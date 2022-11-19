

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


const WorkingRootNodeName = "bugit"




//const WorkingRootNodeName = "bugit"
var BaseGUti = {

    GetEmptyObj: function (obj) {
        function _iterate(obj, shellOfObj) {
            for (var sproperty in obj) {
                if (obj.hasOwnProperty(sproperty)) {
                    var tps = typeof obj[sproperty]
                    var bary = Array.isArray(obj[sproperty])
                    if (tps === "object" && !bary) {
                        shellOfObj[sproperty] = {}
                        _iterate(obj[sproperty], shellOfObj[sproperty]);
                    } else {
                        shellOfObj[sproperty] = 0
                    }
                }
            }
        }
        var structObj = {}
        _iterate(obj, structObj)
        return structObj
    },

    FetchObjDat: function (datObj, SrcObj) {
        function _iterate(carObj, srcObj) {
            if (!srcObj) return;
            for (var sproperty in carObj) {
                console.log("sproperty=", sproperty)
                if (carObj.hasOwnProperty(sproperty)) {
                    if (srcObj.hasOwnProperty(sproperty)) {
                        if (carObj[sproperty] && "object" === typeof (carObj[sproperty]) && !Array.isArray(carObj[sproperty]) && Object.keys(carObj[sproperty]).length > 0) {
                            _iterate(carObj[sproperty], srcObj[sproperty]);
                        } else {
                            carObj[sproperty] = srcObj[sproperty]
                        }
                    } else {
                        delete carObj[sproperty]
                    }
                }
            }
        }
        _iterate(datObj, SrcObj)
        return datObj
    },
    FlushObjDat: function (datObj, targObj) {
        function _iterate(carObj, tarObj) {
            if (!tarObj) return;
            for (var sproperty in carObj) {
                console.log("sproperty=", sproperty)
                if (carObj.hasOwnProperty(sproperty)) {
                    if (tarObj.hasOwnProperty(sproperty)) {//match keys
                        if (carObj[sproperty] && "object" === typeof (carObj[sproperty]) && !Array.isArray(carObj[sproperty]) && Object.keys(carObj[sproperty]).length > 0) {
                            _iterate(carObj[sproperty], tarObj[sproperty]); //non-arry obj. 
                        } else {
                            if (null === carObj[sproperty]) { //to delete key in targetObj.
                                delete tarObj[sproperty]
                            } else {  //flush update target obj.
                                tarObj[sproperty] = carObj[sproperty]
                            }
                        }
                    } else {//mismatch keys
                        if (null === carObj[sproperty]) {
                            //nothing to delete. 
                        } else {//add new key to targetObj.
                            tarObj[sproperty] = carObj[sproperty]
                        }
                    }
                }
            }
        }
        _iterate(datObj, targObj)
        return targObj
    },



    GetFilesAryFromDir: function (startPath, deep, cb) {//startPath, filter
        function recursiveDir(startPath, deep, outFilesArr) {
            var files = fs.readdirSync(startPath);
            for (var i = 0; i < files.length; i++) {
                var filename = path.join(startPath, files[i]);
                //console.log(filename);
                var stat = fs.lstatSync(filename);
                if (stat.isDirectory()) {
                    if (deep) {
                        recursiveDir(filename, deep, outFilesArr); //recurse
                    }
                    continue;
                }/////////////////////////
                else if (cb) {
                    //console.log("file:",filename)
                    if (!cb(filename)) continue
                }
                outFilesArr.push(filename);
            };
        };/////////////////////////////////////

        if (!fs.existsSync(startPath)) return []
        var outFilesArr = [];
        recursiveDir(startPath, deep, outFilesArr);
        return outFilesArr;
    },
    access_dir: function (http, dir) {
        function writebin(pathfile, contentType, res) {
            var content = fs.readFileSync(pathfile)
            //console.log("read:", pathfile)
            res.writeHead(200, { 'Content-Type': contentType });
            res.write(content, 'binary')
            res.end()
        }
        function writetxt(pathfile, contentType, res) {
            var content = fs.readFileSync(pathfile, "utf8")
            //console.log("read:", pathfile)
            res.writeHead(200, { 'Content-Type': contentType });
            res.write(content, 'utf-8')
            res.end()
        }
        // ./assets/ckeditor/ckeditor.js"
        // var dir = "./assets/ckeditor/"
        console.log("lib svr:", dir)
        var ftypes = {
            '.ico': 'image/x-icon',
            '.html': 'text/html',
            '.htm': 'text/html',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.css': 'text/css',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.wav': 'audio/wav',
            '.mp3': 'audio/mpeg',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.eot': 'appliaction/vnd.ms-fontobject',
            '.ttf': 'aplication/font-sfnt'
        }
        var binaries = [".png", ".jpg", ".wav", ".mp3", ".svg", ".pdf", ".eot"]
        BaseGUti.GetFilesAryFromDir(dir, true, function (fname) {
            var ret = path.parse(fname);
            var ext = ret.ext
            //console.log("ret:",ret)
            if (ftypes[ext]) {
                console.log("base:", ret.base)
                console.log("api:", fname)
                http.use("/" + fname, async (req, res) => {
                    console.log('[post] resp write :', req.body, fname)
                    if (binaries.indexOf(ext) >= 0) {
                        writebin(fname, ftypes[ext], res)
                    } else {
                        writetxt(fname, ftypes[ext], res)
                    }
                })
                return true
            }
        });
    },
    GetFileStat: function (fnm) {
        if (fs.existsSync(fnm)) {
            const stats = fs.statSync(fnm);
            return stats;//.size; //mtime modifited
        }
        return { size: -1, mtime: 0 };
    },
    exec_Cmd: function (command) {
        return new Promise((resolve, reject) => {
            try {
                //command = "ls"
                //console.log('exec_Cmd:', command)
                exec(command, (err, stdout, stderr) => {
                    console.log('-exec_Cmd errorr:', err)
                    console.log('-exec_Cmd stderr:', stderr)
                    console.log('-exec_Cmd stdout:', stdout)

                    // the *entire* stdout and stderr (buffered)
                    //resolve(stdout);
                    resolve({
                        stdout: stdout,
                        stderr: stderr,
                        err: err
                    })

                });
            } catch (err) {
                console.log(err)
                reject(err);
            }
        })
    },
    execSync_Cmd: function (command) {
        try {
            //command = "ls"
            console.log('execSync Cmd:', command)
            var ret = execSync(command).toString();
            console.log(ret)
        } catch (error) {
            console.log("error:", error.status);  // 0 : successful exit, but here in exception it has to be greater than 0
            console.log("error:", error.message); // Holds the message you typically want.
            console.log("error:", error.stderr);  // Holds the stderr output. Use `.toString()`.
            console.log("error:", error.stdout);  // Holds the stdout output. Use `.toString()`.
            return error.message
        }
        return ret;
    },








    copy_biobj: function (BibleObj, oj) {
        //console.log("copy_biobj oj", JSON.stringify(oj, null, 4))
        if (!oj || Object.keys(oj).length === 0) return BibleObj
        var retOb = {}
        for (const [bkc, chpObj] of Object.entries(oj)) {
            if (!chpObj || Object.keys(chpObj).length === 0) {
                retOb[bkc] = BibleObj[bkc] //copy whole book
                continue
            }
            retOb[bkc] = {}
            for (const [chp, vrsObj] of Object.entries(chpObj)) {
                //console.log("bc", bkc, chp)
                if (!vrsObj || Object.keys(vrsObj).length === 0) {
                    if (BibleObj[bkc]) retOb[bkc][chp] = BibleObj[bkc][chp]  //copyy whole chapter
                    continue
                }
                retOb[bkc][chp] = {}
                for (const [vrs, txt] of Object.entries(vrsObj)) {
                    //console.log(`${key}: ${value}`);
                    if (BibleObj[bkc] && BibleObj[bkc][chp]) retOb[bkc][chp][vrs] = BibleObj[bkc][chp][vrs]
                }
            }
        }
        return retOb
    },
    convert_Tbcv_2_bcvT: function (rbcv, bcvRobj) {
        if (null === bcvRobj) bcvRobj = {}
        for (const [rev, revObj] of Object.entries(rbcv)) {
            for (const [vol, chpObj] of Object.entries(revObj)) {
                if (!bcvRobj[vol]) bcvRobj[vol] = {}
                if (!chpObj) continue
                for (const [chp, vrsObj] of Object.entries(chpObj)) {
                    if (!bcvRobj[vol][chp]) bcvRobj[vol][chp] = {}
                    if (!vrsObj) continue
                    for (const [vrs, txt] of Object.entries(vrsObj)) {
                        if (!bcvRobj[vol][chp][vrs]) bcvRobj[vol][chp][vrs] = {}
                        bcvRobj[vol][chp][vrs][rev] = txt
                    };
                };
            };
        };
        return bcvRobj;
    },

    search_str_in_bcvT: function (bcvR, Fname, searchStrn) {
        function _parse_global_parm(searchPat) {
            var arsrmat = searchPat.match(/^\/(.*)\/([a-z]*)$/)
            var exparm = "g"
            if (arsrmat && arsrmat.length === 3) {
                console.log(arsrmat)
                searchPat = arsrmat[1]
                exparm += arsrmat[2]
            }
            return { searchPat: searchPat, parm: exparm };
        }
        var parsePat = _parse_global_parm(searchStrn)
        console.log("searchStrn=", searchStrn)
        function _parse_AND(searchPat) {
            var andary = []
            var andmat = searchPat.match(/[\(][\?][\=][\.][\*]([^\)]+)[\)]/g)   //(?=.*Sarai)(?=.*Abram)
            if (andmat) {
                console.log(andmat)
                andmat.forEach(function (fand) {
                    var cors = fand.match(/(?:[\(][\?][\=][\.][\*])([^\)]+)([\)])/)
                    if (cors.length === 3) andary.push(cors[1])
                    console.log("cors", cors)
                })
            }
            return andary;
        }
        var andary = _parse_AND(searchStrn)
        console.log("andary:", andary)


        var retOb = {}
        for (const [bkc, chpObj] of Object.entries(bcvR)) {
            for (const [chp, vrsObj] of Object.entries(chpObj)) {
                for (const [vrs, revObj] of Object.entries(vrsObj)) {
                    var bFound = false
                    for (const [rev, txt] of Object.entries(revObj)) {
                        if (rev === Fname) {
                            var rep = null
                            try {
                                var rep = new RegExp(parsePat.searchPat, parsePat.parm);
                            } catch {
                                console.error("search_str_in_bcvT err", parsePat.searchPat, parsePat.parm)
                            }
                            var mat = txt.match(rep);
                            if (mat) {
                                mat.forEach(function (s, i) {
                                    //if (s.length > 0) console.log(i, s)
                                })
                                bFound = true
                                var txtFound = txt

                                if (andary.length === 0) {
                                    var repex = new RegExp(mat[0], parsePat.parm)
                                    txtFound = txt.replace(repex, "<font class='matInSvr'>" + mat[0] + "</font>");
                                } else {
                                    andary.forEach(function (strkey) {
                                        var repex = new RegExp(strkey, parsePat.parm)
                                        txtFound = txtFound.replace(repex, "<font class='matInSvr'>" + strkey + "</font>");
                                    })
                                }

                                bcvR[bkc][chp][vrs][rev] = txtFound
                            }

                        }
                    }
                    if (bFound) {
                        for (const [rev, txt] of Object.entries(revObj)) {
                            if (!retOb[bkc]) retOb[bkc] = {}
                            if (!retOb[bkc][chp]) retOb[bkc][chp] = {};//BibleObj[bkc][chp]
                            if (!retOb[bkc][chp][vrs]) retOb[bkc][chp][vrs] = {};//BibleObj[bkc][chp]
                            retOb[bkc][chp][vrs][rev] = txt
                        }
                    }
                }
            }
        }
        return retOb
    },
    search_str_in_bibObj__not_used: function (bibObj, searchStrn) {
        var retOb = {}
        for (const [bkc, chpObj] of Object.entries(bibObj)) {
            for (const [chp, vrsObj] of Object.entries(chpObj)) {
                for (const [vrs, txt] of Object.entries(vrsObj)) {
                    var rep = new RegExp(searchStrn, "g");
                    var mat = txt.match(rep);
                    if (mat) {
                        var txtFound = txt.replace(mat[0], "<font class='matInSvr'>" + mat[0] + "</font>");

                        if (!retOb[bkc]) retOb[bkc] = {}
                        if (!retOb[bkc][chp]) retOb[bkc][chp] = {};//BibleObj[bkc][chp]
                        if (!retOb[bkc][chp][vrs]) retOb[bkc][chp][vrs] = {};//BibleObj[bkc][chp]
                        retOb[bkc][chp][vrs][rev] = txtFound
                    }
                }
            }
        }
        return retOb
    },
    bcv_parser: function (sbcv, txt) {
        sbcv = sbcv.replace(/\s/g, "");
        if (sbcv.length === 0) return alert("please select an item first.");
        var ret = { vol: "", chp: "", vrs: "" };
        var mat = sbcv.match(/^(\w{3})\s{,+}(\d+)\s{,+}[\:]\s{,+}(\d+)\s{,+}$/);
        var mat = sbcv.match(/^(\w{3})\s+(\d+)\s+[\:]\s+(\d+)\s+$/);
        var mat = sbcv.match(/^(\w{3})(\d+)\:(\d+)$/);
        if (mat) {
            ret.vol = mat[1].trim();
            ret.chp = "" + parseInt(mat[2]);
            ret.vrs = "" + parseInt(mat[3]);
        } else {
            alert("sbcv=" + sbcv + "," + JSON.stringify(ret));
        }
        ret.chp3 = ret.chp.padStart(3, "0");
        ret._vol = "_" + ret.vol;

        ret.std_bcv = `${ret.vol}${ret.chp}:${ret.vrs}`

        var pad3 = {}
        pad3.chp = ret.chp.padStart(3, "0");
        pad3.vrs = ret.vrs.padStart(3, "0");
        pad3.bcv = `${ret.vol}${pad3.chp}:${pad3.vrs}`
        ret.pad3 = pad3

        var obj = {}
        obj[ret.vol] = {}
        obj[ret.vol][ret.chp] = {}
        obj[ret.vol][ret.chp][ret.vrs] = txt
        ret.bcvObj = obj

        ///////validation for std bcv.
        // if (undefined === _Max_struct[ret.vol]) {
        //     ret.err = `bkc not exist: ${ret.vol}`
        // } else if (undefined === _Max_struct[ret.vol][ret.chp]) {
        //     ret.err = `chp not exist: ${ret.chp}`
        // } else if (undefined === _Max_struct[ret.vol][ret.chp][ret.vrs]) {
        //     ret.err = `vrs not exist: ${ret.vrs}`
        // } else {
        //     ret.err = ""
        // }

        return ret;
    },


    loadObj_by_fname: function (jsfnm) {
        var ret = { obj: null, fname: jsfnm, fsize: -1, header: "", err: "" };

        if (!fs.existsSync(jsfnm)) {
            console.log("f not exit:", jsfnm)
            return ret;
        }
        ret.stat = BaseGUti.GetFileStat(jsfnm)
        ret.fsize = ret.stat.size;
        if (ret.fsize > 0) {
            var t = fs.readFileSync(jsfnm, "utf8");
            var i = t.indexOf("{");
            if (i > 0) {
                ret.header = t.substr(0, i);
                var s = t.substr(i);
                try {
                    ret.obj = JSON.parse(s);
                } catch (e) {
                    ret.err = e;
                }

            }
        }

        ret.writeback = function () {
            var s2 = JSON.stringify(this.obj, null, 4);
            BaseGUti.execSync_Cmd(`echo 'lll'| sudo -S chmod -R 777 ${this.fname}`)
            fs.writeFileSync(this.fname, this.header + s2);
            ret.dlt_size = ret.header.length + s2.length - ret.fsize
        }
        return ret;
    },
    inpObj_to_karyObj: function (inpObj) {
        var keyObj = { kary: [] }
        for (const [bkc, chpObj] of Object.entries(inpObj)) {
            keyObj.bkc = bkc
            keyObj.kary.push(bkc)
            for (const [chp, vrsObj] of Object.entries(chpObj)) {
                keyObj.chp = chp
                keyObj.kary.push(chp)
                for (const [vrs, txt] of Object.entries(vrsObj)) {
                    keyObj.vrs = vrs
                    keyObj.txt = txt
                    keyObj.kary.push(vrs)
                    keyObj.kary.push(txt)
                }
            }
        }
        return keyObj;
    },

    ____________Write2vrs_txt_by_inpObj__________: function (jsfname, doc, inpObj, bWrite) {
        var out = {}
        var bib = BaseGUti.loadObj_by_fname(jsfname);
        out.m_fname = bib.fname

        if (bib.fsize > 0) {
            console.log("fsize:", bib.fsize)
            for (const [bkc, chpObj] of Object.entries(inpObj)) {
                console.log("chpObj", chpObj)
                for (const [chp, vrsObj] of Object.entries(chpObj)) {
                    console.log("vrsObj", vrsObj)
                    for (const [vrs, txt] of Object.entries(vrsObj)) {
                        var readtxt = bib.obj[bkc][chp][vrs]
                        out.data = { dbcv: `${doc}~${bkc}${chp}:${vrs}`, txt: readtxt }
                        console.log("origtxt", readtxt)

                        if (bWrite) {
                            console.log("newtxt", txt)
                            bib.obj[bkc][chp][vrs] = txt
                            bib.writeback();
                            out.desc += ":Write-success"
                        } else {
                            out.desc += ":Read-success"
                        }
                    }
                }
            }
        }
        return out
    },



    decrypt_txt: function (toDecrypt, privateKey) {
        //const absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey)
        //const privateKey = fs.readFileSync(absolutePath, 'utf8')
        const buffer = Buffer.from(toDecrypt, 'base64')
        const decrypted = crypto.privateDecrypt(
            {
                key: privateKey.toString(),
                passphrase: '',
                padding: crypto.constants.RSA_PKCS1_PADDING
            },
            buffer,
        )
        return decrypted.toString('utf8')
    },












    default_inp_out_obj: function () {
        return {
            data: null, desc: "", err: null,
            state: { bGitDir: -1, bMyojDir: -1, bDatDir: -1, bEditable: -1, bRepositable: -1 }
        }
    },


    //// BaseGUti /////
}





