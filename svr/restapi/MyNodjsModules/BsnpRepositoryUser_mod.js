

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

//https://www.npmjs.com/package/gh-pages
var ghpages = require('gh-pages');



const WorkingRootNodeName = "ddir"


var BaseGUti = {



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
            console.log("execSync ==>", ret.slice(0, 120), "...")
        } catch (error) {
            console.log("error status:", error.status);  // 0 : successful exit, but here in exception it has to be greater than 0
            console.log("error message:", error.message); // Holds the message you typically want.
            console.log("error stderr:", error.stderr.toString());  // Holds the stderr output. Use `.toString()`.
            console.log("error stdout:", error.stdout.toString());  // Holds the stdout output. Use `.toString()`.
            return error.message
        }
        return ret;
    },








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
    WalkthruObj_BCV_ReplaceUsername: function (Obj, newStr, oldStr) {
        var replaceTot = 0
        BaseGUti.WalkthruObj_BCV_txt(Obj,
            function (bkc, chp, vrs, leafObj) {//at the end of object tree.
                if ("object" === typeof (leafObj)) {
                    var ar = Obj[bkc][chp][vrs].split(",")
                    var uniqu = [...new Set(ar)] //make a unique arr
                    var idx = uniqu.indexOf(oldStr)
                    if (idx >= 0) {
                        uniqu[idx] = newStr
                        Obj[bkc][chp][vrs] = uniqu.join(",")
                        replaceTot++
                    }
                } else {
                    console.log("============ Error, WalkthruObj_BCV_txt=", bkc, chp, vrs, leafObj)
                    //olog.push([jsfname, fnameID, bkc, chp, vrs])
                }
            })
        return replaceTot
    },
    WalkthruObj_BCV_txt: function (bcvR, cbf) {
        for (const [bkc, chpObj] of Object.entries(bcvR)) {
            for (const [chp, vrsObj] of Object.entries(chpObj)) {
                for (const [vrs, vrsAry] of Object.entries(vrsObj)) {
                    if (cbf) cbf(bkc, chp, vrs, vrsAry)
                }
            }
        }
    },
    FetchObj_UntilEnd: function (retObj, SrcObj, param) {
        function _iterate(carObj, srcObj) {
            for (var carProperty in carObj) {
                if (srcObj.hasOwnProperty(carProperty)) {
                    if (carObj[carProperty] && "object" === typeof (carObj[carProperty]) && !Array.isArray(carObj[carProperty]) && Object.keys(carObj[carProperty]).length > 0) {
                        _iterate(carObj[carProperty], srcObj[carProperty]);
                    } else {
                        if (param && param.FetchNodeEnd) param.FetchNodeEnd(carProperty, carObj, srcObj)
                        else carObj[carProperty] = srcObj[carProperty]
                    }
                } else {
                    if (param && param.SrcNodeNotOwnProperty) param.SrcNodeNotOwnProperty(carProperty, carObj, srcObj)
                    else delete carObj[carProperty]
                }
            }
        }
        //console.log("fetchObj:", retObj)
        if (Object.keys(retObj).length === 0) {
            Object.keys(SrcObj).forEach(function (key) {
                retObj[key] = SrcObj[key]
            })
            //console.log("fetchObj has no keys, then fetchAll", retObj)
            return retObj
        }
        if (!SrcObj) return retObj;
        _iterate(retObj, SrcObj)
        return retObj
    },

    // FlushObjDat: function (datObj, targObj) {
    //     function _iterate(carObj, tarObj) {
    //         if (!tarObj) return;
    //         for (var carProperty in carObj) {
    //             console.log("carProperty=", carProperty)
    //             if (carObj.hasOwnProperty(carProperty)) {
    //                 if (tarObj.hasOwnProperty(carProperty)) {//match keys
    //                     if (carObj[carProperty] && "object" === typeof (carObj[carProperty]) && !Array.isArray(carObj[carProperty]) && Object.keys(carObj[carProperty]).length > 0) {
    //                         _iterate(carObj[carProperty], tarObj[carProperty]); //non-arry obj. 
    //                     } else {
    //                         if (null === carObj[carProperty]) { //to delete key in targetObj.
    //                             delete tarObj[carProperty]
    //                         } else {  //flush update target obj.
    //                             tarObj[carProperty] = carObj[carProperty]
    //                         }
    //                     }
    //                 } else {//mismatch keys
    //                     if (null === carObj[carProperty]) {
    //                         //nothing to delete. 
    //                     } else {//add new key to targetObj.
    //                         tarObj[carProperty] = carObj[carProperty]
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     _iterate(datObj, targObj)
    //     return targObj
    // },
    FlushObj_UntilEnd: function (datObj, targObj, param) {
        function _iterate(carObj, tarObj, tarParent, tarParentProperty) {
            if (!tarObj) return;
            for (var carProperty in carObj) {
                //console.log("carProperty=", carProperty)
                if (tarObj.hasOwnProperty(carProperty)) {//match keys
                    if (carObj[carProperty] && "object" === typeof (carObj[carProperty]) && !Array.isArray(carObj[carProperty]) && Object.keys(carObj[carProperty]).length > 0) {
                        _iterate(carObj[carProperty], tarObj[carProperty], tarObj, carProperty); //non-arry obj. 
                    } else {
                        if (param.SrcNodeEnd) param.SrcNodeEnd(carProperty, carObj, tarObj)
                        //  if (null === carObj[carProperty]) { //to delete key in targetObj.
                        //      delete tarObj[carProperty]
                        //  } else {  //flush update target obj.
                        //      tarObj[carProperty] = carObj[carProperty]
                        //  }
                    }
                } else {//mismatch keys
                    if (param.TargNodeNotOwnProperty) param.TargNodeNotOwnProperty(carProperty, carObj, tarObj, tarParent, tarParentProperty)
                    //  if (null === carObj[carProperty]) {
                    //      //nothing to delete. 
                    //  } else {//add new key to targetObj.
                    //      tarObj[carProperty] = carObj[carProperty]
                    //  }
                }
            }
        }
        _iterate(datObj, targObj, null, null)
        return targObj
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
        ret.set_fname_header = function () {//not need.
            var basename = path.basename(this.fname).replace(".js", "")
            this.header = `var ${basename} = \n`
        }
        ret.writeback = function () {
            var s2 = JSON.stringify(this.obj, null, 4);
            BaseGUti.execSync_Cmd(`echo 'lll'| sudo -S chmod 777 ${this.fname}`)
            fs.writeFileSync(this.fname, this.header + s2);
            ret.dlt_size = ret.header.length + s2.length - ret.fsize
        }

        if (!fs.existsSync(jsfnm)) {
            ret.err = "loadObj_by_fname,f not exit:" + jsfnm
            console.log(ret.err)
            return ret;
        }
        ret.stat = BaseGUti.GetFileStat(jsfnm)
        ret.fsize = ret.stat.size;
        if (ret.fsize > 0) {
            var t = fs.readFileSync(jsfnm, "utf8");
            var i = t.indexOf("{");
            if (i > 0) {
                ret.header = t.slice(0, i);//keep original to save back.
                var s = t.slice(i);
                try {
                    ret.obj = JSON.parse(s);
                } catch (e) {
                    ret.err.catch = e;
                    ret.err.msg = "JSON.parse err."

                }

            }else{
                ret.err = "unable find left-curve-bracket."
            }
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
            SSID: "", data: null, desc: "", err: null,
            state: {}
        }
    },


    ////////////
    Output_append: function (pout, ret) {
        Object.keys(ret).forEach(function (key) {
            pout[key] = ret[key]
        })
        if (ret.err) {
            return false;
        }
        return true;
    }
    //// BaseGUti /////
}





