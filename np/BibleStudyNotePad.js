







function PopupMenu_BcvTag() {
    this.m_id = "#divPopupMenu_BcvTag"
}
PopupMenu_BcvTag.prototype.init_links = function () {


    $("#blueletterbible").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)

        var blbvol = CNST.BlueLetterBibleCode[ret.vol];
        ret.set_href(blbvol + "/" + ret.chp + "/" + ret.vrs);
    });
    $("#qbible_com").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)

        //greek-new-testament/1-Thessalonians/1.html#1

        var ont = "hebrew-old-testament"
        if (ret.isNT()) {
            ont = "greek-new-testament"
        }

        var bkc = ret.vol;
        var bkname = CNST.BiBookName[ret.vol][0];
        bkname = bkname.replace(/_/g, "-")
        ret.set_href(`${ont}/${bkname}/${ret.chp}.html#${ret.vrs}`);

    });
    //https://biblehub.com/commentaries/genesis/2-24.htm
    $("#biblehub").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)

        var volm = ret._vol;
        var bkname = CNST.BiBookName[ret.vol][0];
        bkname = bkname.replace(/_/g, "-")
        bkname = bkname.toLowerCase()
        ret.set_href(bkname + "/" + parseInt(ret.chp3) + "-" + parseInt(ret.vrs) + ".htm");

    });

    $("#h_g").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)

        var volm = ret._vol;
        var bkidx = CNST.BookID2IdxCode[volm];
        ret.set_href(bkidx[0] + volm + "_" + ret.chp3 + ".htm#" + ret.vrs);
    });

    $("#gtw").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)

        //====/passage?search=John13:34&version=NIV;KJV
        var vol2 = CNST.BiBookName[ret.vol][0];
        ret.set_href("?search=" + vol2 + ret.chp + ":" + ret.vrs + "&version=NIV;CUV;KJV;NKJV;ESV");
    });
    $("#studylight").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)

        //https://www.studylight.org/commentary/john/1-1.html
        var vol2 = CNST.BibVolName_Studylight([ret.vol]);
        ret.set_href(vol2 + "/" + ret.chp + "-" + ret.vrs + ".html");
    });

    $("#ccel_org").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)

        //http://www.ccel.org/study/1_Samuel%202:11-4:18 
        var bok = CNST.BibVolName_ccel([ret.vol]);
        ret.set_href(bok + " " + ret.chp + ":" + ret.vrs + ".html");
    });

    $("#crossReference").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)

        //http://www.ccel.org/study/1_Samuel%202:11-4:18 
        var bok = CNST.BlueLetterBibleCode[ret.vol];
        ret.set_href(bok + " " + ret.chp + ":" + ret.vrs + "");

    });

    $("#BibleInput").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)
        ret.set_href(ret.vol + ret.chp + ":" + ret.vrs);
    });

    var _THIS = this
    $("#Cluster_Documents").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)
        var trID = `tr_${ret.vol}_${ret.chp}_${ret.vrs}`

        var tags = []
        $(_THIS.m_par.m_clickedLabel).parent().parent().attr("id", trID)
        $(_THIS.m_par.m_clickedLabel).parentsUntil("tr").find("sup.popupclicklabel").each(function () {
            var tx = $(this).text()
            tags.push(tx)
        });
        Uti.Msg("trID=", trID, tags)
        _THIS.m_par.BCVtagClusterInfo = { tags: tags, trID: trID, bcvOj: ret.bcvObj }
        _THIS.m_par.m_tab_documentsClusterList.Gen_table_for_bcvTag(_THIS.m_par)
        _THIS.m_par.m_groupsMenuMgr.sel_default("Cluster")
    });
}
PopupMenu_BcvTag.prototype.init = function () {
    this.init_links()
}