function GitSponsor(ownername) {
    var part = ["Yp" + "EaWa651" + "IjKK" + "-" + "IBGv0" + "Ylnx" + "Nq" + "-Jr0LMH00MD80"]
    var sponsor_git_pat = "ghp_" + part.join("").replace(/[\-]/g, "")
    this.m_sponsor = { ownername: "bsnp21", ownerpat: sponsor_git_pat }
}
GitSponsor.prototype.gh_repo_list_all_obj = function () {
    var istart = this.m_sponsor.ownername.length + 1
    var str = BaseGUti.execSync_Cmd("gh repo list").toString()// --json nameWithOwner|url
    console.log("gh repo list:", str)
    var lines = str.split(/[\r|\n]/)
    var usrsInfo = {}
    for (var i = 0; i < lines.length; i++) {
        var lin = lines[i]
        if (!lin) continue
        var ar = lin.split(/[\t|\s]+/)
        console.log(i, ar)
        usrsInfo[ar[0].slice(istart)] = ar.slice(1)
    }
    console.log("lines", lines)
    console.log("usrsInfo", usrsInfo)
    return usrsInfo
}
GitSponsor.prototype.git_repo_user_url = function (repopath, bSecure) {
    //https://${userproj.username}:${passcode}@${userproj.hostname}/${userproj.username}/${userproj.projname}.git`
    //this.m_giturl = `https://${m_sponsor.ownername}:${m_sponsor.ownerpat}@github.com/${m_sponsor.ownername}/${this.m_repos}.git`

    var secure = "";
    if (bSecure) {
        secure = `${this.m_sponsor.ownername}:${this.m_sponsor.ownerpat}@`
    }

    if (repopath.indexOf("https") < 0) {
        //var sponser_git_rep = repopath.replace(/[\@|\.|\:|\/]/g, "_")
        repopath = `https://${secure}github.com/${this.m_sponsor.ownername}/${repopath}.git`
    }

    // if (passcode.trim().length > 0) {
    //     if ("github.com" === userproj.hostname) {
    //         return `https://${userproj.username}:${passcode}@${userproj.hostname}/${userproj.username}/${userproj.projname}.git`
    //     }
    //     if ("bitbucket.org" === userproj.hostname) {
    //         return `https://${userproj.username}:${passcode}@${userproj.hostname}/${userproj.prjbitbk}/${userproj.projname}.git`
    //     }
    // }

    return repopath
}








