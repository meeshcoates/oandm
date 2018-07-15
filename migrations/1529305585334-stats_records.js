'use strict'

var Stats=require('../models/stats')
var winston=require('winston');
/*
*Create stats table to store no. of manuals created, client etc
*/
exports.up = function(next) {
  winston.info("Creating Stats table");

  var stats = [
    {
      count_stats: true,
      manual_stats: 0,
      client_stats: 0,
    }
  ];

  Stats.collection.insert(stats);
  next();
};

exports.down = function(next) {
  Stats.collection.deleteMany({});
  next();
};
