



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








var MASTER_SVR = {

    http_port: 543210,
    https_port: 54321,

    execSync_Cmd: function (command) {
        try {
            //command = "ls"
            console.log('execSync Cmd:', command)
            var ret = execSync(command).toString();
            console.log(ret)
        } catch (error) {
            console.log("error:", error.status);  // 0 : successful exit, but here in exception it has to be greater than 0
            console.log("error:", error.message); // Holds the message you typically want.
            console.log("error:", error.stderr);  // Holds the stderr output. Use `.toString()`.
            console.log("error:", error.stdout);  // Holds the stdout output. Use `.toString()`.
            return error.message
        }
        return ret;
    },

}





/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

// use it before all route definitions. for cross domain post.
app.use(cors({ origin: null }));

app.set('trust proxy', true) //:return client req.ip
app.use(express.urlencoded({ extended: true })); //:return req.query


/////////////////////////////////////////////////// 
//
app.get("/", (req, res) => {
    console.log("root ok");
    console.log("res.req.headers.host=", res.req.headers.host);
    //res.send("<script>alert(\'ss\');</script>");'

    

    var obj = { samp: 'ffa' };
    var s = JSON.stringify(res.req.headers);

    var cmd = `echo 'lll'| sudo -S node a.node.js`
    s+=MASTER_SVR.execSync_Cmd(cmd)

    res.send(`${cmd} <br>\n${s}`);
});

app.listen(MASTER_SVR.http_port, () => {
    console.log("* -http svr is listerning on port: " + MASTER_SVR.http_port);
    //hbrq.get_VocabHebrewBufObj();
});
console.log("http svr port:", MASTER_SVR.http_port);
//
////////////////////////////////////////////////





if (MASTER_SVR.https_port === MASTER_SVR.http_port) {
    console.log(`\n- https diabled: MASTER_SVR.https_port === MASTER_SVR.https_port === ${MASTER_SVR.http_port} .`)
} else {
    //How to Fix the NET::ERR_CERT_AUTHORITY_INVALID Error
    const options = {
        //key: fs.readFileSync('./config/https_credentials/key.pem'),
        //cert: fs.readFileSync('./config/https_credentials/cert.pem')
        key: fs.readFileSync('./config/ssl_https/private.key'),
        cert: fs.readFileSync('./config/ssl_https/certificate.crt'),
        ca_bundle: fs.readFileSync('./config/ssl_https/ca_bundle.crt'),
    };
    https_svr = https.createServer(options, app).listen(MASTER_SVR.https_port, async function () {
        console.log(`* Https svr is listerning on port: ${MASTER_SVR.https_port}\n-----------\n`);
    });
}






///////////////////////////////
// php -S localhost:7778
// will override nodejs. server
//
// https://www.npmjs.com/package/nodemon
// npm install -g nodemon
/////////////////////////
// Server Site:
// nodemon a.node.js
//
// client site:
// open restapi_tester.htm
// then click index button.
//
// load htm file for webpage js file issues.
// https://stackoverflow.com/questions/48050666/node-js-serve-html-but-cant-load-script-files-in-served-page
//
//

