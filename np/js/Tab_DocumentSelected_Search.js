
function Tab_DocumentSelected_Search(tid) {
    //this.m_tbid = tid // "#Tab_VersionNamesOfTheBible" Tab_doc_option_for_search

    //this.m_selectedItems_ary = MyStorage.LastSelectedDocsList();//["CUVS"] //default
    this.m_gAppInstancesManager = null;
}
Tab_DocumentSelected_Search.prototype.init = function () {
    var _THIS = this
    function onclick_inpage_find_next(incrs, _this) {
        if (undefined === document.g_NextIndex) document.g_NextIndex = 0
        document.g_NextIndex += incrs
        var matSize = $(".matInPage").length;
        if (document.g_NextIndex < 0) document.g_NextIndex = matSize - 1
        if (document.g_NextIndex >= matSize) document.g_NextIndex = 0
        $(".matNextIdx").removeClass("matNextIdx");
        $(".matInPage").each(function (i, v) {
            if (document.g_NextIndex === i) {
                $(this).addClass("matNextIdx")
                $(this)[0].scrollIntoViewIfNeeded(true)
            }
        });

        var disp = `${document.g_NextIndex}/${matSize}`
        $("#searchNextresult").text(disp).css("color", "black")
        Uti.Msg("tot:" + document.g_NextIndex);
    };



    $("#Btn_Prev, #Btn_Next").hide()
    $("#Btn_Prev").on("click", function () {
        onclick_inpage_find_next(-1, this)
    })
    $("#Btn_Next").on("click", function () {
        onclick_inpage_find_next(+1, this)
    })
    $("#Btn_InPage").on("click", function () {
        $("#Btn_Prev, #Btn_Next").hide()
        var s = $("#sinput").val();
        var err = g_obt.set_inpage_findstrn(s)
        if (err) return alert(err)
        g_obt.Gen_output_table()

        document.m_SearchStrnInPage = s
        _THIS.gen_search_strn_history()
        if (s.length === 0) return alert("reset ok.")
        MyStorage.MostRecentSearchStrn.addonTop(s)
        document.g_NextIndex = -1

        var nFound = $(".matInPage").length;
        if (nFound > 0) {
            $("#Btn_Prev, #Btn_Next").show()
        }
        $("#searchNextresult").text("0/" + nFound)
    })

    $("#searchNextresult").on("click", function () {
        $(this).text(".....")
        $("#sinput").val("").focus()
    })
    $("#RemoveSearchStrn").on("click", function () {
        var shob = MyStorage.CreateMrObj("HistoryOfSearchResult")
        var obj = shob.get_obj()
        $("#Tab_regex_history_search tbody").find("tr.hili_SeaStrRaw").each(function () {
            var key = $(this).attr("objkey")
            delete obj[key]
            $(this).empty()
        })
        shob.set_obj(obj)
        //MyStorage.MostRecentSearchStrn.set_ary(ar)
    })
    $("#REGEXP_AND").on("click", function () {
        var s = $("#sinput").val().trim();
        if (s.length === 0) return alert("empty")
        MyStorage.MostRecentSearchStrn.addonTop(s)
        var ar = s.split(" ")
        var sss = ""
        ar.forEach(function (str) {
            if (str.length > 0) {
                sss += `(?=.*${str})`
            }
        })
        $("#sinput").val(sss)
    })
    $("#REGEXP__OR").on("click", function () {
        var s = $("#sinput").val().trim();
        if (s.length === 0) return alert("empty")
        MyStorage.MostRecentSearchStrn.addonTop(s)
        var ar = s.split(" ")
        if (ar.length <= 1) return
        var sss = ""
        ar.forEach(function (str) {
            if (str.length > 0) {
                sss += `(${str})|`
            }
        })
        sss = sss.replace(/\|$/, "")
        $("#sinput").val(sss)
    })
    $("#REGEXP_IgnoreCase").on("click", function () {
        var s = $("#sinput").val().trim();
        if (s.length === 0) return alert("empty")
        MyStorage.MostRecentSearchStrn.addonTop(s)

        var sss = "/" + s + "/i"
        $("#sinput").val(sss)
    })
    $("#toggle_Case").on("click", function () {
        function _camelize(str) {
            str = str.toLowerCase().replace(/[\s]+(.)/g, function (match, chr) {
                return ' ' + chr.toUpperCase();
            });
            str = str.replace(/^(.)/, function (match, chr) {
                return chr.toUpperCase();
            })
            return str
        }
        var s = $("#sinput").val();
        if (s === s.toLowerCase()) {
            s = s.toUpperCase();
        } else if (s === s.toUpperCase()) {
            s = _camelize(s);
        } else {
            s = s.toLowerCase();
        }
        $("#sinput").val(s)
    })

    $("#e_Note_Viewer").on("click", function () {
        //var _This = this;
        $("title").text("eNote");

        var inpobj = g_aim.get_search_inp()
        
        //Force to set value for e_Note_Viewer
        inpobj.Search.Strn = "^\\d{6}_\\d{6}"
        CNST.Cat2VolArr["WholisticBible"].forEach(function (bkc) {
            inpobj.bibOj[bkc] = {}
            //ret.oj_search[bkc] = {}
        })
        /////////////////


        $("#searchNextresult").text("show e_Notes in server site..")


        try {
            var trymat = ("test").match(inpobj.Search.Strn)
        } catch (err) {
            alert("Regex Err:\n" + inpobj.Search.Strn)
            return alert(err)
        }


        var msg = ` found in '${inpobj.Search.File}' '.`
        var api = new BsnpRestApi()
        api.ajaxion(RestApi.ApiBibleObj_search_txt,
            inpobj,
            function (ret) {
                var shob = MyStorage.CreateMrObj("HistoryOfSearchResult")
                ret.Gen_Output_Table_Form = "e_Note_Viewer"
                _THIS.m_gAppInstancesManager.apiCallback_Gen_output_table(ret, function (size) {
                    var txt = size + msg
                    $("#searchNextresult").text("0/" + txt)
                    var keyary = [inpobj.Search.Strn, size, inpobj.Search.File, '']
                    shob.add_key_val(JSON.stringify(keyary), "yymmdd")
                    _THIS.gen_search_strn_history()
                    $(".hili_SearchStrInBibleStart").addClass("hili_SearchStrInBibleStopd").removeClass("hili_SearchStrInBibleStart")
                });
                Uti.Msg(ret.out.result);
            })


    })

    /////////
    $("#save_SearchHistory2Repo").on("click", function () {
        var This = this
        Uti.Msg("#saveSearchHistory2Repo")

        var skey = $("#MrSearchHistoryInput").val()
        if (!skey) return alert("Saved name is empty.")
        var shob = MyStorage.CreateMrObj("HistoryOfSearchResult")
        var obj = shob.get_obj()
        if (!confirm(`${Object.keys(obj).length} items will be saved in '${skey}'\nSure?`)) return;
        var inpkeyObj = { MostRecent_Searches: {} }
        inpkeyObj.MostRecent_Searches[skey] = [obj] //must be an array to stop key walk through.


        MyStorage.Repo_save_dat_MostRecentSearches(inpkeyObj,
            function (ret) {
                //add into datalist uniquely.
                if ($(`#MrSearchHistoryDatalist option[value='${skey}']`).length === 0) {
                    $("#MrSearchHistoryDatalist").prepend(`<option value='${skey}'></option>`)
                }
                $(".RestSvrBtn_Running").removeClass("RestSvrBtn_Running")
            })
    })
    $("#load_SearchHistory2Repo").on("click", function () {
        Uti.Msg("#load2Repo")
        var skey = $("#MrSearchHistoryInput").val()
        if (!skey) return alert("Saved name is empty.")

        var inpkeyObj = { MostRecent_Searches: {} }
        inpkeyObj.MostRecent_Searches[skey] = {}
        MyStorage.Repo_load_dat_MostRecentSearches(
            inpkeyObj,
            function (ret) {
                $(".RestSvrBtn_Running").removeClass("RestSvrBtn_Running")
                Uti.Msg(ret)
                try {

                    var obj = ret.out.data.MostRecent_Searches[skey][0] //// must be an array to stop key walk through.
                    if (obj) {
                        var ar = Object.keys(obj)
                        if (!confirm(ar.length + " items were loaded from svr.\nUpdate list?")) return;
                        var shob = MyStorage.CreateMrObj("HistoryOfSearchResult")
                        shob.set_obj(obj)
                        _THIS.gen_search_strn_history()
                    }
                } catch {
                    alert("warn: ret cannot gratify", ret)
                }
            })
    })

    $("#clear_MrSearchHistoryInput").on("click", function () {
        $("#MrSearchHistoryInput").val("")
    })


    //this.gen_search_strn_history()//mast be after api load
}

