

const fs = require('fs');
const path = require('path');
const { nextTick } = require('process');
var url = require('url');
const fsPromises = require("fs").promises;
const crypto = require('crypto')

//var Uti = require("./Uti.module").Uti;
//var SvcUti = require("./SvcUti.module").SvcUti;
//const exec = require('child_process').exec;

const { BsnpSvcAccount, BsnpSvcToolkits, NCache } = require("./BsnpSvcAccount_mod")
const { BaseGUti } = require("./BsnpRepositoryUser_mod")

var ApiWrap = {
    Parse_GET_req_to_inp: function (req, cbf) {
        console.log("\n\n\n\n\n\n\n\n-----req.method (GET?)", req.method)
        console.log("-GET: req.url=", req.url);
        console.log("-req.query", req.query)
        var remoteAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);
        console.log("-remoteAddr", remoteAddr)
        console.log("-req.headers", req.headers)
        console.log(req.connection.remoteAddress);

        if (req.method !== "GET") {
            return null
        }
        if (cbf) cbf(req.query)

        //console.log("\n\n\n\n---->GET: req.query=", req.query);
        //var q = url.parse(req.url, true).query;
        //console.log("q=", q);

        if ("undefined" === typeof req.query.inp) {
            console.log("req.query.inp: undefined. Maybe initial loading or page transition");
            return null;
        }

        var inpObj = {}
        console.log("req.query.inp=", req.query.inp)
        if (req.query.inp.match(/^CUID\d+\.\d+$/)) { //SignPageLoaded
            inpObj.CUID = req.query.inp
            return inpObj
        } else {
            var d64 = Buffer.from(req.query.inp, 'base64').toString()
            //d64 = Buffer.from(d64, 'base64').toString()
            var sin = decodeURIComponent(d64);//must for client's encodeURIComponent

            var out = BaseGUti.default_inp_out_obj()
            try {
                var inpObj = JSON.parse(sin);
                inpObj.out = out
                console.log("GET: inp =", JSON.stringify(inpObj, null, 4));
                //cbf(inpObj, res)
                return inpObj
            } catch (err) {
                out.err = err
                console.log(err)
                return out
            }
        }

    },

    Parse_POST_req_to_inp: function (req, res, cbf) {
        console.log("\n\n\n----Parse_POST_req_to_inp")
        console.log("req.method=", req.method)
        console.log("req.url=", req.url)

        //req.pipe(res)
        if (req.method === "POST") {
            //req.pipe(res)
            console.log("------------------------------start... POST: ", "req.url=", req.url)
            var body = "";
            req.on("data", function (chunk) {
                body += chunk;
                console.log("on post data.")
            });

            req.on("end", async function () {
                console.log("on post eend.")

                var inpObj = null
                try {
                    inpObj = JSON.parse(body)
                    inpObj.out = BaseGUti.default_inp_out_obj()
                } catch (err) {
                    inpObj.err = err
                }
                console.log("POST after decoding, inp=", JSON.stringify(inpObj, null, 4));


                console.log("cbf start ------------------------------")
                await cbf(inpObj)
                console.log("cbf ended ------------------------------")

                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(inpObj))
                res.end();
                console.log("______________________________finished post req", (new Date()).toISOString())
            });
        } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end();
            console.log("end of req")
        }
    },
    GetOTK: function (cuid) {
        if (!cuid) cuid = "CUID" + ((new Date()).getTime()) + Math.random()
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096, // Note:can encrypt txt len max 501 bytes. 
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            }
        });
        console.log("publicKey\n", publicKey)
        console.log("privateKey\n", privateKey)

        var pkb64 = Buffer.from(publicKey).toString("base64")
        console.log("pkb64\n", pkb64)
        console.log("pkb64.len", pkb64.length)

        //var tuid = this.m_inp.CUID
        var val = { publicKey: publicKey, privateKey: privateKey, pkb64: pkb64, CUID: cuid }

        NCache.Set(cuid, val, 6000) //set 100min for sign-in page..
        return { CUID: cuid, pkb64: pkb64 }
    },


}





var inp_struct_base = {
    usr: {
        repopath: "",
        passcode: "",
        repodesc: ""
    },
    par: {
        fnames: [],                             //for BibleObject Read.
        bibOj: { bkc: { chp: { vrs: "" } } },   //for BibleObject Read.
    }
}
var inp_struct_search = JSON.parse(JSON.stringify(inp_struct_base))
inp_struct_search.par.Search = { File: "", Strn: "" }
var inp_struct_account_setup = JSON.parse(JSON.stringify(inp_struct_base))
inp_struct_account_setup.par = null
var inp_struct_all = JSON.parse(JSON.stringify(inp_struct_base))
inp_struct_all.par.Search = inp_struct_search.par.Search

