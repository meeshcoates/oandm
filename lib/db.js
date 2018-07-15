
require('env');
var mongoose = require('mongoose');
var winston = require('winston');

winston.info("Connecting to MONGO_URI %s" , process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useMongoClient: true
});
var db = mongoose.connection;
var isConnected = false;
db.on('error', winston.error.bind(winston, 'connection error: '));
db.once('open', function() {
  winston.info('Connected to Mongo DB');
  isConnected = true;
});
