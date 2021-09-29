////////////////////////////////
//server site workload.
const fs = require('fs');
var path = require('path');
/////////////////////////////////////////////////////////////////

var temp = {

    _interpret_repo_url: function (proj_url) {
        if (!proj_url) return null
        if(proj_url.indexOf("github.com/")>0){
            return this._interpret_repo_url_github(proj_url)

        }
        if(proj_url.indexOf("bitbucket.org/")>0){
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
        const hostname = "bitbucket.com"

        var mat = proj_url.match(/^https\:\/\/([^\@]+)[\@]bitbucket[\.]org[\/](([^\/]*)[\/]([^\.]*))[\.]git$/)
        if (mat ) {
            console.log("mat:", mat)
            //return { format: 2, desc: "full_path", full_path: mat[0], user_repo: mat[1], user: mat[2], repo: mat[3] }
            var username = mat[1]
            var projname = mat[4]


            var owner = `_${hostname}_${username}_${projname}`
            var ownerId = `${hostname}/${username}/${projname}`
            return { hostname: hostname, username: username, projname: projname, ownerId: ownerId, ownerstr: owner }
        }
        return null
    },
}

var ret = temp._interpret_repo_url("https://github.com/wdingbox/Bible_obj_weid.git") 
console.log(ret)


console.log("bitbucket")
var ret = temp._interpret_repo_url("https://wdingsoft@bitbucket.org/bsnp21/pub_wd01.git") 
console.log(ret)