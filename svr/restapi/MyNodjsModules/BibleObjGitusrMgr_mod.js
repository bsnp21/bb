

const fs = require('fs');
const path = require('path');
var url = require('url');
const fsPromises = require("fs").promises;

//var Uti = require("./Uti.module").Uti;
//var SvcUti = require("./SvcUti.module").SvcUti;
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

//var btoa = require('btoa');
const crypto = require('crypto')

const NodeCache = require("node-cache");





var { BaseGitUser, BaseGUti } = require("./BaseGitUser_mod");









var NCache = JSON.parse(fs.readFileSync("./config/nCache_cfg.json", "utf8"));//60000 //seconds.

NCache.myCache = new NodeCache({ checkperiod: NCache.m_checkperiod }); //checkperiod default is 600s.
NCache.Init = function () {
    NCache.myCache.set("test", { publicKey: 1, privateKey: 1, CUID: 1 }, 30)
    //myCache.ttl( "tuid", 3 )
    console.log("ttl=", NCache.myCache.getTtl("test"))

    NCache.myCache.set("test", { publicKey: 1, privateKey: 1, CUID: 1 }, 10)
    //myCache.ttl( "tuid", 6 )
    console.log("ttl=", NCache.myCache.getTtl("test"))
    var obj = NCache.myCache.get("test")
    console.log(obj)



    function _destroy_git_proj(key, val) {
        console.log(`\n\n\n\n\n\n\n\n\n\non del, NCache.m_checkperiod=${NCache.m_checkperiod},m_TTL=${NCache.m_TTL}`)
        // ... do something ...
        //
        console.log(`on del:key=${key}, \n-val=${JSON.stringify(val)} `)

        if (!val) return console.log("on del: val is null")
        if ("object" !== typeof (val)) return console.log("on del: val not valid inp.usr obj")
        if (!val.repopath) return console.log("on del: val invalide gituser. inp.usr.repopath null")

        //if (!fs.existsSync(rootDir)) return console.log(`not existsSync(${rootDir}).`)
        //if (!fs.existsSync(key)) return console.log(`not existsSync(${key}).`)

        var gitdir = Buffer.from(key, 'base64').toString('utf8')
        console.log("on del:* start to del proj_destroy ssid=", key)
        console.log("on del:* start to del proj_destroy val=", val)
        console.log("on del:* start to del proj_destroy ownr=", gitdir)
        var inp = {}
        inp.usr = val
        inp.out = BaseGUti.default_inp_out_obj()
        inp.SSID = key
        var userProject = new BibleObjGitusrMgr()
        if (inp.gitusr = userProject.m_BaseGitUser.Set_gitusr(val.repopath)) {
            //userProject.m_inp = inp
            userProject.m_BaseGitUser.Check_proj_state()
            console.log(inp.out.state)
            if (fs.existsSync(userProject.m_BaseGitUser.getFullPath_usr_main())) {
                console.log("on del:git dir exist. push before to delete it")
                userProject.m_BaseGitUser.git_add_commit_push_Sync(false)
                userProject.m_BaseGitUser.m_sponser.git_gh_pages_published_url()
            }
            userProject.m_BaseGitUser.main_dir_remove()
        }
        console.log("on del:* End of del proj_destroy ssid=", key, gitdir)
    }



    NCache.myCache.on("del", function (key, val) {
        _destroy_git_proj(key, val)
        //_MaxForgivenTimes(key, val)
    });
    NCache.myCache.on("expired", function (key, val) {
        //console.log(`on expired:key=${key}, \n-val=${JSON.stringify(val)}`)
        //_MaxForgivenTimes(key, val)
    })
}
NCache.Set = function (key, val, ttl) {
    if (undefined === ttl) return console.log("*** fatal err: ttl not set.")
    if ("object" === typeof val) {
    } else {
        val = this.myCache.get(key)
    }
    if (null == val) return;
    val.tms = (new Date()).getTime() //timestampe for last access.
    val.ttl = ttl
    this.myCache.set(key, val, ttl) //restart ttl -- reborn again.
    console.log("NCache.Set|key,val,ttl |", key, val, ttl)
}
NCache.Get = function (key, ttl) {
    var val = this.myCache.get(key)
    if (undefined === val || null === val) { //0 and "" are allowed.
    } else {
        if (undefined === ttl) {
            if ("object" === typeof (val)) {
                ttl = val.ttl
                this.Set(key, val, ttl) //restart ttl -- reborn again.
            }
        }
    }
    console.log("NCache.Get|key,val,ttl |", key, val, ttl)
    return val
}
NCache.Init()
