///////////////////////////////



var BaseGitUser = function () {
    this.m_dlog = []
}
BaseGitUser.prototype.absRootWorkingDir = function () {
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


BaseGitUser.prototype.gh_repo_create = function (username, passcode, hintword) {
    var dir = this.getFullPath_usr_host()
    if (!hintword) hintword = ""
    var salts = JSON.stringify([passcode, hintword]) //need to be encrypted.--> get_repo_salts
    var commit_msg = this.getFullPath_usr_git(".salts")
    var gh_repo_create = `
# create my-project and clone 
echo ${dir}
cd ${dir}
sudo -S gh repo create ${username} --public --clone
sudo -S chmod 777 ${username}
sudo -S chmod 777 ${username}/.git/config
cd ${username}
echo '${salts}' > .salts
sudo -S mkdir -p account
sudo -S chmod -R 777 account
#sudo -S cp -rf ${this.getFullPath_sys_stdlib_template()}/*  ./account/.
sudo -S git add .salts
sudo -S git add *
sudo -S git commit -m "${commit_msg}"
sudo -S git branch -M main
sudo -S git remote add origin https://github.com/bsnp21/${username}.git
sudo -S git push -u origin main
cd ..
    `
    if (this.getFullPath_usr_git() !== this.getFullPath_usr_host(username)) {
        console.log(this.getFullPath_usr_git() + " is not the same with: " + this.getFullPath_usr_host(username))
    }

    console.log("git_clogh_repo_createne_cmd...")
    var ret = BaseGUti.execSync_Cmd(gh_repo_create).toString()
    console.log("ret", ret)

    return ret
}
BaseGitUser.prototype.get_repo_salts = function (u) {
    var fname = this.getFullPath_usr_git(".salts")
    var txt = fs.readFileSync(fname, "utf-8")
    console.log("salt", fname, txt)
    if (!txt) return []
    var ar = JSON.parse(txt)
    return ar
}
BaseGitUser.prototype.IsUserExist = function (repopath) {
    var gsp = new GitSponsor()
    var usrsinfo = gsp.gh_repo_list_all_obj()
    if (repopath in usrsinfo) {
        return true;
    }
    return false
}

BaseGitUser.prototype.Set_Gitusr = function (repopath) {

    this.m_gitusername = repopath
    //hijack
    var sponser = new GitSponsor()
    repopath = sponser.git_repo_user_url(repopath)
    var passcode = sponser.m_sponsor.ownerpat;
    //this.m_usr = { repopath: repopath, passcode: passcode } //sponsor

    ////////////

    this.usr_repos = { repopath: repopath, passcode: passcode }
    this.m_gitinf = this._interpret_repo_url_str(repopath)
    this.git_Usr_Pwd_Url = sponser.git_repo_user_url(repopath, true) 

    var absRootPath = this.absRootWorkingDir()
    this.m_projDirs = this._prepare_proj_dirs(absRootPath)

    this.m_std_bible_obj_lib_template = `${absRootPath}/bible_obj_lib/jsdb/UsrDataTemplate`

    return true;
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
    if (!this.m_gitinf) return ""
    var userproj = this.m_gitinf
    var passcode = this.usr_repos.passcode
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
    if (!this.m_gitinf) return null
    //const WorkingRootNodeName = "bugit"
    const NodeUsrs = "usrs" //keep same as old. 
    var userproj = this.m_gitinf
    console.log("m_gitinf", this.m_gitinf)
    var absRootPath = this.absRootWorkingDir()

    var projDirs = {}
    projDirs.root_sys = `${absRootPath}`
    projDirs.base_Dir = `${absRootPath}${WorkingRootNodeName}`
    projDirs.user_dir = `${absRootPath}${WorkingRootNodeName}/${NodeUsrs}/${userproj.hostname}/${userproj.username}`                                    //<==User's host
    projDirs.git_root = `${absRootPath}${WorkingRootNodeName}/${NodeUsrs}/${userproj.hostname}/${userproj.username}/${userproj.projname}`               //<==User's git dir .git
    projDirs.acct_dir = `${absRootPath}${WorkingRootNodeName}/${NodeUsrs}/${userproj.hostname}/${userproj.username}/${userproj.projname}/account`       //<==User's acct
    projDirs.dest_myo = `${absRootPath}${WorkingRootNodeName}/${NodeUsrs}/${userproj.hostname}/${userproj.username}/${userproj.projname}/account/myoj`  //<==User's myoj
    projDirs.dest_dat = `${absRootPath}${WorkingRootNodeName}/${NodeUsrs}/${userproj.hostname}/${userproj.username}/${userproj.projname}/account/dat`   //<==User's dat

    console.log("_prepare_proj_dirs---- projDirs =", projDirs)
    return projDirs
}
BaseGitUser.prototype.getFullPath_usr_host = function (subpath) {
    return (!subpath) ? this.m_projDirs.user_dir : `${this.m_projDirs.user_dir}/${subpath.replace(/^[\/]/, "")}`
}
BaseGitUser.prototype.getFullPath_usr_git = function (subpath) {
    return (!subpath) ? this.m_projDirs.git_root : `${this.m_projDirs.git_root}/${subpath.replace(/^[\/]/, "")}`
}
BaseGitUser.prototype.getFullPath_usr_acct = function (subpath) {
    return (!subpath) ? this.m_projDirs.acct_dir : `${this.m_projDirs.acct_dir}/${subpath.replace(/^[\/]/, "")}`

}
BaseGitUser.prototype.getFullPath_usr_myoj = function (subpath) {
    return (!subpath) ? this.m_projDirs.dest_myo : `${this.m_projDirs.dest_myo}/${subpath.replace(/^[\/]/, "")}`

}
BaseGitUser.prototype.getFullPath_usr_dat = function (subpath) {
    return (!subpath) ? this.m_projDirs.dest_dat : `${this.m_projDirs.dest_dat}/${subpath.replace(/^[\/]/, "")}`
}

BaseGitUser.prototype.getFullPath_sys_stdlib_template = function (subpath) {
    return (!subpath) ? this.m_std_bible_obj_lib_template : `${this.m_std_bible_obj_lib_template}/${subpath.replace(/^[\/]/, "")}`
}
BaseGitUser.prototype.getFullPath_sys_stdlib_BibleObj = function (subpath) {
    var sysBibleObjPath = `${this.m_projDirs.root_sys}bible_obj_lib/jsdb/jsBibleObj`
    return (!subpath) ? sysBibleObjPath : `${sysBibleObjPath}/${subpath.replace(/^[\/]/, "")}`
}
BaseGitUser.prototype.getFullPath_root_sys = function (subpath) {
    var sysBibleObjPath = `${this.m_projDirs.root_sys}`
    return (!subpath) ? sysBibleObjPath : `${sysBibleObjPath}/${subpath.replace(/^[\/]/, "")}`
}










///bible doc applied. 

BaseGitUser.prototype.get_DocCode_Fname = function (DocCode) {
    if (!DocCode.match(/^e_/)) return "" //:like, e_Note
    //var fnam = DocCode.replace(/^e_/, "my")  //:myNode_json.js
    return `${DocCode}_json.js`
}
BaseGitUser.prototype.get_pfxname = function (DocCode) {
    //full path rw executable
    //var DocCode = inp.par.fnames[0]
    if (!DocCode) return ""
    var dest_pfname = ""
    switch (DocCode[0]) {
        case "_": //: _myNode,
        case "e": //: e_Node,
            {
                var fnam = this.get_DocCode_Fname(DocCode)
                dest_pfname = this.getFullPath_usr_myoj(`/${fnam}`)
            }
            break
        case ".": //-: ./dat/MostRecentVerses; //not used MyBiblicalDiary
            {
                var fnam = DocCode.substr(1)
                dest_pfname = this.getFullPath_usr_acct(`${fnam}_json.js`)
            }
            break;
        default: //: NIV, CUVS, NIV_Jw  
            dest_pfname = this.getFullPath_sys_stdlib_BibleObj(`${DocCode}.json.js`);
            break;
    }
    if (!fs.existsSync(dest_pfname)) {

    }
    return dest_pfname
}
BaseGitUser.prototype.get_userpathfile_from_tempathfile = function (tmpathfile) {

    var mat = tmpathfile.match(/[\/]myoj[\/]([\w]+)_json\.js$/) //::/myoj/myNode_json.js
    if (mat) {
        var doc = mat[1];//.replace(/^my/, "e_")  //docname: 
        var gitpfx = this.get_pfxname(doc)
        return gitpfx
    }

    var mat = tmpathfile.match(/[\/]dat[\/]([\w]+)_json\.js$/)
    if (mat) {
        var doc = mat[1]
        var gitpfx = this.get_pfxname("./dat/" + doc)
        return gitpfx
    }
}


//////////////////////////////////////////











BaseGitUser.prototype.Check_proj_state = function (cbf) {
    //if (!this.m_inp.out || !this.m_inp.out.state) return console.log("******Fatal Error.")
    var stat = { bRepositable: 0 };//this.m_inp.out.state
    //inp.out.state = { bGitDir: -1, bMyojDir: -1, bEditable: -1, bRepositable: -1 }


    var dir = this.getFullPath_usr_myoj()
    stat.bMyojDir = (fs.existsSync(dir)) ? 1 : 0

    var dir = this.getFullPath_usr_dat()
    stat.bDatDir = (fs.existsSync(dir)) ? 1 : 0

    var dir = this.getFullPath_usr_git("/.git/config")
    stat.bGitDir = (fs.existsSync(dir)) ? 1 : 0

    stat.bEditable = (1 === stat.bMyojDir && 1 === stat.bDatDir && 1 === stat.bGitDir) ? 1 : 0
    //stat.bRepositable = stat.bGitDir

    stat.missedFiles = this.run_makingup_missing_files(false)
    var configtxt = this.load_git_config()

    //console.log("Check_proj_state ----------")
    /////// git status
    //stat.bEditable = stat.bGitDir * stat.bMyojDir * stat.bDatDir
    //this.m_inp.out.state.bRepositable = 0
    if (configtxt.length > 0) {
        //if clone with password ok, it would ok for pull/push 
        stat.bRepositable = 1
    }

    var accdir = this.getFullPath_usr_acct()
    var fstat = {}
    var totalsize = 0
    var iAlertLevel = 0
    BaseGUti.GetFilesAryFromDir(accdir, true, function (fname) {
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

    //console.log("Check_proj_state ----------end")
    if (cbf) cbf()
    return stat
}


/////


BaseGitUser.prototype.run_makingup_missing_files = function (bCpy) {

    var _THIS = this
    var srcdir = this.getFullPath_sys_stdlib_template()
    var nMissed = 0
    BaseGUti.GetFilesAryFromDir(srcdir, true, function (srcfname) {
        //console.log("---getFullPath_sys_stdlib_template:", srcfname)
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
                    var ret = BaseGUti.execSync_Cmd(`echo 'lll' | sudo -S mkdir -p  ${pet.dir}`)
                }
                BaseGUti.execSync_Cmd(`echo 'lll' | sudo -S chmod 777 ${pet.dir}`)
                fs.copyFileSync(srcfname, gitpfx, COPYFILE_EXCL) //failed if des exists.
            }
        }
    });
    return nMissed
}