PopupMenu_BcvTag.prototype.init_popup = function (bcr) {
    this.m_par = bcr
    //this.m_par.m_clickedLabel
    // if (bcr.m_alreadyHili) {
    //     $(this.m_id).slideToggle();
    // } else {
    $(this.m_id).show();
    // }

    //$(this.m_id).css('top', bcr.m_y);
    //$("#divPopupMenu_BcvTag").toggle("'slide', {direction: 'up' }, 1000");//()
    //$(this.m_id).find("caption").text(bcr.m_bcv).focus()
}


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
                    showTxt = "<ol><li></li></ol>"
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
            window.open(`${shref}${api.urlRedirectParam()}`, "_target")
            return false;// true enable href open.
        }
        return false;// diable href open
    })
    function _get_par_ediTxt_par() {
        var htmEdit = _THIS.m_ediDiv.getEditHtm()
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
        api.run(RestApi.ApiBibleObj_write_Usr_BkcChpVrs_txt,
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
        api.run(RestApi.ApiBibleObj_load_by_bibOj,
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

}

function PopupMenu_RevTag() {
    this.m_id = "#divPopupMenu_RevTag"
    this.m_par = null
}
PopupMenu_RevTag.prototype.init_popup = function (par) {
    this.m_par = par

    $(this.m_id).show()

    par.m_showHideVTxt.set_vtxID(this.m_par.m_txuid, function (bHide, sLab) {

    })

}

PopupMenu_RevTag.prototype.init = function () {
    var _THIS = this
    $("#Copy2clipboard").bind("click", function () {
        var txt = $("#" + _THIS.m_par.m_txuid).text()
        var bcv = _THIS.m_par.m_bcv
        var rev = _THIS.m_par.m_strTag
        txt = `"${txt}" (${bcv} ${rev})`;
        Uti.copy2clipboard(txt, this)
        Uti.Msg(txt);
    })

    $("#AudioPlayer").bind("click", function () {
        var txt = $("#" + _THIS.m_par.m_txuid).text()
        var bcv = _THIS.m_par.m_bcv
        var rev = _THIS.m_par.m_strTag

        var surl = `https://wdingbox.github.io/mplayer/aubi_player/htm/bible_verse_player.htm?bcv=${bcv}&txt=${txt}`
        window.open(surl, "_blank")
        Uti.Msg(bcv);
    })
}



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
        var bcv = $(this).text().trim()
        if (bcv.length > 0) {
            Uti.copy2clipboard(`(${bcv})`, this)
        }
        if (cbf) cbf(bcv)
        $(`.bcvTag[title='${bcv}']`).addClass("divPopupMenu_CaptionBCV_MemoVerse")
        _THIS.hide()
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
    $("#divPopupMenu_CaptionBCV").text(par.m_bcv)
    if (par.m_bcv) {
        var stores = MyStorage.MostRecentAryInStore("#MemoryVerse")
        var ary = stores.get_ary()
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









//Showup Bookcode - Chapter:Verses
function ShowupBCV() {
    this.m_MainMenuToggler = "#MainMenuToggler"
    this.m_showupBknID = "#bk_name"
    this.m_showupChpId = "#chp_num"
    this.m_showupVrsId = "#vrs_num"
    this.m_minus_ChpId = "#minus_ChpVal"//:--
    this.m_plus_ChpId = "#plus_ChpVal"

    this.init()
}
ShowupBCV.prototype.init = function () {
    ////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function Showup_CV(val_id) {
        this.m_showupValID = val_id
    }
    Showup_CV.prototype.init = function (val_id) {
        this.m_showupValID = val_id
    }
    Showup_CV.prototype.get_showupVal = function () {
        var str = $(this.m_showupValID).text()
        var ival = parseInt(str)
        if (!Number.isInteger(ival)) {
            ival = 0;
        }
        return ival
    }
    Showup_CV.prototype.set_showupVal = function (i) {
        $(this.m_showupValID).text(i)
    }
    Showup_CV.prototype.append_showupVal = function (i) {
        var _THIS = this
        var icap = _THIS.get_showupVal()
        var iupdateCap = icap * 10 + parseInt(i);
        _THIS.set_showupVal(iupdateCap);
    }
    Showup_CV.prototype.detchback = function () {
        var sval = "" + this.get_showupVal()
        var s = sval.substr(0, sval.length - 1)
        this.set_showupVal(s);
        return s
    }
    ////--------------------------------------------
    ////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function Showup_Bk(val_id) {
        this.m_showupBkiID = val_id
    }
    Showup_Bk.prototype.init = function (val_id) {
        this.m_showupBkiID = val_id
    }
    Showup_Bk.prototype.onclick_bkc = function (cbf) {
        $(this.m_showupBkiID).bind("click", function () {
            cbf()
        })
    }
    Showup_Bk.prototype.set_showupBkc = function (bkc) {
        var Bkname = ""
        if (CNST.Cat2VolArr[bkc]) {
            Bkname = bkc
        } else if (bkc) {
            Bkname = CNST.BibVolNameEngChn(bkc, MyStorage.get_select_val("#LanguageSel"))
        }
        $(this.m_showupBkiID).text(Bkname).attr("volcode", bkc);
    }
    Showup_Bk.prototype.get_showupBkc = function () {
        return $(this.m_showupBkiID).attr("volcode");
    }
    Showup_Bk.prototype.get_showup_bkn_info = function (b) {
        var booknamecode = this.get_showupBkc()
        var iMaxChap = -1
        if (booknamecode && booknamecode.length > 0 && _Max_struct[booknamecode]) {
            iMaxChap = Object.keys(_Max_struct[booknamecode]).length;
        }
        return { bkn: booknamecode, maxChp: iMaxChap }
    }
    ////--------------------------------------------

    this.m_Bki = new Showup_Bk(this.m_showupBknID)
    this.m_Chp = new Showup_CV(this.m_showupChpId)
    this.m_Vrs = new Showup_CV(this.m_showupVrsId)
}

ShowupBCV.prototype.update_showup = function (bcv) {
    var par = Uti.parse_bcv(bcv)
    if (par) {
        this.m_Bki.set_showupBkc(par.vol)
        this.m_Chp.set_showupVal(par.chp)
        this.m_Vrs.set_showupVal(par.vrs)
    } else {
        this.m_Bki.set_showupBkc(bcv)
        this.m_Chp.set_showupVal('')
        this.m_Vrs.set_showupVal('')
    }

}
ShowupBCV.prototype.get_selected_bcv_parm = function () {
    var vol = this.m_Bki.get_showupBkc()
    var chp = this.m_Chp.get_showupVal()
    var vrs = this.m_Vrs.get_showupVal()

    var ret = { oj_search: {} }

    if (!vol || vol.length === 0) {
        return ret
    }

    if (CNST.Cat2VolArr[vol]) { //for category: OT
        CNST.Cat2VolArr[vol].forEach(function (bkc) {
            ret.oj_search[bkc] = {}
        })
        return ret;
    }

    ret.oj_search = {}
    ret.oj_search[vol] = {}

    ret.oj_bc = {}
    ret.oj_bc[vol] = {}
    if (chp === 0) {
        return ret
    }

    ret.oj_bc[vol][chp] = {}
    ret.oj_search[vol][chp] = {}

    if (vrs > 0) {
        ret.m_bcv = vol + chp + ":" + vrs
    }
    return ret;
};



ShowupBCV.prototype.goNextChp = function (i) {
    var maxChp = this.m_Bki.get_showup_bkn_info().maxChp
    if (maxChp < 1) return

    var chp = i + this.m_Chp.get_showupVal() //showup chp

    if (chp > maxChp) chp = 1
    if (chp <= 0) chp = maxChp

    this.m_Chp.set_showupVal(chp) //showup chp
}


ShowupBCV.prototype.onclick_Vrs = function (cbfLoadBible) {
    var _This = this

    $(this.m_Vrs.m_showupValID).bind("click", function (evt) {
        evt.stopImmediatePropagation();

        var maxChp = _This.m_Bki.get_showup_bkn_info().maxChp
        //if (maxChp < 1) return

        var vrs = _This.m_Vrs.get_showupVal()

        _This.m_Vrs.detchback()
        cbfLoadBible(0)
    });
}
ShowupBCV.prototype.onclick_Chp = function (cbfLoadBible) {
    var _This = this
    $(this.m_Chp.m_showupValID).bind("click", function (evt) {
        evt.stopImmediatePropagation();

        var vrs = "" + _This.m_Chp.get_showupVal()
        if (vrs.length > 0) {
            _This.m_Chp.detchback()
            _This.m_Vrs.set_showupVal("")
            cbfLoadBible(1)
        } else {
            _This.m_Vrs.set_showupVal("")
            cbfLoadBible(0)
        }
    });

    $(this.m_minus_ChpId).bind("click", function (evt) {
        evt.stopImmediatePropagation();

        var maxChp = _This.m_Bki.get_showup_bkn_info().maxChp
        if (maxChp < 1) return

        _This.m_Vrs.set_showupVal("")
        _This.goNextChp(-1)
        cbfLoadBible(1)
    });

    $(this.m_plus_ChpId).bind("click", function (evt) {
        evt.stopImmediatePropagation();

        var maxChp = _This.m_Bki.get_showup_bkn_info().maxChp
        if (maxChp < 1) return

        _This.m_Vrs.set_showupVal("")
        _This.goNextChp(+1)
        cbfLoadBible(1)
    });
}
ShowupBCV.prototype.onclick_face = function (cbfLoadBible) {
    var _This = this

    $(this.m_MainMenuToggler).bind("click", function () {
        cbfLoadBible()
    })
}
ShowupBCV.prototype.setAsChildren = function () {
    var _This = this

    $(this.m_MainMenuToggler).css("background-color", "#00aaaa")
    $("body").attr("onbeforeunload", null)
}
////////////////-------------------////////////////////////////////









function SingleKeyInputPanel(tbody) {
    if (!tbody) {
        tbody = "#SingleKeywordsBody"
    }
    this.m_tbody = tbody

}
SingleKeyInputPanel.prototype.rm_hili = function () {
    $(".vin").removeClass("hili");
}
SingleKeyInputPanel.prototype.gen_panel = function (par) {
    var ks = this.get_cha_arr_after_str("", _Max_struct);

    var s = "<tr id='vitr'>";
    var _This = this;
    $.each(ks, function (i, c) {
        var volarr = _This.Get_Vol_Arr_from_KeyChar(c, _Max_struct);
        var vintype = (["1", "2", "3"].indexOf(c) >= 0) ? "vinNum" : "vinCap"
        var ssb = "<sub>" + volarr.length + "</sub>";
        if (volarr.length === 1) ssb = "";
        c = c + ssb;
        s += `<th><div class='vin ${vintype}'>${c}</div></th>`;
        if (9 == i) s += "</tr><tr>";
    });
    s += "</tr>";

    $(this.m_tbody).html(s).find(".vin").bind("click", function () {
        var alreadyHili = $(this)[0].classList.contains('hiliKbd')
        console.log("alreadyHili", alreadyHili)

        $(".vin").removeClass("hiliKbd");
        $(this).addClass("hiliKbd");
        //

        var ch = $(this).text();
        var volarr = _This.Get_Vol_Arr_from_KeyChar(ch[0], _Max_struct);

        if (!par) return console.error("par is null")
        setTimeout(function () {
            if (par && par.onClickItm) par.onClickItm(ch, volarr, alreadyHili)
        }, 100)
    });
    return ks;
}
SingleKeyInputPanel.prototype.get_cha_arr_after_str = function (str, BibleObjStruct) {
    if (!BibleObjStruct) return [];
    var ret = {};
    Object.keys(BibleObjStruct).forEach(function (v) {
        if (v.indexOf(str) == 0) {
            var idx = str.length;
            if (v.length > idx) {
                var ch = v[idx];
                if (!ret[ch]) ret[ch] = 0;
                ret[ch]++;
            }
        }
    });
    var ks = Object.keys(ret).sort();

    //put numbers at tail.
    for (var i = 0; i < 3; i++) {
        var num = ks.shift()
        ks.push(num)
    }

    return ks;
}
SingleKeyInputPanel.prototype.Get_Vol_Arr_from_KeyChar = function (ch) {
    var arr = [];
    var BkAry = Object.keys(_Max_struct)
    if (ch.length != 1) return BkAry
    BkAry.forEach(function (vol) {
        var keycod = vol[0]
        if (!Number.isInteger(parseInt(ch)) && Number.isInteger(parseInt(keycod))) {
            keycod = vol[1] //:J, 1Jn
        }

        if (ch === keycod) {
            arr.push(vol);
        }
    });
    return arr;
}





function SingleKeyOutputBooksTable(tid) {
    this.m_id = tid; //"#Tab_OutputBooksList"
    this.cbf_onClickItm = null
}
SingleKeyOutputBooksTable.prototype.init = function (par) {
    var _THIS = this
    $(this.m_id).bind("click", function () {
        //$(_THIS.m_id).hide()
    }).hide().draggable();
    this.cbf_onClickItm = par.onClickItm
}
SingleKeyOutputBooksTable.prototype.get_selary = function () {
    var vol_arr = []
    $(".v3.hili").each(function () {
        var svol = $(this).text();
        vol_arr.push(svol);
    });
    return vol_arr
}
SingleKeyOutputBooksTable.prototype.ary_To_trs = function (vol_arr) {
    var trarr = [];
    var custom_cat_ary = MyStorage.getCustomCatAry()
    vol_arr.forEach(function (vol, i) {
        var hili = "";//(0 === i) ? "hili" : ""
        var cls = `class='v3 ${hili} ${CNST.BibVol_OTorNT(vol)}' vol='${vol}'`;
        //<td align='right'>"+BiBookName[vol][0]+"</td>
        var iMaxChap = Object.keys(_Max_struct[vol]).length;

        var cls_custom = 'custom_cat'
        if (custom_cat_ary.indexOf(vol) >= 0) {
            cls_custom += ' Custom_Selected_Book_Category'
        }

        trarr.push(`<tr ${cls}><td class='${cls_custom}'>${vol}</td><td>${CNST.BibVolNameEngChn(vol, MyStorage.get_select_val("#LanguageSel"))}</td><td>${iMaxChap}</td></tr>`);
    });
    return trarr.join("");
}
SingleKeyOutputBooksTable.prototype.show = function (bShow) {
    if (bShow) {
        $(this.m_id).show()
    } else {
        $(this.m_id).hide()
    }
}

SingleKeyOutputBooksTable.prototype.Popup_BookList_Table = function (scat, vol_arr, alreadyhili, Yoffset) {

    if (!scat || vol_arr.length === 0) {
        $(this.m_id).hide()
        return
    }
    var _THIS = this
    var tid = this.m_id + " tbody"
    var bcr = $("#menuContainer")[0].getBoundingClientRect();
    var h2 = parseInt(Yoffset);

    var trs = this.ary_To_trs(vol_arr);

    $(tid).html(trs).find(".v3").bind("click", function () {

        if ("Custom" === scat) {
            //$(".v3.hili").removeClass("hili");
            $(this).find("td.custom_cat").toggleClass("Custom_Selected_Book_Category");
            var custom_cat_ary = []
            $(".custom_cat.Custom_Selected_Book_Category").each(function () {
                var tx = $(this).text()
                custom_cat_ary.push(tx)
            })
            Uti.Msg(custom_cat_ary)
            MyStorage.setCustomCatAry(custom_cat_ary)
        } else if (scat.length > 0) {
            var vol = $(this).attr("vol");
            _THIS.cbf_onClickItm(vol)
            $(_THIS.m_id).hide()
        }
    });

    if (alreadyhili) {
        $(this.m_id).css('top', bcr.y + h2).css('left', bcr.x).toggle();//.slideToggle()
    } else {
        $(this.m_id).css('top', bcr.y + h2).css('left', bcr.x).show()
    }

    if (vol_arr.length === -1) {//auto setup problematic
        setTimeout(() => {
            $(tid).find(".v3").each(function () {
                $(this).find("td").addClass("hili");
                $(this).trigger("click")
            })
        }, 2000)
        return
    }
};





















///var d1 = new DigitNumberInputPanel("digiChp", "#DigitOfChapt", "chp_num", showup);
function DigitNumberInputZone() {
    this.m_showup = null
}
DigitNumberInputZone.prototype.init_digi = function (shwup) {
    this.m_showup = shwup
    ///////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function DigitNumberSet(parent) {
        this.m_tbody = null
        this.m_parent = parent
    }
    DigitNumberSet.prototype.Gen_Digits = function (tbody, clsname) {
        if (!tbody) {
            tbody = "#DigitOfChapt"
        }
        this.m_tbody = tbody
        this.m_classname = clsname

        function _td(num, clsname) {
            var s = `<th><button class='digit  ${clsname}' title='${clsname}'>${num}</button></th>`;
            return s;
        }
        function gen_trs(clsname) {
            var s = "", num = 1;
            s += `<tr>`;
            for (var i = 1; i < 10; i++) {
                s += _td(num++, clsname);
            };
            s += _td(0, clsname) + `<td class='imax'>max</td></tr>`;
            return s;
        };

        var s = gen_trs(this.m_classname);
        $(this.m_tbody).html(s)
        this.disable_all_digiKey(true);
        return
    }
    DigitNumberSet.prototype.set_max = function (imax) {
        $(this.m_tbody).find(".imax").text(imax);
    }
    DigitNumberSet.prototype.disable_all_digiKey = function (b) {
        $(this.m_tbody).find(".digit").attr("disabled", b);
    }
    DigitNumberSet.prototype.disable_zero_only = function () {
        this.disable_all_digiKey(false)
        $(this.m_tbody).find(".digit:contains('0')").attr("disabled", true);
    }
    ///////====================================================================

    this.m_Chp = new DigitNumberSet(this)
    this.m_Vrs = new DigitNumberSet(this)

    this.m_Chp.on_Click_Digit = function (cbfLoadBible) {
        this.m_cbfLoadBible = cbfLoadBible
        var _THIS = this

        $(this.m_tbody).find("." + _THIS.m_classname).bind("click", function () {
            var dici = $(this).text();
            _THIS.m_parent.m_showup.m_Chp.append_showupVal(dici)

            _THIS.m_parent.init_Chp_digiKeys_by_vol()
            _THIS.m_parent.init_Vrs_digiKeys_by_vol()

            $(".hili_digi_key").removeClass("hili_digi_key")
            $(this).addClass("hili_digi_key")

            cbfLoadBible()
        });
    }
    this.m_Chp._enable_key = function (vol, chp) {
        $(this.m_tbody).find(".digit").each(function () {
            var dici = parseInt($(this).text());
            var schp = (chp * 10 + dici)
            if (undefined === _Max_struct[vol][schp]) {
                $(this).attr("disabled", true);
            } else {
                $(this).attr("disabled", false);
            }
        });
    }
    this.m_Vrs.on_Click_Digit = function (cbfLoadBible) {
        this.m_cbfLoadBible = cbfLoadBible
        var _THIS = this

        $(this.m_tbody).find("." + _THIS.m_classname).bind("click", function () {
            var dici = $(this).text();
            _THIS.m_parent.m_showup.m_Vrs.append_showupVal(dici)

            _THIS.m_parent.init_Vrs_digiKeys_by_vol()

            $(".hili_digi_key").removeClass("hili_digi_key")
            $(this).addClass("hili_digi_key")

            cbfLoadBible()
        });
    }
    this.m_Vrs._enable_key = function (vol, chp, vrs) {
        function _enable_key(vol, chp, vrs, dici) {
            var vrs = (vrs * 10 + dici)
            return (undefined === _Max_struct[vol][chp][vrs])
        }
        $(this.m_tbody).find(".digit").each(function () {
            var dici = parseInt($(this).text());
            var bret = _enable_key(vol, chp, vrs, dici)
            $(this).attr("disabled", bret);
        });
    }
}
DigitNumberInputZone.prototype.init_Chp_digiKeys_by_vol = function () {
    var vol = this.m_showup.m_Bki.get_showupBkc();// $(this.m_volID).attr("volcode")
    var chp = this.m_showup.m_Chp.get_showupVal();  //()
    var _THIS = this

    if (!vol || CNST.Cat2VolArr[vol]) {
        this.m_Chp.disable_all_digiKey(true)
        return
    }
    var iMaxChap = Object.keys(_Max_struct[vol]).length;
    this.m_Chp.set_max(iMaxChap)
    if (0 === chp) {
        if (1 === iMaxChap) {
            this.m_showup.m_Chp.append_showupVal(1)
            if (this.m_Chp.m_cbfLoadBible) this.m_Chp.m_cbfLoadBible()
        } else if (iMaxChap >= 9) {
            this.m_Chp.disable_zero_only()
        } else {
            this.m_Chp._enable_key(vol, chp)
        }
    } else {
        this.m_Chp._enable_key(vol, chp)
    }
    return iMaxChap
}
DigitNumberInputZone.prototype.init_Vrs_digiKeys_by_vol = function () {
    var vol = this.m_showup.m_Bki.get_showupBkc(); // $(this.m_volID).attr("volcode")
    var chp = this.m_showup.m_Chp.get_showupVal(); //
    var vrs = this.m_showup.m_Vrs.get_showupVal();//


    if (!vol || !chp) {
        this.m_Vrs.disable_all_digiKey(true)
        return
    }
    var iMaxVrs = Object.keys(_Max_struct[vol][chp]).length;
    this.m_Vrs.set_max(iMaxVrs)
    if (0 === vrs) {
        if (iMaxVrs >= 9) {
            this.m_Vrs.disable_zero_only()
        } else {
            this.m_Vrs._enable_key(vol, chp, vrs)
        }
    } else {
        this.m_Vrs._enable_key(vol, chp, vrs)
    }
}
////////////////




























