
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
        vol = "WholisticBible" 
        //return ret
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
    } else {
        ret.m_bcv = vol + chp + ":" + 1
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




