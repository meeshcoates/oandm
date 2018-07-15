/*
* Schema for tax table
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaxSchema = new Schema({
    name:{ type:String },
    percentage:{ type:Number },
    status:{ type:Boolean },
    created_at: { type: Date, default: Date.now }
});

var Tax = mongoose.model('Tax', TaxSchema);

module.exports = Tax;