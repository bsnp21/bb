
var MyStorage = {
    init: function (cbf) {
        if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            localStorage.setItem("test", [1, 2])
            var ar = localStorage.getItem("test")
            console.log("Storage test: ", ar)



            var selidsary = ["#LanguageSel"]
            for (var i = 0; i < selidsary.length; i++) {
                var eid = selidsary[i]
                this.get_select_val(eid)
            }

            this.MostRecentSearchStrn = this.MostRecentAryInStore("MostRecentSearchStrn")



            $("#cacheTTL").val(MyStorage.cacheTTL())



        } else {
            // Sorry! No Web Storage support..
            alert("Sorry, your browser does not support Web Storage...")
        }
    },
    Repo_save: function (cbf) {
        //localStorage.getItem("#MemoryVerse")
        var stores = MyStorage.MostRecentAryInStore("#MemoryVerse")
        var ary = stores.get_ary()

        var txt = JSON.stringify({ "#MemoryVerse": ary }, null, 4)
        console.log(txt)




        Jsonpster.inp.par = { fnames: ["./dat/localStorage"], data: txt }
        Jsonpster.api = RestApi.ApiUsrDat_save
        Uti.Msg("Repo_save:", Jsonpster)
        Jsonpster.RunAjaxPost_Signed(function (ret) {
            cbf(ret)
        })
    },
    Repo_load: function (cbf) {
        if (!Jsonpster.inp.SSID) {//: initial load once for all.
            Jsonpster.inp.SSID = MyStorage.SSID()
            Jsonpster.inp.usr = null
        }
        if (!Jsonpster.inp.SSID) return alert("inp.ssid is not set yet:" + Jsonpster.inp.SSID)


        var txt = JSON.stringify(localStorage, null, 4)
        console.log(txt)
        Jsonpster.inp.par = { fnames: ["./dat/localStorage"] }

        Jsonpster.api = RestApi.ApiUsrDat_load
        Jsonpster.RunAjaxPost_Signed(function (ret) {
            if (cbf) cbf(ret)
        })
    },
    GenCUID: function () {
        const sTUID = "CUID" //timebased user id.
        var uid = localStorage.getItem(sTUID)
        if (!uid || uid.length < 10) {
            uid = sTUID + (new Date()).getTime()
            uid += Math.random()
            localStorage.setItem(sTUID, uid)
        }
        return uid
    },
    SSID: function (ssid) {
        const sessId = "SSID"
        if (undefined === ssid) {
            var ret = localStorage.getItem(sessId)
            if (!ret) return alert("Invalid SessionID. \n- Please sign out/in again.")
            return ret
        } else {
            localStorage.setItem(sessId, ssid)
        }
    },

    Repositories: function () {
        function StoreRepositorie() {
            this.m_storeid = "repositories"
        }

        StoreRepositorie.prototype.repos_store_get = function () {
            var ar = localStorage.getItem(this.m_storeid);
            if (!ar || ar.length === 0) {
                ar = [{ repopath: "https://github.com/bsnp21/pub_test.git", passcode: "pub_test" }]
            } else {
                ar = JSON.parse(ar)
            }
            return ar
        }
        StoreRepositorie.prototype.repos_store_set = function (obj) {
            var ar = this.repos_store_get()
            if (!obj.repopath) {
                return ar;
            }
            for (var i = 0; i < ar.length; i++) {
                if (obj.repopath === ar[i].repopath) {
                    ar.splice(i, 1) //:remove it.
                }
            }
            ar.unshift(obj) //addto head.
            //Uti.Msg("Repository:set=", ar)
            var str = JSON.stringify(ar)
            localStorage.setItem(this.m_storeid, str)
            return ar
        }
        StoreRepositorie.prototype.repos_store_del = function (obj) {
            var ar = this.repos_store_get()
            for (var i = 0; i < ar.length; i++) {
                if (ar[i].repopath === obj.repopath) {
                    ar.splice(i, 1)
                }
            }
            var str = JSON.stringify(ar)
            localStorage.setItem(this.m_storeid, str)
        }

        StoreRepositorie.prototype.repos_app_set = function (obj) {
            $("#repopath").val(obj.repopath)
            $("#passcode").val(obj.passcode)
            $("#repodesc").val(obj.repodesc)
            var reob = Uti.validate_repository_url(obj.repopath)
            if (!reob) {
                $("#SignOut_repopathname").text("ErrorRepo")
                return
            }
            $("#SignOut_repopathname").text(reob.repo)

            obj.repopath = reob.full_path

            var ar = this.repos_store_set(obj)
            return ar
        }
        StoreRepositorie.prototype.repos_app_update = function () {
            var obj = { repopath: $("#repopath").val(), passcode: $("#passcode").val(), repodesc: $("#repodesc").val() }
            var ar = this.repos_app_set(obj)
            return ar[0]
        }
        StoreRepositorie.prototype.repos_app_init = function () {
            var ar = this.repos_store_get()
            this.repos_app_set(ar[0])
            return ar
        }


        var storeRepo = new StoreRepositorie()
        return storeRepo
    },



    MostRecentAryInStore: function (sid) {
        var MostRecentAry = function (sid) {
            this.m_sid = sid
        }
        MostRecentAry.prototype.get_ary = function () {
            var ar = localStorage.getItem(this.m_sid)
            if (!ar || ar.length === 0) {
                ar = []
            } else {
                ar = JSON.parse(ar)
            }
            return ar
        }
        MostRecentAry.prototype.cleanup = function () {
            var ar = localStorage.setItem(this.m_sid, "")
        }
        MostRecentAry.prototype.set_ary = function (ary) {
            var s = ""
            if (ary && ary.length > 0) {
                s = JSON.stringify(ary)
            }
            var ar = localStorage.setItem(this.m_sid, s)
        }
        MostRecentAry.prototype.addonTop = function (strn) {
            if (!strn) return
            var ar = this.get_ary()
            if (!ar) {
                ar = [strn]
            } else {
                Uti.addonTopOfAry(ar, strn)
            }
            localStorage.setItem(this.m_sid, JSON.stringify(ar))
            return ar;
        }
        MostRecentAry.prototype.gen_history_table = function (elid, cbf_click) {
            var trs = ""
            var ar = this.get_ary(), idx = 0
            ar.forEach(function (strn) {
                if (strn.trim().length > 0) {
                    trs += (`<tr><td class='idx'>${++idx}</td><td class='option'>${strn}</td></tr>`);
                }
            })

            //history
            //console.log(ret);
            var stb = `<table border='1'><caption>MostRecentHistory</caption>${trs}</table>`
            $(elid).html(stb)
            $(elid).find(".option").bind("click", function () {
                $(elid).find(".hili").removeClass("hili")
                $(this).addClass("hili");
                var s = $(this).text().trim();
                if (cbf_click) cbf_click(s)
            });
            $(elid).find(".idx").bind("click", function () {
                var tx = $(this).next().toggleClass("deleteItem").text();

            });
        }
        return new MostRecentAry(sid)
    },
    ////--------


    clear: function () {
        var Ignory = ["repositories", "#MemoryVerse", "SSID"]
        Object.keys(localStorage).forEach(function (key) {
            console.log(key)
            if (Ignory.indexOf(key) < 0) {
                delete localStorage[key]
            }
        })
    },

    LastSelectedDocsList: function (v) {
        const uid = "SelectedDocsList"
        if (undefined === v) {
            var ar = localStorage.getItem(uid);
            if (!ar || ar.length === 0) {
                ar = ["NIV", "e_Note"]
            } else {
                ar = ar.split(",")
            }
            return ar
        } else {
            if ("string" === v) {
                return alert("SelectedDocsList must be an array", v)
            }
            localStorage.setItem(uid, v)
        }
    },

    LastSearchInDocument: function (v) {
        const uid = "MostRecentSearchFile"
        if (undefined === v) {
            v = localStorage.getItem(uid);
            if (!v || v.length === 0) v = "NIV"
            return v
        } else {
            if (v.length === 0) return "NIV"
            //$("#SearchInCaption").text(v)
            localStorage.setItem(uid, v)
        }
    },
    ////-----



    FontSize: function (v) {
        if (undefined === v) {
            v = parseInt(localStorage.getItem("FontSize"));
            if (!v || !Number.isInteger(v) || v.length === 0) return 16
            return (v < 6) ? 6 : v
        } else {
            if (parseInt(v) < 6) v = 6
            localStorage.setItem("FontSize", v)
        }
    },
    cacheTTL: function (v) {
        const defaultVal = 3600
        if ("#" === v) {
            v = $("#cacheTTL").val()
            return v
        }
        if ("on" === v) {
            $("#cacheTTL").on("click, change", function () {
                var v = $(this).val()

            })
        }
        if (undefined === v) {
            v = parseInt(localStorage.getItem("cacheTTL"));
            if (!v || !Number.isInteger(v) || v.length === 0 || v < 1) return defaultVal
            return v
        } else {
            v = parseInt(v)
            if (!Number.isInteger(v)) return alert(`not Number.isInteger(${v})`)
            if (v < 1) v = defaultVal
            localStorage.setItem("cacheTTL", v)
        }
    },


    setCustomCatAry: function (obj) {
        if (!obj) {
            localStorage.setItem("CustomCatAry", "")
        } else {
            localStorage.setItem("CustomCatAry", JSON.stringify(obj))
        }
        CNST.Cat2VolArr.Custom = obj
    },
    getCustomCatAry: function () {
        var ar = localStorage.getItem("CustomCatAry")
        if (!ar || ar.length === 0) {
            ar = []
        } else {
            ar = JSON.parse(ar)
        }
        CNST.Cat2VolArr.Custom = ar
        return ar
    },


    get_select_val: function (eid) {
        if (!eid || eid[0] !== "#") return "eid incorrent format."
        var v = localStorage.getItem(eid)
        if (null === v) v = $(eid).attr("default_val")
        if (null === v || undefined === v) return alert(eid + " is not set. err.")
        $(eid).val(v);
        $(eid).change(function () {
            var val = $(this).val()
            localStorage.setItem(eid, val)
            var txt = $(this).find(`option[value='${val}']`).text()
            Uti.Msg(`on change ${eid}:`, val, ":", txt)
        })
        return v
    },



}










