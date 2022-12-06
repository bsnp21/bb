



var https = require('https');
var http = require('http');

const express = require('express');        // call express
const app = express();                 // define our app using express
var bodyParser = require('body-parser');
//var stripe     = require("stripe")("CUSTOM_TEST_TOKEN");
var url = require('url');
var cors = require('cors');


var process = require('process'); //but it gave error.
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
    http_port: 55000,
    https_port: 55005,

    execSync_Cmd: function (command) {
        var ret = ""
        try {
            //command = "ls"
            console.log('execSync Cmd:', command)
            ret = execSync(command).toString();
            console.log(ret)
        } catch (error) {
            ret += JSON.stringify(error, null, 4)
            console.log("error status :", error.status);  // 0 : successful exit, but here in exception it has to be greater than 0
            console.log("error message:", error.message); // Holds the message you typically want.
            console.log("error stderr :", error.stderr);  // Holds the stderr output. Use `.toString()`.
            console.log("error stdout :", error.stdout);  // Holds the stdout output. Use `.toString()`.
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
                    var res = JSON.stringify(ret, null, 4)
                    resolve(ret)

                });
            } catch (err) {
                console.log(JSON.stringify(err))
                reject("errs");
            }
        })
    },
    get_ip: function () {
        return MASTER_SVR.execSync_Cmd("dig +short myip.opendns.com @resolver1.opendns.com")
    },
    usage: function () {
        var cmds = ["exec", "sync"]
        var ar = [
            "pwd",
            "ps aux | grep .node.",
            "node a.node.js",
            "node a.node.js &",

            "/usr/bin/node /var/www/html/wdaws/bb/svr/restapi/a.node.js",

            `cd ~/install/cmd  #;
            ./setup_proj_main.sh  #;`,

            `sudo systemctl restart bsnpc`,

            `sudo git pull #;
            sudo systemctl restart bsnpa
            `,

            `cd ~ #;
            ls -al #;`,

            `cd ~/install #;
            ls -al #;
            sudo git pull`,

            `cd  #;
            sudo git pull`,

            "ls -al",
            "ls -al ../",
            "ls -al ../../",
            "ls -al ../../",



            "dig +short myip.opendns.com @resolver1.opendns.com",
        ]
        var str = `Usage:<br>exec: async cmd. <br>sync: for execSync.<br> e.g.:<br><table border='1'><tr><th>Async</th><th>Sync</th></tr>`
        ar.forEach(function (cmd) {
            str += "<tr>"
            cmds.forEach(function (par) {
                str += `<td><a href='./?${par}=${cmd}'>./?${par}=${cmd}</a>`
            })
            str += "</tr>"
        })
        str += "</table><br>\r\n"
        var str1 = `http://${MASTER_SVR.get_ip()}:${MASTER_SVR.http_port}`
        var str2 = `https://${MASTER_SVR.get_ip()}:${MASTER_SVR.https_port}`
        str += `<br><a href="${str1}">${str1}</a>`
        str += `<br><a href="${str2}">${str2}</a>`

        return str
    },
    run_cmd: function (req, res) {

        var obj = { samp: 'ffa' };

        var dt = (new Date()).toISOString() + "\r\n"
        dt += req.method + "\r\n"
        var reqs = "req.query=" + JSON.stringify(req.query, "<br>", 1);
        var cmd = `echo 'lll'| sudo -S node a.node.js &`
        var cmd = `echo 'lll'| sudo -S ls -al`
        var ret = ""
        if ("exec" in req.query) {
            cmd = req.query["exec"].replace(/\#\;/g, "\n")
            ret = MASTER_SVR.exec_Cmd(cmd).then(
                function (re) {
                    var killers = MASTER_SVR.ps_aux_grep_node(cmd, re.stdout)
                    re.stdout = re.stdout.replace(/(\n)/g, "<br>") 
                    var str = `<pre>${dt}<br>${reqs}<br>${cmd}<br>${JSON.stringify(re, null, 4)}<hr/>${killers}</pre>`
                    res.send(str);
                },
                function (er) {
                    res.send(er);
                })
        }
        else if ("sync" in req.query) {
            cmd = req.query["sync"].replace(/\#\;/g, "\n")
            ret1 = MASTER_SVR.execSync_Cmd(cmd)
            ret2 = MASTER_SVR.ps_aux_grep_node(cmd, ret)
            console.log("cmd=",cmd)
            var str = `<a>${dt}</a><br><pre>${reqs}</pre><textarea style='width:100%;height:50%;'>\n${cmd}\n${ret1}</textarea><pre>${ret2}</pre>`
            res.send(str);
        }
        else {
            res.send(MASTER_SVR.usage());
        }
    },
    ps_aux_grep_node: function (cmd, ret) {
        if (cmd.indexOf("ps aux") < 0) return ""
        var ar = ret.split("\n")
        console.log(ar)
        var pid = "", ret = ""
        for (var i = 0; i < ar.length; i++) {
            var mat = ar[i].match(/[^\s.]+\s+(\d+)/)
            console.log(mat)
            if (mat) {
                pid = mat[1]
                console.log(pid)
                var scmd = `./?sync=sudo -S kill ${pid}`
                ret += `<br>${ar[i]}<br><a href='${scmd}'>${scmd}</a><br>`
            }
        }
        return ret
    }

}
console.log("pid=", process.pid)
MASTER_SVR.execSync_Cmd(`echo ${process.pid} >/tmp/c.node.pid`)
MASTER_SVR.execSync_Cmd("pwd")
var retip = MASTER_SVR.execSync_Cmd("dig +short myip.opendns.com @resolver1.opendns.com")
console.log(retip)





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

    //res.write("root ok");
    MASTER_SVR.run_cmd(req, res)
    //ret = JSON.stringify(ret, null, 4)
    //res.send(str);
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
    var workdir = "/var/www/html/wdaws/bb/svr/restapi"
    if (!fs.existsSync(workdir)) workdir = "."
    const options = {
        //key: fs.readFileSync('./config/https_credentials/key.pem'),
        //cert: fs.readFileSync('./config/https_credentials/cert.pem')
        key: fs.readFileSync(`${workdir}/config/ssl_https/private.key`),
        cert: fs.readFileSync(`${workdir}/config/ssl_https/certificate.crt`),
        ca_bundle: fs.readFileSync(`${workdir}/config/ssl_https/ca_bundle.crt`),
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

