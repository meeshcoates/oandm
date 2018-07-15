/*
* Schema for template table
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TemplateSchema = new Schema({
  companyid: String,
  title: { type: String },
  type: String,
  document: Schema.Types.Mixed,
  order: Number,
  category: String,
  manual: { type: Schema.Types.ObjectId, ref: 'Manual' },
  parameters: [ Schema.Types.Mixed ],
  lastUpdated: { type: Date}

}, {
  toJSON: {
    transform: function(doc, ret, options) {
      if( ret.document && ret.document.location ) {
        // ret.download = ret.document.location;
        ret.download = process.env.APP_URL + '/api/manuals/' + ret.manual + '/templates/' + ret._id + '/download';
      }
      // delete ret.filepath;
      return ret;
    }
  }
});

var Template = mongoose.model('Template', TemplateSchema);

module.exports = Template;
