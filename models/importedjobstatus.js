/*
*Schema for ImportedJobStatus table
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImportedJobStatusSchema = new Schema({
  company_id: { type: String },
  month: { type: Number },
  job_imported: { type: Number },
  created_at: { type: Date, default: Date.now }
});

var ImportedJobStatus = mongoose.model('ImportedJobStatus', ImportedJobStatusSchema);

module.exports = ImportedJobStatus;