BaseGitUser.prototype.mkdir_empty_proj = function () {
    //var password = "lll" //dev mac
    var root_sys = this.getFullPath_root_sys()
    var git_root = this.getFullPath_usr_git()
    var bugit = this.getFullPath_root_sys(WorkingRootNodeName)
    var usrs_home = this.getFullPath_usr_host()

    var git_clone_cmd = `
    #!/bin/sh
    cd ${root_sys}
    if [ -f "${usrs_home}" ]; then
        echo "${usrs_home} exists."
    else 
        echo "${bugit} does not exist."
        echo 'lll' | sudo -S mkdir -p ${usrs_home}
        echo 'lll' | sudo -S chmod -R 777 ${bugit}
    fi
    `
    var ret = BaseGUti.execSync_Cmd(git_clone_cmd).toString()
    console.log("-mkdir_empty_proj:", bugit, fs.existsSync(bugit), ret)
    return ret
}
BaseGitUser.prototype.git_clone = function () {
    //var password = "lll" //dev mac
    var root_sys = this.getFullPath_root_sys()
    var git_root = this.getFullPath_usr_git()
    var clone_https = this.git_Usr_Pwd_Url
    var bugit = this.getFullPath_root_sys(WorkingRootNodeName)

    var git_clone_cmd = `
    #!/bin/sh
    if [ -f "${git_root}/.git/config" ]; then
        echo "${git_root}/.git/config exists."
        echo 'lll' | sudo -S chmod  777 ${git_root}/.git/config
    else 
        echo "${git_root}/.git/config does not exist, so to clone"
        cd ${root_sys}
        echo 'lll' | sudo -S mkdir -p ${git_root}
        echo 'lll' | sudo -S chmod -R 777 ${git_root}
        echo 'lll' | sudo -S GIT_TERMINAL_PROMPT=0 git clone  ${clone_https}  ${git_root}
    fi
    `
    var ret = BaseGUti.execSync_Cmd(git_clone_cmd).toString()
    console.log("git_clone_cmd:", git_root, ret)
    return ret
}

