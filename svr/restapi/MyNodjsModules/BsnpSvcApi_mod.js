

const fs = require('fs');
const path = require('path');
const { nextTick } = require('process');
var url = require('url');
const fsPromises = require("fs").promises;
const crypto = require('crypto')

//var Uti = require("./Uti.module").Uti;
//var SvcUti = require("./SvcUti.module").SvcUti;
//const exec = require('child_process').exec;

const { BibleObjGitusrMgr, NCache } = require("./BibleObjGitusrMgr_mod")
const { BaseGUti } = require("./BaseGitUser_mod")

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
    Output_append: function (pout, ret) {
        Object.keys(ret).forEach(function (key) {
            pout[key] = ret[key]
        })
        if (ret.err) {
            return false;
        }
        return true;
    }

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
        var userProject = new BibleObjGitusrMgr()
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
            var userProject = new BibleObjGitusrMgr()
            //if (!inp.usr.f_path) inp.usr.f_path = ""
            var ret = userProject.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            var TbcvObj = {};
            if ("object" === typeof inp.par.fnames) {//['NIV','ESV']
                for (var i = 0; i < inp.par.fnames.length; i++) {
                    var fnameID = inp.par.fnames[i];
                    var jsfname = userProject.m_BaseGitUser.get_pfxname(fnameID)
                    console.log("jsfname:", jsfname)
                    var bib = BaseGUti.loadObj_by_fname(jsfname);
                    if (!bib.obj) continue
                    var bcObj = BaseGUti.copy_biobj(bib.obj, inp.par.bibOj);
                    TbcvObj[fnameID] = bcObj;
                    inp.out.desc += ":" + fnameID
                }
            }
            var bcvT = {}
            BaseGUti.convert_Tbcv_2_bcvT(TbcvObj, bcvT)
            inp.out.data = BaseGUti.search_str_in_bcvT(bcvT, inp.par.Search.File, inp.par.Search.Strn);
        })
    },

    ApiBibleObj_load_by_bibOj: function (req, res) {
        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            var userProject = new BibleObjGitusrMgr()
            var ret = userProject.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            function way1() {
                var par = inp.par, olog = [];
                console.log("-----:fnames", par.fnames, typeof par.fnames)
                console.log("-----:binp.par.bibOj", par.bibOj)
                var TbcObj = {};
                if ("object" === typeof par.fnames && par.bibOj) {//['NIV','ESV']
                    console.log("par.fnames:", par.fnames)
                    for (var i = 0; i < par.fnames.length; i++) {
                        var fnameID = par.fnames[i];
                        var jsfname = userProject.m_BaseGitUser.get_pfxname(fnameID)
                        console.log("load:", jsfname)
                        var bib = BaseGUti.loadObj_by_fname(jsfname);
                        if (!bib.obj) {
                            olog.push(jsfname + ":noexist:" + fnameID)
                            console.log("not exist..............", jsfname)
                            continue
                        }
                        var bcObj = BaseGUti.copy_biobj(bib.obj, par.bibOj);
                        TbcObj[fnameID] = bcObj;
                        olog.push("loaded:" + fnameID)
                    }
                    olog.push(":success")
                }
                //console.log(TbcObj)
                var bcvT = {}
                BaseGUti.convert_Tbcv_2_bcvT(TbcObj, bcvT)
                inp.out.data = bcvT
                inp.out.olog = olog
            }
            //////////////
            function way2() {
                var par = inp.par, olog = [];
                console.log("-----:fnames", par.fnames, typeof par.fnames)
                console.log("-----:binp.par.bibOj", par.bibOj)

                var carryObj = JSON.parse(JSON.stringify(par.bibOj))
                var sMaxStructFile = userProject.m_BaseGitUser.getFullPath_sys_stdlib_BibleStruct("All_Max_struct_json.js")
                var bibMaxStruct = BaseGUti.loadObj_by_fname(sMaxStructFile);
                BaseGUti.FetchObj_UntilEnd(carryObj, bibMaxStruct.obj,
                    {
                        FetchNodeEnd: function (carProperty, carObj, srcObj) {
                            carObj[carProperty] = srcObj[carProperty] //at the end of object tree, make a copy fr src.
                        }, SrcNodeNotOwnProperty: function (carProperty, carObj, srcObj) { //missing src of object. 
                            //noop
                        }
                    })
                BaseGUti.FetchObj_UntilEnd(carryObj, bibMaxStruct.obj,
                    {
                        FetchNodeEnd: function (carProperty, carObj, srcObj) {//at the end of object tree.
                            if ("string" === typeof (carObj[carProperty])) {
                                carObj[carProperty] = {} //at the end of object tree, change string to arr to prepare to load different version of txt.
                            } else {
                                console.log("************ Impossible Fatal Error, carProperty=", carProperty, carObj[carProperty])
                            }
                        }
                    })

                if ("object" === typeof par.fnames && par.bibOj) {//['NIV','ESV']
                    console.log("par.fnames:", par.fnames)
                    for (var i = 0; i < par.fnames.length; i++) {
                        var fnameID = par.fnames[i];
                        var jsfname = userProject.m_BaseGitUser.get_pfxname(fnameID, {
                            IfUsrNotExist: function (stdpfname, usrpfname) {
                                return stdpfname;
                            }
                        })
                        console.log("load:", jsfname)
                        var bib = BaseGUti.loadObj_by_fname(jsfname);
                        if (bib.obj) {
                            olog.push(jsfname + "::" + fnameID)
                            console.log("exist..............", jsfname)
                            BaseGUti.Walk_of_entries(carryObj,
                                function (bkc, chp, vrs, emptyobj) {//at the end of object tree.
                                    if ("object" === typeof (emptyobj)) {
                                        if (bib.obj[bkc] && bib.obj[bkc][chp] && "string" === typeof (bib.obj[bkc][chp][vrs])) {
                                            carryObj[bkc][chp][vrs][fnameID] = bib.obj[bkc][chp][vrs] //at the end of object tree, change string to arr to prepare to load different version of txt.
                                        }
                                        else {
                                            carryObj[bkc][chp][vrs][fnameID] = ""
                                        }
                                    } else {
                                        carryObj[bkc][chp][vrs][fnameID] = ""
                                        console.log("============ Error, Walk_of_entries=", bkc, chp, vrs, emptyobj)
                                        olog.push([jsfname, fnameID, bkc, chp, vrs])
                                    }
                                })
                        }
                    }
                    olog.push(":success")
                }
                inp.out.data = carryObj
                inp.out.olog = olog
            }
            //way1()
            way2()
            //console.log(bcvT)
        })
    },

    ApiBibleObj_write_Usr_BkcChpVrs_txt: async function (req, res) {
        if (!req || !res) {
            return inp_struct_base
        }
        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            //: unlimited write size. 
            var save_res = { desc: "to save" }
            var userProject = new BibleObjGitusrMgr()
            var ret = userProject.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")


            inp.out.olog = {}
            //if ("object" === typeof inp.par.fnames) {//['NIV','ESV']
            var doc = inp.par.fnames[0]
            var jsfname = userProject.m_BaseGitUser.get_pfxname(doc, {
                IfUsrNotExist: function (stdpfname, usrpfname) {
                    inp.out.olog["cpIfUsrNotExist"] = userProject.m_BaseGitUser.getFullPath_usr__cp_std(stdpfname, usrpfname).split(/\r|\n/) // must manually do it with sudo for gh auth
                    return usrpfname;
                }
            })
            var bio = BaseGUti.loadObj_by_fname(jsfname);
            if (!bio.obj) {
                save_res.desc = `load(${doc},${jsfname})=null`
                return;
            }

            //var karyObj = BaseGUti.inpObj_to_karyObj(inp.par.inpObj)
            //if (karyObj.kary.length !== 4) {
            //    save_res.desc = `err inpObj: ${JSON.stringify(karyObj)}`
            //    return
            //}
            console.log("inp.par.inpObj", inp.par.inpObj)
            //console.log("karyObj", karyObj)
            console.log("bio.obj", bio.obj)

            BaseGUti.FlushObj_UntilEnd(inp.par.inpObj, bio.obj, {
                SrcNodeEnd: function (carProperty, carObj, targObj) {//at the end of object tree.
                    if ("string" === typeof (carObj[carProperty])) {
                        targObj[carProperty] = carObj[carProperty] //at the end of object tree, make a copy or src.
                    } else {
                        console.log("************ Impossible Fatal Error, carProperty=", carProperty, carObj[carProperty])
                    }
                },
                TargNodeNotOwnProperty: function (carProperty, carObj, targObj) {//at the end of object tree.
                    targObj[carProperty] = carObj[carProperty] //at the end of object tree, make a copy or src.
                }
            })
            console.log("2 bio.obj", bio.obj)

            //var pChp = bio.obj[karyObj.bkc][karyObj.chp];//[karyObj.vrs] ///
            //if (!pChp[karyObj.vrs]) {
            //    pChp[karyObj.vrs] = ""
            //}
            //
            //var dlt = karyObj.txt.length - pChp[karyObj.vrs].length
            //if (pChp[karyObj.vrs] === karyObj.txt) {
            //    console.log("Not to save: the new txt is same as original txt-----.dlt=", dlt)
            //} else {
            //    console.log("Save: new txt differs original txt-----.dlt=", dlt)
            //    pChp[karyObj.vrs] = karyObj.txt
            //}
            bio.writeback()

            ////
            //var tagName = `${doc}~${karyObj.bkc}${karyObj.chp}:${karyObj.vrs}`
            //var save_res = {}
            //save_res.saved_size = "" + karyObj.txt.length + ",dlt:" + dlt
            //save_res.len = karyObj.txt.length
            //save_res.dlt = dlt
            //save_res.desc = `${tagName} saved.`

            //inp.out.olog.save_res = save_res

            inp.out.olog.git_res = userProject.m_BaseGitUser.git_add_commit_push_Sync(save_res.desc);//after saved
        })

        //res.writeHead(200, { 'Content-Type': 'text/javascript' });
        //res.write(`Jsonpster.Response(${sret},${sid});`);
        //res.end();
    },

    /////
    ApiBibleObj_read_crossnetwork_BkcChpVrs_txt: function (req, res) {

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {

            var userProject = new BibleObjGitusrMgr()
            var ret = userProject.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

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

            var docpathfilname = userProject.m_BaseGitUser.get_pfxname(doc)
            var outfil = userProject.m_SvrUsrsBCV.gen_crossnet_files_of(docpathfilname)


            //////----
            function __load_to_obj(outObj, jsfname, owner, shareID, inpObj,) {
                //'../../../../bible_study_notes/usrs/bsnp21/pub_wd01/account/myoj/myNote_json.js': 735213,
                var bio = BaseGUti.loadObj_by_fname(jsfname);
                var karyObj = BaseGUti.inpObj_to_karyObj(inpObj)
                if (karyObj.kary.length < 3) {
                    console.log("error",)
                }
                if (bio.obj && karyObj.kary.length >= 3) {
                    var tms = (new Date(bio.stat.mtime)).toISOString().substr(0, 10)
                    var usr_repo = `${owner}#${shareID}@${tms}`
                    outObj[usr_repo] = bio.obj[karyObj.bkc][karyObj.chp][karyObj.vrs]
                } else {
                }
            }


            /////--------------
            var retObj = {}
            var owner = userProject.___session_get_github_owner(docpathfilname)
            __load_to_obj(retObj, docpathfilname, owner, inp.usr.repodesc, inpObj)
            //console.log("jspfn:", jsfname)
            console.log("dcpfn:", docpathfilname)

            for (var i = 0; i < outfil.m_olis.length; i++) {
                var jspfn = outfil.m_olis[i]
                if (docpathfilname === jspfn) continue;
                console.log("*docfname=", jspfn)
                var others = userProject.___session_git_repodesc_load(jspfn)
                if (!others) continue
                if ("*" === shareID) {//no restriction
                    var owner = userProject.___session_get_github_owner(jspfn)
                    __load_to_obj(retObj, jspfn, owner, others.repodesc, inpObj)
                    continue
                }
                console.log("*repodesc=", others.repodesc, shareID)
                if (others.repodesc === shareID) {
                    var owner = userProject.___session_get_github_owner(jspfn)
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
            var userProject = new BibleObjGitusrMgr()
            var ret = userProject.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            var par = inp.par
            var save_res = { desc: "ok" }
            var doc = par.fnames[0]
            var jsfname = userProject.m_BaseGitUser.get_pfxname(doc, "cpIfNonexistance")
            console.log("jsfname=", jsfname)
            var ret = BaseGUti.loadObj_by_fname(jsfname)
            if (ret.obj) {
                BaseGUti.FlushObj_UntilEnd(par.data, ret.obj, {
                    SrcNodeEnd: function (carProperty, carObj, tarObj) {
                        if (null === carObj[carProperty]) { //to delete key in targetObj.
                            delete tarObj[carProperty]
                        } else {  //flush update target obj.
                            tarObj[carProperty] = carObj[carProperty]
                        }
                    }, TargNodeNotOwnProperty: function (carProperty, carObj, tarObj) {
                        if (null === carObj[carProperty]) {
                            //nothing to delete. 
                        } else {//add new key to targetObj.
                            tarObj[carProperty] = carObj[carProperty]
                        }
                    }
                })
                console.log("ret", ret)
                ret.writeback()
            } else {
                save_res.desc = "FATAL: loadObj_by_fname failed:=" + jsfname
                //inp.out.state.err = "FATAL: loadObj_by_fname failed:=", jsfname
                //console.log(inp.out.state.err)
            }
            inp.out.state.save = save_res

            //
            userProject.m_BaseGitUser.git_add_commit_push_Sync("ApiUsrDat_save");//after saved
        })
    },
    ApiUsrDat_load: async function (req, res) {

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            var userProject = new BibleObjGitusrMgr()
            var ret = userProject.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            if (0) {
                await userProject.m_BaseGitUser.git_pull(function (bSuccess) {
                })
            }
            var par = inp.par;
            var doc = par.fnames[0]
            var jsfname = userProject.m_BaseGitUser.get_pfxname(doc)
            var ret = BaseGUti.loadObj_by_fname(jsfname)
            var retObj = ret.obj  //get obj structure w/ keys.
            if ("object" === typeof (par.data) && Object.keys(par.data).length > 0) {  // ===undefined, null, or ''. 
                try {
                    retObj = JSON.parse(JSON.stringify(par.data));// 
                    BaseGUti.FetchObjDat(retObj, ret.obj)
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
        //res.write(`Jsonpster.Response(${sret},${sid});`);
        //res.end();
    },







    ///////////////////////////////////



    ApiUsrAccount_create: function (req, res) {
        console.log("ApiUsrAccount_create")
        ApiUti.Parse_POST_req_to_inp(req, res, function (inp) {
            var userProject = new BibleObjGitusrMgr()
            var ret = userProject.Proj_usr_account_create(inp.par.repopath, inp.par.passcode, inp.par.hintword, inp.par.accesstr)
            ApiUti.Output_append(inp.out, ret)
        })
    },
    ApiUsrReposData_signin: function (req, res) {
        //console.log("ApiUsrReposData_signin")
        //if (!req || !res) {
        //    return inp_struct_account_setup
        //}
        //ApiUti.Parse_POST_req_to_inp(req, res, function (inp) {
        //    //: unlimited write size. 
        //    var userProject = new BibleObjGitusrMgr()
        //    //console.log(inp, "\n\n---Proj_parse_usr_signin.start*************")
        //    var ret = userProject.Proj_parse_usr_signin(inp)
        //    if (!ApiUti.Output_append(inp.out, ret)) return console.log(inp, "\n\n----Proj_parse_usr_signin sign in failed.")
        //
        //
        //    inp.out.state.SSID = null;
        //    if (inp.out.state.bEditable) {
        //        if (null === userProject.m_BaseGitUser.git_push_test()) {
        //            //inp.out.state.bEditable =  inp.out.state. = 0
        //            //console.log("git_push_test failed.!!!!!")
        //            inp.out.state.FailedTest = "git_push_test failed.!!!!!."
        //            userProject.m_BaseGitUser.Proj_detele()
        //        } else {
        //            inp.out.state.SSID = userProject.Session_create()
        //            console.log("Session_create ==", inp.out.state.SSID)
        //        }
        //    }
        //})
    },
    ApiUsrAccount_login: function (req, res) {
        console.log("ApiUsrAccount_login")
        if (!req || !res) {
            return inp_struct_account_setup
        }
        ApiUti.Parse_POST_req_to_inp(req, res, function (inp) {
            //: unlimited write size. 
            var userProject = new BibleObjGitusrMgr()
            //console.log(inp, "\n\n---Proj_parse_usr_signin.start*************")
            var ret = userProject.Proj_parse_usr_login(inp.par.repopath, inp.par.passcode)
            ApiUti.Output_append(inp.out, ret)
            console.log(inp)
        })
    },
    ApiUsrAccount_logout: async function (req, res) {

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            var userProject = new BibleObjGitusrMgr()
            var ret = userProject.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            inp.out.olog = {}
            inp.out.olog["state_beforeDel"] = userProject.m_BaseGitUser.Check_proj_state()
            var gitdir = userProject.m_BaseGitUser.getFullPath_usr_git()
            if (fs.existsSync(gitdir)) {
                inp.out.olog["git add *"] = userProject.m_BaseGitUser.execSync_gitdir_cmd("git add *").split(/\r|\n/)
                inp.out.olog["git commit"] = userProject.m_BaseGitUser.execSync_gitdir_cmd(`git commit -m "before del. repodesc"`).split(/\r|\n/)
                inp.out.olog["git push"] = userProject.m_BaseGitUser.git_push()
            }
            inp.out.olog[`rm -rf ${gitdir}`] = userProject.m_BaseGitUser.execSync_gitdir_cmd(`rm -rf ${gitdir}`).split(/\r|\n/) //BaseGUti.execSync_Cmd(proj_destroy).toString()
            inp.out.state = userProject.m_BaseGitUser.Check_proj_state()
            inp.out.olog["destroySSID"] = userProject.Session_delete(inp.SSID)
        })

        // var sret = JSON.stringify(inp, null, 4)
        // var sid = ""
        // 
        // console.log("oup is ", inp.out)
        // res.writeHead(200, { 'Content-Type': 'text/javascript' });
        // res.write(`Jsonpster.Response(${sret},${sid});`);
        // res.end();
    },

    ApiUsrRepos_toolkids: async function (req, res) {

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            var userProject = new BibleObjGitusrMgr()
            var ret = userProject.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            console.log("ApiUsrRepos_toolkids==>par:", inp.par)
            inp.out.state_before_cmd = userProject.m_BaseGitUser.Check_proj_state()

            if (inp.par.gh_repo_delete_name && inp.par.gh_repo_delete_name.length > 0) {
                console.log("enter destroy ===>par:")
                var reponame = inp.par.gh_repo_delete_name
                if (reponame === "self") reponame = userProject.m_BaseGitUser.m_sponser.m_reponame;
                console.log("to delete:" + reponame)
                inp.out.destroy_res = {}
                var cmd = `sudo gh repo delete ${reponame} --confirm`
                inp.out.destroy_res[cmd] = userProject.m_BaseGitUser.execSync_gitdir_cmd(cmd).split(/\r|\n/) // must manually do it with sudo for gh auth
                inp.out.reposlist = userProject.m_BaseGitUser.m_sponser.gh_repo_list_all_obj()
                //userProject.Session_delete(inp.SSID)
                inp.out.state = userProject.m_BaseGitUser.Check_proj_state()
                return
            }
            if (inp.par.gh_repo_list_tot_diskUsage) {
                inp.out.gh_repo_list_tot_diskUsage = userProject.m_BaseGitUser.m_sponser.gh_repo_list_tot_diskUsage()
                return
            }

            if (inp.par.git_cmd_ary && inp.par.git_cmd_ary.length > 0) {
                console.log("enter => inp.par.git_cmd_ary:")
                inp.out.olog = []
                for (var i = 0; i < inp.par.git_cmd_ary.length; i++) {
                    var cmd = inp.par.git_cmd_ary[i]
                    var arr = userProject.m_BaseGitUser.execSync_gitdir_cmd(cmd).replace(/[\t]/g, " ").split(/\r|\n/)
                    var obj = {}
                    obj[cmd] = arr
                    inp.out.olog.push(obj)
                }
                inp.out.state = userProject.m_BaseGitUser.Check_proj_state()
                return
            }


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

            var userProject = new BibleObjGitusrMgr()
            var ret = userProject.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            var ret = userProject.m_BaseGitUser.Check_proj_state()
            var res2 = userProject.m_BaseGitUser.execSync_gitdir_cmd("git status -sb")
            if (res2 && res2.stdout) {
                inp.out.state.git_status_sb = res2.stdout
                inp.out.state.is_git_behind = res2.stdout.indexOf("behind")
            }
            userProject.m_BaseGitUser.Check_proj_state()
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

            var userProject = new BibleObjGitusrMgr()
            var ret = userProject.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            //inp.out.state = userProject.m_BaseGitUser.Deploy_proj()
            //await userProject.git_add_commit_push("push hard.", "");//real push hard.

            var res2 = userProject.m_BaseGitUser.execSync_gitdir_cmd("git add *")
            var res3 = userProject.m_BaseGitUser.execSync_gitdir_cmd(`git commit -m "svr-push. repodesc:${inp.usr.repodesc}"`)
            var res4 = userProject.m_BaseGitUser.git_push()

            userProject.m_BaseGitUser.Check_proj_state()
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

            var userProject = new BibleObjGitusrMgr()
            var ret = userProject.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            //inp.out.state = userProject.m_BaseGitUser.Deploy_proj()
            userProject.m_BaseGitUser.git_pull();
            userProject.m_BaseGitUser.Check_proj_state()

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
            var userProject = new BibleObjGitusrMgr()
            var ret = userProject.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            var ret = userProject.m_BaseGitUser.Check_proj_state()
            var rso = userProject.m_BaseGitUser.execSync_gitdir_cmd()
            console.log("\n\n*cmd-res", rso)
            userProject.m_BaseGitUser.Check_proj_state()
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

    ________ApiUsrReposData_create___test_only: async function (req, res) {
        console.log("ApiUsrReposData_create")
        if (!req || !res) {
            return inp_struct_account_setup
        }
        var inp = ApiUti.Parse_GET_req_to_inp(req)
        var userProject = new BibleObjGitusrMgr()
        var ret = userProject.Proj_parse_usr_signin(inp)
        if (ret) {
            userProject.m_BaseGitUser.Deploy_proj()


        }

        var sret = JSON.stringify(inp, null, 4)
        var sid = ""

        console.log("oup is ", inp.out)

        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(`Jsonpster.Response(${sret},${sid});`);
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

