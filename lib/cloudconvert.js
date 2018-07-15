const cloudconvert = new (require('cloudconvert'))(process.env.CLOUD_CONVERT_KEY);
const request = require('request');


var CloudConvert = {};

CloudConvert.getAccountStatus = () => {
  request('https://api.cloudconvert.com/user', {
    headers: {
      Authorization: 'Bearer ' + process.env.CLOUD_CONVERT_KEY
    }
  });
};

module.exports = CloudConvert;