function GitRepositoryUser(reponame) {
    this.m_hostname = "github.com"
    if (reponame) this.m_reponame = reponame

    var part = ["Yp" + "EaWa651" + "IjKK" + "-" + "IBGv0" + "Ylnx" + "Nq" + "-Jr0LMH00MD80"]
    var sponsor_git_pat = "ghp_" + part.join("").replace(/[\-]/g, "")
    this.m_acct = { ownername: "bsnp21", ownerpat: sponsor_git_pat }


    var b2pats = ["ghp" + "_" + "M0m" + "RuIQ4n" + "NVzq" + "3IQpMWK7kq6XrhS9y4d1" + "NNS"]
    var ret = BaseGUti.loadObj_by_fname("/home/ubuntu/install/gh/sponsorCfg.json.js")
    console.log("loadObj_by_fname", ret)
    if (ret.obj) {
        this.m_acct.ownername = Buffer.from(ret.obj.ownername, 'base64').toString("utf8")
        this.m_acct.ownerpat = Buffer.from(ret.obj.ownerpets.join(""), 'base64').toString("utf8")
        this.m_acct.ownerpa2 = b2pats.join("")
    }
    console.log("sponsor", this.m_acct)
    //const buffer = Buffer.from(toDecrypt, 'base64')
}
GitRepositoryUser.prototype.set_reponame = function (reponame) {
    this.m_reponame = reponame
}
GitRepositoryUser.prototype.gh_repo_list_all_obj = function () {
    var MAX_SIZE = 1000000 * 1000000000000;// millim Tillion10^12
    var istart = this.m_acct.ownername.length + 1

    var cmd = `gh repo list --limit ${MAX_SIZE}`
    var str = BaseGUti.execSync_Cmd(cmd).toString()// --json nameWithOwner|url
    if (str.indexOf("Command failed") >= 0) {
        console.log("=============gh is not installed or not work:", str)
        return { err: [str], obj: {} };
    }
    console.log("=============gh works")
    var lines = str.split(/[\r|\n]/)
    var usrsInfo = {}
    for (var i = 0; i < lines.length; i++) {
        var lin = lines[i]
        if (!lin) continue
        var ar = lin.split(/[\t|\s]+/)
        //console.log(i, ar)
        var sname = ar[0].slice(istart)
        usrsInfo[sname.toLowerCase()] = ar.slice(1)  //case insensitive
    }
    //console.log("lines", lines)
    console.log("usrsInfo", usrsInfo)
    return { obj: usrsInfo }
}//gh repo list --json diskUsage --limit 10