function Tab_Category() {
    this.m_tabid = "#Tab_CatagryOfBooks"
}
Tab_Category.prototype.rm_hili = function () {
    $(".cat").removeClass("hili");
}
Tab_Category.prototype.Gen_Cat_Table = function (par) {

    $(this.m_tabid + " caption").click(function () {
        $(".cat").removeClass("hili");
        $(".v3").remove();

        if (par && par.onClickItm) par.onClickItm("", [], true)
    });

    var _This = this;
    var s = "";
    $.each(Object.keys(CNST.Cat2VolArr), function (i, v) {
        s += "<tr><td class='cat'>" + v + "</td></tr>";
    });
    $(this.m_tabid + " tbody").html(s).find(".cat").bind("click", function () {
        var alreadyHili = $(this)[0].classList.contains('hili')

        $(".cat").removeClass("hili");
        var scat = $(this).addClass("hili").text();

        var vol_arr = CNST.Cat2VolArr[scat];
        if ("Custom" === scat) {
            vol_arr = Object.keys(_Max_struct)
        }

        if (par && par.onClickItm) par.onClickItm(scat, vol_arr, alreadyHili)
    });
}














function Tab_DocumentsClusterList(tid) {
    this.m_tbid = tid // "#Tab_NamesOfBibleDocuments"
    this.m_onClickItm2Select = null
    this.m_selectedItems_ary = MyStorage.LastSelectedDocsList();//["CUVS"] //default
}
Tab_DocumentsClusterList.prototype.Init_Docs_Table = function (parm) {
    this.m_onClickItm2Select = parm.onClickItm
    this.Set_TabState("Selection")

    var _THIS = this
    $(this.m_tbid + " caption").find(".docSwitch").on("click", function () {
        var val = $(this).attr("title")

        _THIS.Set_TabState(val)
    })
}
Tab_DocumentsClusterList.prototype.Set_TabState = function (val) {

    var _THIS = this
    $(this.m_tbid + " caption").find(".HiliSelctedDoc").removeClass("HiliSelctedDoc")
    $(this.m_tbid + " caption").find(".HiliSelctedDocFromTag").removeClass("HiliSelctedDocFromTag")
    $(this.m_tbid + " caption").find(`*[title=${val}]`).addClass("HiliSelctedDoc")
    $("#Tab_NamesOfBibleDocuments_caps").text(val)
    switch (val) {
        case "Selection": _THIS.Gen_table_for_Documents(); break;
        case "Sequences": _THIS.Gen_table_for_Sequencer(); break;
        default: alert("fatal error")
    }
}

