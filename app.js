var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var winston = require('winston');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var slugify = require('slugify');
const request = require('request');
const passport = require('passport');
const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const aws = require('aws-sdk');
const s3 = new aws.S3();
var fs = require('fs');

var Manual = require('./models/manual');

var User = require('./models/user');
var Template = require('./models/template');

var RefererUser = require('./models/refereruser');
var Company = require('./models/company');
var Companydetail = require('./models/companydetail');
var Contactuser = require('./models/contactuser');
var Importedjobstatus = require('./models/importedjobstatus');
var Jobimporteddetail = require('./models/jobimporteddetail');
var Subscribeuser = require('./models/subscribeuser');

var mails=require('./helpers/mails');

var reactUrl= process.env.REACT_URL;

var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
var qs = require('querystring')

const JWTSECRETKEY = 'chanukah-tibiae-wave-penman';


let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = JWTSECRETKEY;


const strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  if( jwt_payload.user_id === 'AGL_SUPER_ADMIN' ) {
    next(null, { user: 'superadmin'});
  }
  else {
    User.findOne({ _id: jwt_payload.user_id }, function(err, doc) {
      if( doc ) {
        next(null, doc);
      } else {
        next(null, false);
      }
    });
  }
});

passport.use(strategy);

if( process.env !== "PRODUCTION" ) {
  winston.cli();
}

// load all env
require('./lib/env');

// load routes
var index = require('./routes/index');
var api = require('./routes/api');
var signup = require('./routes/company');
var route_subscriptions = require('./routes/subscription');
var route_payment = require('./routes/payment');
var app = express();
// CORS 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*,authorization,Origin, X-Requested-With, Content-Type, Accept");//"Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// setup sessions
app.use(passport.initialize());