GitRepositoryUser.prototype.gh_repo_list_tot_diskUsage = function (github_accountowner) {
    var MAX_SIZE = 1000000 * 1000000000000;// millim Tillion10^12
    if (!github_accountowner) github_accountowner = this.m_acct.ownername
    var cmd = `gh repo list --source ${github_accountowner} --json diskUsage --limit ${MAX_SIZE}`
    var str = BaseGUti.execSync_Cmd(cmd).toString()// --json nameWithOwner|url
    if (str.indexOf("Command failed") >= 0) {
        console.log("============= gh is not installed or not work:", str)
        return { err: [str], obj: {} };
    }
    var robj = { ownername: github_accountowner }
    try {
        var objAry = JSON.parse(str)
        var tot_repos = objAry.length
        var tot_diskUsage = 0
        for (var i = 0; i < tot_repos; i++) {
            tot_diskUsage += objAry[i].diskUsage
        }
        robj.tot_reposNumber = tot_repos
        robj.tot_diskUsageKB = tot_diskUsage //https://docs.github.com/en/graphql/reference/objects#repository
    } catch {
        robj.err = ["failed json str"]
    }
    return robj
}
GitRepositoryUser.prototype.gh_repo_view_json__________ = function () {
    var viewItems = ["assignableUsers",
        "codeOfConduct",
        "contactLinks",
        "createdAt",
        "defaultBranchRef",
        "deleteBranchOnMerge",
        "description",
        "diskUsage",
        "forkCount",
        "fundingLinks",
        "hasIssuesEnabled",
        "hasProjectsEnabled",
        "hasWikiEnabled",
        "homepageUrl",
        "id",
        "isArchived",
        "isBlankIssuesEnabled",
        "isEmpty",
        "isFork",
        "isInOrganization",
        "isMirror",
        "isPrivate",
        "isSecurityPolicyEnabled",
        "isTemplate",
        "isUserConfigurationRepository",
        "issueTemplates",
        "issues",
        "labels",
        "languages",
        "latestRelease",
        "licenseInfo",
        "mentionableUsers",
        "mergeCommitAllowed",
        "milestones",
        "mirrorUrl",
        "name",
        "nameWithOwner",
        "openGraphImageUrl",
        "owner",
        "parent",
        "primaryLanguage",
        "projects",
        "pullRequestTemplates",
        "pullRequests",
        "pushedAt",
        "rebaseMergeAllowed",
        "repositoryTopics",
        "securityPolicyUrl",
        "squashMergeAllowed",
        "sshUrl",
        "stargazerCount",
        "templateRepository",
        "updatedAt",
        "url",
        "usesCustomOpenGraphImage",
        "viewerCanAdminister",
        "viewerDefaultCommitEmail",
        "viewerDefaultMergeMethod",
        "viewerHasStarred",
        "viewerPermission",
        "viewerPossibleCommitEmails",
        "viewerSubscription",
        "watchers"]
    var allitems = viewItems.join(",")
    var ghcmd = `gh repo view ${this.m_acct.ownername}/${this.m_reponame} --json isPrivate,diskUsage,createdAt,pushedAt,updatedAt,homepageUrl,name,owner,nameWithOwner,parent,securityPolicyUrl,sshUrl,url,viewerPermission,viewerPossibleCommitEmails`
    var ghcmd = `gh repo view ${this.m_acct.ownername}/${this.m_reponame} --json ${allitems}`
    var str = BaseGUti.execSync_Cmd(ghcmd).toString()// --json nameWithOwner|url
    console.log("gh_repo_view_json:", str)
    //GraphQL: Could not resolve to a Repository with the name 'bsnpghrepolist/p1zz'. (repository)
    if (str.indexOf("GraphQL") >= 0) {
        console.log("=============gh not work nor installed:", str)
        return { err: str.split(/[\r|\n]/) };
    }
    var lines = str.split(/[\r|\n]/)
    var usrsInfo = {}
    for (var i = 0; i < lines.length; i++) {
        var lin = lines[i]
        if (!lin) continue
        var ar = lin.split(/[\t|\s]+/)
        //console.log(i, ar)
        var sname = ar[0].slice(istart)
        usrsInfo[sname.toLowerCase()] = ar.slice(1)  //case insensitive
    }
    //console.log("lines", lines)
    console.log("usrsInfo", usrsInfo)
    return { obj: usrsInfo }
}
GitRepositoryUser.prototype.gh_auth_login = function () {
    var tmpfile = "gh_tok.tmp"
    var ghauthlogin = `--git-protocol ssh --hostname github.com --with-token < ${tmpfile} `
    var ghcmd = `## 
    sudo -S echo ${this.m_acct.ownerpat} > ${tmpfile}
    gh auth login ${ghauthlogin}
    sudo -S rm -f ${tmpfile}
    `
    console.log("gh_auth_login:", ghcmd + ghauthlogin)
    var ret = BaseGUti.execSync_Cmd(ghcmd).toString()// --json nameWithOwner|url
    console.log("ret", ret)
    return ret
}
GitRepositoryUser.prototype.gh_api_repos_nameWithOwner = function () {
    this.gh_auth_login()

    var ghcmd = `gh api repos/${this.m_acct.ownername}/${this.m_reponame}`
    console.log("gh_api_repos_nameWithOwner:", ghcmd)
    var str = BaseGUti.execSync_Cmd(ghcmd).toString()// --json nameWithOwner|url
    var ret = {
        "message": "Not Found",
        "documentation_url": "https://docs.github.com/rest/reference/repos#get-a-repository"
    }
    try {
        ret = JSON.parse(str)
    } catch {
        ret.catcherr = "err json str."
    }
    if (ret.message && ret.message === "Not Found") {
        ret.err = "gh_api_repos_nameWithOwner failed"
    }
    //console.log("ret", ret)
    return ret
}

GitRepositoryUser.prototype.git_published_usr_account_myoj_url = function (subpathname) {
    //sample: 
    //https://bsnpghrepolist.github.io/wdingpbaz6/account/myoj/e_Note_json.js
    // Eg: subpathname= /e_Note_json.js
    if (subpathname) {
        subpathname = subpathname.replace(/^\/{0,2}/, "")
    }
    else subpathname = ""
    var published = `https://bsnpghrepolist.github.io/${this.m_reponame}/${subpathname}`
    return published;//.replace("/account/", "/")
}
GitRepositoryUser.prototype.git_repo_user_url_private = function (bSecure) {
    //https://${userproj.username}:${passcode}@${userproj.hostname}/${userproj.username}/${userproj.projname}.git`
    //this.m_giturl = `https://${m_acct.ownername}:${m_acct.ownerpat}@github.com/${m_acct.ownername}/${this.m_repos}.git`

    var secure = `${this.m_acct.ownername}:${this.m_acct.ownerpat}@`;

    if (!bSecure) {
        secure = ""
    }


    //if (repopath.indexOf("https") < 0) {
    //var sponser_git_rep = repopath.replace(/[\@|\.|\:|\/]/g, "_")
    var secu_repopath = `https://${secure}github.com/${this.m_acct.ownername}/${this.m_reponame}.git`
    //}


    // if (passcode.trim().length > 0) {
    //     if ("github.com" === userproj.hostname) {
    //         return `https://${userproj.username}:${passcode}@${userproj.hostname}/${userproj.username}/${userproj.projname}.git`
    //     }
    //     if ("bitbucket.org" === userproj.hostname) {
    //         return `https://${userproj.username}:${passcode}@${userproj.hostname}/${userproj.prjbitbk}/${userproj.projname}.git`
    //     }
    // }

    return secu_repopath
}

GitRepositoryUser.prototype.git_conf_txt = function (bSecure) {
    var sec_url = this.git_repo_user_url_private(bSecure)
    var cfg = `
    [core]
        repositoryformatversion = 0
        filemode = true
        bare = false
        logallrefupdates = true
    [remote "origin"]
        url = ${sec_url}
        fetch = +refs/heads/*:refs/remotes/origin/*
    [branch "main"]
        remote = origin
        merge = refs/heads/main    
        `
    return cfg
}

