



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

    //be >= 0 and < 65536
    http_port: 55555,
    https_port: 54321,

    execSync_Cmd: function (command) {
        var ret = ""
        try {
            //command = "ls"
            console.log('execSync Cmd:', command)
            ret = execSync(command).toString();
            console.log(ret)
        } catch (error) {
            ret += JSON.stringify(error, null, 4)
            console.log("error:", error.status);  // 0 : successful exit, but here in exception it has to be greater than 0
            console.log("error:", error.message); // Holds the message you typically want.
            console.log("error:", error.stderr);  // Holds the stderr output. Use `.toString()`.
            console.log("error:", error.stdout);  // Holds the stdout output. Use `.toString()`.
            //return error.message
        }
        return ret;
    },
    exec_Cmd: function (command) {
        return new Promise((resolve, reject) => {
            try {
                //command = "ls"
                //console.log('exec_Cmd:', command)
                exec(command, (err, stdout, stderr) => {
                    console.log('-exec_Cmd errorr:', err)
                    console.log('-exec_Cmd stderr:', stderr)
                    console.log('-exec_Cmd stdout:', stdout)

                    // the *entire* stdout and stderr (buffered)
                    //resolve(stdout);
                    var ret = {
                        stdout: stdout,
                        stderr: stderr,
                        err: err
                    }
                    JSON.stringify(ret, null, 4)
                    resolve("okkk")

                });
            } catch (err) {
                console.log(JSON.stringify(err))
                reject("errs");
            }
        })
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
    console.log("res.req.headers", JSON.stringify(res.req.headers, "<br>", 4));
    //res.send("<script>alert(\'ss\');</script>");'


    var obj = { samp: 'ffa' };

    var dt = (new Date()).toISOString()
    var reqs = JSON.stringify(req.query) + "<br>\r\n";
    reqs += req.method + "<br>\r\n" + req.message
    var cmd = `echo 'lll'| sudo -S node a.node.js &`
    var cmd = `echo 'lll'| sudo -S ls -al`
    var ret = ""
    if ("cmd" in req.query) {
        cmd = req.query["cmd"]
        ret = MASTER_SVR.exec_Cmd(cmd)
    }
    if("sync" in req.query){
        cmd = req.query["cmd"]
        ret = MASTER_SVR.execSync_Cmd(cmd)
    }
    var str = `<pre>${dt}<br>\r\n${cmd} <br>\r\n${JSON.stringify(ret, null, 4)}<br>\r\nreq=<br>\r\n${reqs}</pre>`

    res.send(str);
});
//
/////////////////////////////////////////////////// 


app.listen(MASTER_SVR.http_port, () => {
    console.log("* -http svr is listerning on port: " + MASTER_SVR.http_port);
    //hbrq.get_VocabHebrewBufObj();
});
console.log("http svr port:", MASTER_SVR.http_port);

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

