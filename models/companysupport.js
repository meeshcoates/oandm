/*
*Schema for companysupport table(support popup)
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanySupport = new Schema({
  company_id: { type: String},
  name: { type: String },
  email: {type:String},
  message: { type: String},
  status: {type: String},
  created_at: { type: Date, default: Date.now }
});

var CompanySupport = mongoose.model('CompanySupport', CompanySupport);

module.exports = CompanySupport;