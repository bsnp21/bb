







var AppInstancesManager = function () {
}
AppInstancesManager.prototype.init = function (cbf) {
    var _This = this




    $("body").prepend(BibleInputMenuContainer);
    $("#menuContainer").draggable();
    $('*').on('click', function (e) {
        e.stopPropagation();
    });
    $("body").bind("click", function (evt) {
        evt.stopImmediatePropagation();
        //$("#menuContainer").hide()
        $("#divPopupMenu").hide()
        $("#Tab_OutputVolumnNamesList").hide()
        groupsMenuMgr.collapse()
        //popupMenu.hide()
    })

    groupsMenuMgr.gen_grp_bar(popoutputVolumnNamesList, tab_MostRecent_BCV)




    digi.init_digi(showup)

    showup.onclick_Vrs(function (bload) {
        if (bload) {
            digi.init_Chp_digiKeys_by_vol()
            digi.init_Vrs_digiKeys_by_vol()
            _This.loadBible_chapter_by_bibOj();
        } else {
            digi.init_Vrs_digiKeys_by_vol()
        }
        $("#menuContainer").show()
        groupsMenuMgr.sel_default()
        _This.scrollToView_Vrs() //before clearup.
    })
    showup.m_Bki.onclick_bkc(function () {
        _This.scrollToView_Vrs() //before clearup.

        //store before clearup
        var ret = showup.get_selected_bcv_parm()
        if (ret && ret.m_bcv) tab_MostRecent_BCV.m_tbodies.RecentAccessed.addnew2table(ret.m_bcv)

        //clearup
        showup.m_Chp.set_showupVal("")
        showup.m_Vrs.set_showupVal("")
        digi.init_Chp_digiKeys_by_vol()
        digi.init_Vrs_digiKeys_by_vol()

        $("#menuContainer").show()
        groupsMenuMgr.sel_default()

    })
    showup.onclick_Chp(function (bload) {
        digi.init_Chp_digiKeys_by_vol()
        digi.init_Vrs_digiKeys_by_vol()
        if (bload) {
            _This.loadBible_chapter_by_bibOj();
        }
        $("#menuContainer").show()
        groupsMenuMgr.sel_default()
    })
    showup.onclick_face(function () {
        popoutputVolumnNamesList.show(false)
        //$('#menuContainer').slideToggle();
        _This.scrollToView_Vrs() //before clearup.
    })


    digi.m_Chp.Gen_Digits("#DigitOfChapt", "chp_num")
    digi.m_Vrs.Gen_Digits("#DigitOfVerse", "vrs_num")

    digi.m_Chp.on_Click_Digit(function () {
        _This.loadBible_chapter_by_bibOj();
    })
    digi.m_Vrs.on_Click_Digit(function () {
        _This.scrollToView_Vrs();
    })


    popoutputVolumnNamesList.init({
        onClickItm: function (vol) {
            showup.m_Bki.set_showupBkc(vol);
            showup.m_Chp.set_showupVal("")
            showup.m_Vrs.set_showupVal("")

            digi.init_Chp_digiKeys_by_vol()
            digi.init_Vrs_digiKeys_by_vol()

            var bcv = `${vol}1:1`
            tab_MostRecent_BCV.m_tbodies.RecentAccessed.addnew2table(bcv)
            //d1.init_Chp_digiKeys_by_vol()
            //d2.disable_all_digiKey(true)

            Uti.Msg(vol + " : maxChap = " + Object.keys(_Max_struct[vol]).length + "\n\n\n");

            $("#oBible").html(`<h1>Please select chapter number for ${vol}.</h1>`)

        }
    })



    skinp.gen_panel({
        onClickItm: function (ch, volary, alreadyhili) {
            popoutputVolumnNamesList.Popup_VolumnNamesList_Table(ch, volary, alreadyhili, 90)

            tab_category.rm_hili()
        }
    })

    tab_category.Gen_Cat_Table({
        onClickItm: function (scat, volary, alreadyHili) {
            popoutputVolumnNamesList.Popup_VolumnNamesList_Table(scat, volary, alreadyHili, 2);
            skinp.rm_hili()

            //showup.m_Bki.set_showupBkc(scat);
            showup.update_showup(scat)
        }
    })


    //tab_DocumentSelected_Search.init()
    tab_DocumentSelected_Search.m_gAppInstancesManager = this;
    // tab_DocumentSelected_Search.cbf_click_doc_to_run_search = function () {
    //     $("#searchNextresult").text("Serach str in server site..")
    //     var inpobj = g_aim.get_search_inp()
    //     var volar = Object.keys(inpobj.bibOj)
    //     if (volar.length === 0) {
    //         if (!confirm(`Volumn not selected. \nSearch '${inpobj.Search.Strn}' in all volumns in '${inpobj.Search.File}'.\nSure?`)) {
    //             return;
    //         }
    //     }
    //     var msg = ` found in '${inpobj.Search.File}' for '${volar.join()}.'`
    //     var api = new BsnpRestApi()
    //     api.ajaxion(RestApi.ApiBibleObj_search_txt,
    //         inpobj,
    //         function (ret) {
    //             _This.apiCallback_Gen_output_table(ret, function (size) {
    //                 $("#searchNextresult").text("0/" + size + msg)
    //                 $(".hili_SearchStrInBibleStart").addClass("hili_SearchStrInBibleStopd").removeClass("hili_SearchStrInBibleStart")
    //             });
    //             Uti.Msg(ret.out.result);
    //         })
    // }

    tab_DocumentSelected_Search.Update_DocSel_Table("#Tab_doc_option_for_search")

    tab_documentsClusterList.Init_Docs_Table({
        onClickItm: function (par) {
            if (par) {
                if ("string" === typeof (par)) {
                    if ("reloadtable" === par) {
                        _This.loadBible_chapter_by_bibOj();
                    }
                    //if ("Searching" === par) {
                    //    groupsMenuMgr.sel_default("Search")
                    //}
                } else if ("object" === typeof (par)) {
                    _This.loadBible_verse_by_bibOj(par);
                }
                tab_DocumentSelected_Search.Update_DocSel_Table("#Tab_doc_option_for_search")
            }

        }
    });



    tab_MostRecent_BCV.init_Mrs()
    tab_MostRecent_BCV.onClickHistoryItem(function (bcvAry) {
        if (bcvAry.length === 0) {
            return
        } else if (bcvAry.length === 1) {
            showup.update_showup(bcvAry[0])
            //showup.m_Vrs.set_showupVal("")
            digi.init_Chp_digiKeys_by_vol()
            digi.init_Vrs_digiKeys_by_vol()
            _This.loadBible_chapter_by_bibOj()
        } else {
            var str = bcvAry.join(", ")
            Uti.Msg(str)
            var oj = {}
            bcvAry.forEach(function (bcv) {
                var ret = Uti.parse_bcv(bcv, "", oj)
            })
            _This.loadBible_chapter_by_bibOj(oj)
        }

    })

    popupMenu.init()
    g_obt.onclick_ob_table(function () {
        //$("#menuContainer").hide()
        $("#divPopupMenu").hide()
        $("#Tab_OutputVolumnNamesList").hide()
        //popupMenu.hide()
        groupsMenuMgr.collapse()
    })

    MyStorage.init(function (ret) {

    })


    g_obt.onclick_popupLabel(function (par) {
        par.m_tab_documentsClusterList = tab_documentsClusterList
        par.m_groupsMenuMgr = groupsMenuMgr
        popupMenu.popup(par)
        tab_MostRecent_BCV.m_tbodies.RecentAccessed.addnew2table(par.m_bcv)



        showup.update_showup(par.m_bcv)
        digi.init_Chp_digiKeys_by_vol()
        digi.init_Vrs_digiKeys_by_vol()
        //_This.scrollToView_Vrs()
    })
    g_obt.onclick_Load_Bcv_by_e_Note_Viewer(function (bcvAry) {
        var str = bcvAry.join(", ")
        Uti.Msg(str)
        var oj = {}
        bcvAry.forEach(function (bcv) {
            var ret = Uti.parse_bcv(bcv, "", oj)
        })
        _This.loadBible_chapter_by_bibOj(oj)
    })

    this.init_load_storage() //load first.
    //this.onclicks_btns_in_grpMenu_search()
    tab_DocumentSelected_Search.init()

};
AppInstancesManager.prototype.init_load_storage = function () {

    var _This = this

    function _load_bcv_from_url_param() {
        var bcv = ""
        var punIdx = window.location.href.indexOf("#") //url-ankor #bcv. #Gen1:1
        if (punIdx > 0) {
            bcv = window.location.href.substring(punIdx + 1)
            var ret = Uti.parse_bcv(bcv)
            if (ret) {
                //showup.setAsChildren()
                showup.update_showup(bcv)
                setTimeout(function () {
                    _This.loadBible_chapter_by_bibOj()
                }, 1000)
            }
            return;
        }


        //this is not good, pls use #bcv.
        const urlParams = new URLSearchParams(window.location.search);
        var bcv = urlParams.get('bcv');
        if (bcv) {//frm url for clone. 
            var ret = Uti.parse_bcv(bcv)
            if (ret) {
                showup.setAsChildren()
                showup.update_showup(bcv)
                setTimeout(function () {
                    _This.loadBible_chapter_by_bibOj()
                }, 1000)
            }
        }
    }

    function _init_load_repo() {
        Uti.Msg("start ...", "" + window.location.href);
        var api = new BsnpRestApi()
        var username = api.urlParams.get("SSID").slice(13)
        $("#SignOut_repopathname").text(username)
        var vision = api.urlParams.get("vision")
        $("#SignOut_repopathname").addClass(`user_vsibility_${vision}`)
        //$("#repopath").val(username)
        $("#visibilitydisplay").text(vision) //(new Date()).toISOString()
        $("#visibilitydisplay").attr("href", `./mySignUpdate.htm${window.location.search}`)



        Uti.Msg("RestApi=", RestApi);

        MyStorage.Repositories().repos_app_init()
        MyStorage.Repo_load_data_MostRecentVerses({ MostRecent_Verses: {}, MostRecent_Searches: {} }, function (ret) {
            //if (cbf) cbf(ret)
            Uti.set_menuContainer_color(ret)
            Uti.Msg("Ready ret.out", ret)
            try {
                /////////////////////////////////////////////////////
                if ("MostRecent_Verses" in ret.out.data) {
                    var MrKysVerse = Object.keys(ret.out.data.MostRecent_Verses)
                    tab_MostRecent_BCV.m_tbodies.MemoryRequired.m_MrObjInStore.set_obj(ret.out.data.MostRecent_Verses.MemoryRequired[0])
                    tab_MostRecent_BCV.m_tbodies.RecentAccessed.m_MrObjInStore.set_obj(ret.out.data.MostRecent_Verses.RecentAccessed[0])

                    var str = ""
                    MrKysVerse.sort().forEach(function (key) {
                        str += `<option value="${key}"></option>`
                    })
                    $("#input_browsers").html(str)
                }
            } catch {
                console.error("warn: ret:", ret)
            }
            try {
                /////////////////////////////////////////////////////
                if ("MostRecent_Searches" in ret.out.data) {
                    var MrKysSearc = Object.keys(ret.out.data.MostRecent_Searches)
                    var str = ""
                    MrKysSearc.sort().forEach(function (sky) {
                        str += `<option value='${sky}'></option>`
                    })
                    $("#MrSearchHistoryDatalist").html(str)
                    //
                    var obj = ret.out.data.MostRecent_Searches["MostRecentSearch"][0] //// must be an array to stop key walk through.
                    if (obj) {
                        var ar = Object.keys(obj)
                        //if (!confirm(ar.length + " items were loaded from svr.\nUpdate list?")) return;
                        var shob = MyStorage.CreateMrObj("HistoryOfSearchResult")
                        shob.set_obj(obj)
                        tab_DocumentSelected_Search.gen_search_strn_history()//
                    }
                }

            } catch {
                console.error("warn: ret:", ret)
            }
            _load_bcv_from_url_param()
        })
    }

    ////////////////////////////////
    //
    _init_load_repo()
}
AppInstancesManager.prototype.scrollToView_Vrs = function () {
    var ret = showup.get_selected_bcv_parm()
    if (!ret.m_bcv) return
    $(".bcvTag").each(function () {
        var txt = $(this).text()
        if (txt === ret.m_bcv) {
            $(this)[0].scrollIntoViewIfNeeded()
            $(this).addClass("hiliScroll2View");
        }
    })
};///





