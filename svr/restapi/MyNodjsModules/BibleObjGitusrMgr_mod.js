

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
        inp.out = BaseGUti.default_inp_out_obj()
        inp.SSID = key
        var userProject = new BibleObjGitusrMgr()
        if (inp.gitusr = userProject.m_BaseGitUser.Set_gitusr(val.repopath)) {
            //userProject.m_inp = inp
            userProject.m_BaseGitUser.Check_proj_state()
            console.log(inp.out.state)
            if (1 === inp.out.state.bRepostoryDirExist) {
                //
                console.log("on del:git dir exist. push before to delete it")
                var res2 = userProject.execSync_cmd_git("git add *")
                var res3 = userProject.execSync_cmd_git(`git commit -m "on del in Cache"`)
                var res4 = userProject.git_push()

                var res5 = userProject.m_BaseGitUser.Proj_detele()
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
    this.m_SvrUsrsBCV = new SvrUsrsBCV(this.m_BaseGitUser.pathrootdir)
}




BibleObjGitusrMgr.prototype.Proj_usr_account_create = function (repopath, passcode, hintword, accesstr) {
    console.log("========Proj_usr_account_create", repopath, passcode, hintword)

    var sgu = this.m_BaseGitUser.Set_gitusr(repopath)
    if (sgu.err) return sgu

    var ghinfo = this.m_BaseGitUser.m_sponser.gh_api_repos_nameWithOwner()
    if (!ghinfo.err) {
        console.log(ghinfo);
        return { err: ["already exist.", repopath], ghinfo: ghinfo };
    }

    var res = this.m_BaseGitUser.gh_repo_create(passcode, hintword, accesstr)
    if (!res) return { err: ["failed to create.", repopath] }
    if (res.err) return res;

    var state = this.m_BaseGitUser.Check_proj_state()
    return { state: state, sgu: sgu, info_before_creation: ghinfo, gh_repo_create: res }
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
BibleObjGitusrMgr.prototype.Proj_parse_usr_signin = function (inp) {
    console.log("========Proj_parse_usr_signin")

    var usr = this._decipher_usr_by_key_stored_in_cuid(inp.CUID, inp.cipherusrs)
    if (!usr) {
        console.log("*****failed: sdfadfasjiasf")
        return null
    }
    return this.m_BaseGitUser.Set_gitusr(usr.repopath)
}
BibleObjGitusrMgr.prototype.Proj_parse_usr_login = function (repopath, passcode) {
    if (!repopath) return { err: "null repopath" }
    repopath = repopath.toLowerCase()


    var sgu = this.m_BaseGitUser.Set_gitusr(repopath)
    if (sgu.err) return sgu;

    console.log("========__Proj_parse_usr_login__")
    var ghinfo = this.m_BaseGitUser.m_sponser.gh_api_repos_nameWithOwner()
    if (ghinfo.err) {
        console.log(ghinfo); 
        return { err: ["not exist", repopath], ghinfo: ghinfo }
    }

    this.m_BaseGitUser.Deploy_proj()

    var ar = this.m_BaseGitUser.get_repo_salts()
    if (ar.indexOf(passcode) < 0) {
        return { err: ["password error. Hint: ", ar[1]] }
    }

    var usrObj = { repopath: repopath, passcode: passcode }
    var ssid = this.Session_create(usrObj)

    var state = this.m_BaseGitUser.Check_proj_state()
    state.SSID = ssid

    return { state: state, sgu: sgu, ghinfo: ghinfo } //must be SSID capitalized ret.
}

BibleObjGitusrMgr.prototype.Proj_prepare_after_signed = function (ssid) {

    var usr = this.Session_get_usr(ssid)
    if (!usr) {
        console.log("*****timeout, failed ssid")
        return { err: ["session nonexist|timeout",ssid] }
    }

    this.m_BaseGitUser.Set_gitusr(usr.repopath)

    var state = this.m_BaseGitUser.Check_proj_state()
    return { state: state }
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

    var ssid = (new Date()).getTime()+this.m_BaseGitUser.m_sponser.m_reponame //usr_proj
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






module.exports = {
    NCache: NCache,
    BibleObjGitusrMgr: BibleObjGitusrMgr
}