/*
* Schema for subscribeuser table(store the information about admin user with subsccription plan and company)
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubscribeUserSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  company_id: { type: Schema.Types.ObjectId, ref: 'Company' },
  subscription_id: { type: Schema.Types.ObjectId, ref: 'Subscription' },
  created_at: { type: Date, default: Date.now }
});

var SubscribeUser = mongoose.model('SubscribeUser', SubscribeUserSchema);

module.exports = SubscribeUser;