AppInstancesManager.prototype.loadBible_verse_by_bibOj_output = function (ret, par) {
    //popupMenu_BcvTag.hide()
    popupMenu.hide()
    g_obt.update_table_tr(ret, par)
}
AppInstancesManager.prototype.loadBible_verse_by_bibOj = function (par) {
    var _THIS = this
    var oj = par.BCVtagClusterInfo.bcvOj
    if (!oj) {
        Uti.Msg("loadBible_verse_by_bibOj", oj)
        return alert("null oj")
    }

    var fnamesArr = par.BCVtagClusterInfo.newselary; //tab_documentsClusterList.get_selected_seq_fnamesArr();


    var api = new BsnpRestApi()
    api.ajaxion(RestApi.ApiBibleObj_load_by_bibOj,
        { fnames: fnamesArr, bibOj: oj, Search: null },
        function (ret) {
            if (!ret.out.data) return alert("no out.data")
            _THIS.loadBible_verse_by_bibOj_output(ret, par)
            setTimeout(function () {
                _THIS.scrollToView_Vrs()

            }, 2100)
        })

};///
AppInstancesManager.prototype.apiCallback_Gen_output_table = function (ret, cbf) {
    //popupMenu_BcvTag.hide()
    popupMenu.hide()
    g_obt.set_data(ret)
    if (ret.Gen_Output_Table_Form === "e_Note_Viewer") {
        ret.Gen_Output_Table_Form = null;
        g_obt.Gen_output_table_for_e_Note_Viewer(cbf)
    } else {
        g_obt.Gen_output_table(cbf)
    }
}
AppInstancesManager.prototype.loadBible_chapter_by_bibOj = function (oj) {
    var _THIS = this
    var res = showup.get_selected_bcv_parm();
    if (!oj) {
        console.log("res=", res);
        if (!res || !res.oj_bc) return null
        oj = res.oj_bc
    }
    if (!oj || Object.keys(oj) === 0) return alert("oj is null")
    var fnamesArr = tab_documentsClusterList.get_selected_seq_fnamesArr();

    var api = new BsnpRestApi()
    api.ajaxion(RestApi.ApiBibleObj_load_by_bibOj, {
        fnames: fnamesArr,
        bibOj: oj, Search: null
    }, function (ret) {
        if (!ret.out.data) return alert("no out.data")
        _THIS.apiCallback_Gen_output_table(ret)
        setTimeout(function () {
            _THIS.scrollToView_Vrs()

            //set page-title
            if (!res.m_bcv) return
            $("title").text(res.m_bcv)
        }, 2100)
    })

    return res;
};///
AppInstancesManager.prototype.get_search_inp = function () {
    //
    var fnamesArr = tab_documentsClusterList.get_selected_seq_fnamesArr();
    var searchInFileName = MyStorage.LastSearchInDocument();// nambib.get_search_fname();
    var searchStrn = $("#sinput").val();
    if (searchStrn.length === 0) {
        if ("e_Note" === searchInFileName) {
            searchStrn = "" + prompt("No Serach Str: Set to defalut", "^\\d{6}")
            $("#sinput").val(searchStrn)
        }
        else alert("no search str.")
    }

    var inp = { fnames: fnamesArr, bibOj: null, Search: { File: searchInFileName, Strn: searchStrn } };
    var res = showup.get_selected_bcv_parm();
    if (res) {
        inp.bibOj = res.oj_search
    }
    return inp;
};





