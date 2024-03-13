
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
