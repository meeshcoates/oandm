const winston = require('winston');
const request = require('request');
const async = require('async');
const mkdirp = require('mkdirp');
const fs = require('fs');
const aws = require('aws-sdk');
const _ = require('lodash');
var Company = require('../models/company');
var CompanyDetail = require('../models/companydetail');

const s3 = new aws.S3();

var Simpro = {};
/*
* This library is using during job import, create manual pdf etc from simpro
*/
var OAUTH = {
  consumer_key: process.env.SIMPRO_API_USERNAME,// consumer key
  consumer_secret: process.env.SIMPRO_API_SECRET, // consumer secret
  token: localStorage.getItem('oauth_token'), // oauth_token that is generated during signup for that company
  token_secret: localStorage.getItem('oauth_token_secret') // oauth_token_secret that is generated during signup for that company
};
var simpro_company_url='';

Simpro._postRequest = function(body, callback) {
  request({
    url: simpro_company_url+'/api/?format=json',
    method: 'POST',
    body: body,
    json: true,
    oauth: OAUTH,
    headers: {
      'Content-type': 'application/json'
    }
  }, function(err, response, body) {
    if( err ) {
      winston.warn("Simpro API failed.", { err: err });
    }

    callback(err, response, body);
  });
};

Simpro._downloadAttachments = function(job,companyName, callback) {

  let dir = 'output-files/' + job.JobID + '/';
  mkdirp.sync(dir);
  winston.info("Created directory: ", dir);

  winston.info("Downloading attachments");
  async.eachLimit(job.Attachments, 5, function(attachment, cb) {
    winston.info("Downloading attachment: ", attachment);
    request.get(simpro_company_url + attachment.URL, {
      encoding: null,
      auth: {
        user: process.env.SIMPRO_LOGIN_USERNAME,
        password: process.env.SIMPRO_LOGIN_PASSWORD
      }
    }, function(err, response, content) {
      winston.info("Downloaded attachment", {err});
      if( response.statusCode === 200 ) {
        s3.upload({
          Body: content,
          Bucket: process.env.AWS_BUCKET,
          ACL: 'public-read',
          Key: 'dokkit-'+companyName+'/attachments/' + attachment.FileName,
        }, function(err, data) {
          winston.info("Uploaded to S3", {err});
          cb(err);
        });
      }
    });
  }, function(err) {
    callback(err, job);
  });
};

Simpro._checkStockPartForAttachmentAndDownload = function(job,companyId,simpro_company_id,companyName, part, callback) {
  winston.info('Part Info: ', part);
  Company.findOne({_id: companyId},function(err,data){
    if(err){
      res.status(400).json({error: err})
    }
    let oauth_token_secret=data.oauth_token_secret;
    let oauth_token=data.oauth_token;
    OAUTH.token=oauth_token;
    OAUTH.token_secret=oauth_token_secret;
    simpro_company_url=data.simpro_url;
    var body = {
      id: simpro_company_id, method: "CatalogItemRetrieveAttachments", params: [simpro_company_id, part.StockItemID]
    };

    Simpro._postRequest(body, function(err, response, body) {
      if(err || body.err) {
        winston.warn('Simpro._checkStockPartForAttachmentAndDownload: _postRequest', err, body);
        return callback(err);
      }
      if( body.result.length === 0 ) {
        winston.info('No stock attachment for part: ', part.StockItemID);
        return callback();
      }

      // Update the job part with the url for this part's attachment

      const file = body.result[0];
      const attachment_key = 'dokkit-'+companyName+'/attachments-stock/' + part.StockItemID + '-' + file.FileName;
      part.has_attachment = true;
      part.attachment_key = attachment_key;
      winston.info('Fetching file: ', file.URL);
      request.get(simpro_company_url + file.URL, {
        encoding: null,
        auth: {
          user: process.env.SIMPRO_LOGIN_USERNAME,
          password: process.env.SIMPRO_LOGIN_PASSWORD
        }
      }, function(err, response, content) {
        winston.info("Downloaded stock part attachment", {err});
        if( response.statusCode === 200 ) {
          s3.upload({
            Body: content,
            Bucket: process.env.AWS_BUCKET,
            ACL: 'public-read',
            Key: attachment_key
          }, function(err, data) {
            winston.info("Uploaded stock part attachment to S3", part.StockItemID, {err});
            callback(err);
          });
        }
      });
    });
  });
};
/*  
* Download Stock Part attachments for imported Job.
*/
Simpro.downloadStockPartAttachments = function(job,companyId,simpro_company_id,companyName, callback) {
  winston.info('Downloading Stock Part Manuals for Job: ', job.JobID);

  const parts = _.flatten(_.map(job.manuals, 'parts'));

  winston.info('Total Stock Parts found: %s', parts.length);

  async.eachLimit(parts, 1, function(part, cb) {
    Simpro._checkStockPartForAttachmentAndDownload(job,companyId,simpro_company_id,companyName, part, cb);
  }, function(err) {
    callback(err);
  });
};
/*  
* import job from simpro.
*/
Simpro.getJobById = function(job_id,companyId,simpro_company_id,companyName, callback) {
  Company.findOne({_id: companyId},function(err,data){
    if(err){
      res.status(400).json({error: err})
    }
    let oauth_token_secret=data.oauth_token_secret;
    let oauth_token=data.oauth_token;
    OAUTH.token=oauth_token;
    OAUTH.token_secret=oauth_token_secret;
    simpro_company_url=data.simpro_url;
    
    job_id = parseInt(job_id, 10);

    var body = {
      id: simpro_company_id, method: "JobRetrieve", params: [simpro_company_id, job_id]
    };

    Simpro._postRequest(body, function(err, response, body) {
      // winston.info("Simpro.getJobById", { body: body, result: body.result });
      winston.info("Simpro.getJobById completed", { err: err });
      if( !err ) {
        if( !body.result || !body.result.JobID ) {
          winston.info("Simpro.getJobById", { body: body, result: body.result });
          return callback({ error: 'unknown job' });
        }
        return Simpro._downloadAttachments(body.result,companyName, callback);
      }

      callback(err, body.result);
    });
  });
};
/*  
* get stocks info during job import.
*/
Simpro.getStockInfo = function(stockIds,companyId,simpro_company_id, callback) {
  Company.findOne({_id: companyId},function(err,data){
    if(err){
      res.status(400).json({error: err})
    }
    let oauth_token_secret=data.oauth_token_secret;
    let oauth_token=data.oauth_token;
    OAUTH.token=oauth_token;
    OAUTH.token_secret=oauth_token_secret;
    simpro_company_url=data.simpro_url;
    
    var body = {
      id: simpro_company_id, method: "CatalogItemRetrieveList", params: [simpro_company_id, stockIds]
    };
    Simpro._postRequest(body, function(err, response, body) {
      winston.info("Simpro.getStockInfo completed");
      if( err ) {
        winston.warn("Simpro.getStockInfo", { err: err });
      }
      callback(err, body.result);
    });
  });


};

module.exports = Simpro;