//////////////////////////////////////////





























//../../../../bugit/usrs/{hostname}/{Usrname}/{projname}/account/dat
//../../../../bugit/usrs/{hostname}/{Usrname}/{projname}/account/myoj
var BibleObjGitusrMgr = function () {

    this.m_BaseGitUser = new BaseGitUser()
}




BibleObjGitusrMgr.prototype.Proj_usr_account_create = function (repopath, passcode, hintword, accesstr) {
    console.log("========Proj_usr_account_create", repopath, passcode, hintword)


    var robj = this.m_BaseGitUser.Set_gitusr(repopath)
    if (robj.err) return robj

    robj.state_orign = this.m_BaseGitUser.Check_proj_state()
    robj.sponsorDiskUsage = this.m_BaseGitUser.m_sponser.gh_repo_list_tot_diskUsage()

    robj.ghapinfo = this.m_BaseGitUser.m_sponser.gh_api_repos_nameWithOwner()
    if (!robj.ghapinfo.err) {
        robj.err = ["already exist: ", repopath]
        console.log("already exist: ", repopath);
        return robj;
    }

    robj.gh_repo_create_remote = this.m_BaseGitUser.gh_repo_create_remote_master(accesstr)
    robj.git_clone = this.m_BaseGitUser.git_clone()  //on master by default.
    robj.main_dir_write_salts = this.m_BaseGitUser.main_dir_write_salts(passcode, hintword)
    robj.main_git_add_salts = this.m_BaseGitUser.main_execSync_cmdar("", ["sudo git add .salts"])
    robj._git_add_commit_push_Sync = this.m_BaseGitUser.main_git_add_commit_push_Sync(true)
    robj.state_just_created = this.m_BaseGitUser.Check_proj_state()

    robj.main_dir_remove = this.m_BaseGitUser.main_dir_remove()

    //////
    //gh_pahges
    //this.m_BaseGitUser.gh_pages_publish()



    return robj
}




BibleObjGitusrMgr.prototype._decipher_usr_by_key_stored_in_cuid = function (cuid, cipherusrs) {
    console.log("------- _decipher_usr_by_key_stored_in_cuid=", cuid)

    if (!cuid || cuid.length === 0 || cipherusrs.length === 0) return null
    console.log("decipher user based on prev key nached in cuid=", cuid)

    var robj = NCache.myCache.take(cuid) //take: for safety delete immediately after use.
    if (!robj) return console.log("cache null=" + cuid)
    console.log(robj)

    console.log(cipherusrs)

    var str = BaseGUti.decrypt_txt(cipherusrs, robj.privateKey)
    var usrObj = JSON.parse(str)
    console.log("session_decipher_usrs usrObj=")
    console.log(usrObj)
    return usrObj
}
BibleObjGitusrMgr.prototype.Proj_parse_usr_login = function (repopath, passcode) {
    if (!repopath) return { err: "null repopath" }
    repopath = repopath.toLowerCase()

    var robj = this.m_BaseGitUser.Set_gitusr(repopath)
    if (robj.err) return robj;

    console.log("========__Proj_parse_usr_login__")
    robj.ghapinfo = this.m_BaseGitUser.m_sponser.gh_api_repos_nameWithOwner()
    if (robj.ghapinfo.err) {
        robj.err = ["not exist: ", repopath]
        console.log(robj.err);
        return robj
    }

    //robj.delete_master_dir = this.m_BaseGitUser.main_dir_remove()
    robj.deploy = this.m_BaseGitUser.Deploy_git_repo() //on default master branch.

    robj.saltary = this.m_BaseGitUser.get_repo_salts()
    if (robj.saltary[0] !== passcode) {
        robj.err = ["password error. Hint: ", robj.saltary[1]]
        console.log("robj=", robj)
        return robj
    }

    var usrObj = { repopath: repopath, passcode: passcode }
    robj.SSID = this.Session_create(usrObj)

    robj.state = this.m_BaseGitUser.Check_proj_state()

    //robj.delete_master_dir = this.m_BaseGitUser.main_dir_remove()
    //this.m_BaseGitUser.gh_pages_publish()
    /////////
    //robj.deploy = this.m_BaseGitUser.Deploy_git_repo("gh-pages") // branch.
    //robj.state = this.m_BaseGitUser.Check_proj_state()

    return robj //must be SSID capitalized ret.
}

