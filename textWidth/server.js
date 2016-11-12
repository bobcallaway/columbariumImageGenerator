'use strict';

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
      callback(null, {fontSize: result});
    });
  }
  else {
    callback(null, {error: 'bad query'});
  }
};

function generateImage(data, callback) {

  var imageOutputFile = mktemp.createFile("/tmp/XXXXX.html", function (err, srcPath){
    if (err) 
      return callback(true, err);
    else {
      var cbHTML = fs.readFileSync('rasterize.js');
      var cbTemplate = _.template(cbHTML.toString());
      var svgInput = cbTemplate({lineString: data.lineString, max: data.max, size: data.default});
      fs.writeFileSync(srcPath, svgInput);

      var childArgs = [srcPath];
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
        callback(null, stdout.replace(/\n$/, ''));
      });
    }
  });
};
