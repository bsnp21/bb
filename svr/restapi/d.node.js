



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







var userData = require('../userData');
var request = require('request');

module.exports = {
  hitEndpoint: function() {
    var username = "<redacted_user_name>",
        password = "<redacted_password>",
        auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

    var options = {
      method: 'get',
      url: " https://api.github.com/<redacted_user_name>",
      headers: {
        "Authorization": auth,
        "User-Agent": "<redacted_whatever_doesnt_matter>"
      }
    }
    request(options, function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
    });

  },
}