Tab_DocumentsClusterList.prototype.Gen_table_for_bcvTag = function (par) {
    //BCVtagClusterInfo = { tags: tags, trID: trID }
    var clusterinfo = par.BCVtagClusterInfo;
    var AllDocsArr = Object.keys(CNST.FnameOfBibleObj);
    var selary = clusterinfo.tags

    var _THIS = this

    var trs = ""
    $.each(AllDocsArr, function (i, v) {
        var hil = "";
        if (selary.indexOf(v) >= 0) hil = "hili";
        trs += `<tr><td class='cbkn ${hil}'>${v}</td></tr>`;
    });

    function get_selectedDocs() {
        var ar = []
        $(".cbkn.hili").each(function () {
            var tx = $(this).text().trim()
            ar.push(tx)
        })
        return ar
    }

    $(this.m_tbid + " caption").find(".HiliSelctedDoc").removeClass("HiliSelctedDoc")
    $(this.m_tbid + " caption").find("button:eq(0)").addClass("HiliSelctedDocFromTag")


    $(this.m_tbid + " tbody").html(trs).find(".cbkn").bind("click", function () {
        $(this).toggleClass("hili")
        par.BCVtagClusterInfo.newselary = get_selectedDocs()
        _THIS.m_onClickItm2Select(par)
    });
}
Tab_DocumentsClusterList.prototype.Gen_table_for_Documents = function () {
    var str = "";
    var _THIS = this
    var bknArr = Object.keys(CNST.FnameOfBibleObj);

    $.each(bknArr, function (i, v) {
        var hil = "";
        if (_THIS.m_selectedItems_ary.indexOf(v) >= 0) hil = "hili";

        if (v[0] === "e") hil += " e_EditableDoc"
        str += `<tr><td class='cbkn  ${hil}'>${v}</td></tr>`;
    });


    function update_seletedItems(_this) {
        var alreadyHili = $(_this)[0].classList.contains('hili')

        var name = $(_this).text();

        if (alreadyHili) {//will be deselected and removed
            var idx = _THIS.m_selectedItems_ary.indexOf(name)
            if (_THIS.m_selectedItems_ary.length > 1) {
                _THIS.m_selectedItems_ary.splice(idx, 1) //remove size 1 @idx.
            }
        } else {//will be selected and added back
            if ("e_Subtitle" === name) {
                _THIS.m_selectedItems_ary.unshift(name)
            } else {
                var pos = _THIS.m_selectedItems_ary.indexOf("e_Summary")
                if (pos >= 0) {
                    _THIS.m_selectedItems_ary.splice(pos, 0, name) //insert before summary.
                } else {
                    _THIS.m_selectedItems_ary.push(name) //push back.
                }
            }
        }
        _THIS.m_selectedItems_ary.sort()
        var pos = _THIS.m_selectedItems_ary.indexOf("e_Subtitle")
        if (pos > 0) {
            _THIS.m_selectedItems_ary.splice(pos, 1);
            _THIS.m_selectedItems_ary.unshift("e_Subtitle") //mv to first.
        }
        MyStorage.LastSelectedDocsList(_THIS.m_selectedItems_ary)
        Uti.Msg(name + " : " + CNST.FnameOfBibleObj[name]);
    }
    function update_hili(_this) {
        $(_this).toggleClass("hili");
        var nsel = $(".cbkn.hili").size()
        if (nsel === 0) {//keep at least one.
            $(_this).addClass("hili")
            alert("Minimun 1 must be selected.")
        }

    }


    $(this.m_tbid + " tbody").html(str).find(".cbkn").bind("click", function () {
        update_seletedItems(this)
        update_hili(this)
        _THIS.m_onClickItm2Select("reloadtable")
    });
}
Tab_DocumentsClusterList.prototype.Gen_table_for_Sequencer = function () {
    var _THIS = this
    var bknArr = Object.keys(CNST.FnameOfBibleObj);


    var str = "";
    $.each(_THIS.m_selectedItems_ary, function (i, v) {
        var hil = "hili";

        str += `<tr><td class='cbkn ${hil}'>${v}</td></tr>`;
    });

    function moveup_selitm(_this, i) {
        var name = $(_this).text();
        var idx = _THIS.m_selectedItems_ary.indexOf(name)
        if (1 === i) {//move up
            if (idx === 0) {
                var tmp = _THIS.m_selectedItems_ary.shift()
                _THIS.m_selectedItems_ary.push(tmp)
            } else {
                var tmp = _THIS.m_selectedItems_ary[idx - 1]
                _THIS.m_selectedItems_ary.splice(idx + 1, 0, tmp) //insert after idx
                _THIS.m_selectedItems_ary.splice(idx - 1, 1) //rm prev
            }
        }
        if (-1 === i) {//move down
            if (idx === _THIS.m_selectedItems_ary.length - 1) {
                var tmp = _THIS.m_selectedItems_ary.pop()
                _THIS.m_selectedItems_ary.unshift(tmp)
            } else {
                var tmp = _THIS.m_selectedItems_ary[idx]
                _THIS.m_selectedItems_ary.splice(idx + 2, 0, tmp) //insert after idx
                _THIS.m_selectedItems_ary.splice(idx, 1) //rm prev
            }
        }
        MyStorage.LastSelectedDocsList(_THIS.m_selectedItems_ary)
    }

    $(this.m_tbid + " tbody").html(str).find(".cbkn").bind("click", function () {
        $(this).unbind()
        moveup_selitm(this, +1)
        _THIS.Gen_table_for_Sequencer()
        _THIS.m_onClickItm2Select("reloadtable")
    });
}