BaseGitUser.prototype.Deploy_proj = function () {
    console.log("********************************************* Deploy_proj  1")

    this.mkdir_empty_proj()

    var dir = this.getFullPath_usr_git("/.git/config")
    if (!fs.existsSync(dir)) {
        this.git_clone() //always sucess even passwd is wrong.
    } else {
        this.git_pull()
    }

    if (!fs.existsSync(dir)) {
        return { "NotFound:": dir }
    }


    if (fs.existsSync(dir)) {
        //this.run_makingup_missing_files(true)
    }

    var dir = this.getFullPath_usr_acct()
    if (fs.existsSync(dir)) {
        //BaseGUti.execSync_Cmd(`echo 'lll' |sudo -S chmod -R 777 ${dir}`)
    }

    var ret = this.Check_proj_state()

    //console.log("Deploy_proj ---------- rgfd")
    return ret
}


BaseGitUser.prototype.Destroy_proj = function () {
    var inp = { out: {} };//this.m_inp

    var gitdir = this.getFullPath_usr_git()
    //var password = "lll" //dev mac
    var proj_destroy = `
      sudo -S rm -rf ${gitdir}
    `
    if (fs.existsSync(`${gitdir}`)) {
        inp.out.exec_git_cmd_result = BaseGUti.execSync_Cmd(proj_destroy).toString()
        inp.out.desc += "destroyed git dir: " + gitdir
    }

    this.Check_proj_state()

    //this.Session_delete()
    return inp
}



