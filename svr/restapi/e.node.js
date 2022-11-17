



var https = require('https');
var http = require('http');

const express = require('express');        // call express
const app = express();                 // define our app using express
var bodyParser = require('body-parser');
//var stripe     = require("stripe")("CUSTOM_TEST_TOKEN");
var url = require('url');
var cors = require('cors');

const exec = require('child_process').exec;
const execSync = require('child_process').execSync;



////////////////////////////////
//server site workload.
const fs = require('fs');
var path = require('path');
var cheerio = require("cheerio"); //>> npm install cheerio
/////////////////////////////////////////////////////////////////






var validator = require("email-validator");

var emails=["test@gmail.com","xyzzzzzzzzzzzzz@gmail.com"]
var ret = validator.validate("test@gmail.com"); // true
console.log(ret)
emails.forEach(function(email){
    console.log(email, validator.validate(email))
})

const myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);
console.log(validator.validate(myArgs[0]))


/////
var emailCheck = require('email-check');

// Quick version
emailCheck('mail@example.com')
  .then(function (res) {
    // Returns "true" if the email address exists, "false" if it doesn't.
  })
  .catch(function (err) {
    if (err.message === 'refuse') {
      // The MX server is refusing requests from your IP address.
    } else {
      // Decide what to do with other errors.
    }
  });

// With custom options
emailCheck('mail@example.com', {
  from: 'address@domain.com',
  host: 'mail.domain.com',
  timeout: 3000
})
  .then(function (res) {
    console.log(res);
  })
  .catch(function (err) {
    console.error(err);
  });