
function Tab_MostRecent_BCV() {
    this.m_tableID = "#Tab_MostRecent_BCV"
}

Tab_MostRecent_BCV.prototype.init_Mrs = function () {
    var _THIS = this
    this.m_tbodies = {
        MemoryRequired: new Tab_MostRecentBody("MemoryRequired"),  // MemoryRequired
        RecentAccessed: new Tab_MostRecentBody("RecentAccessed"),  // RecentAccessed
    }

    //
    _THIS.show_all(false)
    _THIS.m_tbodies["RecentAccessed"].show(true)
    _THIS.m_tbodies["MemoryRequired"].show(false)
    $("#Mr_Input_Datalist").val("RecentAccessed")

    $(".docSwitchRecent").on("click", function () {
        _THIS.show_all(false)

        var cap = $(this).attr("title")
        $("#Mr_Input_Datalist").val(cap)
        _THIS.m_tbodies[cap].show(true)
        $(".ColorRecentMarks").removeClass("ColorRecentMarks")
        $(this).addClass("ColorRecentMarks")
    });


    $("#clearUnse").bind("click", function () {
        var cap = _THIS.getCap() //RecentAccessed or MemoryRequired
        _THIS.m_tbodies[cap].clearHistory()
    })
    $("#toggleSel").bind("click", function () {
        var cap = _THIS.getCap()
        _THIS.m_tbodies[cap].toggleSelAll()
    })

    $("#save2Repo").on("click", function () {
        var This = this
        Uti.Msg("#save2Repo")

        var skey = $("#Mr_Input_Datalist").val()

        // 
        var cap = _THIS.getCap()
        var obj = _THIS.m_tbodies[cap].m_MrObjInStore.get_obj()
        if (!confirm(`${Object.keys(obj).length} ${cap} items will be saved in 'MostRecent_Verses/${skey}'\n-Continue?`)) return;
        var inpkeyObj = { MostRecent_Verses: {} }
        inpkeyObj.MostRecent_Verses[skey] = [obj] // must be an array

        MyStorage.Repo_save_data_MostRecentVerses(inpkeyObj,
            function (ret) {
                //add into datalist uniquely.
                if ($(`#input_browsers option[value='${skey}']`).length === 0) {
                    $("#input_browsers").prepend(`<option value='${skey}'></option>`)
                }
                $(".RestSvrBtn_Running").removeClass("RestSvrBtn_Running")
            })
    })
    $("#load2Repo").on("click", function () {
        Uti.Msg("#load2Repo")

        var cap = _THIS.getCap()
        var skey = $("#Mr_Input_Datalist").val()
        if (!skey) skey = cap
        var inpkeyObj = { MostRecent_Verses: {} }
        inpkeyObj.MostRecent_Verses[skey] = {}
        MyStorage.Repo_load_data_MostRecentVerses(
            inpkeyObj,
            function (ret) {
                $(".RestSvrBtn_Running").removeClass("RestSvrBtn_Running")
                console.log(ret)
                Uti.Msg(ret)
                if (ret.out.data) {

                    try {
                        var obj = ret.out.data.MostRecent_Verses[skey][0] //must be an array to stop walking through
                        if (obj) {
                            var ar = Object.keys(obj)
                            if (!confirm(ar.length + " items were loaded from svr.\nUpdate list?")) return;
                            _THIS.m_tbodies[cap].m_MrObjInStore.set_obj(obj)
                            _THIS.m_tbodies[cap].update_tab()
                        }
                    } catch {
                        console.error("Warn: ret cannot gratify usr.", ret)
                    }

                } else {
                    alert("failed to load.")
                }
            })
    })
    $(".RestSvrBtn").on("click", function () {
        $(".RestSvrBtn_Running").removeClass("RestSvrBtn_Running")
        $(this).addClass("RestSvrBtn_Running")
    })

    $(".RecentBCVsBtn").on("click", function () {
        $(".RecentBCVsBtn_Hilit").removeClass("RecentBCVsBtn_Hilit")
        $(this).addClass("RecentBCVsBtn_Hilit")
    })
    $("#clear_Tab_MostRecent_BCV_caps").on("click", function () {
        $("#Mr_Input_Datalist").val("")
    })
}

Tab_MostRecent_BCV.prototype.getCap = function () {
    var scap = $(this.m_tableID).find(".ColorRecentMarks").attr("title").trim()
    //$("#Mr_Input_Datalist").val(scap)
    return scap
}

Tab_MostRecent_BCV.prototype.onClickHistoryItem = function (onClickHistoryItm) {
    this.m_tbodies.RecentAccessed.onClickHistoryItem(onClickHistoryItm)
    this.m_tbodies.MemoryRequired.onClickHistoryItem(onClickHistoryItm)
}

Tab_MostRecent_BCV.prototype.clearHistory = function (idtxtout) {
    var cap = this.getCap()
    this.m_tbodies[cap].clearHistory(idtxtout)
}
Tab_MostRecent_BCV.prototype.show_all = function (bShow) {
    var _THIS = this
    Object.keys(_THIS.m_tbodies).forEach(function (id) {
        _THIS.m_tbodies[id].show(bShow)
    })
}
Tab_MostRecent_BCV.prototype.toggleSelAll = function () {
    var cap = this.getCap()
    this.m_tbodies[cap].toggleSelAll()
}




