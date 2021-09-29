var Utilib = {

    copyTextToClipboard_____: function (text) {
        var textArea = document.createElement("textarea");

        //
        // *** This styling is an extra step which is likely not required. ***
        //
        // Why is it here? To ensure:
        // 1. the element is able to have focus and selection.
        // 2. if the element was to flash render it has minimal visual impact.
        // 3. less flakyness with selection and copying which **might** occur if
        //    the textarea element is not visible.
        //
        // The likelihood is the element won't even render, not even a
        // flash, so some of these are just precautions. However in
        // Internet Explorer the element is visible whilst the popup
        // box asking the user for permission for the web page to
        // copy to the clipboard.
        //

        // Place in the top-left corner of screen regardless of scroll position.
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textArea.style.width = '2em';
        textArea.style.height = '2em';

        // We don't need padding, reducing the size if it does flash render.
        textArea.style.padding = 0;

        // Clean up any borders.
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';

        // Avoid flash of the white box if rendered for any reason.
        textArea.style.background = 'transparent';


        textArea.value = text;

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
            Uti.Msg('Copying text command was ' + msg)
        } catch (err) {
            console.log('Oops, unable to copy');
            Uti.Msg('Oops, unable to copy')
        }

        document.body.removeChild(textArea);

    },
}



var Uti = {
    Msg_Idx: 0,
    Msg: function (...args) {
        var str = ""
        args.forEach(function (dat) {
            if ("object" === typeof dat) {
                str += JSON.stringify(dat, null, 4);
            } else {
                str += dat
            }
            str += " "
        })


        var oldtxt = $("#txtarea").val().substr(0, 7000)
        var results = `[${Uti.Msg_Idx++}]\n${str}\n\n\n` + oldtxt

        $("#txtarea").show().val(results);
    },
    set_menuContainer_color: function (ret) {
        $("#menuContainer, #passcode, #repopath").removeClass("menuContainer_red").removeClass("menuContainer_yellow").removeClass("menuContainer_green")
        if (ret.out.state) {
            if (ret.out.state.bEditable <= 0) {
                $("#menuContainer, #repopath").addClass("menuContainer_red")
                alert("Config tag | Repository Invalid. \n- Editing will not work. \n- Try to go home to login again.")
            } else {
                if (ret.out.state.bRepositable <= 0) {
                    $("#menuContainer, #passcode").addClass("menuContainer_yellow")
                } else {
                    $("#menuContainer").addClass("menuContainer_green")
                }
            }
        } else {
            $("#menuContainer, #repopath").addClass("menuContainer_red")
        }
    },
    show_save_results: function (ret, eid) {
        Uti.Msg("ret.out.save_res:", ret.out.save_res);//,null, 4))
        var msg = "failed to save.", clr = "red"
        if (ret.out.save_res && ret.out.save_res.desc) {
            clr = "lightgreen", msg = `wrote:${ret.out.save_res.desc}(B)`
        }
        var sta = ret.out.state
        if (sta) {
            var colr1 = (sta && 1 === sta.bRepositable) ? "lightgreen" : "yellow"
            var msg1 = `bRepositable:${sta.bRepositable}`
            var colr2 = (sta && 1 === sta.bRepositable) ? "lightgreen" : "yellow"
            var msg2 = `bRepositable:${sta.bRepositable}`
            var desc = ret.out.save_res.desc

            $(eid).html(`<font color='${colr1}'>${msg1}</font>, <font color='${colr2}'>${msg2}</font>, <br><a>${desc}</a>`)
        } else {
            $(eid).html(`<font color='red'>Failed: Invalid Repository</font>`)
        }
    },

    visual_check_repository: function (eid) {
        $(eid).on("click", function () {
            var repopath = $("#repopath").val()
            var reob = Uti.validate_repository_url(repopath)
            if (!reob) return alert("empty")
            if (reob.format === 2) {
                $("#repopath").val(reob.user_repo)
            }
            if (reob.format === 1) {
                $("#repopath").val(reob.full_path)
            }
            var ar = ["", "https-url", "user-repos"]
            $(this).text("Format:" + ar[reob.format])
            $("#SignOut_repopathname").text(reob.repo)
        })
    },
    validate_repository_url: function (repoath) {
        repoath = repoath.trim()
        if (!repoath || repoath.length === 0) return alert("repopath is not defined.")
        var mat = repoath.match(/^https\:\/\/github\.com[\/](([^\/]*)[\/]([^\.]*))[\.]git$/)
        if (mat) {
            return repopath
        }

        var mat = repoath.match(/^https\:\/\/([^\@]+)[\@]bitbucket[\.]org[\/](([^\/]*)[\/]([^\.]*))[\.]git$/)
        if (mat) {
            return repopath
        }
        alert("repository path not recognized.")
        return repopath
    },
    addonTopOfAry: function (targetary, addon) {
        var ary = addon
        if ("string" === typeof addon) {
            ary = [addon]
        }
        for (var i = 0; i < ary.length; i++) {
            var idx = targetary.indexOf(ary[i])
            if (idx >= 0) targetary.splice(idx, 1) //remove at idx, size=1
            targetary.unshift(ary[i]);//on top
        }
        //targetary = targetary.slice(0, 100) //:max len 100. fetch idx range [0, 100].
    },

    parse_bcvOj2strlst: function (sbcv) {
        if ("object" === typeof (sbcv)) {
            var ar = []
            Object.keys(sbcv).forEach(function (bkc) {
                //ar.push(bkc)
                Object.keys(sbcv[bkc]).forEach(function (chp) {
                    //ar.push(chp)
                    Object.keys(sbcv[bkc][chp]).forEach(function (vrs) {
                        var sbcv = `${bkc}${chp}:${vrs}`
                        ar.push(sbcv)
                    })
                })
            })
            return ar
        }
        return null
    },
    parse_bcv: function (sbcv, txt, outOj) {
        if (!sbcv) return null
        if ("object" === typeof (sbcv)) {
            return this.parse_bcvOj2strlst(sbcv)
        }

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
            console.log("not a std bcv:", sbcv)
            return null
        }
        ///////validation for std bcv.
        var err = ""
        if (undefined === _Max_struct[ret.vol]) {
            err = `bkc not exist: ${ret.vol}`
        } else if (undefined === _Max_struct[ret.vol][ret.chp]) {
            err = `chp not exist: ${ret.chp}`
        } else if (undefined === _Max_struct[ret.vol][ret.chp][ret.vrs]) {
            err = `vrs not exist: ${ret.vrs}`
        }
        if (err.length > 0) {
            Uti.Msg("bcv parse err=", err)
            return null
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
        if (outOj) {
            if (!outOj[ret.vol]) outOj[ret.vol] = {}
            if (!outOj[ret.vol][ret.chp]) outOj[ret.vol][ret.chp] = {}
            outOj[ret.vol][ret.chp][ret.vrs] = txt
        }

        ret.bcvObj = obj
        ret.getxt4outOj = function (outOj, trn) {
            if (!trn) {
                return outOj[this.vol][this.chp][this.vrs]
            } else {
                return outOj[this.vol][this.chp][this.vrs][trn]
            }
        }

        return ret;
    },
    htmlDecode: function (value) {
        var txthm = $(`<textarea>${value}</textarea>`).text();
        var t2 = $("<textarea/>").html(value).text();//same
        return txthm;
    },

    htmlEncode: function (value) {
        return $('<textarea/>').text(value).html();
    },
    BCV_RegPat: "([1-3A-Z][a-zA-Z][a-z][0-9]+[\:][0-9]+)",
    convert_std_bcv_in_text_To_linked: function (str) {
        //Uti.Msg(str)
        str = this.convert_std_bcv_in_text_To_unlinked(str)

        var reg = new RegExp(this.BCV_RegPat, "g")
        str = str.replace(reg, '<a href="#$1">$1</a>')
        //Uti.Msg(str)
        return str

        var ret = Uti.convert_std_bcv_str_To_uniq_biblicalseq_splitted_ary(str)
        ret.biblical_order_splitted_ary.forEach(function (v, i) {
            var sln = `$1<a href='#${v}'>${v}</a>`
            var reg = new RegExp(`[^\>\#\;]${v}`, "g") //issue: in <div>Gen1:1</div>
            reg = new RegExp(`(?:(?![v][\>]))${v}`, "g")  // negative lookahead =(?!regex here).
            reg = new RegExp(`(?:(?![v][\>]))${v}`, "g")  // (?: # begin non-capturing group
            reg = new RegExp(`(?:(?!([\"\'][\>])([\"\'][\#])))${v}`, "g")  // (?: # begin non-capturing group
            //reg = new RegExp(`(?:(?![\'][\#]))${v}`, "g")  // (?: # begin non-capturing group
            //reg = new RegExp(`(?:(?![\'][\#])(?![\'][\>]))${v}`, "g") 
            reg = new RegExp(`(?:([^\>\#\;]))(${v})`, "g")  //bug: div>Gen1:1 
            reg = new RegExp(`(?:((div[>])|(.[^\>\#\;])))(${v})`, "g")  //bug: div>Gen1:1 
            reg = new RegExp(`(([\"\']\s{0,}[\>]\s{0,}){0,}|([^\>\#]))(${v})`, "g")  //seems fix bug: div>Gen1:1 
            reg = new RegExp(`([^\>\#])${v}|^${v}`, "g")  //fixed for crossRef
            //reg = new RegExp(`${v}(?:((?!([\<][\/]a[\>])(?!([\"\'])))`, "g") 
            //reg = new RegExp(`(?:(?!(${sln}))`, "g")  
            str = str.replace(reg, sln)
        })
        Uti.Msg(str)
        return str
    },
    convert_std_bcv_in_text_To_unlinked: function (str) {
        //Uti.Msg(str)
        //<a href="#3Jn1:3">3Jn1:3</a> 
        //Note:  \\1  =>regex backreferences
        var reg = new RegExp("<a href=[\"\'][\#]" + this.BCV_RegPat + "[\"\']>\\1<[\/]a>", "g")
        str = str.replace(reg, "$1")

        //Uti.Msg(str)
        return str
    },
    convert_std_uniq_biblicalseq_splitted_ary_To_dashed_strn: function (ary) {
        var str = ary.join(", ")
        var ret = Uti.convert_std_bcv_str_To_uniq_biblicalseq_splitted_ary(str)
        var ary = ret.biblical_order_splitted_ary
        ary.push("")

        //biblical-sort
        //consectives are compressed to dash. Gen1:1,Gen1:2,Gen1:3 ==>> Gen1:1-Gen1:3
        var dashary = []
        for (var i = 0; i < ary.length; i++) {
            var bcv = ary[i]
            var ret = Uti.parse_bcv(bcv)

            var iStart = i, ilastConsective = -1
            for (++i; i <= ary.length - 1; i++) {
                var nextbcv = ary[i]
                var next = Uti.parse_bcv(nextbcv)
                if (!next) {
                    --i;
                    break
                }
                if (1 + parseInt(ret.vrs) === parseInt(next.vrs) && ret.chp === next.chp && ret.vol === next.vol) {
                    ilastConsective = i
                    ret = next
                } else {
                    --i;//restore back.
                    break
                }
            }
            if (ilastConsective > 0) {
                dashary.push(ary[iStart] + "-" + ary[ilastConsective])
                ilastConsective = -1
            } else {
                dashary.push(ary[iStart])
            }
        }

        return dashary.join(", ")
    },
    convert_std_bcv_str_To_uniq_biblicalseq_splitted_ary: function (str) {
        function _check_std_bcv(str) {
            var regexp = new RegExp(/(\w{3}\s{0,}\d+\:\d+)/g)
            var regexp = new RegExp(/(\w{3}\s{0,}\d+\:\d+)\-(\w{3}\s{0,}\d+\:\d+)|(\w{3}\s{0,}\d+\:\d+)/g)
            // Genesis 1:2
            var regexp = new RegExp(/((\w{3}\s*\d+\:\d+)\-(\w{3}\s*\d+\:\d+))|(\w{3}\s*\d+\:\d+)/g)
            var pad3 = []
            var mat = str.match(regexp)
            if (mat) {
                //console.log(mat)
                Uti.Msg(mat)
                for (var i = 0; i < mat.length; i++) {
                    var bcvStr = mat[i].trim()
                    var ar2 = bcvStr.split("-"); //case 'Gen1:1-Gen1:12'
                    var hdbcv = ar2[0].trim()
                    var ret = Uti.parse_bcv(hdbcv, "")
                    if (ret) {
                        var fixedbcv = ret.pad3.bcv
                        if (ar2.length >= 2) fixedbcv += "-" + ar2[1]
                        if (pad3.indexOf(fixedbcv) < 0) {
                            pad3.push(fixedbcv)
                        }
                    }
                }
            } else {
                Uti.Msg("not find")
            }
            return { std: mat, pad3: pad3 }
        }
        function _biblicalOrder(bcvList) {
            bcvList.sort()
            var ar = []
            Object.keys(_Max_struct).forEach(function (bkn) {
                bcvList.forEach(function (bcv) {
                    if (bcv.indexOf(bkn) === 0) {
                        var ar2 = bcv.split("-")
                        var hdbcv = ar2[0].trim()
                        var ret = Uti.parse_bcv(hdbcv, "")
                        var stdbcv = ret.std_bcv
                        if (ar2.length >= 2) stdbcv += "-" + ar2[1]
                        ar.push(stdbcv)
                    }
                })
            })
            return ar
        }
        function get_Max_struct_stdbcv_ary() {
            var ar = []
            for (const [bkc, chpObj] of Object.entries(_Max_struct)) {
                for (const [chp, vrsObj] of Object.entries(chpObj)) {
                    for (const [vrs, txt] of Object.entries(vrsObj)) {
                        var stdbcv = `${bkc}${chp}:${vrs}`
                        ar.push(stdbcv)
                    }
                }
            }
            return ar
        }
        function _dash2ary(stdbcv) {
            var retary = []
            var ar2 = stdbcv.split("-")
            var stdbcv = ar2[0].trim()
            if (ar2.length === 1) {
                retary.push(stdbcv)
            } else {
                var end_bcv = ar2[1].trim()


            }
            return retary
        }
        function _deplore_dash(stdbcvAry) {
            var ar = []
            stdbcvAry.forEach(function (stdbcv) {
                var ar2 = stdbcv.split("-")
                var stdbcv = ar2[0].trim()
                if (ar2.length === 1) {
                    ar.push(stdbcv)
                } else {
                    var endbcv = ar2[1].trim()
                    var maxary = get_Max_struct_stdbcv_ary()
                    var indx0 = maxary.indexOf(stdbcv)
                    var indx1 = maxary.indexOf(endbcv)
                    var ary = maxary.slice(indx0, indx1 + 1)
                    ary.forEach(function (bcv) {
                        ar.push(bcv)
                    })
                }
            })
            return ar
        }

        //_Max_struct
        //std case1: "Gen23:7, Gen23:5, 1Sa26:6, Gen25:10, Gen49:30, Gen27:46, Gen10:15, 2Sa23:39" (Gen23:3 e_CrossRef)
        //std case2: "Gen1:3-Gen23:9, Gen23:5"
        //var hdry = _get_list(str)
        var ret = _check_std_bcv(str)
        ret.biblical_order_dash_ary = _biblicalOrder(ret.pad3)
        ret.biblical_order_splitted_ary = _deplore_dash(ret.biblical_order_dash_ary)
        return ret
    },


    open_child_window: function (htm_fname, cbf) {
        const urlParams = new URLSearchParams(window.location.search);
        ip = urlParams.get('ip');
        var parm = (ip) ? `ip=${ip}` : ""
        window.open(`./${htm_fname}?${parm}`)

        window.addEventListener('message', function (e) {
            var key = e.message ? 'message' : 'data';
            var data = e[key];
            //run function//
            console.log("rev fr Child window.opener.", data)
            //MyStorage.Repositories().add(data)
            if (cbf) cbf(data)
        }, false);
    },


    after_page_transit_load_allusrs_bcv: function (cbf) {

        var myNotes = localStorage.getItem("myNote")

        Jsonpster.inp = JSON.parse(myNotes).inp
        Jsonpster.api = RestApi.ApiBibleObj_read_crossnetwork_BkcChpVrs_txt
        console.log("Jsonpster:", Jsonpster.inp)
        Jsonpster.RunAjaxPost_Signed(function (ret) {
            console.log("ret", ret)
            if (cbf) cbf(ret)
        })
    },


    Jsonpster_crossloader_get_ip: function (ip) {
        if (!ip) {
            //get ip from url param. ?ip=0.0.0.0:7778
            const urlParams = new URLSearchParams(window.location.search);
            var ip = urlParams.get('ip');
            if (!ip) {
                //use self ip.
                ip = window.location.host
            }
            if (!ip) {
                //use self ip.
                ip = window.location.hostname
            }
            if (!ip) {
                return alert("not localhost or missed in url with ?ip=x.x.x.x")
            }
            if ("undefined" === ip) {
                return alert("not localhost or missed in url with ?ip=undefined")
            }

            if (ip.indexOf(":") < 0) return alert(ip += ":7778 ---missed port")

            if (ip.indexOf("http") < 0) {
                if (ip.indexOf("7778") > 0) {//ssl
                    ip = `http://${ip}`;
                } else {
                    ip = `https://${ip}`;
                }
            }



            //other param form url param ?inp=0.0.0.0:778&#Gen2:7
            var idx = window.location.href.indexOf("#") //case: ?ip=1.1.1.1#Gen1:1
            var bcv = ""
            if (idx >= 0) {
                //ip = window.location.href.substr(0, idx)
                bcv = window.location.href.substr(1 + idx)
                window.m_bcv = bcv
            }
            console.log("ip,pcv:", ip, bcv)
        }

        if ("undefined" != typeof RestApi) {
            console.log("Jsonpster is already loaded. Ignore", ip)
        }

        return ip
    },
    Jsonpster_crossloader: function (idx, cbf) {
        var svrip = this.Jsonpster_crossloader_get_ip()
        var svrurl = Uti.Jsonpster_crossloader_get_ip()

        var api = new BsnpRestApi()

        //if (0 === idx) {//initial-sign-in-page-loading only
        //var tuid = MyStorage.GenCUID()
        svrurl += `/Jsonpster?inp=`;
        //SSID will be ready after sign-in success.
        //}

        var e = document.createElement("script");
        e.src = svrurl
        document.body.appendChild(e);


        var tiid = setInterval(function () {
            console.log("wait for Jsonpster")
            if ("undefined" !== typeof Jsonpster) {
                clearInterval(tiid)
                if (0 === idx) {//signin page loaded.

                }
                else if (idx > 0) {//1:main-page loaded  after transit from signin-page.
                    console.log("crossload-2:SSID=", MyStorage.SSID())
                    Jsonpster.inp.usr = null
                    Jsonpster.inp.SSID = MyStorage.SSID() //first time for new page. to load AjxPOST
                }

                if (1 === idx) {
                    //only works with ui in main-page.
                    Jsonpster.onBeforeRun = function () {
                        var uiv = MyStorage.Repositories().repos_app_update().repodesc
                        var ttl = MyStorage.cacheTTL("#")//from ui.
                        Jsonpster.inp.aux = { Update_repodesc: uiv, cacheTTL: ttl }
                    }
                }
                if (2 === idx) {
                    Jsonpster.onBeforeRun = function () {
                        var uiv = $("#repodesc").val();//MyStorage.Repositories().repos_store_get().repodesc
                        var ttl = MyStorage.cacheTTL() //from localStorage
                        Jsonpster.inp.aux = { Update_repodesc: uiv, cacheTTL: ttl }
                    }
                }
                if (3 === idx) {//for crossnet search
                    Jsonpster.onBeforeRun = function () {
                        var uiv = $("#Search_repodesc").val();//MyStorage.Repositories().repos_store_get().repodesc
                        var ttl = MyStorage.cacheTTL() //from localStorage
                        Jsonpster.inp.aux = { Search_repodesc: uiv, cacheTTL: ttl }
                    }
                }

                if (cbf) cbf()
            }
        }, 10)
    },


    copy2clipboard: function (text, ele) {
        //return this.copyTextToClipboard(text)
        $("#txt_copy2clicpboard").val(text).select().focus();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
            Uti.Msg('Copying text command was ' + msg)
        } catch (err) {
            console.log('Oops, unable to copy');
            Uti.Msg('Oops, unable to copy')
        }
        $("#txt_copy2clicpboard").blur()
        $("body").focus()
        return
    },
    jq_post: function () {
        $.post(Jsonpster.getUrl(),
            {
                name: "Donald Duck",
                city: "Duckburg"
            },
            function (data, status) {
                alert("Data: " + data + "\nStatus: " + status);
            });
    }


};////  Uti
////////////////////////////////////
