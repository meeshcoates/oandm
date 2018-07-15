/*
* Schema for manual table
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ManualSchema = new Schema({
  title: String,
  companyid: String
});

var Manual = mongoose.model('Manual', ManualSchema);

module.exports = Manual;
