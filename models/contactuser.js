/*
*Schema for contactuser table(other and none type)
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactUser = new Schema({
	comapany_name:{ type: String },
	email: { type:String },
	telephone: { type:String },
	type: { type:Number },
	created_at: { type: Date, default: Date.now }
});

var ContactUser = mongoose.model('ContactUser', ContactUser);

module.exports = ContactUser;