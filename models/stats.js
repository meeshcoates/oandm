/*
* Schema for stats table
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StatsSchema = new Schema({
	count_stats: {type: Boolean },
    manual_stats:{ type:Number },
    client_stats:{ type:Number },
    client_created: {type: Array},
    client_cancelation: {type: Array},
    created_at: { type: Date, default: Date.now }
});

var Stats = mongoose.model('Stats', StatsSchema);

module.exports = Stats;