

const fs = require('fs');
const path = require('path');
const { nextTick } = require('process');
var url = require('url');
const fsPromises = require("fs").promises;
const crypto = require('crypto')

//var Uti = require("./Uti.module").Uti;
//var SvcUti = require("./SvcUti.module").SvcUti;
//const exec = require('child_process').exec;

const { BibleObjGituser, BibleUti, NCache } = require("./BibleObjGituser_mod")


var ApiUti = {
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

            var out = BibleUti.default_inp_out_obj()
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
                    inpObj.out = BibleUti.default_inp_out_obj()
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
    find_workDir: function () {
        var pwd = __dirname
        console.log("__dirname=", pwd)

        var wd = "", rootdir = "", prev = ""
        pwd.split("/").forEach(function (nodname) {
            wd += nodname + "/"
            console.log(wd)
            if (fs.existsSync(`${wd}/.git`)) {
                rootdir = prev
            }
            prev = wd
        })
        console.log(rootdir, "  <=== svr rootdir")
        return rootdir
    }
}


//  var inp_struct_base = {
//      par: {
//          Search: { File: "searchInFileName", Strn: "searchStrn" },   //for strSearch in one Bible.
//      }
//  }
//  var inp_struct_base = {
//      par: {
//          fnames: [],                             /user pathfile name. './Dat/fname'
//          data: "" // for user stringified obj data holder for read or data for write into fnames[0]
//      }
//  }
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
        var otk = ApiUti.GetOTK()
        console.log(otk);
        res.send(otk);
        res.end();
    },
    Jsonpster: function (req, res) {
        ////////////////////////////////////////////
        //app.get("/Jsonpster", (req, res) => {
        console.log("res.req.headers.host=", res.req.headers.host);

        var inp = ApiUti.Parse_GET_req_to_inp(req)
        var userProject = new BibleObjGituser()
        var pkb64 = ""
        if (inp && inp.CUID) {
            var kpf = userProject.genKeyPair(inp.CUID)
            if (kpf) {
                pkb64 = kpf.pkb64
            }
        }

        //////////////
        var RestApi = {}
        Object.keys(this).forEach(function (key) {
            RestApi[key] = key; //, inp: ApiJsonp_BibleObj[key]() };
        })
        var jstr_RestApi = `var RestApi = ${JSON.stringify(RestApi, null, 4)}`
        var structall = JSON.stringify(inp_struct_all)
        var SvrUrl = `http://${res.req.headers.host}/`
        if (res.req.headers.host.indexOf("7778") < 0) {
            SvrUrl = `https://${res.req.headers.host}/`
        }
        console.log("SvrUrl=", SvrUrl)

        console.log(jstr_RestApi);
        res.send(jstr_RestApi);
        res.end();
        //});
    },
    ApiBibleObj_search_txt: function (req, res) {

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            var userProject = new BibleObjGituser()
            //if (!inp.usr.f_path) inp.usr.f_path = ""
            var proj = userProject.Proj_parse_usr_after_signed(inp)
            if (!proj) return console.log("Proj_parse_usr_after_signed failed.")
            inp.out.state =  userProject.m_UserProjFileSys.Deploy_proj()
            var TbcvObj = {};
            if (proj && "object" === typeof inp.par.fnames) {//['NIV','ESV']
                for (var i = 0; i < inp.par.fnames.length; i++) {
                    var trn = inp.par.fnames[i];
                    var jsfname = userProject.m_UserProjFileSys.get_pfxname(trn)
                    console.log("jsfname:", jsfname)
                    var bib = BibleUti.loadObj_by_fname(jsfname);
                    if (!bib.obj) continue
                    var bcObj = BibleUti.copy_biobj(bib.obj, inp.par.bibOj);
                    TbcvObj[trn] = bcObj;
                    inp.out.desc += ":" + trn
                }
            }
            var bcvT = {}
            BibleUti.convert_Tbcv_2_bcvT(TbcvObj, bcvT)
            inp.out.data = BibleUti.search_str_in_bcvT(bcvT, inp.par.Search.File, inp.par.Search.Strn);

            inp.out.desc += ":success."
            userProject.m_UserProjFileSys.Check_proj_state()
        })
    },

    ApiBibleObj_load_by_bibOj: function (req, res) {

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            var userProject = new BibleObjGituser()
            var proj = userProject.Proj_parse_usr_after_signed(inp)
            if (!proj) return console.log("Proj_parse_usr_after_signed failed.")
            inp.out.state = userProject.m_UserProjFileSys.Deploy_proj()
            if (!inp.out.state || inp.out.state.bEditable !== 1) {
                console.log("proj_setup failed.", inp.out.state)
                return inp;
            }


            if (!inp.out.state || inp.out.state.bMyojDir <= 0) {
                console.log("-----:bMyojDir<=0. dir not exist")
            } else {
                console.log("-----:bMyojDir>0", inp.par.fnames, typeof inp.par.fnames)
                console.log("-----:binp.par.bibOj", inp.par.bibOj)
                var TbcObj = {};
                if (proj && "object" === typeof inp.par.fnames && inp.par.bibOj) {//['NIV','ESV']
                    console.log("inp.par.fnames:", inp.par.fnames)
                    for (var i = 0; i < inp.par.fnames.length; i++) {
                        var trn = inp.par.fnames[i];
                        var jsfname = userProject.m_UserProjFileSys.get_pfxname(trn)
                        console.log("load:", jsfname)
                        var bib = BibleUti.loadObj_by_fname(jsfname);
                        if (!bib.obj) {
                            inp.out.desc += ":noexist:" + trn
                            console.log("not exist..............", jsfname)
                            continue
                        }
                        var bcObj = BibleUti.copy_biobj(bib.obj, inp.par.bibOj);
                        TbcObj[trn] = bcObj;
                        inp.out.desc += ":" + trn
                    }
                    inp.out.desc += ":success"
                }
                //console.log(TbcObj)
                var bcvT = {}
                BibleUti.convert_Tbcv_2_bcvT(TbcObj, bcvT)
                inp.out.data = bcvT
                //console.log(bcvT)
            }
            userProject.m_UserProjFileSys.Check_proj_state()
        })
    },

    ApiBibleObj_write_Usr_BkcChpVrs_txt: async function (req, res) {
        if (!req || !res) {
            return inp_struct_base
        }
        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            //: unlimited write size. 
            var save_res = { desc: "to save" }
            var userProject = new BibleObjGituser()
            var proj = userProject.Proj_parse_usr_after_signed(inp)
            if (!proj) return console.log("Proj_parse_usr_after_signed failed.")

            inp.out.state = userProject.m_UserProjFileSys.Deploy_proj()
            if (!inp.out.state || inp.out.state.bEditable !== 1) return console.log("proj_setup failed.", inp.out.state)



            //if ("object" === typeof inp.par.fnames) {//['NIV','ESV']
            var doc = inp.par.fnames[0]
            var jsfname = userProject.m_UserProjFileSys.get_pfxname(doc)
            var bio = BibleUti.loadObj_by_fname(jsfname);
            if (!bio.obj) {
                save_res.desc = `load(${doc},${jsfname})=null`
                return;
            }

            var karyObj = BibleUti.inpObj_to_karyObj(inp.par.inpObj)
            if (karyObj.kary.length !== 4) {
                save_res.desc = `err inpObj: ${JSON.stringify(karyObj)}`
                return
            }
            console.log(karyObj)
            var pChp = bio.obj[karyObj.bkc][karyObj.chp];//[karyObj.vrs]
            if (!pChp[karyObj.vrs]) {
                pChp[karyObj.vrs] = ""
            }

            var dlt = karyObj.txt.length - pChp[karyObj.vrs].length
            if (pChp[karyObj.vrs] === karyObj.txt) {
                console.log("Not to save: the new txt is same as original txt-----.")
            } else {
                console.log("Save: new txt differs original txt-----.dlt=", dlt)
                pChp[karyObj.vrs] = karyObj.txt
                bio.writeback()
            }

            ////
            var tagName = `${doc}~${karyObj.bkc}${karyObj.chp}:${karyObj.vrs}`
            var save_res = {}
            save_res.saved_size = "" + karyObj.txt.length + ",dlt:" + dlt
            save_res.len = karyObj.txt.length
            save_res.dlt = dlt
            save_res.desc = `${tagName} saved.`
            inp.out.save_res = save_res

            userProject.m_UserProjFileSys.git_add_commit_push_Sync(save_res.desc);//after saved
        })

        //res.writeHead(200, { 'Content-Type': 'text/javascript' });
        //res.write(`Jsonpster.Response(${sret},${sid});`);
        //res.end();
    },

    /////
    ApiBibleObj_read_crossnetwork_BkcChpVrs_txt: function (req, res) {

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {

            var userProject = new BibleObjGituser()
            var proj = userProject.Proj_parse_usr_after_signed(inp)
            if (!proj) return console.log("Proj_parse_usr_after_signed failed.")

            console.log(inp.par.aux)
            if (!inp.par.aux) {
                console.log("no inp.par.aux.")
            }
            if (!inp.par.aux.Search_repodesc) {
                console.log("no Search_repodesc.")
            }
            var shareID = inp.par.aux.Search_repodesc
            var inpObj = inp.par.inpObj

            var doc = inp.par.fnames[0]
            //var docname = userProject.get_DocCode_Fname(doc)
            var docpathfilname = userProject.m_UserProjFileSys.get_pfxname(doc)
            var outfil = userProject.m_SvrUsrsBCV.gen_crossnet_files_of(docpathfilname)


            //////----
            function __load_to_obj(outObj, jsfname, owner, shareID, inpObj,) {
                //'../../../../bible_study_notes/usrs/bsnp21/pub_wd01/account/myoj/myNote_json.js': 735213,
                var bio = BibleUti.loadObj_by_fname(jsfname);
                var karyObj = BibleUti.inpObj_to_karyObj(inpObj)
                if (karyObj.kary.length < 3) {
                    console.log("error",)
                }
                if (proj && bio.obj && karyObj.kary.length >= 3) {
                    var tms = (new Date(bio.stat.mtime)).toISOString().substr(0, 10)
                    var usr_repo = `${owner}#${shareID}@${tms}`
                    outObj[usr_repo] = bio.obj[karyObj.bkc][karyObj.chp][karyObj.vrs]
                } else {
                }
            }


            /////--------------
            var retObj = {}
            var owner = userProject.session_get_github_owner(docpathfilname)
            __load_to_obj(retObj, docpathfilname, owner, inp.usr.repodesc, inpObj)
            //console.log("jspfn:", jsfname)
            console.log("dcpfn:", docpathfilname)

            for (var i = 0; i < outfil.m_olis.length; i++) {
                var jspfn = outfil.m_olis[i]
                if (docpathfilname === jspfn) continue;
                console.log("*docfname=", jspfn)
                var others = userProject.session_git_repodesc_load(jspfn)
                if (!others) continue
                if ("*" === shareID) {//no restriction
                    var owner = userProject.session_get_github_owner(jspfn)
                    __load_to_obj(retObj, jspfn, owner, others.repodesc, inpObj)
                    continue
                }
                console.log("*repodesc=", others.repodesc, shareID)
                if (others.repodesc === shareID) {
                    var owner = userProject.session_get_github_owner(jspfn)
                    __load_to_obj(retObj, jspfn, owner, others.repodesc, inpObj)
                }
            }

            inp.out.repodesc = shareID
            inp.out.data = retObj
        })



        // var sret = JSON.stringify(inp)
        // var sid = ""
        // res.writeHead(200, { 'Content-Type': 'text/javascript' });
        // res.write(`Jsonpster.Response(${sret},${sid});`);
        // res.end();
    },


    ///////////////////////////////////
    ApiUsrDat_save: async function (req, res) {
        if (!req || !res) {
            return inp_struct_base
        }
        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            //: unlimited write size. 
            var userProject = new BibleObjGituser()
            var proj = userProject.Proj_parse_usr_after_signed(inp)
            if (!proj) return console.log("Proj_parse_usr_after_signed failed.")

            inp.out.state = userProject.m_UserProjFileSys.Deploy_proj()
            if (!inp || inp.out.state.bEditable !== 1) return console.log("proj_setup failed.", inp)

            //
            inp.out.state.save_res = userProject.m_UserProjFileSys.Save_userData_frm_client(inp.par)


            //
            userProject.m_UserProjFileSys.git_add_commit_push_Sync(inp.out.state.save_res.desc);//after saved
        })
    },
    ApiUsrDat_load: async function (req, res) {

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            var userProject = new BibleObjGituser()
            var proj = userProject.Proj_parse_usr_after_signed(inp)
            if (!proj) return console.log("Proj_parse_usr_after_signed failed.")

            if (proj) {

                inp.out.state = userProject.m_UserProjFileSys.Deploy_proj()

                var retp = userProject.m_UserProjFileSys.Check_proj_state()
                if (0) {
                    await userProject.m_UserProjFileSys.git_pull(function (bSuccess) {

                    })
                }

                inp.out.data = userProject.m_UserProjFileSys.Load_back_userData(inp.par)
                if (!inp.out.state) inp.out.state.bEditable = 1
            }
        })

        //var sret = JSON.stringify(inp)
        //var sid = ""
        //res.writeHead(200, { 'Content-Type': 'text/javascript' });
        //res.write(`Jsonpster.Response(${sret},${sid});`);
        //res.end();
    },







    ///////////////////////////////////


    ________ApiUsrReposData_create___test_only: async function (req, res) {
        console.log("ApiUsrReposData_create")
        if (!req || !res) {
            return inp_struct_account_setup
        }
        var inp = ApiUti.Parse_GET_req_to_inp(req)
        var userProject = new BibleObjGituser()
        var ret = userProject.Proj_parse_usr_signin(inp)
        if (ret) {
            userProject.m_UserProjFileSys.Deploy_proj()

            if (inp.out.state.bEditable === 1) {
                inp.out.state.SSID = userProject.Session_create()
            }
        }

        var sret = JSON.stringify(inp, null, 4)
        var sid = ""

        console.log("oup is ", inp.out)

        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(`Jsonpster.Response(${sret},${sid});`);
        res.end();
    },
    UsrReposPost_Signin: function (req, res) {
        console.log("UsrReposPost_Signin")
        if (!req || !res) {
            return inp_struct_account_setup
        }
        ApiUti.Parse_POST_req_to_inp(req, res, function (inp) {
            //: unlimited write size. 
            var userProject = new BibleObjGituser()
            console.log(inp, "\n\n---Proj_parse_usr_signin.start*************")
            var proj = userProject.Proj_parse_usr_signin(inp)
            if (!proj) return console.log(inp, "\n\n----Proj_parse_usr_signin sign in failed.")

            inp.out.state = userProject.m_UserProjFileSys.Deploy_proj()
            inp.out.state.SSID = null;
            if (inp.out.state.bEditable) {
                if (null === userProject.m_UserProjFileSys.git_push_test()) {
                    //inp.out.state.bEditable =  inp.out.state.bRepositable = 0
                    console.log("git_push_test failed.!!!!!")
                    inp.out.state.FailedTest = "git_push_test failed.!!!!!."
                    userProject.m_UserProjFileSys.Destroy_proj()
                } else {
                    inp.out.state.SSID = userProject.Session_create()
                    console.log("Session_create ==", inp.out.state.SSID)
                }
            }

        })
    },

    ApiUsrReposData_destroy: async function (req, res) {

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            var userProject = new BibleObjGituser()
            var proj = userProject.Proj_parse_usr_after_signed(inp)
            if (!proj) return console.log("Proj_parse_usr_after_signed failed.")

            userProject.m_UserProjFileSys.Check_proj_state()
            if (0 === inp.out.state.bRepositable) {
                //case push failed. Don't delete
                console.log("git dir not exit.")

            } else {
                var res2 = userProject.m_UserProjFileSys.execSync_cmd_git("git add *")
                var res3 = userProject.m_UserProjFileSys.execSync_cmd_git(`git commit -m "before del. repodesc:${inp.usr.repodesc}"`)
                var res4 = userProject.m_UserProjFileSys.git_push()

                var res5 = userProject.m_UserProjFileSys.Destroy_proj()
            }

            //userProject.Check_proj_state()
            userProject.Session_delete()
        })

        // var sret = JSON.stringify(inp, null, 4)
        // var sid = ""
        // 
        // console.log("oup is ", inp.out)
        // res.writeHead(200, { 'Content-Type': 'text/javascript' });
        // res.write(`Jsonpster.Response(${sret},${sid});`);
        // res.end();
    },

    ApiUsrReposData_status: function (req, res) {

        ApiUti.Parse_POST_req_to_inp(req, res, function (inp) {

            var userProject = new BibleObjGituser()
            var proj = userProject.Proj_parse_usr_after_signed(inp)
            if (!proj) return console.log("Proj_parse_usr_after_signed failed.")

            var ret = userProject.m_UserProjFileSys.Check_proj_state()
            var res2 = userProject.m_UserProjFileSys.execSync_cmd_git("git status -sb")
            if (res2 && res2.stdout) {
                inp.out.state.git_status_sb = res2.stdout
                inp.out.state.is_git_behind = res2.stdout.indexOf("behind")
            }
            userProject.m_UserProjFileSys.Check_proj_state()
        })



        // var sret = JSON.stringify(inp, null, 4)
        // var sid = ""
        // 
        // console.log("oup is ", inp.out)
        // res.writeHead(200, { 'Content-Type': 'text/javascript' });
        // res.write(`Jsonpster.Response(${sret},${sid});`);
        // res.end();
    },


    ApiUsrReposData_git_push: async function (req, res) {

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {

            var userProject = new BibleObjGituser()
            var proj = userProject.Proj_parse_usr_after_signed(inp)
            if (!proj) return console.log("Proj_parse_usr_after_signed failed.")

            inp.out.state = userProject.m_UserProjFileSys.Deploy_proj()
            //await userProject.git_add_commit_push("push hard.", "");//real push hard.

            var res2 = userProject.m_UserProjFileSys.execSync_cmd_git("git add *")
            var res3 = userProject.m_UserProjFileSys.execSync_cmd_git(`git commit -m "svr-push. repodesc:${inp.usr.repodesc}"`)
            var res4 = userProject.m_UserProjFileSys.git_push()

            userProject.m_UserProjFileSys.Check_proj_state()
        })
        //var sret = JSON.stringify(inp, null, 4)
        //var sid = ""

        //console.log("oup is ", inp.out)
        //res.writeHead(200, { 'Content-Type': 'text/javascript' });
        //res.write(`Jsonpster.Response(${sret},${sid});`);
        //res.end();
    },

    ApiUsrReposData_git_pull: async function (req, res) {

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {

            var userProject = new BibleObjGituser()
            var proj = userProject.Proj_parse_usr_after_signed(inp)
            if (!proj) return console.log("Proj_parse_usr_after_signed failed.")

            inp.out.state = userProject.m_UserProjFileSys.Deploy_proj()
            userProject.m_UserProjFileSys.git_pull();
            userProject.m_UserProjFileSys.Check_proj_state()

        })
        //var sret = JSON.stringify(inp, null, 4)
        //var sid = ""
        //
        //console.log("oup is ", inp.out)
        //res.writeHead(200, { 'Content-Type': 'text/javascript' });
        //res.write(`Jsonpster.Response(${sret},${sid});`);
        //res.end();
    },

    ApiUsr_Cmdline_Exec: async function (req, res) {

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            var userProject = new BibleObjGituser()
            var proj = userProject.Proj_parse_usr_after_signed(inp)
            if (!proj) return console.log("Proj_parse_usr_after_signed failed.")

            var ret = userProject.m_UserProjFileSys.Check_proj_state()
            var rso = userProject.m_UserProjFileSys.execSync_cmd_git()
            console.log("\n\n*cmd-res", rso)
            userProject.m_UserProjFileSys.Check_proj_state()
        })

        // var sret = JSON.stringify(inp, null, 4)
        // var sid = ""
        // console.log("oup is ", inp.out)
        // res.writeHead(200, { 'Content-Type': 'text/javascript' });
        // res.write(`Jsonpster.Response(${sret},${sid});`);
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
        var woringDir = ApiUti.find_workDir()
        BibleObjJsonpApi.m_rootDir = woringDir
        //BibleUti.WorkingRootDir(woringDir)
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

