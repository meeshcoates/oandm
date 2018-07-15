/*
* Schema for user table
*/
var mongoose = require('mongoose');
//var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {type: String,required: true},
  email: {type: String,required: true,unique: true},
  password: {type: String, required: true},
  type:{type: Number},
  image: Schema.Types.Mixed,
  created_at: { type: Date, default: Date.now }
});

//UserSchema.plugin(uniqueValidator);

var User = mongoose.model('User', UserSchema);

module.exports = User;