BibleObjGitusrMgr.prototype.Proj_prepare_after_signed = function (ssid) {

    var usr = this.Session_get_usr(ssid)
    if (!usr) {
        console.log("*****timeout, failed ssid")
        return { err: ["session nonexist|timeout", ssid] }
    }

    var robj = this.m_BaseGitUser.Set_gitusr(usr.repopath)
    if (robj.err) return robj;

    robj.deploy_proj = this.m_BaseGitUser.Deploy_git_repo()

    robj.state = this.m_BaseGitUser.Check_proj_state()
    return robj
}
BibleObjGitusrMgr.prototype.ProjSignedin_Save_myoj = function (doc, bibObj) {
    var _this = this
    var olog = {}
    var jsfname = this.m_BaseGitUser.get_pfxname(doc, {
        IfUsrFileNotExist: function (stdpfname, usrpfname) {
            olog["cpIfUsrNotExist"] = _this.m_BaseGitUser.getFullPath_usr__cp_std(stdpfname, usrpfname).split(/\r|\n/) // must manually do it with sudo for gh auth
            return usrpfname;
        }
    })
    var bio = BaseGUti.loadObj_by_fname(jsfname);
    if (null === bio.obj) {
        olog.desc_err = `load(${doc},${jsfname})=null`
        return;
    }

    BaseGUti.FlushObj_UntilEnd(bibObj, bio.obj, {
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
    olog.gh_pages_publish_ = this.m_BaseGitUser.main_git_add_commit_push_Sync(true)

    return olog;
}
BibleObjGitusrMgr.prototype.ProjSignedin_Save_dat = function (doc, inpObj, datype) {
    var jsfname = this.m_BaseGitUser.get_pfxname(doc, {
        IfUsrFileNotExist: function (stdfile, usrfile) {
            var base = path.parse(usrfile)
            BaseGUti.execSync_Cmd(`sudo mkdir -p ${base.dir}`)
            BaseGUti.execSync_Cmd(`sudo chown ubuntu:ubuntu -R ${base.dir}`)
            BaseGUti.execSync_Cmd(`sudo chmod 777 -R ${base.dir}`)
            BaseGUti.execSync_Cmd(`sudo cp ${stdfile} ${usrfile}`)
            console.log("IfUsrFileNotExist, base=", base)
            return usrfile
        }
    })
    if ("plain_text_content" === datype) {
        fs.writeFileSync(jsfname, inpObj, "utf8")
        return { plain_text_content_writeFileSync: jsfname, gh_pages_publish_ : this.m_BaseGitUser.main_git_add_commit_push_Sync(true) }
    }

    var ret = BaseGUti.loadObj_by_fname(jsfname)
    if (null === ret.obj) {
        ret.obj = {}
        ret["file without template:"] = [jsfname, inpObj]
    }
    if (ret.obj) {
        BaseGUti.FlushObj_UntilEnd(inpObj, ret.obj, {
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

        ret.set_fname_header()
        ret.writeback()
        ret["force to save usr data:"] = [jsfname, inpObj]
    }
    ret.gh_pages_publish_ = this.m_BaseGitUser.main_git_add_commit_push_Sync(true)
    return ret;
}
BibleObjGitusrMgr.prototype.ProjSignedin_load_bibObj = function (fnames, bibOj) {
    var olog = [];
    console.log("-----:fnames", fnames, typeof fnames)
    console.log("-----:binp.par.bibOj", bibOj)

    var carryObj = JSON.parse(JSON.stringify(bibOj))
    var sMaxStructFile = this.m_BaseGitUser.getFullPath_sys_stdlib_BibleStruct("All_Max_struct_json.js")
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

    if ("object" === typeof fnames && bibOj) {//['NIV','ESV']
        console.log("par.fnames:", fnames)
        for (var i = 0; i < fnames.length; i++) {
            var fnameID = fnames[i];
            var jsfname = this.m_BaseGitUser.get_pfxname(fnameID, {
                IfUsrFileNotExist: function (stdpfname, usrpfname) {
                    return stdpfname;
                }
            })
            console.log("load:", jsfname)
            var bib = BaseGUti.loadObj_by_fname(jsfname);
            if (bib.obj) {
                olog.push(jsfname + "::" + fnameID)
                console.log("exist..............", jsfname)
                BaseGUti.WalkthruObj_BCV_txt(carryObj,
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
                            console.log("============ Error, WalkthruObj_BCV_txt=", bkc, chp, vrs, emptyobj)
                            olog.push([jsfname, fnameID, bkc, chp, vrs])
                        }
                    })
            }
        }
        olog.push(":success")
    }
    //inp.out.data = carryObj
    //inp.out.olog = olog
    return { data: carryObj, olog: olog }
}



BibleObjGitusrMgr.prototype.___session_get_github_owner = function (docfile) {
    //jspfn: ../../../../bugit/usrs/github.com/bsnp21/pub_test01/account/myoj/myNote_json.js
    var ary = docfile.split("/")
    var idx = ary.indexOf("usrs")
    var hostname = ary[idx + 1]
    var username = ary[idx + 2]
    var reponame = ary[idx + 3]
    var owner = username + "/" + reponame
    return owner
}
BibleObjGitusrMgr.prototype.___session_git_repodesc_load = function (docfile) {
    //jspfn: ../../../../bugit/usrs/github.com/bsnp21/pub_test01/account/myoj/myNote_json.js
    var pos = docfile.indexOf("/account/")
    var gitpath = docfile.substr(0, pos)
    console.log("gitpath", gitpath)
    var usrObj = NCache.Get(gitpath)
    if (!usrObj) return null
    console.log("usrObj", usrObj)
    return { repodesc: usrObj.repodesc, pathfile: gitpath }
}

BibleObjGitusrMgr.prototype.Session_get_usr = function (ssid) {
    //inp.out.state.ssid_cur = ssid
    if (!ssid || ssid.length === 0) {
        return null
    }
    if (!NCache.myCache.has(ssid)) {
        //inp.out.state.failed_ssid = "not have."
        console.log("***** Session_get_usr: could not find key: NCache.myCache.has(inp.SSID)", ssid)
        return null
    }

    var usr = NCache.Get(ssid)
    NCache.Set(ssid, usr, 3600 * 24 * 180) //180days
    return usr;
}
BibleObjGitusrMgr.prototype.Session_create = function (usr) {

    var ssid = (new Date()).getTime() + this.m_BaseGitUser.m_sponser.m_reponame //usr_proj
    var ssid_b64 = ssid;//Buffer.from(ssid).toString("base64") //=btoa()
    var ttl = NCache.m_TTL //default.

    NCache.Set(ssid_b64, usr, ttl)
    console.log("Session_create:ssid=", ssid, ssid_b64, usr, ttl)

    return ssid_b64
}
BibleObjGitusrMgr.prototype.Session_delete = function (ssid) {

    var ret = NCache.myCache.take(ssid)

    console.log("Session_delete:", ssid, ret)

    NCache.myCache.set(ssid, null)
}


BibleObjGitusrMgr.prototype.CreateAdminMgr = function () {
    var adminMgr = new BibleObjGitusrMgr()
    adminMgr.m_BaseGitUser.Set_gitusr("admin")
    adminMgr.m_BaseGitUser.Deploy_git_repo()//on  master by default

    adminMgr.iUpdatedUsersList = 0

    adminMgr.release_user = function () {
        if (this.iUpdatedUsersList > 0) {
            return adminMgr.m_BaseGitUser.main_git_add_commit_push_Sync("admin add usr");//after saved
        }
    }
    adminMgr.Add_doc_BCV_user = function (bcvObj, username, visib) {

        var ret = { bcvObj: bcvObj, usrername: username }

        ret.up_doc_bcv_user = this.Update_doc_bcv_user(bcvObj, username)

        ret.publish_usr = this.Publish_user(username, visib)

        ret.release = this.release_user()

        return ret;
    }
    adminMgr.Update_doc_bcv_user = function (bcvObj, username) {
        var bUpdatedUsersList = false
        var ret = { bUpdatedUsersList: bUpdatedUsersList, bcvObj: bcvObj, usrername: username }

        ret.usrObj = JSON.parse(JSON.stringify(bcvObj))
        BaseGUti.WalkthruObj_BCV_txt(ret.usrObj,
            function (bkc, chp, vrs, endnod) {//at the end of object tree.
                if ("object" !== typeof (endnod)) {
                    ret.usrObj[bkc][chp][vrs] = {}
                }
                ret.usrObj[bkc][chp][vrs][username] = 1
                ret.usrObj_set = [bkc, chp, vrs, endnod]
            })
        ret["usrObj_set_done"] = ret.usrObj

        ////////////

        var jsfname = adminMgr.m_BaseGitUser.getFullPath_usr_acct("u_e_Note_json.js")
        ret.admobj = BaseGUti.loadObj_by_fname(jsfname);
        if (null === ret.admobj.obj) {
            ret.admobj.obj = {}
        }

        BaseGUti.FlushObj_UntilEnd(ret.usrObj, ret.admobj.obj, {
            SrcNodeEnd: function (carProperty, carObj, targObj) {//at the end of object tree.
                //already exist
                ret.SrcNodeEnd = [carProperty, carObj, targObj]
            },
            TargNodeNotOwnProperty: function (carProperty, carObj, targObj, tarParent, tarParentProperty) {//at the end of object tree.
                //targObj[carProperty] = carObj[carProperty] //at the end of object tree, make a copy or src.
                bUpdatedUsersList = true
                if ("object" !== typeof (targObj)) {
                    tarParent[tarParentProperty] = {}
                    tarParent[tarParentProperty][carProperty] = carObj[carProperty]
                } else {
                    targObj[carProperty] = carObj[carProperty]
                }
                ret.TargNodeNotOwnProperty = [carProperty, carObj, targObj, tarParent, tarParentProperty, ret.admobj.obj]
            }
        })

        ret.admobj_afterFlucsh = ret.admobj.obj

        if (bUpdatedUsersList) {
            ret.admobj.set_fname_header()
            ret.admobj.writeback()
        }

        this.iUpdatedUsersList += bUpdatedUsersList ? 1 : 0
        return ret;
    }
    adminMgr.Publish_user = function (username, visib) {
        ////////////////////////////////////
        /// maintain/update public user list.
        var bUpdatedUsersList = false
        var usrfname = this.m_BaseGitUser.getFullPath_usr_acct("pub_users_json.js")
        var pubUsrObj = BaseGUti.loadObj_by_fname(usrfname);
        if (null === pubUsrObj.obj) {
            pubUsrObj.obj = {}
        }
        if (pubUsrObj.obj.hasOwnProperty(username)) {
            if ("private" === visib) {
                delete pubUsrObj.obj[username]
                bUpdatedUsersList = true
            }
        } else {
            if ("public" === visib) {
                pubUsrObj.obj[username] = 1
                bUpdatedUsersList = true
            }
        }
        if (bUpdatedUsersList) {
            pubUsrObj.set_fname_header()
            pubUsrObj.writeback()
        }
        this.iUpdatedUsersList += bUpdatedUsersList ? 1 : 0
        /////////////
        return pubUsrObj
    }
    return adminMgr;
}



module.exports = {
    NCache: NCache,
    BibleObjGitusrMgr: BibleObjGitusrMgr
}