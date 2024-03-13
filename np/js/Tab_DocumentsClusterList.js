



function Tab_DocumentsClusterList(tid) {
    this.m_tbid = tid // "#Tab_VersionNamesOfTheBible"
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
    $("#Tab_VersionNamesOfTheBible_caps").text(val)
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








