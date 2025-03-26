
function SingleKeyOutputBooksTable(tid) {
    this.m_id = tid; //"#Tab_OutputVolumnNamesList"
    this.cbf_onClickItm = null
}
SingleKeyOutputBooksTable.prototype.init = function (par) {
    var _THIS = this
    $(this.m_id).bind("click", function () {
        //$(_THIS.m_id).hide()
        alert()
    }).hide().draggable();
    this.cbf_onClickItm = par.onClickItm

    $(this.m_id + " tbody").bind("click", function () {
        if (_THIS.m_sCatName !== "UserDef") {
            $(_THIS.m_id).hide()
        }
    })
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

SingleKeyOutputBooksTable.prototype.Popup_VolumnNamesList_Table = function (scat, vol_arr, alreadyhili, Tab_OutputVolumnNamesList_ShowClass) {

    this.m_sCatName = scat
    if (!scat || vol_arr.length === 0) {
        $(this.m_id).hide()
        return
    }
    var _THIS = this
    var tbodyid = this.m_id + " tbody"
    //var bcr = $("#menuContainer")[0].getBoundingClientRect();
    //var h2 = parseInt(Yoffset);

    var trs = this.ary_To_trs(vol_arr);

    $(tbodyid).html(trs).find(".v3").bind("click", function () {

        if ("UserDef" === scat) {
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

    $(this.m_id).removeClass("Tab_OutputVolumnNamesList_ShowForCluster")
    $(this.m_id).removeClass("Tab_OutputVolumnNamesList_ShowForKeypad")
    $(this.m_id).addClass(Tab_OutputVolumnNamesList_ShowClass)

    if (alreadyhili) {
        //$(this.m_id).css('top', bcr.y + h2).css('left', bcr.x).toggle();//.slideToggle()
        $(this.m_id).toggle();//.slideToggle()
    } else {
        //$(this.m_id).css('top', bcr.y + h2).css('left', bcr.x).show()
        $(this.m_id).show()
    }

    if (vol_arr.length === -1) {//auto setup problematic
        setTimeout(() => {
            $(tbodyid).find(".v3").each(function () {
                $(this).find("td").addClass("hili");
                $(this).trigger("click")
            })
        }, 2000)
        return
    }
};















