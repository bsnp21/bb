

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
    ApiBibleObj_search_txt: function (req, res) {
        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            var gituserMgr = new BibleObjGitusrMgr()
            //if (!inp.usr.f_path) inp.usr.f_path = ""
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            var TbcvObj = {};
            if ("object" === typeof inp.par.fnames) {//['NIV','ESV']
                for (var i = 0; i < inp.par.fnames.length; i++) {
                    var fnameID = inp.par.fnames[i];
                    var jsfname = gituserMgr.m_BaseGitUser.get_pfxname(fnameID)
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
            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
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
                        var jsfname = gituserMgr.m_BaseGitUser.get_pfxname(fnameID)
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
                var sMaxStructFile = gituserMgr.m_BaseGitUser.getFullPath_sys_stdlib_BibleStruct("All_Max_struct_json.js")
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
                        var jsfname = gituserMgr.m_BaseGitUser.get_pfxname(fnameID, {
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
            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")


            inp.out.olog = {}
            //if ("object" === typeof inp.par.fnames) {//['NIV','ESV']
            var doc = inp.par.fnames[0]
            var jsfname = gituserMgr.m_BaseGitUser.get_pfxname(doc, {
                IfUsrNotExist: function (stdpfname, usrpfname) {
                    inp.out.olog["cpIfUsrNotExist"] = gituserMgr.m_BaseGitUser.getFullPath_usr__cp_std(stdpfname, usrpfname).split(/\r|\n/) // must manually do it with sudo for gh auth
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
            //console.log("bio.obj", bio.obj)

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

            bio.writeback()

            //// optional
            var idxfile = gituserMgr.m_BaseGitUser.getFullPath_usr_acct("/index.htm")
            //fs.writeFileSync(idxfile, "a")
            inp.out.olog.indexfile = idxfile

            inp.out.olog.git_res = gituserMgr.m_BaseGitUser.git_add_commit_push_Sync(save_res.desc);//after saved
            inp.out.olog.gh_pages_publish = gituserMgr.gh_pages_publish()

            /////////////////////////////

            var reponame = gituserMgr.m_BaseGitUser.m_sponser.m_reponame
            var bUpdatedUsersList = false
            var usrinfo = gituserMgr.m_BaseGitUser.m_sponser.gh_api_repos_nameWithOwner()
            var bVisibility = "private"
            if (!usrinfo.err) bVisibility = usrinfo.visibility


            //////////////////////////////

            var adminMgr = new BibleObjGitusrMgr()
            adminMgr.m_BaseGitUser.Set_gitusr("admin")
            adminMgr.m_BaseGitUser.Deploy_proj()
            var jsfname = adminMgr.m_BaseGitUser.get_pfxname(doc, {
                IfUsrNotExist: function (stdpfname, usrpfname) {
                    inp.out.olog["cpIfUsrNotExist2"] = adminMgr.m_BaseGitUser.getFullPath_usr__cp_std(stdpfname, usrpfname).split(/\r|\n/) // must manually do it with sudo for gh auth
                    return usrpfname;
                }
            })
            var bio = BaseGUti.loadObj_by_fname(jsfname);
            if (!bio.obj) {
                save_res.desc2 = `load(${doc},${jsfname})=null`
                return;
            }
            BaseGUti.FlushObj_UntilEnd(inp.par.inpObj, bio.obj, {
                SrcNodeEnd: function (carProperty, carObj, targObj) {//at the end of object tree.
                    if ("string" === typeof (carObj[carProperty])) {
                        var ary = targObj[carProperty].split(",")
                        var idx = ary.indexOf(reponame)
                        if (idx < 0) {
                            if (bVisibility === "public") {
                                ary.unshift(reponame)  // add new public usrname.
                                targObj[carProperty] = ary.join(",")
                                bUpdatedUsersList = true
                            }
                        } else {
                            if (bVisibility === "private") {
                                ary.splice(idx, 1) // remove the private user.
                                targObj[carProperty] = ary.join(",")
                                bUpdatedUsersList = true
                            }
                        }
                    } else {
                        console.log("************ Impossible Fatal Error, carProperty=", carProperty, carObj[carProperty])
                    }
                },
                TargNodeNotOwnProperty: function (carProperty, carObj, targObj) {//at the end of object tree.
                    targObj[carProperty] = carObj[carProperty] //at the end of object tree, make a copy or src.
                }
            })
            console.log("3 bio.obj", bio.obj, bVisibility)
            if (bUpdatedUsersList) {
                bio.set_fname_header()
                bio.writeback()
                inp.out.olog.git_res2 = adminMgr.m_BaseGitUser.git_add_commit_push_Sync(save_res.desc2);//after saved
            }
            ///////////////////////////////////////////////////////////////////////////
        })

        //res.writeHead(200, { 'Content-Type': 'text/javascript' });

        //res.end();
    },

    /////
    ApiBibleObj_read_crossnetwork_BkcChpVrs_txt: function (req, res) {

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {

            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

        })



        // var sret = JSON.stringify(inp)
        // var sid = ""
        // res.writeHead(200, { 'Content-Type': 'text/javascript' });

        // res.end();
    },


    ///////////////////////////////////
    ApiUsrDat_save: async function (req, res) {
        if (!req || !res) {
            return inp_struct_base
        }
        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            inp.out.olog = {}
            //: unlimited write size. 
            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            var par = inp.par
            var save_res = { desc: "ok" }
            var doc = par.fnames[0]
            var jsfname = gituserMgr.m_BaseGitUser.get_pfxname(doc, {
                IfUsrNotExist: function (stdfile, usrfile) {
                    var base = path.parse(usrfile)
                    BaseGUti.execSync_Cmd(`sudo mkdir -p ${base.dir}`)
                    BaseGUti.execSync_Cmd(`sudo chown ubuntu:ubuntu -R ${base.dir}`)
                    BaseGUti.execSync_Cmd(`sudo chmod 777 -R ${base.dir}`)
                    BaseGUti.execSync_Cmd(`sudo cp ${stdfile} ${usrfile}`)

                    return usrfile
                }
            })
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
            inp.out["git_add_commit_push_Sync"] = gituserMgr.m_BaseGitUser.git_add_commit_push_Sync("ApiUsrDat_save");//after saved
            inp.out.olog.gh_pages_publish = gituserMgr.gh_pages_publish()
        })
    },
    ApiUsrDat_load: async function (req, res) {

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            var par = inp.par;
            var doc = par.fnames[0]
            var jsfname = gituserMgr.m_BaseGitUser.get_pfxname(doc)
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

        //res.end();
    },







    ///////////////////////////////////




    ApiUsrAccount_create: function (req, res) {
        console.log("ApiUsrAccount_create")
        ApiUti.Parse_POST_req_to_inp(req, res, function (inp) {
            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_usr_account_create(inp.par.repopath, inp.par.passcode, inp.par.hintword, inp.par.accesstr)
            ApiUti.Output_append(inp.out, ret)
        })
    },

    ApiUsrAccount_login: function (req, res) {
        console.log("ApiUsrAccount_login")
        if (!req || !res) {
            return inp_struct_account_setup
        }
        ApiUti.Parse_POST_req_to_inp(req, res, function (inp) {
            //: unlimited write size. 
            var gituserMgr = new BibleObjGitusrMgr()
            //console.log(inp, "\n\n---Proj_parse_usr_login.start*************")
            var ret = gituserMgr.Proj_parse_usr_login(inp.par.repopath, inp.par.passcode)
            ApiUti.Output_append(inp.out, ret)
            console.log(inp)
        })
    },
    ApiUsrAccount_logout: async function (req, res) {

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            inp.out.olog = {}
            inp.out.olog["state_beforeDel"] = gituserMgr.m_BaseGitUser.Check_proj_state()
            var gitdir = gituserMgr.m_BaseGitUser.getFullPath_usr_git()
            if (fs.existsSync(gitdir)) {
                inp.out.olog["git_add_commit_push_Sync"] = gituserMgr.m_BaseGitUser.git_add_commit_push_Sync(true)
            }
            inp.out.olog["destroySSID"] = gituserMgr.Session_delete(inp.SSID) //trig to delete usr dir. 
            inp.out.state = gituserMgr.m_BaseGitUser.Check_proj_state()
        })

        // var sret = JSON.stringify(inp, null, 4)
        // var sid = ""
        // 
        // console.log("oup is ", inp.out)
        // res.writeHead(200, { 'Content-Type': 'text/javascript' });

        // res.end();
    },
    ApiUsrAccount_update: function (req, res) {
        console.log("ApiUsrAccount_create")
        ApiUti.Parse_POST_req_to_inp(req, res, function (inp) {
            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            inp.out.olog = {}
            inp.out.olog["state_beforeDel"] = gituserMgr.m_BaseGitUser.Check_proj_state()
            var gitdir = gituserMgr.m_BaseGitUser.getFullPath_usr_git()
            if (fs.existsSync(gitdir)) {
                inp.out.olog["git_add_commit_push_Sync"] = gituserMgr.m_BaseGitUser.git_add_commit_push_Sync(true)
            }
            //inp.out.olog["destroySSID"] = gituserMgr.Session_delete(inp.SSID) //trig to delete usr dir. 
            inp.out.state = gituserMgr.m_BaseGitUser.Check_proj_state()

            if (!inp.par.passcodeNew) {
                inp.out.err = ["missing new passcode."]
                return
            }
            if (!inp.par.accesstr) {
                inp.out.err = ["missing accesstr."]
                return
            }
            //return

            gituserMgr.m_BaseGitUser.git_dir_write_salts(inp.par.passcodeNew, inp.par.hintword)
            inp.out.olog["git_add_commit_push_Sync"] = gituserMgr.m_BaseGitUser.git_add_commit_push_Sync("ApiUsrAccount_update");//after saved

            //return
            var cmd = `gh repo edit ${gituserMgr.m_BaseGitUser.m_sponser.m_acct.ownername}/${inp.par.repopath} --visibility ${inp.par.accesstr} --homepage 'https://github.com'`
            inp.out.olog[cmd] = gituserMgr.m_BaseGitUser.execSync_gitdir_cmd(cmd).split(/\r|\n/) // must manually do it with sudo for gh auth


        })
    },

    ApiUsrRepos_toolkids: async function (req, res) {

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {
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
            if (!ApiUti.Output_append(inp.out, ret)) {
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
                inp.out.destroy_res[cmd] = gituserMgr.m_BaseGitUser.execSync_gitdir_cmd(cmd).split(/\r|\n/) // must manually do it with sudo for gh auth
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
                    var arr = gituserMgr.m_BaseGitUser.execSync_gitdir_cmd(cmd).replace(/[\t]/g, " ").split(/\r|\n/)
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









    ApiUsrReposData_status: function (req, res) {

        ApiUti.Parse_POST_req_to_inp(req, res, function (inp) {

            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            var ret = gituserMgr.m_BaseGitUser.Check_proj_state()
            var res2 = gituserMgr.m_BaseGitUser.execSync_gitdir_cmd("git status -sb")
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

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {

            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            //inp.out.state = gituserMgr.m_BaseGitUser.Deploy_proj()
            //await gituserMgr.git_add_commit_push("push hard.", "");//real push hard.

            var res2 = gituserMgr.m_BaseGitUser.execSync_gitdir_cmd("git add *")
            var res3 = gituserMgr.m_BaseGitUser.execSync_gitdir_cmd(`git commit -m "svr-push. repodesc:${inp.usr.repodesc}"`)
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

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {

            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            //inp.out.state = gituserMgr.m_BaseGitUser.Deploy_proj()
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

        ApiUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            var gituserMgr = new BibleObjGitusrMgr()
            var ret = gituserMgr.Proj_prepare_after_signed(inp.SSID)
            if (!ApiUti.Output_append(inp.out, ret)) return console.log("Proj_prepare_after_signed failed.")

            var ret = gituserMgr.m_BaseGitUser.Check_proj_state()
            var rso = gituserMgr.m_BaseGitUser.execSync_gitdir_cmd()
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
        var inp = ApiUti.Parse_GET_req_to_inp(req)
        var gituserMgr = new BibleObjGitusrMgr()
        var ret = gituserMgr.Proj_parse_usr_signin(inp)
        if (ret) {
            gituserMgr.m_BaseGitUser.Deploy_proj()


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

