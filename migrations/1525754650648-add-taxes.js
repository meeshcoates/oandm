'use strict'

var Tax=require('../models/tax')
var winston=require('winston');
/*
*Create tax table 
*/
exports.up = function(next) {
  winston.info("Creating Taxes");

  var taxes = [
    {
      name: 'Vat',
      percentage:20,
      status:true
    }
  ];

  Tax.collection.insert(taxes);
  next();
};

exports.down = function(next) {
  Tax.collection.deleteMany({});
  next();
};
