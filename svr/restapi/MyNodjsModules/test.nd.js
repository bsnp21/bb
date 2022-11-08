////////////////////////////////
//server site workload.
const fs = require('fs');
var path = require('path');
/////////////////////////////////////////////////////////////////

var temp = {

    _interpret_repo_url_str: function (proj_url) {
        if (!proj_url) return null
        if (proj_url.indexOf("github.com/") > 0) {
            return this._interpret_repo_url_github(proj_url)

        }
        if (proj_url.indexOf("bitbucket.org/") > 0) {
            return this._interpret_repo_url_bitbucket(proj_url)
        }
        console.log(" ***** fatal err: git repository path not recognized..")
        return null
    },
    _interpret_repo_url_github: function (proj_url) {
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
    },
    _interpret_repo_url_bitbucket: function (proj_url) {
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
    },

    _interpret_git_config_Usr_Pwd_Url : function (usr_proj, passcode) {
        usr_proj.git_Usr_Pwd_Url = ""
        if (passcode.trim().length > 0) {
            if ("github.com" === usr_proj.hostname) {
                usr_proj.git_Usr_Pwd_Url = `https://${usr_proj.username}:${passcode}@${usr_proj.hostname}/${usr_proj.username}/${usr_proj.projname}.git`
            }
            if ("bitbucket.org" === usr_proj.hostname) {
                usr_proj.git_Usr_Pwd_Url = `https://${usr_proj.username}:${passcode}@${usr_proj.hostname}/${usr_proj.prjbitbk}/${usr_proj.projname}.git`
            }
        }
    
        //inp.usr.repodesc = inp.usr.repodesc.trim().replace(/[\r|\n]/g, ",")//:may distroy cmdline.
    }
}

var ret = temp._interpret_repo_url_str("https://github.com/wdingbox/Bible_obj_weid.git")
temp._interpret_git_config_Usr_Pwd_Url(ret, "passcode")
console.log(ret)


console.log("bitbucket")
var ret = temp._interpret_repo_url_str("https://wdingsoft@bitbucket.org/bsnp21/pub_wd01.git")

temp._interpret_git_config_Usr_Pwd_Url(ret, "passcode")
console.log(ret)