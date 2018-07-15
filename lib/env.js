var fs = require("fs");
var _ = require("lodash");

// Load all the values from the .env file to override the process.env
try {
  env = fs.readFileSync(__dirname + '/../.env', 'utf8');
  env = env.split("\n");

  _.each(env, function(key) {
    matches = key.match(/^([^=]+)=["']?(.*)["']?$/);
    if( matches ) {
      process.env[matches[1]] = matches[2];
    }
  });
}
catch (e) {
  console.info("No .env file found, assuming keys are already present");
}

// Check if we have all the keys that we wanted
var required_keys = {
  MONGO_URI: { required: true },
  AWS_ACCESS_KEY_ID: { required: true },
  AWS_SECRET_ACCESS_KEY: { required: true },
  AWS_BUCKET: { required: true },
  AWS_DEFAULT_REGION: { required: true },
  APP_URL: { required: true },
  CLOUD_CONVERT_KEY: { required: true },
  SIMPRO_API_USERNAME: { required: true },
  SIMPRO_API_SECRET: { required: true },
  SIMPRO_LOGIN_USERNAME: { required: true },
  SIMPRO_LOGIN_PASSWORD: { required: true },
  STRIP_KEY: {required:true }
};

_.each(required_keys, function(value, key) {
  if( value.required && !process.env[key] ) {
    console.error("Environment variable " + key + " not found!");
    process.exit(1);
  }
});
