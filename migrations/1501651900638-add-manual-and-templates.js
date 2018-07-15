'use strict'

var mongoose = require('mongoose');
var winston = require('winston');

var Manual = require('../models/manual');
var Template = require('../models/template');

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
*Create template and manual table for master template
*/
var templates = [
  {
    companyid: '0',
    title: "Header Template",
    type: "HEADER_TEMPLATE",
    category: "COVER",
    parameters: [
      { name: "ClientName", type: "text" },
      { name: "AddressLine1", type: "text" },
      { name: "AddressLine2", type: "text" },
      { name: "City", type: "text" },
      { name: "County", type: "text" },
      { name: "PostCode", type: "text" },
      { name: "ProjectCompletionDate", type: "text", field: "date" },
      { name: "ClientLogo", type: "image" },
      { name: "ClientDetails", type: "text" },
      { name: "ContractorLogo", type: "image" },
      { name: "ContractorDetails", type: "text" }
    ]
  }, {
    companyid: '0',
    title: "Audio Visual Main Template",
    type: "MAIN",
    category: "AUDIO_VISUAL",
    parameters: [
      { name: "DescriptionOfWorks", type: "DescriptionOfWorks" },
      { name: "AdditionalInformation", type: "text" },
      { name: "ClientLogo", type: "image" },
      { name: "PartnerLogo", type: "image" }
    ]
  }, {
    companyid: '0',
    title: "Audio Visual Cover",
    type: "COVER",
    category: "AUDIO_VISUAL",
    parameters: [
      { name: "Parts", type: "parts" }
    ]
  }, {
    companyid: '0',
    title: "Audio Visual Manufacturers Schedule",
    type: "MANU_SCHED",
    category: "AUDIO_VISUAL",
    parameters: [
      { name: "Parts", type: "parts" }
    ]
  }, {
    companyid: '0',
    title: "Electrical Main Template",
    type: "MAIN",
    category: "ELECTRICAL",
    parameters: [
      { name: "DescriptionOfWorks", type: "DescriptionOfWorks" },
      { name: "SystemInstalledBy", type: "checklist", options: [
        "Existing system installed by third party",
        "AGL Commercial responsible for relocations to suit new layout & compliance testing"
      ]},
    ]
  }, {
    companyid: '0',
    title: "Electrical Cover Sheet",
    type: "COVER",
    category: "ELECTRICAL",
    parameters: [
    ]
  }, {
    companyid: '0',
    title: "Electrical Manufacturers Schedule",
    type: "MANU_SCHED",
    category: "ELECTRICAL",
    parameters: [
      { name: "Parts", type: "parts" }
    ]
  }, {
    companyid: '0',
    title: "Fire Detection Main",
    type: "MAIN",
    category: "FIRE_DETECTION",
    parameters: [
      { name: "DescriptionOfWorks", type: "DescriptionOfWorks" },
      { name: "SystemInstalledBy", type: "checklist", options: [
        "Existing system installed previously by third party"
      ]},
    ]
  }, {
    companyid: '0',
    title: "Fire Detection Cover Sheet",
    type: "COVER",
    category: "FIRE_DETECTION",
    parameters: [
    ]
  }, {
    companyid: '0',
    title: "Fire Detection Manufacturers Schedule",
    type: "MANU_SCHED",
    category: "FIRE_DETECTION",
    parameters: [
      { name: "Parts", type: "parts" }
    ]
  }, {
    companyid: '0',
    title: "Mechanical Main",
    type: "MAIN",
    category: "MECHANICAL",
    parameters: [
      { name: "DescriptionOfWorks", type: "DescriptionOfWorks" },
    ]
  }, {
    companyid: '0',
    title: "Mechanical Cover Sheet",
    type: "COVER",
    category: "MECHANICAL",
    parameters: [
    ]
  }, {
    companyid: '0',
    title: "Mechanical Manufacturers Schedule",
    type: "MANU_SCHED",
    category: "MECHANICAL",
    parameters: [
      { name: "Parts", type: "parts" }
    ]
  }, {
    companyid: '0',
    title: "Security Main",
    type: "MAIN",
    category: "SECURITY",
    parameters: [
      { name: "DescriptionOfWorks", type: "DescriptionOfWorks" },
      { name: "SystemInstalledBy", type: "checklist", options: [
        "Existing system installed previously by third party"
      ]},
    ]
  }, {
    companyid: '0',
    title: "Security Cover Sheet",
    type: "COVER",
    category: "SECURITY",
    parameters: [
    ]
  }, {
    companyid: '0',
    title: "Security Manufacturers Schedule",
    type: "MANU_SCHED",
    category: "SECURITY",
    parameters: [
      { name: "Parts", type: "parts" }
    ]
  }, {
    companyid: '0',
    title: "Voice Data Main",
    type: "MAIN",
    category: "VOICE_DATA",
    parameters: [
      { name: "DescriptionOfWorks", type: "DescriptionOfWorks" }
    ]
  }, {
    companyid: '0',
    title: "Voice Data Cover Sheet",
    type: "COVER",
    category: "VOICE_DATA",
    parameters: [
    ]
  }, {
    companyid: '0',
    title: "Voice Data Manufacturers Schedule",
    type: "MANU_SCHED",
    category: "VOICE_DATA",
    parameters: [
      { name: "Parts", type: "parts" }
    ]
  }
];


function runUp(next) {
  if( !isConnected ) {
    winston.info("Not connected to db yet");
    setTimeout(function() {
      runUp(next);
    }, 100);
    return;
  }

  winston.info("Creating Manual");
  var manual = new Manual({ title: 'O & M Manual',companyid: '0' });

  manual.save(function(err, m) {
    if( err ) {
      winston.warn("Could not create Manual", { err: err });
      next();
      return;
    }
    winston.info("Created manual, now creating templates");
    templates.forEach(function(t) {
      t.manual = m._id;
    });

    Template.collection.insert(templates, next);
  });
};

exports.up = function(next) {
  runUp(next);
};

exports.down = function(next) {

  Manual.remove(function() {
    Template.remove(function() {
      next();
    });
  });
};
