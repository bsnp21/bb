

const fs = require('fs');
const path = require('path');
const { nextTick } = require('process');
var url = require('url');
const fsPromises = require("fs").promises;
const crypto = require('crypto')

//var Uti = require("./Uti.module").Uti;
//var SvcUti = require("./SvcUti.module").SvcUti;
//const exec = require('child_process').exec;

const { BibleObjGitusrMgr, BsnpSvcUti, NCache } = require("./BibleObjGitusrMgr_mod")
const { BaseGUti } = require("./BaseGitUser_mod")

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
            BsnpSvcUti.ApiUsrAccount_create(inp)
            //var gituserMgr = new BibleObjGitusrMgr()
            //var ret = gituserMgr.Proj_usr_account_create(inp.par.repopath, inp.par.passcode, inp.par.hintword, inp.par.accesstr)
            //if (!BaseGUti.Output_append(inp.out, ret)) return console.log("ApiUsrAccount_create failed.")
            //
            //var admin = gituserMgr.CreateAdminMgr()
            //ret.admnpublish_usr = admin.Publish_user(inp.par.repopath, inp.par.accesstr)
            //ret.admrelease = admin.release_user()
            //
            //
            //return;
        })
    },

    ApiUsrAccount_login: function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, function (inp) {
            BsnpSvcUti.ApiUsrAccount_login(inp)
            ////: unlimited write size. 
            //var gituserMgr = new BibleObjGitusrMgr()
            ////console.log(inp, "\n\n---Proj_parse_usr_login.start*************")
            //var ret = gituserMgr.Proj_parse_usr_login(inp.par.repopath, inp.par.passcode)
            //BaseGUti.Output_append(inp.out, ret)
            //console.log(inp)
        })
    },
    ApiUsrAccount_logout: async function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            BsnpSvcUti.ApiUsrAccount_logout(inp)
            //var gituserMgr = new BibleObjGitusrMgr()
            //var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            //if (!BaseGUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")
            //
            //inp.out.olog = {}
            //inp.out.olog["state_beforeDel"] = gituserMgr.m_BaseGitUser.Check_proj_state()
            //var gitdir = gituserMgr.m_BaseGitUser.getFullPath_usr_main()
            //if (fs.existsSync(gitdir)) {
            //
            //}
            //inp.out.olog["destroySSID"] = gituserMgr.Session_delete(inp.SSID) //trig to delete usr dir. 
            //inp.out.state = gituserMgr.m_BaseGitUser.Check_proj_state()
        })
    },
    ApiUsrAccount_update: function (req, res) {
        console.log("ApiUsrAccount_create")
        ApiWrap.Parse_POST_req_to_inp(req, res, function (inp) {
            BsnpSvcUti.ApiUsrAccount_update(inp)
            //var gituserMgr = new BibleObjGitusrMgr()
            //var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            //if (!BaseGUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")
            //
            //var usrname = gituserMgr.m_BaseGitUser.m_sponser.m_reponame
            //
            //inp.out.olog = {}
            //gituserMgr.m_BaseGitUser.main_dir_remove()
            //gituserMgr.m_BaseGitUser.Set_gitusr(usrname)
            //gituserMgr.m_BaseGitUser.Deploy_git_repo() //on master. 
            //
            //if (!inp.par.passcodeNew) {
            //    inp.out.err = ["missing new passcode."]
            //    return
            //}
            //if (!inp.par.accesstr) {
            //    inp.out.err = ["missing accesstr."]
            //    return
            //}
            //
            //gituserMgr.m_BaseGitUser.main_dir_write_salts(inp.par.passcodeNew, inp.par.hintword)
            //gituserMgr.m_BaseGitUser.main_execSync_cmdar("", ["sudo git add .salts"])
            //inp.out.olog["git_add_commit_push_Sync_def"] = gituserMgr.m_BaseGitUser.main_git_add_commit_push_Sync("ApiUsrAccount_update");//after saved
            //
            //var cmd = `gh repo edit ${gituserMgr.m_BaseGitUser.m_sponser.m_acct.ownername}/${inp.par.repopath} --visibility ${inp.par.accesstr} --homepage 'https://github.com'`
            //inp.out.olog[cmd] = gituserMgr.m_BaseGitUser.main_execSync_cmd(cmd).split(/\r|\n/) // must manually do it with sudo for gh auth
            //
            //gituserMgr.m_BaseGitUser.main_dir_remove()
            //
            /////////////////
            //var admin = gituserMgr.CreateAdminMgr()
            //inp.out.olog.admnpublish_usr = admin.Publish_user(inp.par.repopath, inp.par.accesstr)
            //inp.out.olog.admrelease = admin.release_user()

        })
    },
    ///////////////////////////////////////////////








    ////////////////////////////////////
    //
    // basic bible Read/Write/Search API.
    // 
    ApiBibleObj_search_txt: function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            BsnpSvcUti.ApiBibleObj_search_txt(inp)
        })
    },

    ApiBibleObj_load_by_bibOj: function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            BsnpSvcUti.ApiBibleObj_load_by_bibOj(inp);
        })
    },

    ApiBibleObj_write_Usr_BkcChpVrs_txt: async function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            BsnpSvcUti.ApiBibleObj_write_Usr_BkcChpVrs_txt(inp);
        })
    },
    ///////////////////////////////////////







    ///////////////////////////////////
    ApiUsrDat_save: async function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            inp.out.olog = {}
            //: unlimited write size. 
            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!BaseGUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            inp.out.olog.save_dat = gituserMgr.ProjSignedin_Save_dat(inp.par.fnames[0], inp.par.data, inp.par.datype)

            //inp.out.olog.gh_pages_publish_ = gituserMgr.m_BaseGitUser.gh_pages_publish()
        })
    },
    ApiUsrDat_load: async function (req, res) {
        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!BaseGUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            var par = inp.par;
            var doc = par.fnames[0]
            var jsfname = gituserMgr.m_BaseGitUser.get_pfxname(doc)
            var ret = BaseGUti.loadObj_by_fname(jsfname)
            var retObj = ret.obj  //get obj structure w/ keys.
            if ("object" === typeof (par.data) && Object.keys(par.data).length > 0) {  // ===undefined, null, or ''. 
                try {
                    retObj = JSON.parse(JSON.stringify(par.data));// 
                    BaseGUti.FetchObj_UntilEnd(retObj, ret.obj)
                    console.log("out.data", retObj)
                } catch (err) {
                    console.log("err", err)
                    //inp.out.state.err = err
                }
            }
            inp.out.data = retObj;
        })

        //var sret = JSON.stringify(inp)
        //var sid = ""
        //res.writeHead(200, { 'Content-Type': 'text/javascript' });

        //res.end();
    },



















































    ApiUsrRepos_toolkids: async function (req, res) {

        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            if (inp.par && inp.par.trepass_cmd_ary && inp.par.trepass_cmd_ary.length > 0) {
                console.log("enter => inp.par.trepass_cmd_ary:")
                inp.out.olog = []
                for (var i = 0; i < inp.par.trepass_cmd_ary.length; i++) {
                    var cmd = inp.par.trepass_cmd_ary[i]
                    var arr = BaseGUti.execSync_Cmd(cmd).replace(/[\t]/g, " ").split(/\r|\n/)
                    var obj = {}
                    obj[cmd] = arr
                    inp.out.olog.push(obj)
                }
                return
            }

            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!BaseGUti.Output_append(inp.out, ret)) {
                return console.log("Proj_prepare_after_signed failed.")
            }

            console.log("ApiUsrRepos_toolkids==>par:", inp.par)
            inp.out.state_before_cmd = gituserMgr.m_BaseGitUser.Check_proj_state()

            if (inp.par.gh_repo_delete_name && inp.par.gh_repo_delete_name.length > 0) {
                console.log("enter destroy ===>par:")
                var reponame = inp.par.gh_repo_delete_name
                if (reponame === "self") reponame = gituserMgr.m_BaseGitUser.m_sponser.m_reponame;
                console.log("to delete:" + reponame)
                inp.out.destroy_res = {}
                var cmd = `sudo gh repo delete ${reponame} --confirm`
                inp.out.destroy_res[cmd] = gituserMgr.m_BaseGitUser.main_execSync_cmd(cmd).split(/\r|\n/) // must manually do it with sudo for gh auth
                inp.out.reposlist = gituserMgr.m_BaseGitUser.m_sponser.gh_repo_list_all_obj()
                //gituserMgr.Session_delete(inp.SSID)
                inp.out.state = gituserMgr.m_BaseGitUser.Check_proj_state()
                return
            }
            if (inp.par.gh_repo_list_tot_diskUsage) {
                inp.out.gh_repo_list_tot_diskUsage = gituserMgr.m_BaseGitUser.m_sponser.gh_repo_list_tot_diskUsage()
                return
            }

            if (inp.par.git_cmd_ary && inp.par.git_cmd_ary.length > 0) {
                console.log("enter => inp.par.git_cmd_ary:")
                inp.out.olog = []
                for (var i = 0; i < inp.par.git_cmd_ary.length; i++) {
                    var cmd = inp.par.git_cmd_ary[i]
                    var arr = gituserMgr.m_BaseGitUser.main_execSync_cmd(cmd).replace(/[\t]/g, " ").split(/\r|\n/)
                    var obj = {}
                    obj[cmd] = arr
                    inp.out.olog.push(obj)
                }
                inp.out.state = gituserMgr.m_BaseGitUser.Check_proj_state()
                return
            }



        })

        // var sret = JSON.stringify(inp, null, 4)
        // var sid = ""
        // 
        // console.log("oup is ", inp.out)
        // res.writeHead(200, { 'Content-Type': 'text/javascript' });

        // res.end();
    },





    /////
    ApiBibleObj_read_crossnetwork_BkcChpVrs_txt: function (req, res) {

        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {

            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!BaseGUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")
        })



        // var sret = JSON.stringify(inp)
        // var sid = ""
        // res.writeHead(200, { 'Content-Type': 'text/javascript' });

        // res.end();
    },




    ApiUsrReposData_status: function (req, res) {

        ApiWrap.Parse_POST_req_to_inp(req, res, function (inp) {

            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!BaseGUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            var ret = gituserMgr.m_BaseGitUser.Check_proj_state()
            var res2 = gituserMgr.m_BaseGitUser.main_execSync_cmd("git status -sb")
            if (res2 && res2.stdout) {
                inp.out.state.git_status_sb = res2.stdout
                inp.out.state.is_git_behind = res2.stdout.indexOf("behind")
            }
            gituserMgr.m_BaseGitUser.Check_proj_state()
        })



        // var sret = JSON.stringify(inp, null, 4)
        // var sid = ""
        // 
        // console.log("oup is ", inp.out)
        // res.writeHead(200, { 'Content-Type': 'text/javascript' });

        // res.end();
    },


    ApiUsrReposData_git_push: async function (req, res) {

        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {

            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!BaseGUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")


            //await gituserMgr.git_add_commit_push("push hard.", "");//real push hard.

            var res2 = gituserMgr.m_BaseGitUser.main_execSync_cmd("git add *")
            var res3 = gituserMgr.m_BaseGitUser.main_execSync_cmd(`git commit -m "svr-push. repodesc:${inp.usr.repodesc}"`)
            //var res4 = gituserMgr.m_BaseGitUser.git_push()

            gituserMgr.m_BaseGitUser.Check_proj_state()
        })
        //var sret = JSON.stringify(inp, null, 4)
        //var sid = ""

        //console.log("oup is ", inp.out)
        //res.writeHead(200, { 'Content-Type': 'text/javascript' });

        //res.end();
    },

    ApiUsrReposData_git_pull: async function (req, res) {

        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {

            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!BaseGUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")


            gituserMgr.m_BaseGitUser.git_pull();
            gituserMgr.m_BaseGitUser.Check_proj_state()

        })
        //var sret = JSON.stringify(inp, null, 4)
        //var sid = ""
        //
        //console.log("oup is ", inp.out)
        //res.writeHead(200, { 'Content-Type': 'text/javascript' });

        //res.end();
    },

    ApiUsr_Cmdline_Exec: async function (req, res) {

        ApiWrap.Parse_POST_req_to_inp(req, res, async function (inp) {
            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!BaseGUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            var ret = gituserMgr.m_BaseGitUser.Check_proj_state()
            var rso = gituserMgr.m_BaseGitUser.main_execSync_cmd()
            console.log("\n\n*cmd-res", rso)
            gituserMgr.m_BaseGitUser.Check_proj_state()
        })

        // var sret = JSON.stringify(inp, null, 4)
        // var sid = ""
        // console.log("oup is ", inp.out)
        // res.writeHead(200, { 'Content-Type': 'text/javascript' });

        // res.end();
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
        console.log("ApiUsrReposData_create")
        if (!req || !res) {
            return inp_struct_account_setup
        }
        var inp = ApiWrap.Parse_GET_req_to_inp(req)
        var gituserMgr = new BibleObjGitusrMgr()
        var ret = gituserMgr.Proj_parse_usr_signin(inp)
        if (ret) {



        }

        var sret = JSON.stringify(inp, null, 4)
        var sid = ""

        console.log("oup is ", inp.out)

        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(`.Response(${sret},${sid});`);
        res.end();
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

