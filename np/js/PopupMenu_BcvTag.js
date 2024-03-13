
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
