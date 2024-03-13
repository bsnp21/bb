



function PopupMenu() {
    this.m_id = "#divPopupMenu"
    this.m_par = null
}

PopupMenu.prototype.init = function (cbf) {
    var _THIS = this
    $(this.m_id).draggable().hide()
    $(this.m_id).find("a").bind("click", function () {
        $(_THIS.m_id).hide()
    })

    $("#divPopupMenu_CaptionBCV").on("click", function () {
        //click to add into MemoryRequired list in store and uiTable. set datalist to MemoryRequired.
        var bcv = $(this).attr("SaveToMemoryVerse")
        if (bcv.length > 0) {
            Uti.copy2clipboard(`(${bcv})`, this)
        }

        //if (cbf) cbf(bcv)
        if ($(this)[0].classList.contains("divPopupMenu_CaptionBCV_MemoVerse")) {
            //if (!confirm(bcv + " is already in MemoryVerses. \nContinue to update?"))
            //    return;
        }
        $(`.bcvTag[title='${bcv}']`).addClass("divPopupMenu_CaptionBCV_MemoVerse")

        //
        var obj = tab_MostRecent_BCV.m_tbodies.MemoryRequired.m_MrObjInStore.get_obj()
        var ary = Object.keys(obj)
        if (ary.indexOf(bcv) >= 0) {
            if (!confirm(`'${bcv}' already in MemoryRequired (${Object.keys(obj).length}). \nContinue?`)) return;
        }

        tab_MostRecent_BCV.m_tbodies.MemoryRequired.addnew2table(bcv)
        $("#Mr_Input_Datalist").val("MemoryRequired")
        $("#MemoryVerse_Btn").trigger("click")

    })

    this.popupMenu_BcvTag = new PopupMenu_BcvTag()
    this.popupMenu_EdiTag = new PopupMenu_EdiTag()
    this.popupMenu_RevTag = new PopupMenu_RevTag()

    this.popupMenu_BcvTag.init()
    this.popupMenu_EdiTag.init()
    this.popupMenu_RevTag.init()


    var ShowHideVTxt = function () {
        var _THIS = this
        $(".EdiTag_ToggleHideShow").bind("click", function () {
            $(_THIS.m_vtxID).slideToggle().toggleClass("showTxt")
            _THIS.update_label()
        })
    }
    ShowHideVTxt.prototype.set_vtxID = function (vtxID, cbf) {
        this.m_vtxID = "#" + vtxID
        this.m_cbf = cbf
        this.update_label()
    }
    ShowHideVTxt.prototype.update_label = function () {
        // _THIS.m_par.m_txuid 
        var bshowTxt = $(this.m_vtxID)[0].classList.contains("showTxt")

        var sLab = "Hide"
        if (bshowTxt) {
            sLab = "Show"
        }
        $(".EdiTag_ToggleHideShow").text(sLab)
        if (this.m_cbf) this.m_cbf(bshowTxt, sLab)
    }
    this.showHideVTxt = new ShowHideVTxt()
}
PopupMenu.prototype.popup = function (par) {


    par.m_showHideVTxt = this.showHideVTxt
    this.m_par = par

    $(this.m_id).css('top', par.m_y);

    $(this.m_id).find("tbody").hide()


    var ret = Uti.parse_bcv(par.m_strTag)
    //var txuid = par.m_txuid
    if (ret) {
        this.popupMenu_BcvTag.init_popup(par)
    } else {
        if (par.m_strTag.match(/^e_/)) {
            this.popupMenu_EdiTag.init_popup(par)
        } else {
            this.popupMenu_RevTag.init_popup(par)
        }
    }
    $("#divPopupMenu_CaptionBCV").text(`SaveToMemoryVerse: ${par.m_bcv}`).attr("SaveToMemoryVerse", par.m_bcv)
    if (par.m_bcv) {
        var stores = MyStorage.CreateMrObj("MemoryRequired")
        var ary = Object.keys(stores.get_obj())
        if (ary.indexOf(par.m_bcv) >= 0) {
            $("#divPopupMenu_CaptionBCV").addClass("divPopupMenu_CaptionBCV_MemoVerse")
        } else {
            $("#divPopupMenu_CaptionBCV").removeClass("divPopupMenu_CaptionBCV_MemoVerse")
        }
    }

    if (par.m_alreadyHili) {
        $(this.m_id).toggle();
    } else {
        $(this.m_id).show()
    }

}
PopupMenu.prototype.hide = function () {
    $(this.m_id).hide()
}