GitRepositoryUser.prototype.gh_repo_create_remote_master = function (accesstr) {

    if (["public", "private"].indexOf(accesstr) < 0) return { err: ["accesstr must be public|private.", accesstr] }

    var username = this.m_reponame
    var gh_repo_create = `
# create my-project and clone 
############   sudo -S gh repo create ${username} --private --clone   ## sudo cause gh to create repo on previos git account. 
#######################################################################################################
gh repo create ${this.m_acct.ownername}/${username} --${accesstr}   ## must remove sudo for third pary github account. 
#######################################################################################################
`
    var str = BaseGUti.execSync_Cmd(gh_repo_create).split(/\r|\n/)
    return str
}
GitRepositoryUser.prototype.curl_publish_source_for_website_of_git_reponame = function () {

    const GITHUB_USER = this.m_acct.ownername //  ### "your-github-username"
    const REPO_NAME = this.m_reponame         //  ### "your-repo-name"
    const ACCESS_TOKEN = this.m_acct.ownerpat        //  ### "your-github-access-token"
    var gh_repo_create = `

# Replace the following variables with your own values
# https://github.com/bsnpghrepolist/wdingpbax/settings/pages

# For user/organization sites (using 'main' or 'master' branch)
curl -H "Authorization: token ${ACCESS_TOKEN}" \
     -X POST \
     -d '{"source":{"branch":"master"}}' \
     https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/pages

########                                                                
`
    var str = BaseGUti.execSync_Cmd(gh_repo_create).split(/\r|\n/)
    return str
}









///////////////////////////////



var BsnpRepositoryUser = function () {
    this.m_dlog = []
}
BsnpRepositoryUser.prototype.absRootWorkingDir = function () {
    var rootdir = __dirname.slice(0, __dirname.indexOf("/bb/") + 1)
    console.log("__dirname=", __dirname, "rootdir=", rootdir)
    return rootdir
}


BsnpRepositoryUser.prototype.get_repo_salts = function (u) {
    var ret = ["YQ==", "a"]
    var fname = this.getFullPath_usr_main(".salts")
    if (!fs.existsSync(fname)) {
        return ret
    }
    var txt = fs.readFileSync(fname, "utf-8")
    console.log("salt", fname, txt)
    if (!txt) return ret
    try {
        return JSON.parse(txt)
    } catch {
        return ret
    }
}

BsnpRepositoryUser.prototype.validate_reponame = function (reponame) {
    //The repository name must start with a letter and can only contain lowercase letters, numbers, hyphens, underscores, and forward slashes.
    if (reponame.length >= 120) {
        return { err: ["invalide name length.", reponame] }
    }
    if (!reponame.match(/^[a-z][a-z0-9\_]+$/)) return { err: ["illegal name.", reponame] }

    if (reponame.match(/\s/g)) return { err: ["reponame has spaces.", reponame, console.log("reponame has spaces.")] }
    //if (passcode.match(/\s/g)) return { err: ["passcode has spaces.", passcode, console.log("passcode has spaces.")] }
    if (!reponame.match(/^([a-zA-Z0-9\.\-\_]+)$/)) return { err: ["username has illegal characters.", reponame] }
    //if (!passcode.match(/^([a-zA-Z0-9\.\-\_]+)$/)) return { err: ["passcode has illegal characters.", passcode, console.log("passcode has illegal chars.")] }

    return { ok: ["legal name.", reponame] }
}
BsnpRepositoryUser.prototype.Set_gitusr = function (reponame) {
    if (!reponame) return { err: "reponame is null." }
    reponame = reponame.toLowerCase()



    var vld = this.validate_reponame(reponame)
    if (vld.err) return vld;

    this.m_RepoUsr = new GitRepositoryUser(reponame)

    this.m_projDirs = this._prepare_proj_data_dirs()

    return { vld: vld };
}
BsnpRepositoryUser.prototype._prepare_proj_data_dirs = function () {
    //const WorkingRootNodeName = "ddir"
    const NodeUsrs = "usrs" //keep same as old. 
    var absSvcRoot = this.absRootWorkingDir()
    var hostname = this.m_RepoUsr.m_hostname;//"github.com"
    var username = this.m_RepoUsr.m_acct.ownername;
    var projname = this.m_RepoUsr.m_reponame

    var projDirs = {}
    projDirs.root_sys = `${absSvcRoot}`
    projDirs.base_Dir = `${absSvcRoot}${WorkingRootNodeName}`
    projDirs.user_dir = `${absSvcRoot}${WorkingRootNodeName}/${NodeUsrs}/${hostname}/${username}`                                    //<==User's host
    projDirs.git_root = `${absSvcRoot}${WorkingRootNodeName}/${NodeUsrs}/${hostname}/${username}/${projname}`               //<==User's git dir .git
    projDirs.acct_dir = `${absSvcRoot}${WorkingRootNodeName}/${NodeUsrs}/${hostname}/${username}/${projname}/account`       //<==User's acct
    projDirs.dest_myo = `${absSvcRoot}${WorkingRootNodeName}/${NodeUsrs}/${hostname}/${username}/${projname}/account/myoj`  //<==User's myoj
    projDirs.dest_dat = `${absSvcRoot}${WorkingRootNodeName}/${NodeUsrs}/${hostname}/${username}/${projname}/account/dat`   //<==User's dat

    console.log("_prepare_proj_data_dirs---- projDirs =", projDirs)

    function make_path_777(startPath, endpath) {
        var cmd_ghroot = `
        #!/bin/sh 
        if [ -d "${endpath}" ]; then
            echo "${endpath} already has been created."
        else 
            echo "${endpath} does not exist, create it one-time-for-all: ${endpath}"
            echo 'lll' | sudo -S mkdir -p ${endpath}
            echo 'lll' | sudo -S chown -R ubuntu:ubuntu ${endpath}
            echo 'lll' | sudo -S chmod -R 777 ${startPath}
        fi
        `
        var ret = BaseGUti.execSync_Cmd(cmd_ghroot).toString()
        console.log("-fs.existsSync(ghroot):", fs.existsSync(ghroot), ret)
    }


    var ghroot = projDirs.user_dir
    make_path_777(projDirs.base_Dir, ghroot)
    if (fs.existsSync(ghroot)) this.ghRoot = ghroot
    else console.log(`********** Fatal Error creating ghroot: ${ghroot}.`)


    this.m_std_bible_obj_lib_template = `${absSvcRoot}bible_obj_lib/jsdb/UsrDataTemplate`
    if (!fs.existsSync(this.m_std_bible_obj_lib_template)) {
        var clone_https = 'https://github.com/wdingbox/bible_obj_lib.git'
        var clone_lib = `echo 'lll' | sudo -S GIT_TERMINAL_PROMPT=0 git clone ${clone_https}  ${absSvcRoot}bible_obj_lib`
        var ret = BaseGUti.execSync_Cmd(clone_lib).toString()
        console.log("-m_std_bible_obj_lib_template:", ret)
    }

    return projDirs
}
BsnpRepositoryUser.prototype.getFullPath_usr_host = function (subpath) {
    return (!subpath) ? this.m_projDirs.user_dir : `${this.m_projDirs.user_dir}/${subpath.replace(/^[\/]/, "")}`
}
BsnpRepositoryUser.prototype.getFullPath_usr_main = function (subpath) {
    return (!subpath) ? this.m_projDirs.git_root : `${this.m_projDirs.git_root}/${subpath.replace(/^[\/]/, "")}`
}

