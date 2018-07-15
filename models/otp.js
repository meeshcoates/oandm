/*
* Schema for otp table
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OtpSchema = new Schema({
  entity: String,
  type: String,
  otp: Number
});

var Otp = mongoose.model('Otp', OtpSchema);

module.exports = Otp;
