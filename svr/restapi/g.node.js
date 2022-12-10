



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

//https://www.npmjs.com/package/gh-pages
var ghpages = require('gh-pages');



function gh_pages_cmdline() {
    var reponame = process.argv.length === 3 ? process.argv[2] : ""
    if (!reponame) {
        console.log("no reponame argument.")
        return
    }


    var option = {
        /**
     * If the current directory is not a clone of the repository you want to work
     * with, set the URL for the repository in the `repo` option.  This usage will
     * push all files in the `src` config to the `gh-pages` branch of the `repo`.
     */
        repo: `https://github.com/bsnpghrepolist/${reponame}.git`,


        /**
     * This configuration will avoid logging the GH_TOKEN if there is an error.
     */
        repo: 'https://' + process.env.GH_TOKEN + '@github.com/user/private-repo.git',
        silent: true


    }
    var dir = `/home/ubuntu/${reponame}/account`
    if (!fs.existsSync(dir)) return console.log(`${dir} does not exist.`)

    ghpages.publish(dir, option, function (err) {
        console.log(err, `https://bsnpghrepolist.github.io/${reponame}/myoj/e_Note_json.js`)

    });
}
function gh_pages_bsnpghrepolist_publish(dist, reponame) {

    var option = {
        /**
     * If the current directory is not a clone of the repository you want to work
     * with, set the URL for the repository in the `repo` option.  This usage will
     * push all files in the `src` config to the `gh-pages` branch of the `repo`.
     */
        repo: `https://github.com/bsnp21/${reponame}.git`

    }
    //var dist = `${workdir}/${reponame}/account`
    if (!fs.existsSync(dist)) return console.log(`${dist} does not exist.`)

    ghpages.publish(dist, option, function (err) {
        console.log(err, `https://bsnpghrepolist.github.io/${reponame}/myoj/e_Note_json.js`)

    });
}

function fswatch_gh_pages_rename() {
    if (process.argv.length !== 2) return;
    var watchDir = "/var/www/html/"
    fs.watch(watchDir, { recursive: true }, function (eventType, filename) {
        console.log(`\n${watchDir} event type: ${eventType}; filename: ${filename}`);
        var fullpathname = watchDir + filename
        if (eventType !== 'remane') return console.log("not rename.");
        if (!fs.existsSync(fullpathname)) return console.log("file not exist");
        var reg = new RegExp("(.+\/(\w+)\/account)\/(\w+\/\w+_json\.js)$")
        var mat = fullpathname.match(reg)
        if (!mat) return console.log("not bsnp account file.")
        var reponame = mat[2], dir = mat[1], datfile = mat[3]
        ghpages.publish(dir, { repo: reponame }, function (err) {
            console.log(`https://bsnpghrepolist.github.io/${reponame}/${datfile}`, "err:" + err)
        });
    })
}

//gh_pages_cmdline()
//fswatch_gh_pages_rename()
//console.log('myArgs: ', myArgs);
let urls = "https://www.reddit.com/r/popular.jsonxxyy";

function get_txt_fr_net(urls, cbf) {
    let body = "";
    https.get(urls, (res) => {

        res.on("data", (chunk) => {
            body += chunk;
            //console.log(chunk)
        });

        res.on("end", (data) => {
            try {
                //let json = JSON.parse(body);
                // do something with JSON
                //console.log(body)
                console.log("load")
                if (cbf) cbf(body)
            } catch (error) {
                console.error(error.message);
            };
        });

    }).on("error", (error) => {
        console.error(error.message);
    });
    return body
}
urls = "https://bsnpghrepolist.github.io/wdingpub01/dat/MyBiblicalDiary_json.js"
var txt = get_txt_fr_net(urls, (dat) => {
    //console.log(dat)
})
console.log("load end")


console.log("process.env.GH_TOKEN_bsnpghrepolist=", process.env.GH_TOKEN_bsnpghrepolist)
console.log("process.env.GH_TOKEN_bsnp21=", process.env.GH_TOKEN_bsnp21)
function gh_pages_test_muplitple_dest_by_argv2() {
    if (process.argv.length < 4) return console.log("missing owner repo")

    var ownername = process.argv[2]
    var envKey = `GH_TOKEN_${ownername}`
    var envs = process.env[envKey]
    //console.log("process.env", process.env)
    console.log("env", envs)
    console.log("envKey", envKey)


    var reponame = process.argv[3]

    var option = {
        /**
     * This configuration will avoid logging the GH_TOKEN if there is an error.
     */
        repo: 'https://' + process.env.GH_TOKEN + 'github.com/user/private-repo.git',
        //silent: false,
        //dest:"account",
        repo: `https://${envs}github.com/${ownername}/${reponame}.git`
    }
    var dir = `/home/ubuntu/dist`
    dir = process.argv[4]

    if (!fs.existsSync(dir))  console.log(`${dir} does not exist.`)
    console.log(option)
    console.log("dist=",dir)

    if (process.argv.length === 4) return console.log("one more param to actually run.")

    //ghpages.clean()
    ghpages.publish(dir, option, function (err) {
        console.log("err=", err)

    });
}
gh_pages_test_muplitple_dest_by_argv2()