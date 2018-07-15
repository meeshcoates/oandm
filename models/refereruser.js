/*
* Schema for referuser table
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReferUserSchema = new Schema({
  userId: { type: String },
  refererId: { type:String },
  companyId: { type:String },
  created_at: { type: Date, default: Date.now }
});

var ReferUser = mongoose.model('ReferUser', ReferUserSchema);

module.exports = ReferUser;