Tab_DocumentSelected_Search.prototype.gen_search_strn_history = function () {
    if (undefined === document.m_SearchStrnInPage) document.m_SearchStrnInPage = ""
    var s = document.m_SearchStrnInPage
    var trs = "<tr class='trRecentBCV'><th>#</th><th>Search</th><th>n</th><th>Vsn</th><th>Vols</th><th>Tm</th></tr>"

    var shob = MyStorage.CreateMrObj("HistoryOfSearchResult")
    var obj = shob.get_obj(), idx = Object.keys(obj).length
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            var val = obj[key]
            if (key.indexOf("[") < 0) continue;
            var keyary = JSON.parse(key)
            if (keyary.length == 4) {
                trs += `<tr class='SeaStrPickable' objkey='${key}'><td class="MemoIdx">${idx--}</td><td>${keyary[0]}</td><td class='MemoNum'>${keyary[1]}</td><td class='MemoVsn'>${keyary[2]}</td><td class='MemoVols'>${keyary[3]}</td><td class="MemoTime">${val}</td></tr>`
            }
        }
    }

    //history
    //console.log(ret);
    $("#Tab_regex_history_search tbody").html(trs).find("td").bind("click", function () {
        $(this).parent().toggleClass("hili_SeaStrRaw");
        var s = $(this).text().trim();
        $("#sinput").val(s);
    });
    Sort_Table("Tab_regex_history_search")


}

