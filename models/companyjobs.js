/*
*Schema for companyjobs table(link compny with their jobs)
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanyJobsSchema = new Schema({
  company_id: { type: String },
  job_id: {type:String},
});

var Companyjobs = mongoose.model('companyjobs', CompanyJobsSchema);

module.exports = Companyjobs;