

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

var { BaseGitUser, WorkingRootNodeName } = require("./BaseGitUser_mod");


//const WorkingRootNodeName = "bist"
var BibleUti = {

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
        BibleUti.GetFilesAryFromDir(dir, true, function (fname) {
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
        ret.stat = BibleUti.GetFileStat(jsfnm)
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
            BibleUti.execSync_Cmd(`echo 'lll'| sudo -S chmod -R 777 ${this.fname}`)
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
        var bib = BibleUti.loadObj_by_fname(jsfname);
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


    _check_pub_testing: function (inp) {
        if (inp.usr.passcode.length === 0) {
            return null
        }
        ////SpecialTestRule: repopath must be same as password.
        inp.usr.repopath = inp.usr.repopath.trim()
        const PUB_TEST = "pub_test", MYPASSWORD = "3edcFDSA"
        if (this.m_BaseGitUser.usr_proj.projname.indexOf(PUB_TEST) === 0 || 0 === this.m_BaseGitUser.usr_proj.projname.indexOf("Guest")) {
            if (this.m_BaseGitUser.usr_proj.projname !== inp.usr.passcode && MYPASSWORD !== inp.usr.passcode) {
                console.log("This is for pub_test only but discord to the rule.")
                return null
            } else {
                console.log("This is for pub_test only: sucessfully pass the rule.")
                inp.usr.passcode = MYPASSWORD
            }
        }
        return inp
    },
    _deplore_usr_proj_dirs: function (userproj, base_Dir) {
        if (!userproj) return
        //const base_Dir = "bible_study_notes/usrs"




        userproj.base_Dir = base_Dir
        userproj.user_dir = `${base_Dir}/${userproj.hostname}/${userproj.username}`
        userproj.git_root = `${base_Dir}/${userproj.hostname}/${userproj.username}/${userproj.projname}`
        userproj.acct_dir = `${base_Dir}/${userproj.hostname}/${userproj.username}/${userproj.projname}/account`
        userproj.dest_myo = `${base_Dir}/${userproj.hostname}/${userproj.username}/${userproj.projname}/account/myoj`
        userproj.dest_dat = `${base_Dir}/${userproj.hostname}/${userproj.username}/${userproj.projname}/account/dat`


        console.log("deplore: userproj=", userproj)
    },

    _interpret_repo_url_str: function (proj_url) {
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

    _interpret_git_config_Usr_Pwd_Url: function (userproj, passcode) {
        userproj.git_Usr_Pwd_Url = ""
        if (passcode.trim().length > 0) {
            if ("github.com" === userproj.hostname) {
                userproj.git_Usr_Pwd_Url = `https://${userproj.username}:${passcode}@${userproj.hostname}/${userproj.username}/${userproj.projname}.git`
            }
            if ("bitbucket.org" === userproj.hostname) {
                userproj.git_Usr_Pwd_Url = `https://${userproj.username}:${passcode}@${userproj.hostname}/${userproj.prjbitbk}/${userproj.projname}.git`
            }
        }

        //inp.usr.repodesc = inp.usr.repodesc.trim().replace(/[\r|\n]/g, ",")//:may distroy cmdline.
    },



    default_inp_out_obj: function () {
        return {
            data: null, desc: "", err: null,
            state: { bGitDir: -1, bMyojDir: -1, bDatDir: -1, bEditable: -1, bRepositable: -1 }
        }
    },
    //// BibleUti /////
}



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
            userProject.m_inp = inp
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
        val.tms = (new Date()).getTime() //timestampe for last access.
        val.ttl = ttl
    }
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





























//../../../../bist/usrs/{hostname}/{Usrname}/{projname}/account/dat
//../../../../bist/usrs/{hostname}/{Usrname}/{projname}/account/myoj
var BibleObjGituser = function () {

    this.m_BaseGitUser = new BaseGitUser()
    this.m_SvrUsrsBCV = new SvrUsrsBCV(this.m_BaseGitUser.pathrootdir)
}




BibleObjGituser.prototype.Proj_usr_account_create = function (inp) {
    console.log("========Proj_usr_account_create", inp)
    if (this.m_BaseGitUser.IsUserExist(inp.par.repopath)) {
        return { create_er: inp.par.repopath + ": user alreay exists." }
    }
    this.m_BaseGitUser.Set_Gitusr(inp.par.repopath)
    this.m_BaseGitUser.gh_repo_create(inp.par.repopath, inp.par.passcode, inp.par.hintword)
    var ret = this.m_BaseGitUser.Check_proj_state()
    return ret
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
    this.m_inp = inp
    if (!inp || !inp.out) {
        console.log("!inp || !inp.out")
        return null
    }

    inp.usr = this._decipher_usr_by_key_stored_in_cuid(inp.CUID, inp.cipherusrs)
    if (!inp.usr) {
        console.log("*****failed: sdfadfasjiasf")
        return null
    }
    return this.m_BaseGitUser.Set_Gitusr(inp.usr.repopath, inp.usr.passcode)
}
BibleObjGituser.prototype.Proj_parse_usr_login = function (inp) {
    this.m_inp = inp

    console.log("========__Proj_parse_usr_login__", inp)
    if (!this.m_BaseGitUser.IsUserExist(inp.par.repopath)) {
        return { login_er: inp.par.repopath + ": not exist." }
    }
    this.m_BaseGitUser.Set_Gitusr(inp.par.repopath)
    this.m_BaseGitUser.Deploy_proj()
    var ar = this.m_BaseGitUser.get_repo_salts()
    if (ar.indexOf(inp.par.passcode) < 0) {
        return { login_er: "password error." }
    }
    var ret = this.m_BaseGitUser.Check_proj_state()
    return ret
}

BibleObjGituser.prototype.Proj_parse_usr_after_signed = function (inp) {
    this.m_inp = inp
    if (!inp || !inp.out) {
        return null
    }

    inp.usr = this.proj_get_usr_fr_cache_ssid(inp)
    if (!inp.usr) {
        console.log("*****failed sdfadfas")
        return null
    }
    this.proj_update_cache_ssid_by_inp_aux(inp)

    return this.m_BaseGitUser.Set_Gitusr(inp.usr.repopath, inp.usr.passcode)
}

BibleObjGituser.prototype.proj_get_usr_aux_ttl = function (inp) {
    var ttl = (inp.par.aux && inp.par.aux.cacheTTL) ? inp.par.aux.cacheTTL : null
    return ttl
}
BibleObjGituser.prototype.proj_get_usr_fr_cache_ssid = function (inp) {
    inp.out.state.ssid_cur = inp.SSID
    if (!inp.SSID || inp.SSID.length === 0) {
        return null
    }
    if (!NCache.myCache.has(inp.SSID)) {
        inp.out.state.failed_ssid = "not have."
        console.log("***** proj_get_usr_fr_cache_ssid: could not find key: NCache.myCache.has(inp.SSID)", inp.SSID)
        return null
    }

    var ttl = this.proj_get_usr_aux_ttl(inp);// inp.par.aux && inp.par.aux.cacheTTL) ? inp.par.aux.cacheTTL : null
    inp.usr = NCache.Get(inp.SSID, ttl)

    if (!inp.usr) {
        inp.out.state.failed_ssid = "expired or not exist."
    }


    return inp.usr
}
BibleObjGituser.prototype.proj_update_cache_ssid_by_inp_aux = function (inp) {

    if (!inp.SSID || inp.SSID.length === 0 || !inp.usr || !inp.par.aux) {
        return null
    }

    var ttl = this.proj_get_usr_aux_ttl(inp);//inp.par.aux.cacheTTL
    if (!ttl) {
        return
    }
    ttl = parseInt(ttl)
    NCache.Set(inp.SSID, inp.usr, ttl)
    console.log(`Update_repodesc ************* inp.par.aux= ${JSON.stringify(inp.par.aux)}`)

    return inp.usr
}


BibleObjGituser.prototype.session_get_github_owner = function (docfile) {
    //jspfn: ../../../../bist/usrs/github.com/bsnp21/pub_test01/account/myoj/myNote_json.js
    var ary = docfile.split("/")
    var idx = ary.indexOf("usrs")
    var hostname = ary[idx + 1]
    var username = ary[idx + 2]
    var reponame = ary[idx + 3]
    var owner = username + "/" + reponame
    return owner
}
BibleObjGituser.prototype.session_git_repodesc_load = function (docfile) {
    //jspfn: ../../../../bist/usrs/github.com/bsnp21/pub_test01/account/myoj/myNote_json.js
    var pos = docfile.indexOf("/account/")
    var gitpath = docfile.substr(0, pos)
    console.log("gitpath", gitpath)
    var usrObj = NCache.Get(gitpath)
    if (!usrObj) return null
    console.log("usrObj", usrObj)
    return { repodesc: usrObj.repodesc, pathfile: gitpath }
}


BibleObjGituser.prototype.Session_create = function () {
    var gitdir = this.m_BaseGitUser.get_usr_git_dir()


    var ssid = this.m_BaseGitUser.m_gitinf.ownerId //usr_proj
    var ssid_b64 = Buffer.from(ssid).toString("base64")
    var ttl = NCache.m_TTL //default.
    if (this.m_inp.usr.ttl && false === isNaN(parseInt(this.m_inp.usr.ttl))) {
        ttl = parseInt(this.m_inp.usr.ttl)
    }

    NCache.Set(ssid_b64, this.m_inp.usr, ttl)
    console.log("Session_create:", ssid, ssid_b64, this.m_inp.usr)

    return ssid_b64
}
BibleObjGituser.prototype.Session_delete = function () {
    if (!this.m_inp.SSID) return
    var ret = NCache.myCache.take(this.m_inp.SSID)
    //NCache.myCache.set(this.m_inp.SSID, null)
    //console.log("Session_delete:", this.m_inp.SSID, this.m_inp.usr, ret)
    //ret = NCache.myCache.del(this.m_inp.SSID)
    console.log("Session_delete:", this.m_inp.SSID, this.m_inp.usr, ret)

    NCache.myCache.set(this.m_inp.SSID, null)
}






module.exports = {
    BibleUti: BibleUti,
    NCache: NCache,
    BibleObjGituser: BibleObjGituser
}