BsnpRepositoryUser.prototype.getFullPath_usr_acct = function (subpath) {
    var fullpathname = (!subpath) ? this.m_projDirs.acct_dir : `${this.m_projDirs.acct_dir}/${subpath.replace(/^[\/]/, "")}`
    return fullpathname;
}
BsnpRepositoryUser.prototype.getFullPath_usr_myoj = function (subpath, bCopyIfNonexistance) {
    var fullpathname = (!subpath) ? this.m_projDirs.dest_myo : `${this.m_projDirs.dest_myo}/${subpath.replace(/^[\/]/, "")}`
    if (subpath && bCopyIfNonexistance) {
        var std = this.getFullPath_sys_stdlib_template(`/myoj/${subpath}`)
        console.log("bCopyIfNonexistance=true", std, fullpathname)
        this.getFullPath_usr__cp_std(std, fullpathname)
    }
    return fullpathname;
}
BsnpRepositoryUser.prototype.getFullPath_usr_dat = function (subpath, bCopyIfNonexistance) {
    var fullpathname = (!subpath) ? this.m_projDirs.dest_dat : `${this.m_projDirs.dest_dat}/${subpath.replace(/^[\/]/, "")}`
    if (subpath && bCopyIfNonexistance) {
        var std = this.getFullPath_sys_stdlib_template(`/dat/${subpath}`)
        console.log("bCopyIfNonexistance=true", std, fullpathname)
        this.getFullPath_usr__cp_std(std, fullpathname)
    }
    return fullpathname;
}
BsnpRepositoryUser.prototype.getFullPath_usr__cp_std = function (std, fullpathname) {
    console.log("getFullPath_usr__cp_std:", std, fullpathname)
    if (!fs.existsSync(fullpathname) && fs.existsSync(std)) { //dynamic copy one. 
        var acctDir = this.m_projDirs.acct_dir;//this.getFullPath_usr_acct()
        var ret = path.parse(fullpathname);
        var cp_template_cmd = `
            #!/bin/sh
            echo 'lll' | sudo -S mkdir -p ${ret.dir}
            echo 'lll' | sudo -S chmod -R 777 ${ret.dir}
            echo 'lll' | sudo -S cp  ${std}  ${fullpathname}
            echo 'lll' | sudo -S chmod -R 777 ${fullpathname}
            #cd -`
        var ret = BaseGUti.execSync_Cmd(cp_template_cmd).toString()
        console.log("getFullPath_usr_acct", cp_template_cmd, ret)
        return ret
    }
    return ""
}
BsnpRepositoryUser.prototype.getFullPath_sys_stdlib_template = function (subpath) {
    return (!subpath) ? this.m_std_bible_obj_lib_template : `${this.m_std_bible_obj_lib_template}/${subpath.replace(/^[\/]/, "")}`
}
BsnpRepositoryUser.prototype.getFullPath_usr_acct_file_StdChoice_IfNotExist = function (subpath, cbf) {
    var usrpfname = this.getFullPath_usr_acct(subpath)
    var stdpfname = this.getFullPath_sys_stdlib_template(subpath)
    if (!fs.existsSync(usrpfname)) {
        if (cbf) {
            return cbf(stdpfname, usrpfname) //usr make decision between the two. 
        } else {
            if (!fs.existsSync(stdpfname)) {
                console.log("*** std file not exist.", stdpfname)
            }
            return stdpfname;
        }
    }
    return usrpfname;
}

BsnpRepositoryUser.prototype.getFullPath_sys_stdlib_BibleObj = function (subpath) {
    var sysBibleObjPath = `${this.m_projDirs.root_sys}bible_obj_lib/jsdb/jsBibleObj`
    return (!subpath) ? sysBibleObjPath : `${sysBibleObjPath}/${subpath.replace(/^[\/]/, "")}`
}
BsnpRepositoryUser.prototype.getFullPath_sys_stdlib_BibleStruct = function (subpath) {
    var sysBibleObjPath = `${this.m_projDirs.root_sys}bible_obj_lib/jsdb/jsBibleStruct`
    return (!subpath) ? sysBibleObjPath : `${sysBibleObjPath}/${subpath.replace(/^[\/]/, "")}`
}
BsnpRepositoryUser.prototype.getFullPath_root_sys = function (subpath) {
    var sysBibleObjPath = `${this.m_projDirs.root_sys}`
    return (!subpath) ? sysBibleObjPath : `${sysBibleObjPath}${subpath.replace(/^[\/]/, "")}`
}










///bible doc applied. 

