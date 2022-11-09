

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
BaseGitUser.prototype.set_gitusr = function (repopath, passcode) {
    this.usr_acct = { repopath: repopath, passcode: passcode }
    this.m_gitinf = this._interpret_repo_url_str(repopath)
    this.git_Usr_Pwd_Url = this._interpret_git_config_Usr_Pwd_Url()
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
BaseGitUser.prototype._deplore_usr_proj_dirs = function (base_Dir) {

    var userproj = this.m_gitinf
    console.log("m_gitinf", this.m_gitinf)
    var projDirs = {}

    projDirs.base_Dir = `${WorkingBaseNodeName}`
    projDirs.user_dir = `${WorkingBaseNodeName}/${userproj.hostname}/${userproj.username}`
    projDirs.git_root = `${WorkingBaseNodeName}/${userproj.hostname}/${userproj.username}/${userproj.projname}`
    projDirs.acct_dir = `${WorkingBaseNodeName}/${userproj.hostname}/${userproj.username}/${userproj.projname}/account`
    projDirs.dest_myo = `${WorkingBaseNodeName}/${userproj.hostname}/${userproj.username}/${userproj.projname}/account/myoj`
    projDirs.dest_dat = `${WorkingBaseNodeName}/${userproj.hostname}/${userproj.username}/${userproj.projname}/account/dat`

    this.m_projDirs = projDirs
    console.log("compose: projDirs=", projDirs)
}

//////////////////////////////////////////




module.exports = {
    BaseGitUser: BaseGitUser,
    WorkingRootNodeName:WorkingRootNodeName,

}