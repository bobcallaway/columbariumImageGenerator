var AWS = require('aws-sdk');
var _ = require('underscore');

exports.handler = function (event, context, callback) { 
  if (event) { 
    sendSMS(event, function(err, result) {
      if (err) {
        return callback(null, {error: result});
      }
      callback(null, result);
    });
  }
  else {
    callback(null, {error: 'bad query'});
  }
};

function sendSMS(event, callback) {
  var sns = new AWS.SNS();

  var errors = [];

  _.each(event.phones, function(phone){
    var params = {
      PhoneNumber: phone,
      Message: event.message, 
      Subject: (event.urgent?"URGENT ":"") + "StMM Columbarium:",
      "AWS.SNS.SMS.SenderID": "StMM",
      "AWS.SNS.SMS.SMSType": "Transactional"
    };
    sns.publish(params, function(err, data) {
      if (err) errors.push(err);
    }); 
  });
  if (errors.length > 0){
    callback(true, errors);
  }
  else
    callback(null, {success: true});
};