BsnpRepositoryUser.prototype.get_DocCode_Fname = function (DocCode) {
    if (!DocCode.match(/^e_/)) return "" //:like, e_Note
    //var fnam = DocCode.replace(/^e_/, "my")  //:myNode_json.js
    return `${DocCode}_json.js`
}
BsnpRepositoryUser.prototype.get_pfxname = function (DocCode, par) {
    var cbf = par ? (par.IfUsrFileNotExist ? par.IfUsrFileNotExist : null) : null
    //full path rw executable
    //var DocCode = inp.par.fnames[0]
    if (!DocCode) return ""
    var dest_pfname = "", subDir = ""
    switch (DocCode[0]) {
        case "_": //: _myNode,
        case "e": //: e_Node,
            {
                var fnam = DocCode
                if (!fnam.match(/_json\.js$/)) fnam += "_json.js"
                subDir = `/myoj/${fnam}`
                //dest_pfname = this.getFullPath_usr_myoj(`${fnam}`, cpyIfNonsistance)
                dest_pfname = this.getFullPath_usr_acct_file_StdChoice_IfNotExist(subDir, cbf)

            }
            break
        case ".": //-: ./dat/MostRecentVerses; //not used MyBiblicalDiary
            {
                var fnam = DocCode.slice(6)
                if (!fnam.match(/_json\.js$/)) fnam += "_json.js"
                subDir = `/dat/${fnam}`
                //dest_pfname = this.getFullPath_usr_dat(`${fnam}_json.js`, cpyIfNonsistance)
                dest_pfname = this.getFullPath_usr_acct_file_StdChoice_IfNotExist(subDir, cbf)
            }
            break;
        default: //: NIV, CUVS, NIV_Jw  
            dest_pfname = this.getFullPath_sys_stdlib_BibleObj(`${DocCode}.json.js`);
            break;
    }

    return dest_pfname
}
BsnpRepositoryUser.prototype.get_pfxname____________ = function (DocCode, cpyIfNonsistance) {
    //full path rw executable
    //var DocCode = inp.par.fnames[0]
    if (!DocCode) return ""
    var dest_pfname = ""
    switch (DocCode[0]) {
        case "_": //: _myNode,
        case "e": //: e_Node,
            {
                var fnam = this.get_DocCode_Fname(DocCode)
                subDir = `/myoj/${fnam}`
                dest_pfname = this.getFullPath_usr_myoj(`${fnam}`, cpyIfNonsistance)
            }
            break
        case ".": //-: ./dat/MostRecentVerses; //not used MyBiblicalDiary
            {
                var fnam = DocCode.slice(6)
                dest_pfname = this.getFullPath_usr_dat(`${fnam}_json.js`, cpyIfNonsistance)
            }
            break;
        default: //: NIV, CUVS, NIV_Jw  
            dest_pfname = this.getFullPath_sys_stdlib_BibleObj(`${DocCode}.json.js`);
            break;
    }



    return dest_pfname
}

//////////////////////////////////////////


BsnpRepositoryUser.prototype.Check_proj_state = function (cbf) {
    //if (!this.m_inp.out || !this.m_inp.out.state) return console.log("******Fatal Error.")
    var stat = {}; //this.m_inp.out.state
    var accdir = this.getFullPath_usr_main()
    if (!fs.existsSync(accdir)) {
        return { main_dir_not_exist: accdir };
    }
    var _THIS = this

    var fstat = {}
    var totalsize = 0
    var iAlertLevel = 0
    BaseGUti.GetFilesAryFromDir(accdir, true, function (fname) {
        if (fname.match(/\.git/)) return
        var ret = path.parse(fname);
        //console.log(fname, ret)
        if (ret.dir.match(/\.git$/)) return
        var ext = ret.ext
        var nam = ret.base.replace(accdir, "")
        //console.log("ret:",ret)
        var sta = fs.statSync(fname)
        totalsize += sta.size
        var fMB = (sta.size / 1000000).toFixed(2)
        var str = "" + fMB + "/100(MB)"
        if (sta.size < 1000) str = sta.size + "(B)"
        if (sta.size >= 1000 && sta.size < 1000 * 1000) str = (sta.size / 1000).toFixed(2) + "(KB)"
        if (sta.size >= 1000 * 1000 && sta.size < 1000 * 1000 * 1000) str = (sta.size / 1000 / 1000).toFixed(2) + "(MB)"

        if (fMB >= 80.0) { ////** Github: 100 MB per file, 1 GB per repo, svr:10GB
            iAlertLevel = 1
            str += "*"
        }
        if (fMB >= 90.0) { ////** Github: 100 MB per file, 1 GB per repo, svr:10GB
            iAlertLevel = 2
            str += "**"
        }

        var datname = fname.replace(accdir, "").slice(1)
        var str2 = datname
        if (datname.match(/_json.js/)) {
            var url = _THIS.m_RepoUsr.git_published_usr_account_myoj_url(datname)
            datname = datname.replace("_json.js", "").replace("account/", "")
            str2 = `<a href='${url}'>${datname}</a>`
        }
        fstat[str2] = str
    });

    stat.fstat = fstat
    stat.repo_usage = (totalsize / 1000000).toFixed(2) + "/1000(MB)"
    stat.repo_alertLevel = iAlertLevel

    //console.log("Check_proj_state ----------end")
    if (cbf) cbf()
    return stat
}


BsnpRepositoryUser.prototype.main_dir_write_salts = function (passcode, hintword) {
    var salts = JSON.stringify([passcode, hintword])
    var fname = this.getFullPath_usr_main(".salts")
    var ret = fs.writeFileSync(fname, salts, function (er) {
        console.log("write ret", er)
    })

    var fname = this.getFullPath_usr_main("index.htm")
    //var ret = fs.writeFileSync(fname, "making salts", function (er) {
        //console.log("write ret", er)
    //})

    console.log("write salts: ", fname, salts)
    return salts
}




BsnpRepositoryUser.prototype.Deploy_git_repo = function (sBranch) {
    console.log("********************************************* Deploy_git_repo  1")


    var dir = this.getFullPath_usr_main()
    if (sBranch && sBranch.length > 0) {
        dir = this.getFullPath_usr_acct()
    }

    var ret = this.git_clone(sBranch) //always sucess even passwd is wrong.

    if (fs.existsSync(dir)) {
        return this.git_pull(sBranch)
    }


    return ret
}


BsnpRepositoryUser.prototype.main_dir_remove = function () {

    var gitdir = this.getFullPath_usr_main()
    //var password = "lll" //dev mac
    var proj_destroy = `
      sudo -S rm -rf ${gitdir}
    `
    var ret = ""
    if (fs.existsSync(`${gitdir}`)) {
        ret = BaseGUti.execSync_Cmd(proj_destroy).toString()
    }
    //this.Session_delete()
    return ret
}














BsnpRepositoryUser.prototype.git_status = async function (_sb) {
    var inp = { out: {} }
    if (!inp.out.state) return console.log("*** Fatal Error: inp.out.state = null")

    if (undefined === _sb) _sb = ""
    var gitdir = this.getFullPath_usr_main("/.git/config")
    if (fs.existsSync(gitdir)) {
        /////// git status
        var git_status_cmd = `
        cd ${this.getFullPath_usr_main()}
        git status ${_sb}
        #git diff --ignore-space-at-eol -b -w --ignore-blank-lines --color-words=.`

        inp.out.git_status_res = BaseGUti.exec_Cmd(git_status_cmd).toString()
    }
}

/////







