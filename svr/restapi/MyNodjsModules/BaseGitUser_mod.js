

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


const WorkingRootNodeName = "bist"

const WorkingBaseNodeName = "bist"












var BaseGitUser = function () {
}
BaseGitUser.prototype.absRootWorkingDir = function (app) {
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
BaseGitUser.prototype.Set_Gitusr = function (repopath, passcode) {
    this.usr_acct = { repopath: repopath, passcode: passcode }
    this.m_gitinf = this._interpret_repo_url_str(repopath)
    this.git_Usr_Pwd_Url = this._interpret_git_config_Usr_Pwd_Url()
    this.m_projDirs = this._prepare_proj_dirs()
    return this;
}
BaseGitUser.prototype._interpret_repo_url_str = function (proj_url) {
    if (!proj_url) return null
    console.log("proj_url=", proj_url)
    if (proj_url.indexOf("github.com/") > 0) {
        return this._interpret_repo_url_github(proj_url)

    }
    if (proj_url.indexOf("bitbucket.org/") > 0) {
        return this._interpret_repo_url_bitbucket(proj_url)
    }
    console.log(" ***** fatal err: git repository path not recognized..")
    return null
}
BaseGitUser.prototype._interpret_repo_url_github = function (proj_url) {
    if (!proj_url) return null
    //https://github.com/wdingbox/Bible_obj_weid.git
    var reg = new RegExp(/^https\:\/\/github\.com\/(\w+)\/(\w+)(\.git)$/)
    const hostname = "github.com"

    var mat = proj_url.match(/^https\:\/\/github\.com[\/](([^\/]*)[\/]([^\.]*))[\.]git$/)
    if (mat && mat.length === 4) {
        console.log("mat:", mat)
        //return { format: 2, desc: "full_path", full_path: mat[0], user_repo: mat[1], user: mat[2], repo: mat[3] }
        var username = mat[2]
        var projname = mat[3]


        var owner = `_${hostname}_${username}_${projname}`
        var ownerId = `${hostname}/${username}/${projname}`
        return { hostname: hostname, username: username, projname: projname, ownerId: ownerId, ownerstr: owner }
    }
    return null
}
BaseGitUser.prototype._interpret_repo_url_bitbucket = function (proj_url) {
    if (!proj_url) return null
    //proj_url = https://wdingsoft@bitbucket.org/bsnp21/pub_wd01.git
    //proj_url = https://wdingsoft:3edcfdsa@bitbucket.org/bsnp21/pub_wd01.git
    var reg = new RegExp(/^https\:\/\/github\.com\/(\w+)\/(\w+)(\.git)$/)
    const hostname = "bitbucket.org"

    var mat = proj_url.match(/^https\:\/\/([^\@]+)[\@]bitbucket[\.]org[\/](([^\/]*)[\/]([^\.]*))[\.]git$/)
    if (mat) {
        console.log("mat:", mat)
        //return { format: 2, desc: "full_path", full_path: mat[0], user_repo: mat[1], user: mat[2], repo: mat[3] }
        var username = mat[1]
        var prjbitbk = mat[3]
        var projname = mat[4]


        var owner = `_${hostname}_${username}_${projname}`
        var ownerId = `${hostname}/${username}/${projname}`
        return { hostname: hostname, username: username, projname: projname, prjbitbk: prjbitbk, ownerId: ownerId, ownerstr: owner }
    }
    return null

}
BaseGitUser.prototype._interpret_git_config_Usr_Pwd_Url = function () {
    var userproj = this.m_gitinf
    var passcode = this.usr_acct.passcode
    if (passcode.trim().length > 0) {
        if ("github.com" === userproj.hostname) {
            return `https://${userproj.username}:${passcode}@${userproj.hostname}/${userproj.username}/${userproj.projname}.git`
        }
        if ("bitbucket.org" === userproj.hostname) {
            return `https://${userproj.username}:${passcode}@${userproj.hostname}/${userproj.prjbitbk}/${userproj.projname}.git`
        }
    }
    return ""
}
BaseGitUser.prototype._prepare_proj_dirs = function () {

    //const WorkingBaseNodeName = "bist"
    const NodeUsrs = "usrs" //keep same as old. 
    var userproj = this.m_gitinf
    console.log("m_gitinf", this.m_gitinf)
    var absRootPath = this.absRootWorkingDir()
    this.m_rootDir = absRootPath //remove alter
    var projDirs = {}

    projDirs.root_abs = `${absRootPath}`
    projDirs.base_Dir = `${absRootPath}${WorkingBaseNodeName}`
    projDirs.user_dir = `${absRootPath}${WorkingBaseNodeName}/${NodeUsrs}/${userproj.hostname}/${userproj.username}`
    projDirs.git_root = `${absRootPath}${WorkingBaseNodeName}/${NodeUsrs}/${userproj.hostname}/${userproj.username}/${userproj.projname}`
    projDirs.acct_dir = `${absRootPath}${WorkingBaseNodeName}/${NodeUsrs}/${userproj.hostname}/${userproj.username}/${userproj.projname}/account`
    projDirs.dest_myo = `${absRootPath}${WorkingBaseNodeName}/${NodeUsrs}/${userproj.hostname}/${userproj.username}/${userproj.projname}/account/myoj`
    projDirs.dest_dat = `${absRootPath}${WorkingBaseNodeName}/${NodeUsrs}/${userproj.hostname}/${userproj.username}/${userproj.projname}/account/dat`


    //////
    projDirs.std_bible_obj_lib_template = `${absRootPath}/bible_obj_lib/jsdb/UsrDataTemplate`

    console.log("_prepare_proj_dirs---- projDirs =", projDirs)
    return projDirs
}

BaseGitUser.prototype.get_usr_dat_dir = function (subpath) {
    return (!subpath)? this.m_projDirs.dest_dat:`${this.m_projDirs.dest_dat}/${subpath.replace(/^[\/]/,"")}`
    if (!this.usr_proj) return ""
    if (!subpath) {
        return `${this.m_rootDir}${this.usr_proj.dest_dat}`
    }
    return `${this.m_rootDir}${this.usr_proj.dest_dat}${subpath}`
}
BaseGitUser.prototype.get_usr_acct_dir = function (subpath) {
    return (!subpath)? this.m_projDirs.acct_dir:`${this.m_projDirs.acct_dir}/${subpath.replace(/^[\/]/,"")}`
    if (!this.usr_proj) return ""
    if (!subpath) {
        return `${this.m_rootDir}${this.usr_proj.acct_dir}`
    }
    return `${this.m_rootDir}${this.usr_proj.acct_dir}${subpath}`
}
BaseGitUser.prototype.get_usr_myoj_dir = function (subpath) {
    return (!subpath)? this.m_projDirs.dest_myo:`${this.m_projDirs.dest_myo}/${subpath.replace(/^[\/]/,"")}`
    if (!this.usr_proj) return ""
    if (!subpath) {
        return `${this.m_rootDir}${this.usr_proj.dest_myo}`
    }
    return `${this.m_rootDir}${this.usr_proj.dest_myo}${subpath}`
}

BaseGitUser.prototype.get_usr_git_dir = function (subpath) {
    return (!subpath)? this.m_projDirs.git_root:`${this.m_projDirs.git_root}/${subpath.replace(/^[\/]/,"")}`
    if (!this.usr_proj) return ""
    if (undefined === subpath || null === subpath) {
        return `${this.m_rootDir}${this.usr_proj.git_root}`
    }
    //if (subpath[0] !== "/") subpath = "/" + subpath
    return `${this.m_rootDir}${this.usr_proj.git_root}${subpath}`
}
BaseGitUser.prototype.get_dir_lib_template = function (subpath) {
    return (!subpath)? this.m_projDirs.std_bible_obj_lib_template:`${this.m_projDirs.std_bible_obj_lib_template}/${subpath.replace(/^[\/]/,"")}`
    var pathfile = `${this.m_rootDir}bible_obj_lib/jsdb/UsrDataTemplate`
    if (undefined === subpf) {
        return pathfile
    }
    return pathfile + subpf
}










///bible doc applied. 

BaseGitUser.prototype.get_DocCode_Fname = function (DocCode) {
    if (!DocCode.match(/^e_/)) return "" //:like, e_Note
    //var fnam = DocCode.replace(/^e_/, "my")  //:myNode_json.js
    return `${DocCode}_json.js`
}


BaseGitUser.prototype.get_pfxname = function (DocCode) {
    var inp = this.m_inp
    //var DocCode = inp.par.fnames[0]
    if (!DocCode) return ""
    var dest_pfname = ""
    switch (DocCode[0]) {
        case "_": //: _myNode,
        case "e": //: e_Node,
            {
                var fnam = this.get_DocCode_Fname(DocCode)
                dest_pfname = this.get_usr_myoj_dir(`/${fnam}`)
            }
            break
        case ".": //-: ./dat/MostRecentVerses; //not used MyBiblicalDiary
            {
                var fnam = DocCode.substr(1)
                dest_pfname = this.get_usr_acct_dir(`${fnam}_json.js`)
            }
            break;
        default: //: NIV, CUVS, NIV_Jw  
            dest_pfname = `${this.m_rootDir}bible_obj_lib/jsdb/jsBibleObj/${DocCode}.json.js`;
            break;
    }
    return dest_pfname
}
BaseGitUser.prototype.get_userpathfile_from_tempathfile = function (tmpathfile) {
    //var src = `${this.m_UserProjFileSys.m_rootDir}bible_obj_lib/jsdb/UsrDataTemplate/myoj/${fnam}`
    var mat = tmpathfile.match(/[\/]myoj[\/]([\w]+)_json\.js$/) //::/myoj/myNode_json.js
    if (mat) {
        var doc = mat[1];//.replace(/^my/, "e_")  //docname: 
        var gitpfx = this.get_pfxname(doc)
        return gitpfx
    }
    //var src_dat = `${this.m_UserProjFileSys.m_rootDir}bible_obj_lib/jsdb/UsrDataTemplate${fnam}_json.js`
    var mat = tmpathfile.match(/[\/]dat[\/]([\w]+)_json\.js$/)
    if (mat) {
        var doc = mat[1]
        var gitpfx = this.get_pfxname("./dat/" + doc)
        return gitpfx
    }
}


//////////////////////////////////////////











BaseGitUser.prototype.run_proj_state = function (cbf) {
    //if (!this.m_inp.out || !this.m_inp.out.state) return console.log("******Fatal Error.")
    var stat = { bRepositable: 0 };//this.m_inp.out.state
    //inp.out.state = { bGitDir: -1, bMyojDir: -1, bEditable: -1, bRepositable: -1 }


    var dir = this.get_usr_myoj_dir()
    stat.bMyojDir = (fs.existsSync(dir)) ? 1 : 0

    var dir = this.get_usr_dat_dir()
    stat.bDatDir = (fs.existsSync(dir)) ? 1 : 0

    var dir = this.get_usr_git_dir("/.git/config")
    stat.bGitDir = (fs.existsSync(dir)) ? 1 : 0

    stat.bEditable = (1 === stat.bMyojDir && 1 === stat.bDatDir && 1 === stat.bGitDir) ? 1 : 0
    //stat.bRepositable = stat.bGitDir

    stat.missedFiles = this.run_makingup_missing_files(false)
    var configtxt = this.load_git_config()

    //console.log("run_proj_state ----------")
    /////// git status
    //stat.bEditable = stat.bGitDir * stat.bMyojDir * stat.bDatDir
    //this.m_inp.out.state.bRepositable = 0
    if (configtxt.length > 0) {
        //if clone with password ok, it would ok for pull/push 
        stat.bRepositable = 1
    }

    var accdir = this.get_usr_acct_dir()
    var fstat = {}
    var totalsize = 0
    var iAlertLevel = 0
    BibleUti.GetFilesAryFromDir(accdir, true, function (fname) {
        var ret = path.parse(fname);
        var ext = ret.ext
        var nam = ret.base.replace(/_json\.js$/, "")
        //console.log("ret:",ret)
        var sta = fs.statSync(fname)
        var fMB = (sta.size / 1000000).toFixed(2)
        totalsize += sta.size
        var str = "" + fMB + "/100(MB)"
        if (fMB >= 80.0) { ////** Github: 100 MB per file, 1 GB per repo, svr:10GB
            var str = nam + ":" + fMB + "/100(MB)"
            warnsAry.push(str)
            iAlertLevel = 1
            str += "*"
        }
        if (fMB >= 90.0) { ////** Github: 100 MB per file, 1 GB per repo, svr:10GB
            stat.bMyojDir = 0
            iAlertLevel = 2
            str += "*"
        }
        fstat[nam] = str
    });

    stat.fstat = fstat
    stat.repo_usage = (totalsize / 1000000).toFixed(2) + "/1000(MB)"
    stat.repo_alertLevel = iAlertLevel

    //console.log("run_proj_state ----------end")
    if (cbf) cbf()
    return stat
}


/////


BaseGitUser.prototype.run_makingup_missing_files = function (bCpy) {

    var _THIS = this
    var srcdir = this.get_dir_lib_template()
    var nMissed = 0
    BibleUti.GetFilesAryFromDir(srcdir, true, function (srcfname) {
        //console.log("---get_dir_lib_template:", srcfname)
        var ret = path.parse(srcfname);
        var ext = ret.ext
        var bas = ret.base

        var gitpfx = _THIS.get_userpathfile_from_tempathfile(srcfname)
        if (!fs.existsSync(gitpfx)) {
            nMissed++
            console.log("-src:makeup", srcfname)
            console.log("-des:makeup", gitpfx)
            const { COPYFILE_EXCL } = fs.constants;
            if (bCpy) {
                var pet = path.parse(gitpfx);
                if (!fs.existsSync(pet.dir)) {
                    var ret = BibleUti.execSync_Cmd(`echo 'lll' | sudo -S mkdir -p  ${pet.dir}`)
                }
                BibleUti.execSync_Cmd(`echo 'lll' | sudo -S chmod 777 ${pet.dir}`)
                fs.copyFileSync(srcfname, gitpfx, COPYFILE_EXCL) //failed if des exists.
            }
        }
    });
    return nMissed
}


BaseGitUser.prototype.Run_proj_setup = function () {
    console.log("********************************************* run setup 1")

    var dir = this.get_usr_git_dir("/.git/config")
    if (!fs.existsSync(dir)) {
        this.git_clone() //always sucess even passwd is wrong.
    } else {
        this.git_pull()
    }

    if (!fs.existsSync(dir)) {
        return null
    }


    if (fs.existsSync(dir)) {
        this.run_makingup_missing_files(true)
    }

    var dir = this.get_usr_acct_dir()
    if (fs.existsSync(dir)) {
        BibleUti.execSync_Cmd(`echo 'lll' |sudo -S chmod -R 777 ${dir}`)
    }

    var ret = this.run_proj_state()

    //console.log("Run_proj_setup ---------- rgfd")
    return ret
}


BaseGitUser.prototype.Run_proj_destroy = function () {
    var inp = { out: {} };//this.m_inp
  
    var gitdir = this.get_usr_git_dir()
    //var password = "lll" //dev mac
    var proj_destroy = `
      sudo -S rm -rf ${gitdir}
    `
    if (fs.existsSync(`${gitdir}`)) {
        inp.out.exec_git_cmd_result = BibleUti.execSync_Cmd(proj_destroy).toString()
        inp.out.desc += "destroyed git dir: " + gitdir
    }

    this.run_proj_state()

    //this.Session_delete()
    return inp
}



BaseGitUser.prototype.cp_template_to_git = function () {
    var inp = { out: {desc:""} };//this.m_inp
    inp.out.desc += ",clone."

    var gitdir = this.get_usr_myoj_dir()
    if (fs.existsSync(`${gitdir}`)) {
        inp.out.desc += ", usr acct already exist: "
        return inp
    }

  
    //var password = "lll" //dev mac
    var acctDir = this.get_usr_acct_dir()
    var cp_template_cmd = `
    #!/bin/sh
    echo 'lll' | sudo -S mkdir -p ${acctDir}
    echo 'lll' | sudo -S chmod -R 777 ${acctDir}
    # sudo -S cp -aR  ${this.m_rootDir}bible_obj_lib/jsdb/UsrDataTemplate  ${acctDir}/
    echo 'lll' | sudo -S cp -aR  ${this.m_rootDir}bible_obj_lib/jsdb/UsrDataTemplate/*  ${acctDir}/.
    echo 'lll' | sudo -S chmod -R 777 ${acctDir}
    #cd -`

    inp.out.cp_template_cmd = cp_template_cmd
    console.log("cp_template_cmd", cp_template_cmd)
    inp.out.cp_template_cmd_result = BibleUti.execSync_Cmd(cp_template_cmd).toString()

    if (!fs.existsSync(`${gitdir}`)) {
        inp.out.desc += ", cp failed: "
    }
    return inp
}




BaseGitUser.prototype.chmod_R_777_acct = function (spath) {
    // mode : "777" 
    var inp = { out: {} };//this.m_inp
    
    var dir = this.get_usr_acct_dir(spath)
    console.log("perm:", dir)
    if (!fs.existsSync(dir)) {
        return inp
    }
    //var password = "lll"
    var change_perm_cmd = `echo 'lll'|  sudo -S chmod -R 777 ${dir}`

    inp.out.change_perm = BibleUti.execSync_Cmd(change_perm_cmd).toString()

    return inp.out.change_perm
}
BaseGitUser.prototype.chmod_R_ = function (mode, dir) {
    // mode : "777" 
    var inp = { out: {} }//this.m_inp
    
    
    console.log("perm:", dir)
    if (!fs.existsSync(dir)) {
        return inp
    }
    //var password = "lll"
    var change_perm_cmd = ` sudo -S chmod -R ${mode} ${dir}`

    inp.out.change_perm = BibleUti.execSync_Cmd(change_perm_cmd).toString()

    return inp.out.change_perm
}


BaseGitUser.prototype.load_git_config = function () {
    var git_config_fname = this.get_usr_git_dir("/.git/config")
    if (!fs.existsSync(git_config_fname)) return ""
    //if (!this.m_git_config_old || !this.m_git_config_new) {
    var olds, news, txt = fs.readFileSync(git_config_fname, "utf8")
    var ipos1 = txt.indexOf(this.usr_acct.repopath)
    var ipos2 = txt.indexOf(this.git_Usr_Pwd_Url)//usr_proj

    console.log("ipos1:", ipos1, this.usr_acct.repopath)
    console.log("ipos2:", ipos2, this.git_Usr_Pwd_Url)//usr_proj

    var configurl = ""
    if (ipos1 > 0) {
        olds = txt
        news = txt.replace(this.usr_acct.repopath, this.git_Usr_Pwd_Url)//usr_proj
    }
    if (ipos2 > 0) {
        news = txt
        olds = txt.replace(this.git_Usr_Pwd_Url, this.usr_acct.repopath)//usr_proj

        console.log("initial git_config_fname not normal:", txt)
    }
    if ((ipos1 * ipos2) < 0) {
        this.m_git_config_old = olds
        this.m_git_config_new = news

        //var txt = fs.readFileSync(git_config_fname, "utf8")
        var pos0 = txt.indexOf("[remote \"origin\"]")
        var pos1 = txt.indexOf("\n\tfetch = +refs");//("[branch \"master\"]")
        configurl = txt.substring(pos0 + 19, pos1)
    }
    this.configurl = configurl //usr_proj
    //}
    //console.log("load_git_config__end.configurl=", this.usr_proj)
    return configurl
}






BaseGitUser.prototype.Load_back_userData = function (par) {
    //var inp = this.m_inp
    var doc = par.fnames[0]
    var jsfname = this.get_pfxname(doc)
    var ret = BibleUti.loadObj_by_fname(jsfname)

    var retObj = ret.obj  //get obj structure w/ keys.
    if ("object" === typeof (par.data) && Object.keys(par.data).length > 0) {  // ===undefined, null, or ''. 
        try {
            retObj = JSON.parse(JSON.stringify(par.data));// 
            BibleUti.FetchObjDat(retObj, ret.obj)
            console.log("out.data", retObj)
        } catch (err) {
            console.log("err", err)
            //inp.out.state.err = err
        }
    }
    return retObj;
}



BaseGitUser.prototype.Save_userData_frm_client = function (par) {
    //var inp = this.m_inp
    var save_res = { desc: "ok" }
    var doc = par.fnames[0]
    var jsfname = this.get_pfxname(doc)
    console.log("jsfname=", jsfname)
    var ret = BibleUti.loadObj_by_fname(jsfname)
    if (ret.obj) {
        BibleUti.FlushObjDat(par.data, ret.obj)
        console.log("ret", ret)
        ret.writeback()
    } else {
        save_res.desc = "FATAL: loadObj_by_fname failed:=" + jsfname
        //inp.out.state.err = "FATAL: loadObj_by_fname failed:=", jsfname
        //console.log(inp.out.state.err)
    }

    //// 
    //var save_res = {}
    //save_res.desc = "len:" + inp.par.data.length;// + ",dlt:" + ret.dlt_size
    //save_res.dlt = ret.dlt_size
    //save_res.len = inp.par.data.length
    //inp.par.data = ""
    //save_res.ret = ret
    //inp.out.save_res = save_res
    return save_res;
}





BaseGitUser.prototype.git_config_allow_push = function (bAllowPush) {
    { /****.git/config
        [core]
                repositoryformatversion = 0
                filemode = true
                bare = false
                logallrefupdates = true
                ignorecase = true
                precomposeunicode = true
        [remote "origin"]
                url = https://github.com/wdingbox/bible_obj_weid.git
                fetch = +refs/heads/*:refs/remotes/origin/*
        [branch "master"]
                remote = origin
                merge = refs/heads/master
        ******/

        //https://github.com/wdingbox/bible_obj_weid.git
        //https://github.com/wdingbox:passcode@/bible_obj_weid.git
    } /////////

    //if (!this.m_inp.usr.repopath) return
    //if (!this.usr_proj) return
    if (!this.git_Usr_Pwd_Url) return //usr_proj

    var git_config_fname = this.get_usr_git_dir("/.git/config")
    if (!fs.existsSync(git_config_fname)) {
        console.log(".git/config not exist:", git_config_fname)
        return
    }



    if (!this.m_git_config_old || !this.m_git_config_new) {
        this.load_git_config()
        console.log("========")
    }

    if (bAllowPush) {
        fs.writeFileSync(git_config_fname, this.m_git_config_new, "utf8")
        console.log("bAllowPush=1:url =", this.git_Usr_Pwd_Url)//usr_proj
    } else {
        fs.writeFileSync(git_config_fname, this.m_git_config_old, "utf8")
        //console.log("bAllowPush=0:url =", this.m_inp.usr.repopath)
    }
}


BaseGitUser.prototype.git_clone = function () {
    //var password = "lll" //dev mac
    var _THIS = this
    var inp = { out: {} };//this.m_inp
    var proj = this.m_projDirs //usr_proj;
    if (!proj) {
        inp.out.desc += ", failed inp.usr parse"
        console.log("failed-git-parse", inp.out.desc)
        return inp
    }

    var dir = this.m_rootDir
    if (!fs.existsSync(dir)) {
        console.log("Fatal Error: not exist dir:", dir)
        return null
    }

    inp.out.git_clone_res = { desc: "git-clone", bExist: false }
    var gitdir = this.get_usr_git_dir("/.git")
    if (fs.existsSync(gitdir)) {
        inp.out.git_clone_res.desc += "|already done."
        inp.out.git_clone_res.bExist = true
        console.log("already exist:", gitdir)
        return inp
    }


    var clone_https = this.git_Usr_Pwd_Url
    if (clone_https.length === 0) {
        clone_https = this.usr_acct.repopath
    }
    if (clone_https.length === 0) {
        inp.out.git_clone_res.desc += ",no url."
        console.log("clone_https null:", clone_https)
        return inp
    }
    console.log("to clone: ", clone_https)

    //console.log("proj", proj)
    var dir = this.m_projDirs.user_dir //usr_proj
    if (!fs.existsSync(dir)) {
        var ret = BibleUti.execSync_Cmd(`echo 'lll'| sudo -S mkdir -p ${dir}`).toString()
    }
    var ret = BibleUti.execSync_Cmd(`echo 'lll'|  sudo -S chmod -R 777 ${dir}`).toString()

    gitdir = this.get_usr_git_dir()
    if (fs.existsSync(gitdir)) {
        inp.out.git_clone_res.desc += "|git folder exit but no .git"
        inp.out.git_clone_res.bExist = true
        var ret = BibleUti.execSync_Cmd(`echo 'lll'|  sudo -S rm -rf ${gitdir}`).toString()
        console.log(ret)
    }


    var git_clone_cmd = `
    #!/bin/sh
    cd ${this.m_rootDir}
    echo 'lll'|  sudo -S GIT_TERMINAL_PROMPT=0 git clone  ${clone_https}  ${proj.git_root}
    if [ -f "${proj.git_root}/.git/config" ]; then
        echo "${proj.git_root}/.git/config exists."
        echo 'lll'| sudo -S chmod  777 ${proj.git_root}/.git/config
    else 
        echo "${proj.git_root}/.git/config does not exist."
    fi
    `
    console.log("git_clone_cmd...")
    inp.out.git_clone_res.git_clone_cmd = git_clone_cmd
    var ret = BibleUti.execSync_Cmd(git_clone_cmd).toString()
    console.log("ret", ret)
    return inp
}

BaseGitUser.prototype.git_status = async function (_sb) {
    var inp = { out: {} }
    if (!inp.out.state) return console.log("*** Fatal Error: inp.out.state = null")

    if (undefined === _sb) _sb = ""
    var gitdir = this.get_usr_git_dir("/.git/config")
    if (fs.existsSync(gitdir)) {
        /////// git status
        var git_status_cmd = `
        cd ${this.get_usr_git_dir()}
        git status ${_sb}
        #git diff --ignore-space-at-eol -b -w --ignore-blank-lines --color-words=.`

        inp.out.git_status_res = BibleUti.exec_Cmd(git_status_cmd).toString()
    }
}


BaseGitUser.prototype.git_add_commit_push_Sync = function (msg) {
    var _THIS = this
    var inp = {};//this.m_inp
    var gitdir = this.get_usr_git_dir()
    if (!fs.existsSync(gitdir)) {
        return console.log("gitdir not exists.");
    }

    //password = "lll" //dev mac
    var command = `
    #!/bin/bash
    set -x #echo on
    echo '=>cd ${gitdir}'
    cd  ${gitdir}
    echo '=>git status'
    echo 'lll'|  sudo -S git status
    echo '=>git diff'
    echo 'lll'|  sudo -S git diff --ignore-space-at-eol -b -w --ignore-blank-lines --color-words=.
    echo '=>git add *'
    echo 'lll'|  sudo -S git add *
    echo '=>git commit'
    echo 'lll'|  sudo -S git commit -m "Sync:${msg}. repodesc:${this.usr_acct.repodesc}"
    echo '=>git push'
    echo 'lll'|  sudo -S GIT_TERMINAL_PROMPT=0 git push
    echo '=>git status'
    echo 'lll'| sudo -S git status
    echo '=>git status -sb'
    echo 'lll'|  sudo -S git status -sb
    `
    console.log('exec_command:', command)
    console.log('exec_command start:')

    try {
        //e.g. command = "ls"
        _THIS.git_config_allow_push(true)
        exec(command, (err, stdout, stderr) => {
            console.log('\n-exec_Cmd errorr:')
            console.log(err)
            console.log('\n-exec_Cmd stderr:',)
            console.log(stderr)
            console.log('\n-exec_Cmd stdout:')
            console.log(stdout)
            console.log('\n-exec_Cmd end.')
            _THIS.git_config_allow_push(false)
        });
    } catch (err) {
        console.log(err)
    }

    console.log('exec_command END.')
    setTimeout(function () {
        console.log('exec_command ENDED Mark.', gitdir)
    }, 10000)
}

BaseGitUser.prototype.git_pull = function (cbf) {
    this.git_config_allow_push(true)
    var ret = this.execSync_cmd_git("GIT_TERMINAL_PROMPT=0 git pull")
    this.git_config_allow_push(false)
    //var mat = this.m_inp.out.git_pull_res.stderr.match(/(fatal)|(fail)|(error)/g)
    return ret
}

BaseGitUser.prototype.git_push = async function () {
    this.git_config_allow_push(true)
    var ret = this.execSync_cmd_git("git push").toString()
    if (null !== ret) {
        console.log("\n*** test git push:", ret)
        if (ret.match(/failed/i)) {
            ret = null
        }
    }
    this.git_config_allow_push(false)
    return ret
}
BaseGitUser.prototype.git_push_test = function () {
    var tm = (new Date()).toString()
    console.log("tm=", tm)

    var dir = this.get_usr_git_dir()

    this.git_config_allow_push(true)
    var logname = "test.log"
    var cmd = `
    cd ${dir}
    echo lll | sudo -S  echo '${tm}'> ${logname}
    echo lll | sudo -S  git add ${logname}
    echo lll | sudo -S  git commit -m 'test.log'
    echo lll | sudo -S  git push
    `
    var ret = this.execSync_cmd_git(cmd).toString()
    if (null !== ret) {
        console.log("\n*** test git push:", ret)
        if (ret.match(/failed/i)) {
            ret = null
        }
    }
    this.git_config_allow_push(false)
    return ret
}
BaseGitUser.prototype.execSync_cmd_git = function (gitcmd) {
    var _THIS = this


    if (!fs.existsSync(this.get_usr_git_dir())) {
        return null
    }

    //console.log("proj", proj)
    //var password = "lll" //dev mac
    var scmd = `
    #!/bin/sh
    cd ${this.get_usr_git_dir()}
     echo lll |sudo -S ${gitcmd}
    `
    console.log("\n----git_cmd start:>", scmd)
    var res = BibleUti.execSync_Cmd(scmd)
    console.log("\n----git_cmd end.")

    return res
}







module.exports = {
    BaseGitUser: BaseGitUser,
    WorkingRootNodeName:WorkingRootNodeName,

}