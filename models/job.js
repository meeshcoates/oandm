/*
* Schema for job table
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JobSchema = new Schema({
  simpro_id: { type: Number, unique: true },
  status: String,
  simpro_job: Schema.Types.Mixed,
  created_at: { type: Date, default: Date.now },
  manuals: Schema.Types.Mixed,
  job_completion_date: String,
  imported_at: { type: Date, default: Date.now },
  customer_logo: Schema.Types.Mixed,
  site_logo: Schema.Types.Mixed,
  pdf_key: String,
  pdf_created_at: { type: Date },
  pdf_requested_at: { type: Date },
  pdf_request_process_url: String,
  pdf_request_process_status: Schema.Types.Mixed,
  subscription_history_id: { type: Schema.Types.ObjectId, ref: 'Subscriptionhistory' },
}, {
  toJSON: {
    transform: function(doc, ret, options) {
      if( ret.pdf_key ) {
        ret.pdf_download_url = `https://s3.eu-west-2.amazonaws.com/${process.env.AWS_BUCKET}/${ret.pdf_key}`;
      }
      return ret;
    }
  }
});

var Job = mongoose.model('Job', JobSchema);

module.exports = Job;
