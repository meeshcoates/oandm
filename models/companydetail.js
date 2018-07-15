/*
* Schema for CompanyDetail table
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanyDetailSchema = new Schema({
  company_id: { type: String },
  is_simpro_authorized: { type: Boolean },
  verified: { type: String },
  logo: Schema.Types.Mixed,
  address: { type: Object },
  created_at: { type: Date, default: Date.now }
});

var CompanyDetail = mongoose.model('CompanyDetail', CompanyDetailSchema);

module.exports = CompanyDetail;