

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

var { BaseGitUser, BaseGUti, WorkingRootNodeName } = require("./BaseGitUser_mod");


//const WorkingRootNodeName = "bugit" BibleUti


var SvrUsrsBCV = function (srcpath) {
    this.m_rootDir = srcpath
    this.output = {
        m_olis: [],
        m_totSize: 0,
        m_totFiles: 0,
        m_totPaths: 0
    }
}
SvrUsrsBCV.prototype.get_paths = function (srcpath) {
    return fs.readdirSync(srcpath).filter(function (file) {
        if ("." === file[0]) return false;
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}
SvrUsrsBCV.prototype.get_files = function (srcpath) {
    return fs.readdirSync(srcpath).filter(function (file) {
        if ("." === file[0]) return false;
        return fs.statSync(srcpath + '/' + file).isFile();
    });
}
SvrUsrsBCV.prototype.getFary = function (srcPath, cbf) {
    var fary = this.get_files(srcPath);
    var dary = this.get_paths(srcPath);
    this.output.m_totPaths += dary.length;
    this.output.m_totFiles += fary.length;

    for (var i = 0; i < dary.length; i++) {
        var spath = dary[i];
        //console.log(spath)
        this.getFary(path.join(srcPath, spath), cbf);
    }
    for (var k = 0; k < fary.length; k++) {
        var sfl = fary[k];
        //console.log("path file :", srcPath, sfl)
        //if (doc !== sfl) continue
        var pathfile = path.join(srcPath, sfl);
        var stats = fs.statSync(pathfile);
        this.output.m_totSize += stats.size;

        if (cbf) cbf(srcPath, sfl)
    }
}
SvrUsrsBCV.prototype.decompose = function (docpathfilname) {
    var ret = path.parse(docpathfilname)
    //console.log(ret)
    var ary = ret.dir.split("/")
    var owner = `_${ary[6]}_${ary[7]}_${ary[8]}`
    var compound = { owner: owner, base: ret.base }
    //console.log("compound", compound)
    return compound
}
SvrUsrsBCV.prototype.gen_crossnet_files_of = function (docpathfilname, cbf) {
    //console.log("spec=", spec)
    this.m_compound = this.decompose(docpathfilname)
    var _This = this
    this.getFary(this.m_rootDir, function (spath, sfile) {
        var pathfile = path.join(spath, sfile);
        var cmpd = _This.decompose(pathfile)
        if (cmpd.base === _This.m_compound.base) {
            _This.output.m_olis.push(pathfile);
            console.log("fnd:", pathfile)
            if (cbf) cbf(spath, sfile)
        }

    })
    return this.output
}









var NCache = {}
NCache.m_checkperiod = 60 //s.
NCache.m_TTL = NCache.m_checkperiod * 6 //360 seconds (default)
NCache.m_MFT = 300  //MaxForgivenTimesToKeepCache== ttl * 300.
NCache.m_MAX = 3600 * 200  //about a week

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
        console.log(`\n\n\n\n\n\n\n\n\n\non del, NCache.m_checkperiod=${NCache.m_checkperiod},m_TTL=${NCache.m_TTL}, m_MFT=${NCache.m_MFT}`)
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
        inp.out = BibleUti.default_inp_out_obj()
        inp.SSID = key
        var userProject = new BibleObjGituser()
        if (inp.gitusr = userProject.m_BaseGitUser.Set_Gitusr(val.repopath, val.passcode)) {
            //userProject.m_inp = inp
            userProject.m_BaseGitUser.Check_proj_state()
            console.log(inp.out.state)
            if (1 === inp.out.state.bRepositable) {
                //
                console.log("on del:git dir exist. push before to delete it")
                var res2 = userProject.execSync_cmd_git("git add *")
                var res3 = userProject.execSync_cmd_git(`git commit -m "on del in Cache"`)
                var res4 = userProject.git_push()

                var res5 = userProject.m_BaseGitUser.Destroy_proj()
            }
        }
        console.log("on del:* End of del proj_destroy ssid=", key, gitdir)
    }


    function _MaxForgivenTimes(key, val) {
        if ("object" !== typeof val) {
            return console.log("on expired, must dies!~~~~~~~~~~~~", key)
        }

        if (key.match(/^CUID\d+\.\d+/)) {//key=CUID16129027802800.6753972926962513, 
            return console.log("on expired, must dies!~~~~~~~~~~~~", key)
        }

        var tms = val.tms, ttl = val.ttl
        if (!tms || !ttl) {
            return console.log("on expired, invalid must die.", ttl, tms, key)
        }

        var cur = (new Date()).getTime() //(ms)
        var dlt = (cur - tms) / 1000.0 //(s)
        var max = ttl * NCache.m_MFT
        if (max > NCache.m_MAX) {
            max = NCache.m_MAX
        }

        console.log(`on expired,MFT=${NCache.m_MFT}, ttl=${ttl}, dlt=${dlt}, key=${key}`)
        if (dlt < max) {
            console.log("on expired, keep alive!", key)
            NCache.myCache.set(key, val, ttl) //keep it.
        } else {
            console.log("on expired, ~~~~~~~~~ die ~~~~~~~", key)
        }
        console.log("on expired end!\n\n\n\n\n\n\n")
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
    }else{
        val = this.myCache.get(key)
    }
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
var BibleObjGituser = function () {

    this.m_BaseGitUser = new BaseGitUser()
    this.m_SvrUsrsBCV = new SvrUsrsBCV(this.m_BaseGitUser.pathrootdir)
}




BibleObjGituser.prototype.Proj_usr_account_create = function (repopath, passcode, hintword) {
    console.log("========Proj_usr_account_create", repopath, passcode, hintword)
    if (this.m_BaseGitUser.IsUserExist(repopath)) {
        return { err: repopath + ": user alreay exists." }
    }
    this.m_BaseGitUser.Set_Gitusr(repopath)
    this.m_BaseGitUser.gh_repo_create(repopath, passcode, hintword)
    var ret = this.m_BaseGitUser.Check_proj_state()
    return { ok: ret }
}

BibleObjGituser.prototype._decipher_usr_by_key_stored_in_cuid = function (cuid, cipherusrs) {
    console.log("------- _decipher_usr_by_key_stored_in_cuid=", cuid)

    if (!cuid || cuid.length === 0 || cipherusrs.length === 0) return null
    console.log("decipher user based on prev key nached in cuid=", cuid)

    var robj = NCache.myCache.take(cuid) //take: for safety delete immediately after use.
    if (!robj) return console.log("cache null=" + cuid)
    console.log(robj)

    console.log(cipherusrs)

    var str = BibleUti.decrypt_txt(cipherusrs, robj.privateKey)
    var usrObj = JSON.parse(str)
    console.log("session_decipher_usrs usrObj=")
    console.log(usrObj)
    return usrObj
}
BibleObjGituser.prototype.Proj_parse_usr_signin = function (inp) {
    console.log("========Proj_parse_usr_signin")

    var usr = this._decipher_usr_by_key_stored_in_cuid(inp.CUID, inp.cipherusrs)
    if (!usr) {
        console.log("*****failed: sdfadfasjiasf")
        return null
    }
    return this.m_BaseGitUser.Set_Gitusr(usr.repopath)
}
BibleObjGituser.prototype.Proj_parse_usr_login = function (repopath, passcode) {
    var usrObj = { repopath: repopath, passcode: passcode }

    console.log("========__Proj_parse_usr_login__")
    if (!this.m_BaseGitUser.IsUserExist(repopath)) {
        return { err: ["not exist:", repopath] }
    }
    this.m_BaseGitUser.Set_Gitusr(repopath)


    this.m_BaseGitUser.Deploy_proj()

    var ar = this.m_BaseGitUser.get_repo_salts()
    if (ar.indexOf(passcode) < 0) {
        return { err: ["password error.", ar[1]] }
    }

    //inp.out.state.SSID = userProject.Session_create()
    var ssid = this.Session_create(usrObj)

    var ret = this.m_BaseGitUser.Check_proj_state()
    return { ok: ret, ssid: ssid }
}

BibleObjGituser.prototype.Proj_parse_usr_after_signed = function (ssid) {

    var usr = this.proj_get_usr_fr_cache_ssid(ssid)
    if (!usr) {
        console.log("*****failed sdfadfas")
        return null
    }
    NCache.Set(ssid, usr, 3600 * 24 * 180)

    return this.m_BaseGitUser.Set_Gitusr(usr.repopath)
}


BibleObjGituser.prototype.proj_get_usr_fr_cache_ssid = function (ssid) {
    //inp.out.state.ssid_cur = ssid
    if (!ssid || ssid.length === 0) {
        return null
    }
    if (!NCache.myCache.has(ssid)) {
        //inp.out.state.failed_ssid = "not have."
        console.log("***** proj_get_usr_fr_cache_ssid: could not find key: NCache.myCache.has(inp.SSID)", ssid)
        return null
    }

    var usr = NCache.Get(ssid)
    return usr;
}


BibleObjGituser.prototype.session_get_github_owner = function (docfile) {
    //jspfn: ../../../../bugit/usrs/github.com/bsnp21/pub_test01/account/myoj/myNote_json.js
    var ary = docfile.split("/")
    var idx = ary.indexOf("usrs")
    var hostname = ary[idx + 1]
    var username = ary[idx + 2]
    var reponame = ary[idx + 3]
    var owner = username + "/" + reponame
    return owner
}
BibleObjGituser.prototype.session_git_repodesc_load = function (docfile) {
    //jspfn: ../../../../bugit/usrs/github.com/bsnp21/pub_test01/account/myoj/myNote_json.js
    var pos = docfile.indexOf("/account/")
    var gitpath = docfile.substr(0, pos)
    console.log("gitpath", gitpath)
    var usrObj = NCache.Get(gitpath)
    if (!usrObj) return null
    console.log("usrObj", usrObj)
    return { repodesc: usrObj.repodesc, pathfile: gitpath }
}


BibleObjGituser.prototype.Session_create = function (usr) {


    var ssid = this.m_BaseGitUser.m_gitusername //usr_proj
    var ssid_b64 = Buffer.from(ssid).toString("base64")
    var ttl = NCache.m_TTL //default.
    //if (this.m_inp.usr.ttl && false === isNaN(parseInt(this.m_inp.usr.ttl))) {
    //   ttl = parseInt(this.m_inp.usr.ttl)
    //}
    

    NCache.Set(ssid_b64, usr, ttl)
    console.log("Session_create:ssid=", ssid, ssid_b64, usr, ttl)

    return ssid_b64
}
BibleObjGituser.prototype.Session_delete = function () {
    if (!this.m_inp.SSID) return
    var ret = NCache.myCache.take(this.m_inp.SSID)

    console.log("Session_delete:", this.m_inp.SSID, this.m_usr, ret)

    NCache.myCache.set(this.m_inp.SSID, null)
}






module.exports = {
    NCache: NCache,
    BibleObjGituser: BibleObjGituser
}