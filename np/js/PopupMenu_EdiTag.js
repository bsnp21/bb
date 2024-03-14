
function PopupMenu_EdiTag() {
    this.m_id = "#divPopupMenu_EdiTag"
    this.m_par = null
}
PopupMenu_EdiTag.prototype.init_popup = function (par) {
    this.m_par = par


    this.m_ediDiv.setId_Txt(par.m_txuid, par.m_rev, par.m_outxtObj)
    this.m_ediBtn.init_associate(this.m_ediDiv)
    var bEdit = this.m_ediDiv.isEditable()



    this.m_ediBtn.enable_edit(bEdit, false)


    var ids = "#RevTag_Save, #RevTag_Load, #RevTag_Edit_External, #RevTag_Edit_Local"
    par.m_showHideVTxt.set_vtxID(this.m_par.m_txuid, function (bHide, sLab) {
        if (bHide) {
            $(ids).parent().hide()
        } else {
            $(ids).parent().show()
            if (bEdit) {
                $("#RevTag_Save").parent().show()
                $("#RevTag_Load").parent().hide()
            } else {
                $("#RevTag_Save").parent().hide()
                $("#RevTag_Load").parent().show()
            }
        }
    })

    $(this.m_id).show()
}
PopupMenu_EdiTag.prototype.toggle_ShowHideTxt = function (txID) {
    // _THIS.m_par.m_txuid 
    var bshowTxt = $("#" + txID)[0].classList.contains("showTxt")

    if (bshowTxt) {
        return "Show"
    } else {
        return "Hide";
    }
}
PopupMenu_EdiTag.prototype.init = function () {
    var _THIS = this



    function DivEditTxt() {
        this.m_id = null
        this.m_edi_enabled = false
    }
    DivEditTxt.prototype.setId_Txt = function (id, rev, ouTxtObj) {
        this.m_id = "#" + id
        this.m_rev = rev
        this.m_otxObj = ouTxtObj
    }
    DivEditTxt.prototype.txthtml = function (htm) {
        if (undefined === htm) {
            return $(this.m_id).html()
        }
        return $(this.m_id).html(htm)
    }
    DivEditTxt.prototype.getEditHtm = function () {
        var edx = ""
        if (this.isEditable()) {
            edx = this.txthtml()
        } else {
            //Uti.Msg("uneditable text")
            edx = this.m_otxObj[this.m_rev]
        }
        edx = Uti.htmlDecode(edx.trim())
        edx = edx.replace(/[\n\r\t]/g, '')
        return edx
    }
    DivEditTxt.prototype.setEditHtm = function (txt) {
        var edx = Uti.htmlDecode(txt.trim())
        edx = edx.replace(/[\n\r\t]/g, '')
        this.m_otxObj[this.m_rev] = edx
        return edx
    }
    DivEditTxt.prototype.enableEdit = function (bEnable) {
        if (!this.m_id) return alert("enableEdit er")

        if (bEnable) {
            $(this.m_id).attr("contenteditable", "true")
            var showTxt = this.m_otxObj[this.m_rev]
            if (!showTxt) {
                if ("e_Subtitle" === this.m_rev) {
                    showTxt = "<a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>"
                } else {
                    showTxt = Uti.Get_e_Note_Date("(ed).") + "<ol><li></li></ol>"   //remark:e_note: yymmdd_hhmmss(ed).
                }
            }
            showTxt = Uti.convert_std_bcv_in_text_To_unlinked(showTxt)
            $(this.m_id).html(showTxt)
        } else {
            $(this.m_id).removeAttr("contenteditable")
            var showTxt = $(this.m_id).html() //storeIt
            var showTxt = Uti.convert_std_bcv_in_text_To_unlinked(showTxt)
            showTxt = Uti.htmlDecode(showTxt.trim())
            showTxt = showTxt.replace(/[\n\r\t]/g, '')
            this.m_otxObj[this.m_rev] = showTxt;//$(this.m_id).html() //storeIt

            var htmShow = Uti.convert_std_bcv_in_text_To_linked(showTxt)
            if (!htmShow) {
                htmShow = "<ol><li>z</li></ol>"
            }
            $(this.m_id).html(htmShow)
        }
    }

    DivEditTxt.prototype.isEditable = function () {
        return !!$(this.m_id).attr("contenteditable")
    }


    function EditBtn(id) {
        this.m_elm = $(id)
        this.m_edi_enabled = false

    }
    EditBtn.prototype.init_associate = function (edidiv) {
        this.m_ediDiv = edidiv
    }

    EditBtn.prototype.enable_edit = function (bEnable, bBubleEvt) {
        this.m_edi_enabled = bEnable
        if (bEnable) {
            $(this.m_elm).text("Disable Edit")
        } else {
            $(this.m_elm).text("Enable Edit")
        }
        if (!bBubleEvt) return
        this.m_ediDiv.enableEdit(bEnable)
    }
    EditBtn.prototype.toggle_enableEdit = function () {
        this.m_edi_enabled = !this.m_edi_enabled
        this.enable_edit(this.m_edi_enabled, true)
    }
    this.m_ediBtn = new EditBtn("#RevTag_Edit_Local")
    this.m_ediDiv = new DivEditTxt()

    function _set_par_ediTxt() {
        var htmEdit = _THIS.m_ediDiv.getEditHtm()
        //htmEdit = $(htmEdit).html()
        //htmEdit = Uti.htmlDecode(htmEdit.trim())
        var editObj = {
            fname: _THIS.m_par.m_rev,
            bcv: _THIS.m_par.m_bcv,
            txt: htmEdit
        }
        //if (htmEdit.length >= 2000) alert(`lengh=${htmEdit.length} > max 2000.`)
        var ret = Uti.parse_bcv(_THIS.m_par.m_bcv, htmEdit)
        //var pster = {inp:{par:''}}
        var par = { fnames: [_THIS.m_par.m_rev], inpObj: ret.bcvObj }
        //pster.api = RestApi.ApiBibleObj_write_Usr_BkcChpVrs_txt
        localStorage.setItem("myNote", JSON.stringify(editObj))
        return true
    }


    $("#RevTag_Edit_Local").bind("click", function () {
        _THIS.m_ediBtn.toggle_enableEdit()
        //_THIS.hide()
    })

    $("#RevTag_Edit_External").bind("click", function () {
        if (_set_par_ediTxt()) {
            var api = new BsnpRestApi()
            var shref = $(this).attr("href")
            var url = `${shref}${api.urlRedirectParam()}`
            window.open(url, "_blank")
            return false;// true enable href open.
        }
        return false;// diable href open
    })

    $("#RevTag_SocialNetworkPlatform").bind("click", function () {
        if (_set_par_ediTxt()) {
            var api = new BsnpRestApi()
            var shref = $(this).attr("href")
            window.open(`${shref}${api.urlRedirectParam()}&BCV=${_THIS.m_par.m_bcv}`, "_blank")
            return false;// true enable href open.
        }
        return false;// diable href open
    })
    function _get_par_ediTxt_par() {
        var htmEdit = _THIS.m_ediDiv.getEditHtm()
        htmEdit = Uti.Update_e_Note_Date(htmEdit)

        if (htmEdit.length >= 2000000) alert(`lengh=${htmEdit.length} > max 2MB.`)
        var ret = Uti.parse_bcv(_THIS.m_par.m_bcv, htmEdit)
        var par = { fnames: [_THIS.m_par.m_rev], inpObj: ret.bcvObj }
        return par
    }
    $("#RevTag_Save").bind("click", function () {
        var par = _get_par_ediTxt_par()
        if (!par) {
            Uti.Msg("No save")
            return
        }
        var api = new BsnpRestApi()
        api.ajaxion(RestApi.ApiBibleObj_write_Usr_BkcChpVrs_txt,
            par,
            function (ret) {
                console.log("ret", ret)
                Uti.Msg(ret.out)
                _THIS.m_ediBtn.enable_edit(false, true)
            })
    })


    $("#RevTag_Load").bind("click", function () {
        var psr = Uti.parse_bcv(_THIS.m_par.m_bcv, "")

        var api = new BsnpRestApi()
        api.ajaxion(RestApi.ApiBibleObj_load_by_bibOj,
            { fnames: [_THIS.m_par.m_rev], bibOj: psr.bcvObj },
            function (ret) {
                console.log("ret", ret.out.data)
                Uti.Msg(ret.out)
                if (ret.out.data) {
                    var txt = ret.out.data[psr.vol][psr.chp][psr.vrs][_THIS.m_par.m_rev]

                    var edx = _THIS.m_ediDiv.getEditHtm()
                    if (txt != edx) {
                        var dlt = edx.length - txt.length
                        if (!confirm(`difference:${dlt}(b): continue?`)) return
                    }
                    var showtxt = Uti.convert_std_bcv_in_text_To_linked(txt)
                    _THIS.m_ediDiv.txthtml(showtxt)
                    _THIS.m_ediDiv.setEditHtm(txt)
                    _THIS.m_ediBtn.enable_edit(true, true)
                    $(_THIS.m_ediDiv.m_id).toggleClass("txt_loaded")
                } else {
                    alert("load failed. ")
                }
            })
    })
    $("#RevTag_ReadLocalStorage").bind("click", function () {
        var str = localStorage.getItem("myNote")
        if (str) {
            var obj = JSON.parse(str)
            if (!obj || obj.bcv != _THIS.m_par.m_bcv) {
                if (!confirm(`Storage ${obj.bcv} dismatch ${_THIS.m_par.m_bcv}.\nForce to read, ok?`)) return;
            } else {
                if (!confirm("Read from localStorage, len=" + str.length)) return
            }
            var txt = obj.txt
            var showtxt = Uti.convert_std_bcv_in_text_To_linked(txt)
            _THIS.m_ediDiv.txthtml(showtxt)
            _THIS.m_ediDiv.setEditHtm(txt)
            _THIS.m_ediBtn.enable_edit(true, true)
            $(_THIS.m_ediDiv.m_id).toggleClass("txt_loaded")
        }
    })

}





