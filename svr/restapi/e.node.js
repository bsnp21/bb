



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
console.log(validator.validate(myArgs))