
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
        if ("UserDef" === scat) {
            vol_arr = Object.keys(_Max_struct)
        }

        if (par && par.onClickItm) par.onClickItm(scat, vol_arr, alreadyHili)
    });
}