Tab_DocumentsClusterList.prototype.get_selected_seq_fnamesArr = function () {
    return this.m_selectedItems_ary
};///




function Tab_DocumentSelected_Search(tid) {
    //this.m_tbid = tid // "#Tab_NamesOfBibleDocuments"
    this.cbf_click_doc_to_run_search = null

    //this.m_selectedItems_ary = MyStorage.LastSelectedDocsList();//["CUVS"] //default
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
    //$("#Btn_InSvr").on("click", function () {
    //    _THIS.onclick_inSvr_BibleObj_search_str()
    //})
    $("#searchNextresult").on("click", function () {
        $(this).text(".....")
        $("#sinput").val("").focus()
    })
    $("#RemoveSearchStrn").on("click", function () {
        var ar = []
        $("#Tab_regex_history_search").find(".option").each(function () {
            var tx = $(this).text().trim()
            if ($(this).hasClass("hili")) {
                $(this).parentsUntil("tbody").empty()
            } else {
                ar.push(tx)
            }
        })
        MyStorage.MostRecentSearchStrn.set_ary(ar)
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

    this.gen_search_strn_history()
}


Tab_DocumentSelected_Search.prototype.gen_search_strn_history = function () {
    if (undefined === document.m_SearchStrnInPage) document.m_SearchStrnInPage = ""
    var s = document.m_SearchStrnInPage

    var trs = ""
    var ar = MyStorage.MostRecentSearchStrn.get_ary()
    ar.forEach(function (strn) {
        var matcls = (s === strn.trim()) ? "SearchStrnInPage" : ""
        if (strn.trim().length > 0) {
            trs += (`<tr><td class='option ${matcls}'>${strn}</td></tr>`);
        }
    })

    //history
    //console.log(ret);
    $("#Tab_regex_history_search tbody").html(trs).find(".option").bind("click", function () {
        $(this).toggleClass("hili");
        var s = $(this).text().trim();
        $("#sinput").val(s);
    });


}
Tab_DocumentSelected_Search.prototype.onclick_inSvr_BibleObj_search_str = function () {
    $("#Btn_Prev, #Btn_Next").hide()

    var s = $("#sinput").val().trim();
    if (s.length === 0) return alert("empty input")

    MyStorage.MostRecentSearchStrn.addonTop(s)
    this.gen_search_strn_history()
    document.g_NextIndex = -1



    this.cbf_click_doc_to_run_search()


    //test
    var unicds = "";
    for (var i = 0; i < s.length; i++) {
        var ch = s.charCodeAt(i);
        if (ch > 512) {
            unicds += "\\u" + ch.toString(16);
        }
    }
    Uti.Msg(s, "unicode:", unicds);
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
        _THIS.onclick_inSvr_BibleObj_search_str()
    })
}



function Tab_MostRecentBody(bSingpleSel) {
    this.m_tbodyID = null; //"#Tab_MostRecent_BCV"
    this.m_bSingleSel = bSingpleSel
}
Tab_MostRecentBody.prototype.init = function (tbodyID) {
    this.m_tbodyID = tbodyID
    this.m_MostRecentInStore = MyStorage.MostRecentAryInStore(tbodyID)
    this.m_bcvHistory = this.m_MostRecentInStore.get_ary()
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

    this.m_MostRecentInStore.addonTop(bcv)
    this.m_bcvHistory = this.m_MostRecentInStore.get_ary()
    this.m_bcvHistory = this.m_bcvHistory.slice(0, 100) //:max in size. fetch idx range [0, 100].
    this.update_tab()
}

Tab_MostRecentBody.prototype.update_tab = function () {
    var _THIS = this
    var trs = ""
    this.m_bcvHistory.forEach(function (vcv, i) {
        trs += (`<tr><td>${vcv}</td></tr>`)
    });

    $(this.m_tbodyID).html(trs).find("td").bind("click", function (evt) {
        evt.stopImmediatePropagation()

        if (_THIS.m_bSingleSel) {
            $(_THIS.m_tbodyID).find(".hili").removeClass("hili")
        }

        $(this).toggleClass("hili")
        var hiliary = []
        $(this).parentsUntil("table").find(".hili").each(function () {
            hiliary.push($(this).text())
        })

        if (_THIS.m_onClickHistoryItm) _THIS.m_onClickHistoryItm(hiliary)
    })
}
Tab_MostRecentBody.prototype.clearHistory = function (idtxtout) {
    var _THIS = this

    _THIS.m_MostRecentInStore.cleanup()
    var n = 0;
    $(this.m_tbodyID).find("td").each(function () {
        var tx = $(this).text().trim()
        if ($(this)[0].classList.contains("hili")) {
            $(this).parent().hide()
            n++
        } else {
            _THIS.m_MostRecentInStore.addonTop(tx)
        }
    })
    if (n === 0) alert("nothing is selected to delete.")
    this.m_bcvHistory = _THIS.m_MostRecentInStore.get_ary()

    //this.MyStorage_add2HistoryMostRecentBook(this.m_bcvHistory)

    var std_bcv_strn = this.m_bcvHistory.join(", ")
    Uti.Msg(std_bcv_strn)
    var ret = Uti.convert_std_bcv_str_To_uniq_biblicalseq_splitted_ary(std_bcv_strn)
    Uti.Msg(ret)
    var stdbcv = Uti.convert_std_uniq_biblicalseq_splitted_ary_To_dashed_strn(ret.biblical_order_splitted_ary)
    Uti.Msg(stdbcv)
}
Tab_MostRecentBody.prototype.toggleSelAll = function () {
    $(this.m_tbodyID).find("td").toggleClass("hili")
}
Tab_MostRecentBody.prototype.sortAllItems = function () {
    this.m_bcvHistory.sort()
    this.update_tab()
}




function Tab_MostRecent_BCV() {
    this.m_tableID = "#Tab_MostRecent_BCV"

}

