



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


var repo = process.argv.length === 3 ? process.argv[2]: ""
if(!repo){
    console.log("no repo argument.")
    return
}



var ghpages = require('gh-pages');


var option = {
    /**
 * If the current directory is not a clone of the repository you want to work
 * with, set the URL for the repository in the `repo` option.  This usage will
 * push all files in the `src` config to the `gh-pages` branch of the `repo`.
 */
    repo: `https://github.com/bsnpghrepolist/${repo}.git`

}
var dir = `/home/ubuntu/${repo}/account`
if(!fs.existsSync(dir)) return console.log(`${dir} does not exist.`)

ghpages.publish(dir, option, function (err) { 
    console.log(err)
});


//console.log('myArgs: ', myArgs);

