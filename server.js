'use strict';

var path = require('path');
var childProcess = require('child_process');
var phantomJsPath = require('phantomjs-prebuilt').path;
var mktemp = require('mktemp');

exports.handler = function (event, context, callback) { 
  if (event.data) { 
    generateImage(event.data, function(err, result) {
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

exports.generateImage = function(data, callback) {

  var imageOutputFile = mktemp.createFile("XXXXX.html", function (err, path){
    if (err) 
      return callback(true, err);
    else {
      /*
      - TODO: generate SVG from input JSON
      */
      // data
    }
  };

  var childArgs = [path.join(__dirname, 'phantomjs-script.js')];
  var phantom = childProcess.execFile(phantomJsPath, childArgs, { 
    env: {
      URL: 'cb.html' //TODO: change me
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
    callback(null, new Buffer(stdout).toString('base64'));
  });
};