Tab_DocumentSelected_Search.prototype.Update_DocSel_Table = function (tbodyID) {
    var _THIS = this
    var ar = MyStorage.LastSelectedDocsList();
    var trs = ""
    for (var i = 0; i < ar.length; i++) {
        trs += `<tr><td>${ar[i]}</td><tr>`
    }
    $(tbodyID).html(trs).find("td").on("click", function () {
        $(tbodyID).find(".hili_SearchStrInBibleStart").removeClass("hili_SearchStrInBibleStart")
        $(tbodyID).find(".hili_SearchStrInBibleStopd").removeClass("hili_SearchStrInBibleStopd")
        $(this).addClass("hili_SearchStrInBibleStart")
        var txt = $(this).text()
        MyStorage.LastSearchInDocument(txt)
        _THIS.onclick_inSvr_BibleObj_search_str(txt)
    })
}
Tab_DocumentSelected_Search.prototype.onclick_inSvr_BibleObj_search_str = function (searchInFileName) {
    $("#Btn_Prev, #Btn_Next").hide()

    var _This = this;

    document.g_NextIndex = -1


    var inpobj = g_aim.get_search_inp()
    if (inpobj.Search.Strn.trim().length === 0) {
        return alert("empty input SEARCH STRING: ")
    }



    $("#searchNextresult").text("Serach str in server site..")


    try {
        var trymat = ("test").match(inpobj.Search.Strn)
    } catch (err) {
        alert("Regex Err:\n" + inpobj.Search.Strn)
        return alert(err)
    }


    var msg = ` found in '${inpobj.Search.File}' '.`
    var api = new BsnpRestApi()
    api.ajaxion(RestApi.ApiBibleObj_search_txt,
        inpobj,
        function (ret) {
            var shob = MyStorage.CreateMrObj("HistoryOfSearchResult")
            _This.m_gAppInstancesManager.apiCallback_Gen_output_table(ret, function (size) {
                var txt = size + msg
                $("#searchNextresult").text("0/" + txt)
                var keyary = [inpobj.Search.Strn, size, inpobj.Search.File, '']
                shob.add_key_val(JSON.stringify(keyary), "yymmdd")
                _This.gen_search_strn_history()
                $(".hili_SearchStrInBibleStart").addClass("hili_SearchStrInBibleStopd").removeClass("hili_SearchStrInBibleStart")
            });
            Uti.Msg(ret.out.result);
        })



    return
}




