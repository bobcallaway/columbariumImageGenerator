'use strict';

var aws = require('aws-sdk');
var fs = require('fs');
var _ = require('underscore');
var path = require('path');
var childProcess = require('child_process');
var phantomJsPath = require('phantomjs-prebuilt').path;
var mktemp = require('mktemp');

exports.handler = function (event, context, callback) { 
  if (event) { 
    generateImage(event, function(err, result) {
      if (err) {
        return callback(null, {error: result});
      }
      callback(null, {image: result});
    });
  }
  else {
    callback(null, {error: 'bad query'});
  }
};

function putObjectToS3(bucket, key, data){
    var s3 = new aws.S3();
        var params = {
            Bucket : bucket,
            Key : key,
            ACL : "public-read",
            Body : data
        }
        s3.putObject(params, function(err, data) {
          if (err) return err;
        });
}

function generateImage(data, callback) {

  var imageOutputFile = mktemp.createFile("/tmp/XXXXX.html", function (err, srcPath){
    if (err) 
      return callback(true, err);
    else {
      var wallNumber = data.wallNumber;
      //TODO: validate wallNumber, and if data.niches fits schema
      var cbHTML = fs.readFileSync('cb.html');
      var cbTemplate = _.template(cbHTML.toString());
      var svgInput = cbTemplate({niches: JSON.stringify(data)});
      fs.writeFileSync(srcPath, svgInput);

      var childArgs = [path.join(__dirname, 'rasterize.js'), srcPath, '/dev/stdout'];
      var phantom = childProcess.execFile(phantomJsPath, childArgs, { 
        env: {
          URL: srcPath
        },
        maxBuffer: 2048*1024
      });
    
      var stdout = '';
      var stderr = '';
      
      phantom.stdout.on('data', function(data) {
        stdout += data;
      });
      
      phantom.stderr.on('data', function(data) {
        stderr += data;
      });
      
      phantom.on('uncaughtException', function(err) {
        console.log('uncaught exception: ' + err);
      });
      
      phantom.on('exit', function(exitCode) {
        if (exitCode !== 0) {
          return callback(true, stderr);
        }
        //callback(null, new Buffer(stdout).toString('base64'));
	// base64 decode stdout to binary
        var imageBytes = new Buffer(stdout, 'base64')
	// upload into s3 bucket as wallX.png
	var s3Error = putObjectToS3("columbariumimage","wallImages/wall" + wallNumber + ".png", imageBytes);
        if (s3Error) return callback(true, s3Error);
        else callback(null, stdout);
      });
    }
  });
};