BaseGitUser.prototype.cp_template_to_git = function () {
    var inp = { out: { desc: "" } };//this.m_inp
    inp.out.desc += ",clone."

    var gitdir = this.getFullPath_usr_myoj()
    if (fs.existsSync(`${gitdir}`)) {
        inp.out.desc += ", usr acct already exist: "
        return inp
    }


    //var password = "lll" //dev mac
    var acctDir = this.getFullPath_usr_acct()
    var cp_template_cmd = `
    #!/bin/sh
    echo 'lll' | sudo -S mkdir -p ${acctDir}
    echo 'lll' | sudo -S chmod -R 777 ${acctDir}
    # sudo -S cp -aR  ${this.m_projDirs.root_sys}bible_obj_lib/jsdb/UsrDataTemplate  ${acctDir}/
    echo 'lll' | sudo -S cp -aR  ${this.m_projDirs.root_sys}bible_obj_lib/jsdb/UsrDataTemplate/*  ${acctDir}/.
    echo 'lll' | sudo -S chmod -R 777 ${acctDir}
    #cd -`

    inp.out.cp_template_cmd = cp_template_cmd
    console.log("cp_template_cmd", cp_template_cmd)
    inp.out.cp_template_cmd_result = BaseGUti.execSync_Cmd(cp_template_cmd).toString()

    if (!fs.existsSync(`${gitdir}`)) {
        inp.out.desc += ", cp failed: "
    }
    return inp
}