BsnpRepositoryUser.prototype.git_clone = function (branch) {
    //var password = "lll" //dev mac
    //var root_sys = this.getFullPath_root_sys()

    var clone_https = this.m_RepoUsr.git_repo_user_url_private(true)
    var bransh_option = `--branch ${branch}`
    var git_root = this.getFullPath_usr_acct()
    if (!branch) { //on master by default.
        bransh_option = ""
        git_root = this.getFullPath_usr_main()
    }

    var git_clone_cmd = `
    #!/bin/sh     
    # BsnpRepositoryUser.git_clone()
    if [ -d "${git_root}/.git" ]; then
        echo "${git_root} aleady exists."
        echo 'lll' | sudo -S chmod  777 ${git_root}
        sudo chown ubuntu:ubuntu -R ${git_root}
    else 
        echo "${git_root} does not exist, then git clone ${bransh_option} ${clone_https}  ${git_root}"
        sudo rm -rf ${git_root}
        echo "start-git-clone..."
        echo 'lll' | sudo -S GIT_TERMINAL_PROMPT=0 git clone ${bransh_option} ${clone_https}  ${git_root}
        sudo -S chmod 777 -R ${git_root}
        sudo chown ubuntu:ubuntu -R ${git_root}
    fi
    `
    var ret = BaseGUti.execSync_Cmd(git_clone_cmd).toString()
    console.log("git_clone_cmd:", git_root, ret)
    return ret
}

BsnpRepositoryUser.prototype.git_pull = function (branch) {
    var gitdir = this.getFullPath_usr_main()
    if (branch && branch.length > 0) {
        gitdir = this.getFullPath_usr_acct()
    }
    if (!fs.existsSync(gitdir)) {
        return `pull nonexistance:${gitdir}`
    }
    var cmd = `
    sudo mkdir -p ${gitdir}
    cd ${gitdir}
    pwd
    sudo chown ubuntu:ubuntu -R ${gitdir}
    sudo chmod 777 -R ${gitdir}
    sudo GIT_TERMINAL_PROMPT=0 git pull     #origin main
    #sudo git checkout main
    sudo chown ubuntu:ubuntu -R ${gitdir}
    sudo chmod 777 -R ${gitdir}
    git branch -a
    `
    var ret = BaseGUti.execSync_Cmd(cmd).toString()
    return ret
}

BsnpRepositoryUser.prototype.main_git_add_commit_push_Sync = function (bSync) {
    var _THIS = this
    var gitdir = this.getFullPath_usr_main()
    if (!fs.existsSync(gitdir)) {
        return console.log("gitdir not exists=" + gitdir);
    }
    //git remote set-url origin new.git.url/herefffff
    var repo_url = this.m_RepoUsr.git_repo_user_url_private(true)

    //password = "lll" //dev mac
    /* https://www.r-bloggers.com/2020/07/5-steps-to-change-github-default-branch-from-master-to-main/ */
    var command = `
    #!/bin/bash  ###git_add_commit_push_Sync
    set -x #echo on
    cd  ${gitdir}
    pwd
    echo 'lll'|  sudo -S git status
    echo 'lll'|  sudo -S git branch -a 
    echo 'lll'|  sudo -S git diff --ignore-space-at-eol -b -w --ignore-blank-lines --color-words=.
    echo 'lll'|  sudo -S git add *
    echo 'lll'|  sudo -S git commit -m 'do git_add_commit_push_Sync(${bSync}).'
    echo 'lll'|  sudo -S git remote set-url origin ${repo_url} 
    echo 'lll'|  sudo -S GIT_TERMINAL_PROMPT=0 git push
    echo 'lll'|  sudo -S git status
    echo 'lll'|  sudo -S git branch
    echo 'lll'|  sudo -S git status -sb
    `

    /****
     wdingpba$ git pull --all
Fetching origin
There is no tracking information for the current branch.
Please specify which branch you want to merge with.
See git-pull(1) for details.

    git pull <remote> <branch>

If you wish to set tracking information for this branch you can do so with:

    git branch --set-upstream-to=origin/<branch> master

    ******/
    if (bSync) {
        return BaseGUti.execSync_Cmd(command).split(/[\r|\n]/)
    }

    try {
        {
            exec(command, (err, stdout, stderr) => {
                console.log('\n-exec_Cmd errorr:')
                console.log(err)
                console.log('\n-exec_Cmd stderr:',)
                console.log(stderr)
                console.log('\n-exec_Cmd stdout:')
                console.log(stdout)
                console.log('\n-exec_Cmd end.')

            })
        };
    } catch (err) {
        console.log(err)
    }
}
BsnpRepositoryUser.prototype.git_add_commit_push_Sync_ = function (bSync) {
    var _THIS = this
    var gitdir = this.getFullPath_usr_main()
    if (!fs.existsSync(gitdir)) {
        return console.log("gitdir not exists=" + gitdir);
    }
    //git remote set-url origin new.git.url/herefffff
    var repo_url = this.m_RepoUsr.git_repo_user_url_private(true)

    //password = "lll" //dev mac
    /* https://www.r-bloggers.com/2020/07/5-steps-to-change-github-default-branch-from-master-to-main/ */
    var command = `
    #!/bin/bash  ###git_add_commit_push_Sync
    set -x #echo on
    cd  ${gitdir}
    pwd
    echo 'lll'|  sudo -S git status
    echo 'lll'|  sudo -S git branch
    echo 'lll'|  sudo -S git diff --ignore-space-at-eol -b -w --ignore-blank-lines --color-words=.
    echo 'lll'|  sudo -S git add *
    echo 'lll'|  sudo -S git commit -m 'do git_add_commit_push_Sync(${bSync}).'
    echo 'lll'|  sudo -S git remote set-url origin ${repo_url}
    echo 'lll'|  sudo -S GIT_TERMINAL_PROMPT=0 git push
    # echo 'lll'|  sudo -S git branch -M main default   # error: refname refs/heads/main not found, fatal: Branch rename failed
    echo 'lll'|  sudo -S git branch -M master main
    echo 'lll'|  sudo -S GIT_TERMINAL_PROMPT=0 git push origin HEAD:main
    echo 'lll'|  sudo -S GIT_TERMINAL_PROMPT=0 git push origin HEAD
    echo 'lll'|  sudo -S GIT_TERMINAL_PROMPT=0 git push origin HEAD:main
    echo 'lll'|  sudo -S GIT_TERMINAL_PROMPT=0 git push --set-upstream origin main
    echo 'lll'|  sudo -S git status
    echo 'lll'|  sudo -S git branch
    echo 'lll'|  sudo -S git status -sb
    `

    /****
     wdingpba$ git pull --all
Fetching origin
There is no tracking information for the current branch.
Please specify which branch you want to merge with.
See git-pull(1) for details.

    git pull <remote> <branch>

If you wish to set tracking information for this branch you can do so with:

    git branch --set-upstream-to=origin/<branch> master

    ******/
    if (bSync) {
        return BaseGUti.execSync_Cmd(command).split(/[\r|\n]/)
    }

    try {
        {
            exec(command, (err, stdout, stderr) => {
                console.log('\n-exec_Cmd errorr:')
                console.log(err)
                console.log('\n-exec_Cmd stderr:',)
                console.log(stderr)
                console.log('\n-exec_Cmd stdout:')
                console.log(stdout)
                console.log('\n-exec_Cmd end.')

            })
        };
    } catch (err) {
        console.log(err)
    }
}

