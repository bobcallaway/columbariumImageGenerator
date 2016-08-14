'use strict';

const express = require('express');
var bodyParser = require('body-parser');
var phantomjs = require('phantomjs-prebuilt')
let exec = require('child_process').exec;

// Express Stuff
const PORT = 8080;
const app = express();
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.json(req.body);

/*
- generate SVG from input JSON
- call phantomjs to create png from SVG
- return png in response
*/

/*
var program = phantomjs.exec('phantomjs-script.js', 'arg1', 'arg2')
program.stdout.pipe(process.stdout)
program.stderr.pipe(process.stderr)
program.on('exit', code => {
  // do something on end 
})
*/
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
