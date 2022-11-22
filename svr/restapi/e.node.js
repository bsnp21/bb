



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



var nodemailer = require('nodemailer');

var sver = "gmail"
var transporter = nodemailer.createTransport({
  service: sver,
  auth: {
    user: "mordecaijair1213@gmail.com",
    pass: 'Mordecai.Jair.12.13'
  }
});



var mailOptions = {
  from: 'youremail@gmail.com',
  to: 'wdinge@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});




///////////

// var validator = require("email-validator");
// var emailExistence = require("email-existence");
// var emailCheck = require('email-check');
// 
// const myArgs = process.argv.slice(2);
// 
// var emails = ["test@gmail.com", "xyzzzzzzzzzzzzz@gmail.com"]
// emails.push(myArgs[0])
// var ret = validator.validate("test@gmail.com"); // true
// console.log(ret)
// emails.forEach(function (email) {
//     console.log(email, validator.validate(email))
// 
//     emailCheck(email,{
//         timeout:5000
//     })
//         .then(function (res) {
//             // Returns "true" if the email address exists, "false" if it doesn't.
//             console.log("check",email, res);
//         })
//         .catch(function (err) {
//             console.log(email, err);
//             if (err.message === 'refuse') {
//                 // The MX server is refusing requests from your IP address.
//             } else {
//                 // Decide what to do with other errors.
//             }
//         });
// 
//     ///
//     emailExistence.check(email, function(error, response){
//         console.log(email, 'res: '+response);
//     });
// 
// })


console.log('myArgs: ', myArgs);

