'use strict'


var Subscription = require('../models/subscription');
var winston = require('winston');

require('../lib/env');

var mongoose = require('mongoose');

// load all env
require('../lib/env');

//Load Database
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
/*
*Create subscription table for plans details
*/
exports.up = function (next) {

  winston.info("Creating subscription plans");

  var plans = [
    {
      type: 1,
      title: 'Business Starter Monthly Plan Features',
      label:'Business Starter Monthly',
      description: [
        '1 Project per month',
        'Unlimited Users',
        'Six ready made industry templates',
        'Email support'
      ],
      duration_type: 'MONTHLY',
      allowance: 1,
      price: 54.00,
      feature_tip: 'If you have some months that may have more than one project sign up for a yearly subscription to get 12 projects spread over the year.',
      priority: 1,
      plan_id: "plan_Cpo94m87MnI9d7"
    },
    {
      type: 2,
      title: 'Business Starter Yearly Plan Features',
      label: 'Business Starter Yearly',
      description: [
        '12 Projects per year',
        'Unlimited Users',
        'Six ready made industry templates',
        'Email support'
      ],
      duration_type: 'YEARLY',
      allowance: 12,
      price: 540.00,
      feature_tip: 'Update the templates with your own logo and change elements to reflect your business brand.',
      priority: 2,
      plan_id: "plan_Cpo9F3RGpGLWnZ"
    },
    {
      type: 3,
      title: 'Business Essential Monthly Plan Features',
      label: 'Business Essential Monthly',
      price: 118.00,
      description: [
        '3 Projects per month',
        'Unlimited Users',
        'Six ready made industry templates',
        'Email support'
      ],
      duration_type: 'MONTHLY',
      allowance: 3,
      price: 118.00,
      feature_tip: 'If you have some months that may have more than three projects sign up for a yearly subscription to get 36 projects spread over the year.',
      priority: 3,
      plan_id: "plan_Cpo8rN7IA9J29Y"
    },
    {
      type: 4,
      title: 'Business Essential Yearly Plan Features',
      label : 'Business Essential Yearly',
      description: [
        '36 Projects per year',
        'Unlimited Users',
        'Six ready made industry templates',
        'Email & Telephone support'
      ],
      duration_type: 'YEARLY',
      allowance: 36, 
      price: 1188.00, 
      feature_tip: 'Update the templates with your own logo and change elements to reflect your business brand.',
      priority: 4,
      plan_id: "plan_Cpo8D0e8Zkcdj2"
    },
    {
      type: 5,
      title: 'Business Enterprise Monthly Plan Features',
      label: 'Business Enterprise Monthly',
      description: [
        '10 Projects per month',
        'Unlimited Users',
        'Six ready made industry templates',
        '24/7 support'
      ],
      duration_type: 'MONTHLY', 
      allowance: 10, 
      price: 238.00 ,
      feature_tip: 'If you have some months that may have more than ten projects sign up for a yearly subscription to get unlimited projects spread over the year.',
      priority: 5,
      plan_id: "plan_Cpo71ouviHRbSP"
    },
    {
      type: 6,
      title: 'Business Enterprise Yearly Plan Features',
      label: 'Business Enterprise Yearly',
      description: [
        'Unlimited Projects',
        'Unlimited Users',
        'Six ready made industry templates',
        '24/7 support'
      ],
      duration_type: 'YEARLY',
      allowance: null, 
      price: 2388.00 ,
      feature_tip: 'Update the templates with your own logo and change elements to reflect your business brand.',
      priority: 6,
      plan_id: "plan_Cpo850WU0Rj4pc"
    }
  ];

  plans.forEach((plan) => {
    Subscription.collection.insert(plan);
  });
  next();
};

exports.down = function (next) {
  Subscription.collection.deleteMany({});
  next();
};