BsnpRepositoryUser.prototype.git_add_commit_push_Sync = function (bSync) {
    var _THIS = this
    var gitdir = this.getFullPath_usr_main()
    if (!fs.existsSync(gitdir)) {
        return console.log("gitdir not exists=" + gitdir);
    }
    //git remote set-url origin new.git.url/herefffff
    var repo_url = this.m_RepoUsr.git_repo_user_url_private(true)

    //password = "lll" //dev mac
    /* https://www.r-bloggers.com/2020/07/5-steps-to-change-github-default-branch-from-master-to-main/ */
    var command = `
    #!/bin/bash  ###git_add_commit_push_Sync
    set -x #echo on
    cd  ${gitdir}
    pwd
    echo 'lll'|  sudo -S git status
    echo 'lll'|  sudo -S git branch
    echo 'lll'|  sudo -S git diff --ignore-space-at-eol -b -w --ignore-blank-lines --color-words=.
    echo 'lll'|  sudo -S git add *
    echo 'lll'|  sudo -S git commit -m 'do git_add_commit_push_Sync(${bSync}).'
    echo 'lll'|  sudo -S git remote set-url origin ${repo_url}
    echo 'lll'|  sudo -S GIT_TERMINAL_PROMPT=0 git push
    # echo 'lll'|  sudo -S git branch -M main default   # error: refname refs/heads/main not found, fatal: Branch rename failed
    echo 'lll'|  sudo -S git branch -M master main
    echo 'lll'|  sudo -S GIT_TERMINAL_PROMPT=0 git push origin HEAD:main
    echo 'lll'|  sudo -S GIT_TERMINAL_PROMPT=0 git push origin HEAD
    echo 'lll'|  sudo -S GIT_TERMINAL_PROMPT=0 git push origin HEAD:main
    echo 'lll'|  sudo -S GIT_TERMINAL_PROMPT=0 git push --set-upstream origin main
    echo 'lll'|  sudo -S git status
    echo 'lll'|  sudo -S git branch
    echo 'lll'|  sudo -S git status -sb
    `

    /****
     wdingpba$ git pull --all
Fetching origin
There is no tracking information for the current branch.
Please specify which branch you want to merge with.
See git-pull(1) for details.

    git pull <remote> <branch>

If you wish to set tracking information for this branch you can do so with:

    git branch --set-upstream-to=origin/<branch> master

    ******/
    if (bSync) {
        return BaseGUti.execSync_Cmd(command).split(/[\r|\n]/)
    }

    try {
        {
            exec(command, (err, stdout, stderr) => {
                console.log('\n-exec_Cmd errorr:')
                console.log(err)
                console.log('\n-exec_Cmd stderr:',)
                console.log(stderr)
                console.log('\n-exec_Cmd stdout:')
                console.log(stdout)
                console.log('\n-exec_Cmd end.')

            })
        };
    } catch (err) {
        console.log(err)
    }
}



BsnpRepositoryUser.prototype.chmod_R_777_acct = function (spath) {
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
BsnpRepositoryUser.prototype.chmod_R_ = function (mode, dir) {
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


BsnpRepositoryUser.prototype.git_push_test = function () {
    var tm = (new Date()).toString()
    console.log("tm=", tm)

    var gitdir = this.getFullPath_usr_main()
    if (!fs.existsSync(gitdir)) {
        return `nonexistance:${gitdir}`
    }

    var logname = "test.log"
    var cmd = `
    cd ${gitdir}
    echo lll | sudo -S  touch  ${logname}
    echo lll | sudo -S  chmod 777  ${logname}
    echo lll | sudo -S  echo '${tm}' > ${logname}
    echo lll | sudo -S  git add ${logname}
    echo lll | sudo -S  git commit -m '${logname}'
    echo lll | sudo -S  git push
    `
    var ret = this.main_execSync_cmd(cmd).toString()
    if (null !== ret) {
        console.log("\n*** test git push:", gitdir, ret)
        if (ret.match(/failed/i)) {
            if (!fs.existsSync(gitdir)) {
                console.log("*********** getFullPath_usr_main not exist.", gitdir)
                return null
            }
            ret = null
        }
    }

    return ret
}
BsnpRepositoryUser.prototype.main_execSync_cmd = function (gitcmd) {
    var _THIS = this

    if (!fs.existsSync(this.getFullPath_usr_main())) {
        return "NotExistGitDir=" + this.getFullPath_usr_main()
    }

    //console.log("proj", proj)
    //var password = "lll" //dev mac
    var scmd = `
    #!/bin/sh
    cd ${this.getFullPath_usr_main()}
    ${gitcmd}
    `
    //console.log("\n----git_cmd start:>", scmd)
    var res = BaseGUti.execSync_Cmd(scmd)
    //console.log("\n----git_cmd end.")

    return res
}
BsnpRepositoryUser.prototype.main_execSync_cmdar = function (subdir, cmdar) {
    var _THIS = this

    var sdir = this.getFullPath_usr_main(subdir)
    if (!fs.existsSync(sdir)) {
        return "NotExistGitDir=" + sdir
    }

    var ret = []
    cmdar.forEach(function (scmd, i) {
        var cmd = `
        #!/bin/sh
        cd ${sdir}
        ${scmd}
        `
        ret.push(BaseGUti.execSync_Cmd(cmd))
    })
    return ret;
}






module.exports = {
    BaseGUti: BaseGUti,
    BsnpRepositoryUser: BsnpRepositoryUser
}