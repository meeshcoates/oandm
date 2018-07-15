var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubscriptionhistorySchema = new Schema({
 	user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  	company_id: { type: Schema.Types.ObjectId, ref: 'Company' },
 	  allowance: { type:Number }, 
  	start_date: { type: Date },
  	end_date: { type: Date },
  	cancel_date: { type: Date },  	
  	stripe_subscription_id: { type: String },
    plan_id: { type: String },
  	stripe_invoice_id: { type: String },
  	amount: { type: Number },
  	paid: { type: Number },
  	created_date: { type: Date },
  	stripe_subscription_status: { type: String }
});

var Subscriptionhistory = mongoose.model('Subscriptionhistory', SubscriptionhistorySchema);

module.exports = Subscriptionhistory;