BaseGitUser.prototype.chmod_R_777_acct = function (spath) {
    // mode : "777" 
    var inp = { out: {} };//this.m_inp

    var dir = this.getFullPath_usr_acct(spath)
    console.log("perm:", dir)
    if (!fs.existsSync(dir)) {
        return inp
    }
    //var password = "lll"
    var change_perm_cmd = `echo 'lll'|  sudo -S chmod -R 777 ${dir}`

    inp.out.change_perm = BaseGUti.execSync_Cmd(change_perm_cmd).toString()

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

    inp.out.change_perm = BaseGUti.execSync_Cmd(change_perm_cmd).toString()

    return inp.out.change_perm
}


BaseGitUser.prototype.load_git_config = function () {
    var git_config_fname = this.getFullPath_usr_git("/.git/config")
    if (!fs.existsSync(git_config_fname)) return ""
    //if (!this.m_git_config_old || !this.m_git_config_new) {
    var olds, news, txt = fs.readFileSync(git_config_fname, "utf8")
    var ipos1 = txt.indexOf(this.usr_repos.repopath)
    var ipos2 = txt.indexOf(this.git_Usr_Pwd_Url)//usr_proj

    console.log("ipos1:", ipos1, this.usr_repos.repopath)
    console.log("ipos2:", ipos2, this.git_Usr_Pwd_Url)//usr_proj

    var configurl = ""
    if (ipos1 > 0) {
        olds = txt
        news = txt.replace(this.usr_repos.repopath, this.git_Usr_Pwd_Url)//usr_proj
    }
    if (ipos2 > 0) {
        news = txt
        olds = txt.replace(this.git_Usr_Pwd_Url, this.usr_repos.repopath)//usr_proj

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
    return retObj;
}



BaseGitUser.prototype.Save_userData_frm_client = function (par) {
    //var inp = this.m_inp
    var save_res = { desc: "ok" }
    var doc = par.fnames[0]
    var jsfname = this.get_pfxname(doc)
    console.log("jsfname=", jsfname)
    var ret = BaseGUti.loadObj_by_fname(jsfname)
    if (ret.obj) {
        BaseGUti.FlushObjDat(par.data, ret.obj)
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

    var git_config_fname = this.getFullPath_usr_git("/.git/config")
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


BaseGitUser.prototype.git_status = async function (_sb) {
    var inp = { out: {} }
    if (!inp.out.state) return console.log("*** Fatal Error: inp.out.state = null")

    if (undefined === _sb) _sb = ""
    var gitdir = this.getFullPath_usr_git("/.git/config")
    if (fs.existsSync(gitdir)) {
        /////// git status
        var git_status_cmd = `
        cd ${this.getFullPath_usr_git()}
        git status ${_sb}
        #git diff --ignore-space-at-eol -b -w --ignore-blank-lines --color-words=.`

        inp.out.git_status_res = BaseGUti.exec_Cmd(git_status_cmd).toString()
    }
}


BaseGitUser.prototype.git_add_commit_push_Sync = function (msg) {
    var _THIS = this
    var inp = {};//this.m_inp
    var gitdir = this.getFullPath_usr_git()
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
    echo 'lll'|  sudo -S git commit -m "Sync:${msg}. repodesc:${this.usr_repos.repodesc}"
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

    var dir = this.getFullPath_usr_git()


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
        console.log("\n*** test git push:", dir, ret)
        if (ret.match(/failed/i)) {
            if (!fs.existsSync(dir)) {
                console.log("*********** getFullPath_usr_git not exist.", dir)
                return null
            }
            ret = null
        }
    }
    this.git_config_allow_push(false)
    return ret
}
BaseGitUser.prototype.execSync_cmd_git = function (gitcmd) {
    var _THIS = this


    if (!fs.existsSync(this.getFullPath_usr_git())) {
        return null
    }

    //console.log("proj", proj)
    //var password = "lll" //dev mac
    var scmd = `
    #!/bin/sh
    cd ${this.getFullPath_usr_git()}
     echo lll |sudo -S ${gitcmd}
    `
    console.log("\n----git_cmd start:>", scmd)
    var res = BaseGUti.execSync_Cmd(scmd)
    console.log("\n----git_cmd end.")

    return res
}







module.exports = {
    BaseGUti: BaseGUti,
    BaseGitUser: BaseGitUser,
    WorkingRootNodeName: WorkingRootNodeName,

}