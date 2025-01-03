







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
//OutputBibleTable.prototype.onclick_Load_Bcv_by_e_Note_Viewer = function (cbf) {
//    this.mcbf_onclick_Load_Bcv_by_e_Note_Viewer = cbf
//}
OutputBibleTable.prototype.Set_Event_output_table_for_E_Note_Viewer = function (tbid) {
    var _THIS = this;
    $(tbid).find("td").bind("click", function (evt) {
        $(this).toggleClass("hili");
    })
    $(tbid).find(".e_Note_Viewer_BCV").bind("click", function (evt) {
        var bcv = $(this).text().trim();
        Utilib.CloneNewWindow_By_TitleBVC(bcv);
        //alert(bcv)
        //if(_THIS.mcbf_onclick_Load_Bcv_by_e_Note_Viewer) _THIS.mcbf_onclick_Load_Bcv_by_e_Note_Viewer([bcv])
    })
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

        //$("title").text(bcr.m_bcv)

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
        $("#Tab_OutputVolumnNamesList").hide()

        tab_MostRecent_BCV.m_tbodies.RecentAccessed.addnew2table(bcv)
    });

    $(tbid).find("td").bind("click", function () {
        $(this).toggleClass("hili_obi_td");
        var bcv = $(this).find(".popupclicklabel").attr("title")
        tab_MostRecent_BCV.m_tbodies.RecentAccessed.addnew2table(bcv)
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
OutputBibleTable.prototype.Gen_output_table_for_e_Note_Viewer = function (cbf) {

    var _THIS = this;
    var tb = this.create_htm_table_str_for_e_Note_Viewer();
    Uti.Msg("tot_rows:", tb.size);
    if (cbf) cbf(tb.size)
    $(this.m_tbid).html(tb.htm);

    this.Set_Event_output_table_for_E_Note_Viewer(this.m_tbid);

    this.incFontSize(0)

    var sortab = new Rapid_Sort_Table("#"+tb.ID)
    sortab.sort_col({ colIdx: 2, asend: 1 })
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
OutputBibleTable.prototype.create_htm_table_str_for_e_Note_Viewer = function () {
    //ret = this.convert_rbcv_2_bcvRobj(ret)
    var _THIS = this
    if (!this.m_data || !this.m_data.out || !this.m_data.out.data) {
        return { htm: "", size: 0 };
    }

    console.log("result:", this.m_data.out.result)
    var ret = this.create_trs_for_e_Note_Viewer(this.m_data.out.data)
    var bibOj = this.m_data.par.bibOj;
    var str = JSON.stringify(bibOj)
    var sbcvlst = Uti.parse_bcvOj2strlst(bibOj)
    //Object.keys(bibOj).forEach(function (bkc) {
    //    var oj = {}
    //    oj[bkc] = bibOj[bkc]
    //    sbcvlst += Uti.parse_bcv(oj) + ", "
    //})

    var s = "<table id='BibOut' border='1'><caption>e_Note_Viewer</caption>";
    s += `<caption><p>TotRows=${ret.size}</p><p>${sbcvlst.join(", ")}</p></caption>`;
    s += "<thead><th>#</th><th>V</th><th>Verse</th></thead>";
    s += "<tbody>";
    s += ret.trs;

    s += "</tbody></table>";
    ret.htm = s
    ret.ID = "BibOut"
    return ret
}
OutputBibleTable.prototype.create_trs = function (odat) {
    //ret = this.convert_rbcv_2_bcvRobj(ret)
    var _THIS = this
    if (!odat) {
        return { trs: "", size: 0 };
    }

    var stores = MyStorage.CreateMrObj("MemoryRequired")
    var obj = stores.get_obj()
    var MemoryVersary = Object.keys(obj)


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

OutputBibleTable.prototype.create_trs_for_e_Note_Viewer = function (odat) {
    //ret = this.convert_rbcv_2_bcvRobj(ret)
    var _THIS = this
    if (!odat) {
        return { trs: "", size: 0 };
    }

    var stores = MyStorage.CreateMrObj("MemoryRequired")
    var obj = stores.get_obj()
    var MemoryVersary = Object.keys(obj)


    //console.log("result:", this.m_data.out.result)
    var samp_out = {
        Gen: {
            1: {
                2: {
                    "NIV": "ss",
                    "e_Note": "aa"
                }

            }

        }
    }
    function htmlToText(html) {
        var temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent; // Or return temp.innerText if you need to return only visible text. It's slower.
    }

    var idx = 0, trs = "", uuid = "";
    $.each(odat, function (vol, chpObj) {
        $.each(chpObj, function (chp, vrsObj) {
            $.each(vrsObj, function (vrs, val) {
                //console.log("typeof val=", typeof val);
                idx++;
                var sbcv = `${vol}${chp}:${vrs}`;

                var txt = val["e_Note"].trim()
                var dat = htmlToText(txt).substring(0, 13)
                trs += `<tr><td><div class='e_Note_Rotate'>${idx}</div></td><td><div class='e_Note_Viewer_BCV e_Note_Rotate'>${sbcv}</div></td><td>${txt}</td></tr>`;

            });
        });
    });
    return { trs: trs, size: idx };
}