// Connect to the database
winston.info("Connecting to MONGO_URI %s" , process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useMongoClient: true
});
mongoose.set('debug', true);
var db = mongoose.connection;
db.on('error', winston.error.bind(winston, 'connection error: '));
db.once('open', function() {
  winston.info('Connected to Mongo DB');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/assests', express.static(__dirname+'/uploads'));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static(path.join(__dirname, 'output-files')));

//handle login for admin/team meber/or main admin
app.post('/api/authenticate', function(req, res, next) {
  winston.info('Authenticate a request');

  var username = req.body.username;
  var password = req.body.password;
  if(username==='info@givmail.com' && password==='123456test'){
    bcrypt.hash(password, 10, function(err, password) {
      if( err ) {
        winston.warn('bcrypt error', err);
        return res.status(500).json({ errorMessage: 'Error updating password', error: err });
      }

      var userData =  new User({
          email:username,
          name: 'superadmin',
          type: 3,
          password: password
      });
      User.findOne({ email: username }, function(err, user) {
        if(err){
          return res.status(400).json({ error: 'Error occured.' });
        }
        if( !user ) {
          userData.save(function(err, doc) {
            if(err) {
              return res.status(400).json({ error: err });
            }
            const secretKey = JWTSECRETKEY;
            const payload = { user_id: doc._id };
            const token = jwt.sign(payload, secretKey);
            return res.status(201).json({ token: token, username: username,userType : 'admin',doc:doc});
          });
        }
        if(user){
          const secretKey = JWTSECRETKEY;
          const payload = { user_id: user._id };
          const token = jwt.sign(payload, secretKey);
          return res.status(201).json({ token: token, username: username,userType : 'admin',doc:user});
        }
      });
    });
  }else{
    User.findOne({ email: username }, function(err, doc) {
      if( err || !doc ) {
        winston.warn('Error auth: ', { err, doc } );
        return res.status(404).json({ error: 'Incorrect username or password' });
      }

      bcrypt.compare(req.body.password, doc.password, function(err, result) {
        if( err || !result ) {
          winston.warn('Error auth bcrypt: ', { err, doc, result } );
          return res.status(404).json({ error: 'You entered an Incorrect username or password' });
        }
        if(doc.type==2 || doc.type==1){
          RefererUser.findOne({refererId: doc._id}).exec(function(err, referrer) {
            if(err) {
              winston.warn('Error fetching memberuser', { err });
              return res.status(500).json({ error: "Error fetching memberuser" });
            }
            if(referrer){
              Subscribeuser.findOne({user_id: referrer.userId}).exec(function(err, subsUser) {
                  if(err){
                     winston.warn('Unable to get companyId for that user.');
                     return res.status(404).json({ error: 'Unable to get companyId for that user.' });
                  }
              });
            }
            if(!referrer){
              Subscribeuser.findOne({user_id:doc._id},function(err, subsUser){
                if(err){
                   winston.warn('Unable to get companyId for that user.');
                   return res.status(404).json({ error: 'Unable to get companyId for that user.' });
                }
              });
            }
          });
        }        
        const secretKey = JWTSECRETKEY;
        const payload = { user_id: doc._id };
        const token = jwt.sign(payload, secretKey);

        return res.status(200).json({ token: token, username: username, doc: doc,userType: 'user' });
      });
    });
  }
});
/*
* Check email address is exist in database or not.
*/
app.post('/api/authenticateUserEmail', function(req, res, next) {
  winston.info('check email is exist or not');

  var username = req.body.username;

    User.findOne({ email: username }, function(err, doc) {
      if( err || !doc ) {
        winston.warn('Error auth: ', { err, doc } );
        return res.status(200).json({ error: 'Incorrect email' });
      }
      return res.status(200).json({username: username, doc: doc });
    });
});
/*
* Handle forget password request
*/
app.post('/api/forgetpassword', function(req, res, next) {

  var username = req.body.username;

  mails.sendMail({
      from: process.env.MAIL_ID_FROM, // sender address
      to: username,
      subject: 'Reset Password for Dokkit Application', // Subject line
      html: `<div>
          <h2>Hello!</h2>
          <p>You are receiving this email because we received a password reset request for your account.</p>
          <p style="text-align: center"><a href=${reactUrl}`+`/forgot-password?email=${username}>Reset Password</a></p>
          <hr>
          <p>If you did not request a password reset, no further action is required.</p>
          <p>Regards,</p>
          <p>Dokkit</p>
          </div>` // html body 
    },(error, info) => {
      if (error) {
        return res.status(500).json({message:'Internal Server Erro'});
      }
      return res.status(200).json({message:'Email send to user to set new password.'});
    });
});
/*
* Cancel dokkit mail request
*/
app.post('/sendMailCancelDokkit', function(req, res, next) {

  var message = req.body.message;

  mails.sendMail({
      from: process.env.MAIL_ID_FROM, // sender address
      to: process.env.MAIL_ID_TO,
      subject: 'Unsubscribe', // Subject line
      html: `<div>
          <p>A compnay cancel dokkit subscription. </p>
          <h2>Message:</h2>
          <p>`+message+`</p>
          <p>Thanks,</p>
          <p>Dokkit Team</p>
          </div>` // html body 
    },(error, info) => {
      if (error) {
        return res.status(500).json({message:'Internal Server Erro'});
      }
      return res.status(200).json({message:'Email send to user to set new password.'});
    });
});

// TODO: Fix this, it should be someplace else ideally
// Have it out here just so that it avoids authentication
app.get('/api/manuals/:manual_id/templates/:template_id/download', function(req, res, next) {
  winston.info("fetch download file");
  Template.findById(req.params.template_id, function(err, doc) {
    if( err ) {
      winston.warn('Error fetching templates', { err: err, manual_id: req.params.manual_id });
      return res.status(500).json({ error: "Error fetching templates" });
    }
    var fileUploaddedDirectlyOnS3=doc.document.key.indexOf('docx')!==-1;
    if(fileUploaddedDirectlyOnS3==1){
      var options = {
          Bucket    : 'dokkitapp',
          Key    : doc.document.key,
      };
      res.attachment(doc.document.key);
      var fileStream = s3.getObject(options).createReadStream();
      fileStream.pipe(res);

    }else{
      var filename = slugify(doc.title) + '.docx';
      res.setHeader('Content-Type', "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader('Content-disposition', 'attachment; filename=' + filename);

      request(doc.document.location).pipe(res);
    }
  });
});
app.use('/signup/company',signup);
app.use('/subscriptions',route_subscriptions);
//app.use('/api', [passport.authenticate('jwt', { session: false }),  api]);
app.use('/api', api);
app.use('/payment',route_payment);
app.use('/*', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