var ApiJsonp_BibleObj = {
    Get_OTK: function (req, res) {
        var otk = ApiWrap.GetOTK()
        console.log(otk);
        res.send(otk);
        res.end();
    },



    ///////////////////////////////////
    //
    // User Account Mgment: Create/Update, Login/Logout
    //

    ApiUsrAccount_create: function (req, res) {
        console.log("ApiUsrAccount_create")
        ApiWrap.Parse_POST_req_to_inp(req, res, function (inp) {
            BsnpSvcAccount.ApiUsrAccount_create(inp)
        })
    },

    ApiUsrAccount_login: function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, function (inp) {
            BsnpSvcAccount.ApiUsrAccount_login(inp)

        })
    },
    ApiUsrAccount_logout: async function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            BsnpSvcAccount.ApiUsrAccount_logout(inp)

        })
    },
    ApiUsrAccount_update: function (req, res) {
        console.log("ApiUsrAccount_create")
        ApiWrap.Parse_POST_req_to_inp(req, res, function (inp) {
            BsnpSvcAccount.ApiUsrAccount_update(inp)
        })
    },
    ///////////////////////////////////////////////








    ////////////////////////////////////
    //
    // basic bible Read/Write/Search API.
    // 
    ApiBibleObj_search_txt: function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            BsnpSvcAccount.ApiBibleObj_search_txt(inp)
        })
    },

    ApiBibleObj_load_by_bibOj: function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            BsnpSvcAccount.ApiBibleObj_load_by_bibOj(inp);
        })
    },

    ApiBibleObj_write_Usr_BkcChpVrs_txt: async function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            BsnpSvcAccount.ApiBibleObj_write_Usr_BkcChpVrs_txt(inp);
        })
    },
    ///////////////////////////////////////



    ApiUsrReposData_status: function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, function (inp) {
            BsnpSvcAccount.ApiUsrReposData_status(inp)
        })
    },



    ///////////////////////////////////
    // Usr Data: Save/Load
    ApiUsrDat_save: async function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            BsnpSvcAccount.ApiUsrDat_save(inp)
        })
    },
    ApiUsrDat_load: async function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            BsnpSvcAccount.ApiUsrDat_load(inp)
        })
    },
    /////////////////////////////////////


















































    //////////////////////////
    //
    // Tool Test
    //

    ApiUsrRepos_toolkids: async function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            BsnpSvcToolkits.ApiUsrRepos_toolkids(inp, req, res)
        })
    },





    /////
    ApiBibleObj_read_crossnetwork_BkcChpVrs_txt: function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            BsnpSvcToolkits.ApiBibleObj_read_crossnetwork_BkcChpVrs_txt(inp, req, res)
        })
    },







    ApiUsrReposData_git_push: async function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            BsnpSvcToolkits.ApiUsrReposData_git_push(inp, req, res)
        })
    },

    ApiUsrReposData_git_pull: async function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            BsnpSvcToolkits.ApiUsrReposData_git_pull(inp, req, res)

        })
    },

    ApiUsr_Cmdline_Exec: async function (req, res) {

        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            BsnpSvcToolkits.ApiUsr_Cmdline_Exec(inp, req, res)
        })
    },

    test_https_work: async function (req, res) {
        console.log("test_https_work...")

        /////// show cache.keys
        console.log("NCache.myCache.keys():")
        var ar = NCache.myCache.keys()
        console.log(ar)
        Object.keys(NCache.myCache.keys()).forEach(function (i) {
            var sky = ar[i]
            console.log("skey:", sky)
            var obj = NCache.Get(sky)
            console.log(obj)
        })



        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(`api: test_https_work, it works ok.`);
        res.end();
    },

    ________ApiUsrReposData_create___test_only: async function (req, res) {

    },
}//// BibleRestApi ////

var BibleObjJsonpApi = {
    set_postHeader: function (res) {
        // for cross domain post.

        //
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
    },
    init: function (app) {
        //
        Object.keys(ApiJsonp_BibleObj).forEach(function (sapi) {
            console.log("api:", sapi)
            app.use("/" + sapi, function (req, res) {
                BibleObjJsonpApi.set_postHeader(res)

                ApiJsonp_BibleObj[sapi](req, res);
            })
        });
        return;
    }
}




module.exports = {
    BibleObjJsonpApi: BibleObjJsonpApi
}

