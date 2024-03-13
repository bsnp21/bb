
function Tab_MostRecentBody(tbodyID) {

    this.m_tbodyID = "#" + tbodyID; //"#Tab_MostRecent_BCV"
    this.m_MrObjInStore = MyStorage.CreateMrObj(tbodyID)
    this.m_bSingleSel = false
}
Tab_MostRecentBody.prototype.show = function (bShow) {
    if (bShow) $(this.m_tbodyID).show()
    else {
        $(this.m_tbodyID).hide()
    }
    return bShow
}
Tab_MostRecentBody.prototype.onClickHistoryItem = function (onClickHistoryItm) {
    this.m_onClickHistoryItm = onClickHistoryItm
    this.update_tab()
}
Tab_MostRecentBody.prototype.addnew2table = function (bcv) {
    var ret = Uti.parse_bcv(bcv)
    if (!ret) return Uti.Msg("addnew is not valid: " + bcv)

    this.m_MrObjInStore.add_key_val(bcv, "yymmdd")
    this.update_tab()
}

Tab_MostRecentBody.prototype.update_tab = function () {
    var _THIS = this
    var tid = this.m_tbodyID + "_table"
    var tid2 = tid.replace(/^\#/, "")
    this.m_MrObjInStore.gen_obj_table_MrVerses(tid2, function (stb) {
        var tab = $(_THIS.m_tbodyID).html(stb)
        tab.find(".RecentBCV").bind("click", function (evt) {
            //evt.stopImmediatePropagation()

            if (_THIS.m_bSingleSel) {
                $(_THIS.m_tbodyID).find(".hiliRecentBCV").removeClass("hiliRecentBCV")
            }

            $(this).toggleClass("hiliRecentBCV")
            var hiliary = []
            $(this).parentsUntil("table").find(".RecentBCV.hiliRecentBCV").each(function () {
                hiliary.push($(this).text())
            })

            if (_THIS.m_onClickHistoryItm) _THIS.m_onClickHistoryItm(hiliary)
        })
        tab.find(".MemoTime").bind("click", function () {
            var tm = $(this).text()
            //$("#Mr_Input_Datalist").val(tm)
        })

        tab.find("th").bind("click", function () {
            tab.find(".Hili_RecentBCV_Column_Sel").removeClass("Hili_RecentBCV_Column_Sel")
            $(this).addClass("Hili_RecentBCV_Column_Sel")
            $(this).toggleClass("Hili_RecentBCV_Column_Sort")
        })
        Sort_Table(tid2)
    })
}
Tab_MostRecentBody.prototype.clearHistory = function (idtxtout) {
    var _THIS = this

    _THIS.m_MrObjInStore.cleanup()
    var n = 0, obj = {};
    $(this.m_tbodyID).find("td.RecentBCV").each(function () {
        var key = $(this).text().trim()
        if ($(this)[0].classList.contains("hiliRecentBCV")) {
            //$(this).parent().hide()
            $(this).addClass("ItmemToBeRemoved")
            n++
        } else {
            var val = $(this).parent().find(".MemoTime").text()
            obj[key] = val;
        }
    })
    if (confirm(n + " selected items will be removed. \nSure?")) {
        $(".ItmemToBeRemoved").each(function () {
            $(this).parent().remove()
        })
        _THIS.m_MrObjInStore.set_obj(obj)
    }
    return

    var obj = _THIS.m_MrObjInStore.get_obj()
    var std_bcv_strn = JSON.stringify(obj)
    Uti.Msg(std_bcv_strn)
    var ret = Uti.convert_std_bcv_str_To_uniq_biblicalseq_splitted_ary(std_bcv_strn)
    Uti.Msg(ret)
    var stdbcv = Uti.convert_std_uniq_biblicalseq_splitted_ary_To_dashed_strn(ret.biblical_order_splitted_ary)
    Uti.Msg(stdbcv)
}
Tab_MostRecentBody.prototype.toggleSelAll = function () {
    $(this.m_tbodyID).find("td.RecentBCV").toggleClass("hiliRecentBCV")
}

