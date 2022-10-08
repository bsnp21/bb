
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
            $("#cacheTTL").bind("click change keyup blur", function () {
                var v = $(this).val()
                var size = parseInt($(this).attr("maxlength"))
                if (v.length >= size) {
                    v = v.substr(0, size)
                    $(this).val(v)
                }
                MyStorage.cacheTTL(v)
            })



        } else {
            // Sorry! No Web Storage support..
            alert("Sorry, your browser does not support Web Storage...")
        }
    },
    Repo_save: function (cbf) {
        //localStorage.getItem("#MemoryVerse")
        var stores = MyStorage.MrObjInStore("#MemoryVerse")
        var obj = stores.get_obj()

        if (!confirm(Object.keys(obj).length + " items will be saved in svr\nAre you sure?")) return;

        var txt = JSON.stringify({ "#MemoryVerse": obj }, null, 4)
        console.log(txt)

        var api = new BsnpRestApi()
        api.run(RestApi.ApiUsrDat_save,
            {
                fnames: ["./dat/localStorage"],
                data: txt
            },
            function (ret) {
                cbf(ret)
            })

        return
    },
    Repo_load: function (cbf) {
        var api = new BsnpRestApi()
        api.run(RestApi.ApiUsrDat_load,
            {
                fnames: ["./dat/localStorage"]
            },
            function (ret) {
                if (cbf) cbf(ret)
            })
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
            var dt = (new Date).toISOString()
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

    MrObjInStore: function (sid) {
        var MostRecentAry = function (sid) {
            this.m_sid = "Mr" + sid
        }
        MostRecentAry.prototype.get_obj = function () {
            var ar = localStorage.getItem(this.m_sid)
            if (!ar) {
                ar = {}
            } else {
                ar = JSON.parse(ar)
            }
            return ar
        }
        MostRecentAry.prototype.cleanup = function () {
            var ar = localStorage.setItem(this.m_sid, "")
        }
        MostRecentAry.prototype.set_obj = function (obj) {
            var s = ""
            if (obj) {
                s = JSON.stringify(obj)
            }
            var ar = localStorage.setItem(this.m_sid, s)
        }
        MostRecentAry.prototype.add_key_val = function (key, val) {
            if (!key) return
            var obj = this.get_obj()
            if (null === val) {
                if (key in obj) delete obj[key]
                return obj
            }
            if ("yymmdd" === val) val = (new Date).toISOString()
            obj[key] = val
            localStorage.setItem(this.m_sid, JSON.stringify(obj))
            return obj;
        }
        MostRecentAry.prototype.gen_obj_table = function (tid2, cbf_click) {
            var trs = `<table border='1' id='${tid2}'><tr class='trRecentBCV'><th>#</th><th>verse</th><th>Dt</th></tr>`
            var idx = 0;
            var obj = this.get_obj()
            for (const [key, val] of Object.entries(obj)) {
                var sid = (idx++).toString().padStart(2, '0')
                trs += (`<tr><td class="MemoIdx">${sid}</td><td class='RecentBCV'>${key}</td><td><div class="MemoTime">${val}</div></td></tr>`)
            };
            trs += "</table>"
            if (cbf_click) cbf_click(trs)
            return trs;
        }
        return new MostRecentAry(sid)
    },    ////--------


    clear: function () {
        var Ignory = ["repositories", "#MemoryVerse"]
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
        const defaultVal = 99999999 //max in seconds = 1157 days
        if (undefined === v) {//get 
            var vs = parseInt(localStorage.getItem("cacheTTL"));
            if (!vs) vs = defaultVal
            return vs
        } else {//set
            v = parseInt(v)
            if (!Number.isInteger(v) || isNaN(v)) return alert(`not Number.isInteger(${v})`)
            if (v < 1) v = 1
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










