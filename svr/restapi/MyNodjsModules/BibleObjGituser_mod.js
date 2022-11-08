

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

    WorkingRootDir: function (v) {
        if (undefined === v) {
            return BibleUti.m_rootDir
        } else {
            BibleUti.m_rootDir = v
        }
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
        if (inp.usr_proj.projname.indexOf(PUB_TEST) === 0 || 0 === inp.usr_proj.projname.indexOf("Guest")) {
            if (inp.usr_proj.projname !== inp.usr.passcode && MYPASSWORD !== inp.usr.passcode) {
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
    _parse_inp_usr2proj: function (repopath, passcode) {
        //this.m_inp = inp
        var userproj = BibleUti._interpret_repo_url_str(repopath)//inp.usr.repopath

        BibleUti._deplore_usr_proj_dirs(userproj, this.m_sBaseUsrs)

        if (passcode.trim().length > 0) {
            BibleUti._interpret_git_config_Usr_Pwd_Url(userproj, passcode)//inp.usr.passcode
        }

        //BibleUti._parse_inp_usr2proj
        //this.m_inp.userproj = userproj
        return userproj
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
        var rootDir = BibleUti.WorkingRootDir();// + WorkingRootNodeName
        console.log(`on del:key=${key}, \n-val=${JSON.stringify(val)}, \n-rootDir=${rootDir}`)

        if (!val) return console.log("on del: !val")
        if ("object" !== typeof (val)) return console.log("on del: val not valid inp.usr obj")
        if (!val.repopath) return console.log("on del: val invalid. inp.usr.repopath null")

        if (!fs.existsSync(rootDir)) return console.log(`not existsSync(${rootDir}).`)
        //if (!fs.existsSync(key)) return console.log(`not existsSync(${key}).`)

        var gitdir = Buffer.from(key, 'base64').toString('utf8')
        console.log("on del:* start to del proj_destroy ssid=", key)
        console.log("on del:* start to del proj_destroy val=", val)
        console.log("on del:* start to del proj_destroy ownr=", gitdir)
        var inp = {}
        inp.usr = val
        inp.out = BibleUti.default_inp_out_obj()
        inp.SSID = key
        if (inp.usr_proj = BibleUti._parse_inp_usr2proj(val.repopath, val.passcode)) {
            var userProject = new BibleObjGituser(rootDir)
            userProject.m_inp = inp
            userProject.run_proj_state()
            console.log(inp.out.state)
            if (1 === inp.out.state.bRepositable) {
                //
                console.log("on del:git dir exist. push before to delete it")
                var res2 = userProject.execSync_cmd_git("git add *")
                var res3 = userProject.execSync_cmd_git(`git commit -m "on del in Cache"`)
                var res4 = userProject.git_push()

                var res5 = userProject.Run_proj_destroy()
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


















var UserProjFileSys = function (rootDir) {
    if (!rootDir.match(/\/$/)) rootDir += "/"
    this.m_rootDir = rootDir


    this.m_sRootNode = WorkingRootNodeName //"bist"
    this.m_sBaseUsrs = `${this.m_sRootNode}/usrs`
    this.m_sBaseTemp = `${this.m_sRootNode}/temp`

    this.pathrootdir = rootDir + this.m_sRootNode
}
UserProjFileSys.prototype.proj_get_usr_aux_ttl = function (inp) {
    var ttl = (inp.par.aux && inp.par.aux.cacheTTL) ? inp.par.aux.cacheTTL : null
    return ttl
}













//../../../../bist/usrs/{hostname}/{Usrname}/{projname}/account/dat
//../../../../bist/usrs/{hostname}/{Usrname}/{projname}/account/myoj
var BibleObjGituser = function (rootDir) {
    //    if (!rootDir.match(/\/$/)) rootDir += "/"
    //    this.m_rootDir = rootDir
    //
    //
    //    this.m_sRootNode = WorkingRootNodeName //"bist"
    //    this.m_sBaseUsrs = `${this.m_sRootNode}/usrs`
    //    this.m_sBaseTemp = `${this.m_sRootNode}/temp`
    //
    //
    //
    //    var pathrootdir = rootDir + this.m_sRootNode
    this.m_UserProjFileSys = new UserProjFileSys(rootDir)
    this.m_SvrUsrsBCV = new SvrUsrsBCV(this.m_UserProjFileSys.pathrootdir)
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
BibleObjGituser.prototype.Proj_parse_usr_after_signed = function (inp) {
    this.m_inp = inp
    if (!inp || !inp.out) {
        return null
    }

    inp.usr = this.proj_get_usr_fr_cache_ssid(inp)
    if (!inp.usr) {
        return null
    }
    this.proj_update_cache_ssid_by_inp_aux(inp)
    //inp.usr_proj = BibleUti._parse_inp_usr2proj(inp.usr.repopath, inp.usr.passcode)
    return this.parse_inp_usr2proj(inp.usr.repopath, inp.usr.passcode)
}

BibleObjGituser.prototype._decipher_usr_by_key_stored_in_cuid = function (cuid, cipherusrs) {
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
    this.m_inp = inp
    if (!inp || !inp.out) {
        console.log("!inp || !inp.out")
        return null
    }

    inp.usr = this._decipher_usr_by_key_stored_in_cuid(inp.CUID, inp.cipherusrs)
    if (!inp.usr) {
        return null
    }
    var usrproj = this.parse_inp_usr2proj(inp.usr.repopath, inp.usr.passcode)
    //this.m_inp.usr_proj = usr_proj
    return inp.usr_proj

}
BibleObjGituser.prototype.parse_inp_usr2proj = function (repopath, passcode) {
    //this.m_inp = inp
    var userproj = BibleUti._interpret_repo_url_str(repopath)//inp.usr.repopath

    BibleUti._deplore_usr_proj_dirs(userproj, this.m_UserProjFileSys.m_sBaseUsrs)

    if (passcode.trim().length > 0) {
        BibleUti._interpret_git_config_Usr_Pwd_Url(userproj, passcode)//inp.usr.passcode
    }

    //
    this.m_inp.usr_proj = userproj
    return this.m_inp
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
    var gitdir = this.get_usr_git_dir()

    if (!this.m_inp.usr_proj) return null
    var ssid = this.m_inp.usr_proj.ownerId
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

BibleObjGituser.prototype.get_usr_acct_dir = function (subpath) {
    if (!this.m_inp.usr_proj) return ""
    if (!subpath) {
        return `${this.m_rootDir}${this.m_inp.usr_proj.acct_dir}`
    }
    return `${this.m_rootDir}${this.m_inp.usr_proj.acct_dir}${subpath}`
}
BibleObjGituser.prototype.get_usr_myoj_dir = function (subpath) {
    if (!this.m_inp.usr_proj) return ""
    if (!subpath) {
        return `${this.m_rootDir}${this.m_inp.usr_proj.dest_myo}`
    }
    return `${this.m_rootDir}${this.m_inp.usr_proj.dest_myo}${subpath}`
}
BibleObjGituser.prototype.get_usr_dat_dir = function (subpath) {
    if (!this.m_inp.usr_proj) return ""
    if (!subpath) {
        return `${this.m_rootDir}${this.m_inp.usr_proj.dest_dat}`
    }
    return `${this.m_rootDir}${this.m_inp.usr_proj.dest_dat}${subpath}`
}


BibleObjGituser.prototype.get_usr_git_dir = function (subpath) {
    if (!this.m_inp.usr_proj) return ""
    if (undefined === subpath || null === subpath) {
        return `${this.m_rootDir}${this.m_inp.usr_proj.git_root}`
    }
    //if (subpath[0] !== "/") subpath = "/" + subpath
    return `${this.m_rootDir}${this.m_inp.usr_proj.git_root}${subpath}`
}

BibleObjGituser.prototype.get_DocCode_Fname = function (DocCode) {
    if (!DocCode.match(/^e_/)) return "" //:like, e_Note
    //var fnam = DocCode.replace(/^e_/, "my")  //:myNode_json.js
    return `${DocCode}_json.js`
}
BibleObjGituser.prototype.get_pfxname = function (DocCode) {
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
BibleObjGituser.prototype.get_userpathfile_from_tempathfile = function (tmpathfile) {
    //var src = `${this.m_rootDir}bible_obj_lib/jsdb/UsrDataTemplate/myoj/${fnam}`
    var mat = tmpathfile.match(/[\/]myoj[\/]([\w]+)_json\.js$/) //::/myoj/myNode_json.js
    if (mat) {
        var doc = mat[1];//.replace(/^my/, "e_")  //docname: 
        var gitpfx = this.get_pfxname(doc)
        return gitpfx
    }
    //var src_dat = `${this.m_rootDir}bible_obj_lib/jsdb/UsrDataTemplate${fnam}_json.js`
    var mat = tmpathfile.match(/[\/]dat[\/]([\w]+)_json\.js$/)
    if (mat) {
        var doc = mat[1]
        var gitpfx = this.get_pfxname("./dat/" + doc)
        return gitpfx
    }
}
BibleObjGituser.prototype.get_dir_lib_template = function (subpf) {
    var pathfile = `${this.m_rootDir}bible_obj_lib/jsdb/UsrDataTemplate`
    if (undefined === subpf) {
        return pathfile
    }
    return pathfile + subpf
}



BibleObjGituser.prototype.run_makingup_missing_files = function (bCpy) {

    var _THIS = this
    var srcdir = this.get_dir_lib_template()
    var nMissed = 0
    BibleUti.GetFilesAryFromDir(srcdir, true, function (srcfname) {
        console.log("---get_dir_lib_template:", srcfname)
        var ret = path.parse(srcfname);
        var ext = ret.ext
        var bas = ret.base

        var gitpfx = _THIS.get_userpathfile_from_tempathfile(srcfname)
        if (!fs.existsSync(gitpfx)) {
            nMissed++
            console.log("-src:", srcfname)
            console.log("-des:", gitpfx)
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

BibleObjGituser.prototype.Run_proj_setup = function () {
    console.log("********************************************* run setup 1")
    var inp = this.m_inp
    if (!inp.usr_proj || !inp.out.state) {
        inp.out.desc += ", failed inp.usr parse"
        console.log("failed git setup", inp.out.desc)
        return null
    }

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

    this.run_proj_state()
    return inp
}
BibleObjGituser.prototype.Run_proj_destroy = function () {
    var inp = this.m_inp
    var proj = inp.usr_proj;
    if (!proj) {
        console.log("failed git setup", inp)
        return inp
    }

    //console.log("proj", proj)
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

    this.Session_delete()
    return inp
}
BibleObjGituser.prototype.run_proj_state = function (cbf) {
    if (!this.m_inp.out || !this.m_inp.out.state) return console.log("******Fatal Error.")
    var stat = this.m_inp.out.state
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

    /////// git status
    //stat.bEditable = stat.bGitDir * stat.bMyojDir * stat.bDatDir
    this.m_inp.out.state.bRepositable = 0
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

    if (cbf) cbf()
    return stat
}

BibleObjGituser.prototype.cp_template_to_git = function () {
    var inp = this.m_inp
    var proj = inp.usr_proj;
    if (!proj) {
        inp.out.desc += ", failed inp.usr parse"
        console.log("failed git setup", inp.out.desc)
        return inp
    }
    inp.out.desc += ",clone."

    var gitdir = this.get_usr_myoj_dir()
    if (fs.existsSync(`${gitdir}`)) {
        inp.out.desc += ", usr acct already exist: "
        return inp
    }

    //console.log("proj", proj)
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
BibleObjGituser.prototype.chmod_R_777_acct = function (spath) {
    // mode : "777" 
    var inp = this.m_inp
    var proj = inp.usr_proj;
    if (!proj) {
        inp.out.desc += ", failed inp.usr parse"
        console.log("failed git setup", inp.out.desc)
        return inp
    }
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
BibleObjGituser.prototype.chmod_R_ = function (mode, dir) {
    // mode : "777" 
    var inp = this.m_inp
    var proj = inp.usr_proj;
    if (!proj) {
        inp.out.desc += ", failed inp.usr parse"
        console.log("failed git setup", inp.out.desc)
        return inp
    }
    console.log("perm:", dir)
    if (!fs.existsSync(dir)) {
        return inp
    }
    //var password = "lll"
    var change_perm_cmd = ` sudo -S chmod -R ${mode} ${dir}`

    inp.out.change_perm = BibleUti.execSync_Cmd(change_perm_cmd).toString()

    return inp.out.change_perm
}

BibleObjGituser.prototype.load_git_config = function () {
    var git_config_fname = this.get_usr_git_dir("/.git/config")
    if (!fs.existsSync(git_config_fname)) return ""
    //if (!this.m_git_config_old || !this.m_git_config_new) {
    var olds, news, txt = fs.readFileSync(git_config_fname, "utf8")
    var ipos1 = txt.indexOf(this.m_inp.usr.repopath)
    var ipos2 = txt.indexOf(this.m_inp.usr_proj.git_Usr_Pwd_Url)

    console.log("ipos1:", ipos1, this.m_inp.usr.repopath)
    console.log("ipos2:", ipos2, this.m_inp.usr_proj.git_Usr_Pwd_Url)

    var configurl = ""
    if (ipos1 > 0) {
        olds = txt
        news = txt.replace(this.m_inp.usr.repopath, this.m_inp.usr_proj.git_Usr_Pwd_Url)
    }
    if (ipos2 > 0) {
        news = txt
        olds = txt.replace(this.m_inp.usr_proj.git_Usr_Pwd_Url, this.m_inp.usr.repopath)

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
    this.m_inp.usr_proj.configurl = configurl
    //}
    return configurl
}

BibleObjGituser.prototype.Load_back_userData = function (par) {
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
//BibleObjGituser.prototype.save_userData_frm_client_________________ = function (inp) {
//    //var inp = this.m_inp
//    var doc = inp.par.fnames[0]
//    var jsfname = this.get_pfxname(doc)
//    console.log("jsfname=", jsfname)
//    var ret = BibleUti.loadObj_by_fname(jsfname)
//    if (ret.obj) {
//        BibleUti.FlushObjDat(inp.par.data, ret.obj)
//        console.log("ret", ret)
//        ret.writeback()
//    } else {
//        inp.out.state.err = "FATAL: loadObj_by_fname failed:=", jsfname
//        console.log(inp.out.state.err)
//    }
//
//    //// 
//    var save_res = {}
//    save_res.desc = "len:" + inp.par.data.length;// + ",dlt:" + ret.dlt_size
//    //save_res.dlt = ret.dlt_size
//    save_res.len = inp.par.data.length
//    //inp.par.data = ""
//    //save_res.ret = ret
//    inp.out.save_res = save_res
//    return save_res;
//}
BibleObjGituser.prototype.Save_userData_frm_client = function (par) {
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
BibleObjGituser.prototype.git_config_allow_push = function (bAllowPush) {
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

    if (!this.m_inp.usr.repopath) return
    if (!this.m_inp.usr_proj) return
    if (!this.m_inp.usr_proj.git_Usr_Pwd_Url) return

    var git_config_fname = this.get_usr_git_dir("/.git/config")
    if (!fs.existsSync(git_config_fname)) {
        console.log(".git/config not exist:", git_config_fname)
        return
    }



    if (!this.m_git_config_old || !this.m_git_config_new) {
        this.load_git_config()
    }

    if (bAllowPush) {
        fs.writeFileSync(git_config_fname, this.m_git_config_new, "utf8")
        console.log("bAllowPush=1:url =", this.m_inp.usr_proj.git_Usr_Pwd_Url)
    } else {
        fs.writeFileSync(git_config_fname, this.m_git_config_old, "utf8")
        console.log("bAllowPush=0:url =", this.m_inp.usr.repopath)
    }
}

BibleObjGituser.prototype.git_clone = function () {
    //var password = "lll" //dev mac
    var _THIS = this
    var inp = this.m_inp
    var proj = inp.usr_proj;
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


    var clone_https = inp.usr_proj.git_Usr_Pwd_Url
    if (clone_https.length === 0) {
        clone_https = inp.usr.repopath
    }
    if (clone_https.length === 0) {
        inp.out.git_clone_res.desc += ",no url."
        console.log("clone_https null:", clone_https)
        return inp
    }
    console.log("to clone: ", clone_https)

    //console.log("proj", proj)
    var dir = inp.usr_proj.user_dir
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
BibleObjGituser.prototype.git_status = async function (_sb) {
    var inp = this.m_inp
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

BibleObjGituser.prototype.git_add_commit_push_Sync = function (msg) {
    var _THIS = this
    var inp = this.m_inp
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
    echo 'lll'|  sudo -S git commit -m "Sync:${msg}. repodesc:${inp.usr.repodesc}"
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

BibleObjGituser.prototype.git_pull = function (cbf) {
    this.git_config_allow_push(true)
    this.m_inp.out.git_pull_res = this.execSync_cmd_git("GIT_TERMINAL_PROMPT=0 git pull")
    this.git_config_allow_push(false)
    //var mat = this.m_inp.out.git_pull_res.stderr.match(/(fatal)|(fail)|(error)/g)
    return this.m_inp.out.git_pull_res
}

BibleObjGituser.prototype.git_push = async function () {
    this.git_config_allow_push(true)
    var ret = this.m_inp.out.git_push_res = this.execSync_cmd_git("git push").toString()
    if (null !== ret) {
        console.log("\n*** test git push:", ret)
        if (ret.match(/failed/i)) {
            ret = null
        }
    }
    this.git_config_allow_push(false)
    return ret
}
BibleObjGituser.prototype.git_push_test = function () {
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
    var ret = this.m_inp.out.git_push_res = this.execSync_cmd_git(cmd).toString()
    if (null !== ret) {
        console.log("\n*** test git push:", ret)
        if (ret.match(/failed/i)) {
            ret = null
        }
    }
    this.git_config_allow_push(false)
    return ret
}
BibleObjGituser.prototype.execSync_cmd_git = function (gitcmd) {
    var _THIS = this
    var inp = this.m_inp


    if (!fs.existsSync(this.get_usr_git_dir())) {
        inp.out.desc = "no git dir"
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
    BibleUti: BibleUti,
    NCache: NCache,
    BibleObjGituser: BibleObjGituser
}