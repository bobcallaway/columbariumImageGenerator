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
      MessageAttributes : {
        "AWS.SNS.SMS.SenderID": { DataType: "STRING_VALUE", StringValue: "StMM"},
        "AWS.SNS.SMS.SMSType": { DataType: "STRING_VALUE", StringValue: "Transactional"}
      }
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
