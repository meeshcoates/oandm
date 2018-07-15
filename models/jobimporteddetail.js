/*
* Schema for jobimporteddetail table
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JobImportedDetailSchema = new Schema({
  user_id: { type: String },
  imported_jobid: { type: String },
  created_at: { type: Date, default: Date.now }
});

var JobImportedDetail = mongoose.model('JobImportedDetail', JobImportedDetailSchema);

module.exports = JobImportedDetail;