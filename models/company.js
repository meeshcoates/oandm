/*
* Schema for company table
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanySchema = new Schema({
  name: { type: String ,unique:true},
  website: {type:String,unique:true},
  companies_from_api: Schema.Types.Mixed,
  oauth_token_secret: { type: String },
  oauth_token: { type: String },
  simpro_url: { type: String },
  created_at: { type: Date, default: Date.now }
});

var Company = mongoose.model('Company', CompanySchema);

module.exports = Company;