Tab_MostRecent_BCV.prototype.init = function () {
    var _THIS = this
    this.m_tbodies = {
        MemoryVerse: new Tab_MostRecentBody(false),
        RecentBooks: new Tab_MostRecentBody(true),
        RecentTouch: new Tab_MostRecentBody(false),
    }
    //this.m_Tab_HistoryMostRecentBodyMarks = new Tab_MostRecentBody()
    this.m_tbodies.RecentTouch.init("#RecentTouch")
    this.m_tbodies.RecentBooks.init("#RecentBooks")
    this.m_tbodies.MemoryVerse.init("#MemoryVerse")

    //var cap = _THIS.getCap()
    _THIS.show_all(false)
    _THIS.m_tbodies["RecentTouch"].show(true)
    $("#Tab_MostRecent_BCV_caps").text("RecentTouch")


    $(this.m_tableID).find("caption:eq(0)").find("button").bind("click", function () {
        _THIS.show_all(false)
        $("#save2Repo").hide()
        $("#load2Repo").hide()
        var cap = $(this).attr("title")
        $("#Tab_MostRecent_BCV_caps").text(cap)
        _THIS.m_tbodies[cap].show(true)
        $(this).parent().find(".ColorRecentMarks").removeClass("ColorRecentMarks")
        $(this).addClass("ColorRecentMarks")
        if (cap === "MemoryVerse") {
            $("#save2Repo").show()
            $("#load2Repo").show()
        }
    });

    $("#clearUnse").bind("click", function () {
        var cap = _THIS.getCap()
        _THIS.m_tbodies[cap].clearHistory()
    })
    $("#toggleSel").bind("click", function () {
        var cap = _THIS.getCap()
        _THIS.m_tbodies[cap].toggleSelAll()
    })
    $("#sortTbIts").bind("click", function () {
        var cap = _THIS.getCap()
        _THIS.m_tbodies[cap].sortAllItems()
    })
    $("#save2Repo").on("click", function () {
        var This = this
        //$(this).text("...")
        Uti.Msg("#save2Repo")
        MyStorage.Repo_save(function (ret) {
            //$(This).html("&#9635;")
            //Uti.show_save_results(ret, "#StorageRepo_save_res")
            //$("#StorageRepo_save").prop("checked", false)
        })
    })
    $("#load2Repo").on("click", function () {
        var This = this
        Uti.Msg("#load2Repo")
        MyStorage.Repo_load(function (ret) {
            console.log(ret)
            if (ret.out.data) {
                var ar = ret.out.data["#MemoryVerse"]
                if (ar) {
                    if (!confirm(ar.length + " items were loaded from svr.\nUpdate list?")) return;
                    for (var i = 0; i < ar.length; i++) {
                        var bcv = ar[i]
                        markHistory.addnew2table("MemoryVerse", bcv)
                    }
                }
            } else {
                alert("failed to load.")
            }
        })
    })
}
Tab_MostRecent_BCV.prototype.getCap = function () {
    var cap = $(this.m_tableID).find("caption:eq(0)").find(".ColorRecentMarks").text().trim()
    var capmap = { "B": "RecentBooks", "T": "RecentTouch", "M": "MemoryVerse" }
    var scap = capmap[cap]
    $("#Tab_MostRecent_BCV_caps").text(scap)
    return scap
}

