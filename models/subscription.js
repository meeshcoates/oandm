/*
* Schema for subscription table
*/
var mongoose = require('mongoose');
var Tax=require('./tax');

var Schema = mongoose.Schema;

var SubscriptionSchema = new Schema({
	type: { type:Number ,unique:true },
	title:{ type:String},
	description:{ type:[] },
	duration_type: { type:String },
	allowance: { type:Number }, 
	feature_tip:{ type:String },
	price:{ type:Number },
	created_at: { type: Date, default: Date.now },
	priority: { type: Number },
	plan_id: { type: String }
});

// ,{
// 	toJSON:{
// 		transform: function(subs,ret,options){
// 			Tax.find({status:true}).exec((err,res)=>{
// 				ret.taxes=res;
// 				return ret;
// 			});
// 		}
// 	}
// }
var Subscription = mongoose.model('Subscription', SubscriptionSchema);

module.exports = Subscription;