Tab_MostRecent_BCV.prototype.onClickHistoryItem = function (onClickHistoryItm) {
    this.m_tbodies.RecentTouch.onClickHistoryItem(onClickHistoryItm)
    this.m_tbodies.RecentBooks.onClickHistoryItem(onClickHistoryItm)
    this.m_tbodies.MemoryVerse.onClickHistoryItem(onClickHistoryItm)
}
Tab_MostRecent_BCV.prototype.addnew2table = function (itm, bcv) {
    this.m_tbodies[itm].addnew2table(bcv)
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









function GroupsMenuMgr() {
    this.m_grpContainerID = "#GroupsContainer"
}
GroupsMenuMgr.prototype.close_others_of = function (sid) {
    var _THIS = this
    //close others
    $(`.GrpMenuItemHili[sid!='${sid}']`).removeClass("GrpMenuItemHili").each(function () {
        var sid = $(this).attr("sid")
        $("#" + sid).hide()
    })
    _THIS.m_popupBookList.show(false)
}
GroupsMenuMgr.prototype.gen_grp_bar = function (popupBookList, hist) {
    this.m_popupBookList = popupBookList

    var _THIS = this

    $(this.m_grpContainerID).find("div:eq(0)").find("a[sid]").on("click", function () {
        var sid = $(this).attr("sid");
        $("#" + sid).slideToggle()
        _THIS.close_others_of(sid)

        $(this).toggleClass("GrpMenuItemHili")
    })

    /////

    $("#Check_bcv").click(function () {
        var str = $("#txtarea").val()

        var bcvAry = CNST.StdBcvAry_FromAnyStr(str)
        if (bcvAry.length > 0) {
            str = bcvAry.join()
        }

        var ret = Uti.convert_std_bcv_str_To_uniq_biblicalseq_splitted_ary(str)
        Uti.Msg(ret)
        Uti.Msg(ret.biblical_order_splitted_ary.join(", "))

        ////
        //const urlParams = new URLSearchParams(window.location.search);
        //const ip = urlParams.get('ip');
        var htm = ""
        ret.biblical_order_splitted_ary.forEach(function (v, i) {
            hist.m_tbodies.RecentTouch.addnew2table(v)
            var sln = `<a href='#${v}'>${v}</a>`
            htm += `${sln} | `
        })
        $("#operation_res").html(htm)
        Uti.Msg(htm)

        str = Uti.convert_std_bcv_in_text_To_linked(str)
        Uti.Msg(str)
    });


    $("#NewPage").attr("href", window.location.href)



    $("#Storage_local_repos_exchange").on("click", function () {
        Uti.open_child_window("./myStorageRepos.htm", function (data) {
            Uti.Msg("fr child win:", data)
        })
    })

    $("#account_default").on("click", function () {
        $("#repopath").val("https://github.com/bsnp21/pub_test01.git")
        $("#passcode").val("")
    })
    $("#share_public").on("click", function () {
        var tx = $("#repodesc").val('*')
        //var d = new Date()
        //$("#repodesc").val(d.toISOString().substr(0, 10) + "," + d.toLocaleTimeString() + ". " + tx)
    })
    $("#share_private").on("click", function () {
        var tx = $("#repodesc").val('')
        //var d = new Date()
        //$("#repodesc").val(d.toISOString().substr(0, 10) + "," + d.toLocaleTimeString() + ". " + tx)
    })
    $("#account_helper").on("click", function () {
        Uti.open_child_window("./mySignIn.htm", function (data) {
            MyStorage.Repositories().repos_app_set(data)
        })
    })


    $("#account_updateStatus").on("click", function () {
        MyStorage.Repositories().repos_app_update()
        PageUti.repo_status("#account_set_info")
        $("#idatetiemstampe").text((new Date()).toString())
    })

    //  Readonly now.
    //  $("#repopath").bind("focus", function () {
    //      PageUti.Repositories_History("#outConfig", 1)
    //  })
    $("#repodesc").on("focus", function () {
        PageUti.Repositories_History("#account_set_info", 2)
        MyStorage.Repositories().repos_app_update()
    })

    //$("#cacheTTL").on("change, keyup, click, blur", function () {
    //    MyStorage.cacheTTL($(this).val())
    //})


    //  $("#passcode").bind("focus", function () {
    //      PageUti.Repositories_History("#outConfig", -1)
    //  })

    $("#passcode_toggler").on("click", function () {
        var tx = $("#passcode").attr("type")
        console.log(tx, btoa(tx), atob(btoa(tx)))
        if (tx === "password") tx = "text"
        else tx = "password"
        $("#passcode").attr("type", tx)
    })

    $("#Storage_clear").on("change", function () {
        MyStorage.clear();
        var _THIS = this
        setTimeout(function () {
            $(_THIS).prop('checked', false);
        }, 3000)
    })


    $(".StorageRepo_Signout").on("click", function () {
        if (!confirm("Are you sure to sign out? \n\n (it could be destroyed permenantly).")) return;

        var api = new BsnpRestApi()
        api.run(RestApi.ApiUsrReposData_destroy, {

        }, function (ret) {
            $("body").attr("onbeforeunload", null)
            window.open("./index.htm", "_self")
        })
    })
}
GroupsMenuMgr.prototype.sel_default = function (sid) {
    if (!sid) sid = "Keyboard"
    var sid = "grp_" + sid
    $(this.m_grpContainerID).find(`a[sid='${sid}']`).addClass("GrpMenuItemHili")
    $("#" + sid).show();
    this.close_others_of(sid)
    $("#menuContainer").show()
}
GroupsMenuMgr.prototype.collapse = function () {
    $(".GrpMenu").hide()
    $(".GrpMenuItemHili").removeClass("GrpMenuItemHili")
}



var groupsMenuMgr = new GroupsMenuMgr()


var tab_DocumentSelected_Search = new Tab_DocumentSelected_Search()


var showup = new ShowupBCV() // ShowupBknChpVrsPanel()
var skinp = new SingleKeyInputPanel()
var digi = new DigitNumberInputZone()
var skout = new SingleKeyOutputBooksTable("#Tab_OutputBooksList")

var tab_category = new Tab_Category()
var markHistory = new Tab_MostRecent_BCV()

var tab_documentsClusterList = new Tab_DocumentsClusterList("#Tab_NamesOfBibleDocuments")

var popupMenu = new PopupMenu()



var AppInstancesManager = function () {
}
AppInstancesManager.prototype.init = function (cbf) {
    var _This = this

    $("#idatetiemstampe").text((new Date()).toString())


    $("body").prepend(BibleInputMenuContainer);
    $("#menuContainer").draggable();
    $('*').on('click', function (e) {
        e.stopPropagation();
    });
    $("body").bind("click", function (evt) {
        evt.stopImmediatePropagation();
        //$("#menuContainer").hide()
        $("#divPopupMenu").hide()
        $("#Tab_OutputBooksList").hide()
        groupsMenuMgr.collapse()
        //popupMenu.hide()
    })

    groupsMenuMgr.gen_grp_bar(skout, markHistory)




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
        if (ret && ret.m_bcv) markHistory.m_tbodies.RecentTouch.addnew2table(ret.m_bcv)

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
        skout.show(false)
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


    skout.init({
        onClickItm: function (vol) {
            showup.m_Bki.set_showupBkc(vol);
            showup.m_Chp.set_showupVal("")
            showup.m_Vrs.set_showupVal("")

            digi.init_Chp_digiKeys_by_vol()
            digi.init_Vrs_digiKeys_by_vol()

            var bcv = `${vol}1:1`
            markHistory.m_tbodies.RecentTouch.addnew2table(bcv)
            //markHistory.m_tbodies.RecentBooks.addnew2table(bcv)
            //d1.init_Chp_digiKeys_by_vol()
            //d2.disable_all_digiKey(true)

            Uti.Msg(vol + " : maxChap = " + Object.keys(_Max_struct[vol]).length + "\n\n\n");

            $("#oBible").html(`<h1>Please select chapter number for ${vol}.</h1>`)

        }
    })



    skinp.gen_panel({
        onClickItm: function (ch, volary, alreadyhili) {
            skout.Popup_BookList_Table(ch, volary, alreadyhili, 90)

            tab_category.rm_hili()
        }
    })

    tab_category.Gen_Cat_Table({
        onClickItm: function (scat, volary, alreadyHili) {
            skout.Popup_BookList_Table(scat, volary, alreadyHili, 2);
            skinp.rm_hili()

            //showup.m_Bki.set_showupBkc(scat);
            showup.update_showup(scat)
        }
    })


    //tab_DocumentSelected_Search.init()
    tab_DocumentSelected_Search.cbf_click_doc_to_run_search = function () {
        $("#searchNextresult").text("Serach str in server site..")
        var api = new BsnpRestApi()
        api.run(RestApi.ApiBibleObj_search_txt,
            g_aim.get_search_inp(),
            function (ret) {
                _This.apiCallback_Gen_output_table(ret, function (size) {
                    $("#searchNextresult").text("0/" + size)
                    $(".hili_SearchStrInBibleStart").addClass("hili_SearchStrInBibleStopd").removeClass("hili_SearchStrInBibleStart")
                });
                Uti.Msg(ret.out.result);
            })
    }

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



    markHistory.init()
    markHistory.onClickHistoryItem(function (bcvAry) {
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

    popupMenu.init(function (bcv) {
        markHistory.addnew2table("MemoryVerse", bcv)

        MyStorage.Repo_save(function (ret) {
            Uti.show_save_results(ret, "#StorageRepo_save_res")
            Uti.Msg("MyStorage.Repo_save:", ret)
            //$("#StorageRepo_save").prop("checked", false)
        })
    })
    g_obt.onclick_ob_table(function () {
        //$("#menuContainer").hide()
        $("#divPopupMenu").hide()
        $("#Tab_OutputBooksList").hide()
        //popupMenu.hide()
        groupsMenuMgr.collapse()
    })

    MyStorage.init(function (ret) {

    })


    g_obt.onclick_popupLabel(function (par) {
        par.m_tab_documentsClusterList = tab_documentsClusterList
        par.m_groupsMenuMgr = groupsMenuMgr
        popupMenu.popup(par)
        markHistory.m_tbodies.RecentTouch.addnew2table(par.m_bcv)
        $("title").text(par.m_bcv)

        showup.update_showup(par.m_bcv)
        digi.init_Chp_digiKeys_by_vol()
        digi.init_Vrs_digiKeys_by_vol()
        //_This.scrollToView_Vrs()
    })

    //this.onclicks_btns_in_grpMenu_search()
    tab_DocumentSelected_Search.init()

    this.init_load_storage()
};
AppInstancesManager.prototype.init_load_storage = function () {

    var _This = this
    function _load_bcv_from_url_param() {
        if (window.m_bcv) {//frm url. 
            var ret = Uti.parse_bcv(window.m_bcv)
            if (ret) {
                showup.setAsChildren()
                showup.update_showup(window.m_bcv)
                setTimeout(function () {
                    _This.loadBible_chapter_by_bibOj()
                }, 1000)
            }
        }
    }

    function _init_load_repo() {
        Uti.Msg("start ...", "" + window.location.href);

        Uti.Msg("RestApi=", RestApi);

        MyStorage.Repositories().repos_app_init()
        MyStorage.Repo_load(function (ret) {
            //if (cbf) cbf(ret)
            Uti.set_menuContainer_color(ret)
            Uti.Msg("Ready ret.out", ret.out)

            var memo = (ret.out.data) ? ret.out.data["#MemoryVerse"] : ""
            if (memo) {
                var ar = (ret.out.data["#MemoryVerse"])
                for (var i = 0; i < ar.length; i++) {
                    var bcv = ar[i]
                    markHistory.addnew2table("MemoryVerse", bcv)
                }
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
    api.run(RestApi.ApiBibleObj_load_by_bibOj,
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
    g_obt.Gen_output_table(cbf)
}
AppInstancesManager.prototype.loadBible_chapter_by_bibOj = function (oj) {
    var _THIS = this
    if (!oj) {
        var res = showup.get_selected_bcv_parm();
        console.log("res=", res);
        if (!res || !res.oj_bc) return null
        oj = res.oj_bc
    }
    if (!oj || Object.keys(oj) === 0) return alert("oj is null")
    var fnamesArr = tab_documentsClusterList.get_selected_seq_fnamesArr();

    var api = new BsnpRestApi()
    api.run(RestApi.ApiBibleObj_load_by_bibOj, {
        fnames: fnamesArr,
        bibOj: oj, Search: null
    }, function (ret) {
        if (!ret.out.data) return alert("no out.data")
        _THIS.apiCallback_Gen_output_table(ret)
        setTimeout(function () {
            _THIS.scrollToView_Vrs()
        }, 2100)
    })

    return res;
};///
AppInstancesManager.prototype.get_search_inp = function () {
    //
    var fnamesArr = tab_documentsClusterList.get_selected_seq_fnamesArr();
    var searchFileName = MyStorage.LastSearchInDocument();// nambib.get_search_fname();
    var searchStrn = $("#sinput").val();
    if (searchStrn.length === 0) {
        return alert("no search str.")
    }

    var inp = { fnames: fnamesArr, bibOj: null, Search: { File: searchFileName, Strn: searchStrn } };
    var res = showup.get_selected_bcv_parm();
    if (res) {
        inp.bibOj = res.oj_search
    }
    return inp;
};






///////////
//////////
//////////
//////////
/////////
///////////
//////////
//////////
//////////
/////////

function OutputBibleTable() {
    this.m_tbid = "#oBible"
}
OutputBibleTable.prototype.incFontSize = function (n) {
    var fsz = MyStorage.FontSize()
    fsz += n;
    $(this.m_tbid + " table .tx").css("font-size", fsz);
    $("#fontsize").text(fsz)

    MyStorage.FontSize(fsz)
    g_aim.scrollToView_Vrs()
}
OutputBibleTable.prototype.onclick_ob_table = function (cbf) {
    this.incFontSize(0);

    $(this.m_tbid).bind("click", function () {
        if (cbf) cbf()
    })
}

OutputBibleTable.prototype.onclick_popupLabel = function (cbf) {
    this.m_onclick_popupLabel = cbf
}
OutputBibleTable.prototype.set_data = function (ret) {
    this.m_data = ret
}
OutputBibleTable.prototype.set_inpage_findstrn = function (str) {
    var ret = ""
    var InSvrSerachStr = $(".matInSvr:eq(0)").text()
    this.m_inpage_findstrn = ""

    if (str.length === 0) return ret
    if (InSvrSerachStr === str) {
        ret = "already have for in Svr"
    } else {
        this.m_inpage_findstrn = str
    }
    return ret
}
OutputBibleTable.prototype.Set_Event_output_table = function (tbid) {
    var _THIS = this;

    $(tbid).find(".popupclicklabel").bind("click", function (evt) {
        evt.stopImmediatePropagation()

        //solve confliction between toggle and hili
        var alreadyHili = $(this)[0].classList.contains('bcvMark')
        $(".bcvMark").removeClass("bcvMark");
        $(this).addClass("bcvMark");

        var bcr = $(this)[0].getBoundingClientRect();
        console.log(bcr)

        bcr.m_alreadyHili = alreadyHili
        bcr.m_y = bcr.y + window.scrollY + $(this).height() + 5;
        bcr.m_bcv = $(this).attr("title")
        bcr.m_txuid = $(this).attr("txuid")
        bcr.m_strTag = $(this).text();

        var ret = Uti.parse_bcv(bcr.m_strTag)
        if (!ret) {
            bcr.m_rev = bcr.m_strTag
        }
        bcr.bcvParser = ret = Uti.parse_bcv(bcr.m_bcv)
        bcr.m_ouTxtStr = ret.getxt4outOj(_THIS.m_data.out.data, bcr.m_rev)
        bcr.m_outxtObj = ret.getxt4outOj(_THIS.m_data.out.data)
        bcr.m_clickedLabel = this

        _THIS.m_onclick_popupLabel(bcr)

    });


    $(tbid).find(".tx").bind("keydown", function () {
        $(this).addClass("edit_keydown");
    });


    $(tbid).find(".tx").bind("click", function (evt) {
        evt.stopImmediatePropagation();

        $(this).toggleClass("hiliVrsTxt");

        //CopyTextToClipboard
        var txt = $(this).text();
        var bcv = $(this).parentsUntil("tbody").find("a.bcvTag").text();
        var rev = $(this).prev().text()
        txt = `"${txt}" (${bcv} ${rev})`;


        Uti.Msg(txt);
        $("#divPopupMenu").hide()
        $("#Tab_OutputBooksList").hide()
    });

    $(tbid).find("td").bind("click", function () {
        $(this).toggleClass("hili_obi_td");
        var bcv = $(this).find(".popupclicklabel").attr("title")
        markHistory.m_tbodies.RecentTouch.addnew2table(bcv)
    });
}
OutputBibleTable.prototype.Gen_output_table = function (cbf) {

    var _THIS = this;
    var tb = this.create_htm_table_str();
    Uti.Msg("tot_rows:", tb.size);
    if (cbf) cbf(tb.size)
    $(this.m_tbid).html(tb.htm);

    this.Set_Event_output_table(this.m_tbid)

    this.incFontSize(0)
}

OutputBibleTable.prototype.update_table_tr = function (ret, par) {
    var ret = this.create_trs(ret.out.data)
    var trID = "#" + par.BCVtagClusterInfo.trID

    $(trID).find("td").remove()
    $(trID).html($(ret.trs).find("td"));
    this.Set_Event_output_table(trID)
    return;
}
OutputBibleTable.prototype.get_search_matched_txt = function (txt) {
    //ret = this.convert_rbcv_2_bcvRobj(ret)
    if (!this.m_inpage_findstrn) return txt
    var findstrn = this.m_inpage_findstrn
    var reg = new RegExp(findstrn, "g")

    var mat = txt.match(reg)
    if (mat) {
        mat.forEach(function (val) {
            var rep = `<font class='matInPage'>${findstrn}</font>`
            txt = txt.replace(reg, rep)
        })
    }
    return txt
}
OutputBibleTable.prototype.create_htm_table_str = function () {
    //ret = this.convert_rbcv_2_bcvRobj(ret)
    var _THIS = this
    if (!this.m_data || !this.m_data.out || !this.m_data.out.data) {
        return { htm: "", size: 0 };
    }

    console.log("result:", this.m_data.out.result)
    var ret = this.create_trs(this.m_data.out.data)
    var bibOj = this.m_data.par.bibOj;
    var str = JSON.stringify(bibOj)
    var sbcvlst = Uti.parse_bcvOj2strlst(bibOj)
    //Object.keys(bibOj).forEach(function (bkc) {
    //    var oj = {}
    //    oj[bkc] = bibOj[bkc]
    //    sbcvlst += Uti.parse_bcv(oj) + ", "
    //})

    var s = "<table id='BibOut' border='1'>";
    s += `<caption><p>TotRows=${ret.size}</p><p>${sbcvlst.join(", ")}</p></caption>`;
    s += "<thead><th>#</th></thead>";
    s += "<tbody>";
    s += ret.trs;

    s += "</tbody></table>";
    ret.htm = s
    return ret
}
OutputBibleTable.prototype.create_trs = function (odat) {
    //ret = this.convert_rbcv_2_bcvRobj(ret)
    var _THIS = this
    if (!odat) {
        return { trs: "", size: 0 };
    }

    var stores = MyStorage.MostRecentAryInStore("#MemoryVerse")
    //this.m_tbodies.MemoryVerse.init("#MemoryVerse")
    var MemoryVersary = stores.get_ary()


    //console.log("result:", this.m_data.out.result)
    var idx = 0, trs = "", uuid = "";
    $.each(odat, function (vol, chpObj) {
        $.each(chpObj, function (chp, vrsObj) {
            $.each(vrsObj, function (vrs, val) {
                //console.log("typeof val=", typeof val);
                idx++;
                var sbcv = `${vol}${chp}:${vrs}`;
                var MemoVersClass = ""
                if (MemoryVersary.indexOf(sbcv) >= 0) {
                    MemoVersClass = "divPopupMenu_CaptionBCV_MemoVerse"
                }
                var BcvTag = `<a class='popupclicklabel bcvTag ${MemoVersClass}' title='${sbcv}'>${sbcv}</a>`
                trs += `<tr><td>${BcvTag}`;
                switch (typeof val) {
                    case "object"://trn
                        $.each(val, function (revId, txt) {
                            txt = _THIS.get_search_matched_txt(txt)

                            var vrsTxtTag = 'a' //a is ued for scripture txt. 
                            if (revId.match(/^e_[a-zA-Z]/)) {//E.g. "NIV",  "e_Note"
                                vrsTxtTag = 'div'
                                txt = Uti.convert_std_bcv_in_text_To_linked(txt)
                            }

                            var clsname = `class='tx tx${revId}'`
                            if (CNST.OT_Bkc_Ary.indexOf(vol) >= 0 && revId === 'H_G') {
                                clsname = `dir='rtl' class='tx tx${revId} tx_OT'` //
                            }
                            uuid = `${revId}_${vol}_${chp}_${vrs}`;
                            var revTag = `<sup txuid='${uuid}' class='popupclicklabel revTag' title='${sbcv}'>${revId}</sup>`
                            var vrsTxt = `<${vrsTxtTag} id='${uuid}' ${clsname}>${txt}</${vrsTxtTag}>`
                            trs += `<div>${revTag}${vrsTxt}</div>`;
                        });
                        break;
                    case "string":
                        trs += "<div>" + val + "</div>";
                        break;
                }
                trs += "</td></tr>";
            });
        });
    });
    return { trs: trs, size: idx };
}
var g_aim = new AppInstancesManager();
var g_obt = new OutputBibleTable()













