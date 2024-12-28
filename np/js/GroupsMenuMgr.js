




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

    $("#Check_bcv").on("click", function () {
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
        //const ip = urlParams.get('sip');
        var htm = ""
        ret.biblical_order_splitted_ary.forEach(function (v, i) {
            hist.m_tbodies.RecentAccessed.addnew2table(v)
            var sln = `<a href='#${v}'>${v}</a>`
            htm += `${sln} | `
        })
        $("#operation_res").html(htm)
        Uti.Msg(htm)

        str = Uti.convert_std_bcv_in_text_To_linked(str)
        Uti.Msg(str)
    });
    $("#saveUsrDat").on("click", function () {
        $(this).addClass("hili")
        var fname = $("#saveUsrDatFilename").val()
        if (fname.length === 0) return alert("no fname.")
        var txt = $("#txtarea").val();//.replace(/\\n/g, "\n").replace(/\\/g, "")

        var par = {
            "fnames": [
                `./dat/${fname}`
            ],
            "data": txt,
            "datype": "plain_text_content"
        }
        var _this = this

        var api = new BsnpRestApi()
        api.ajaxion(
            RestApi.ApiUsrDat_save,
            par,
            function (ret) {
                $(_this).removeClass("hili")
                console.log("ret", ret)
                alert("ok")
            })

    });






    $("#Storage_local_repos_exchange").on("click", function () {
        Uti.open_child_window("./myStorageRepos.htm", function (data) {
            Uti.Msg("fr child win:", data)
        })
    })


    $("#share_private").on("click", function () {

    })
    $("#account_reSignIn").on("click", function () {
        const urlParams = new URLSearchParams(window.location.search);
        var ip = urlParams.get('sip')
        window.open(`./mySignIn.htm?sip=${ip}`, "_target")
    })

    $("#myExt_Diary").on("click", function () {
        var repo = $("#repopath").val()
        $(this).attr("href", `./calendars/calendar3yr.htm${window.location.search}`)
    })

    $("#CloneNewPage").on("click", function () {
        // use #bcv. 
        var surl = '' + window.location.href   ////url-ankor #bcv. #Gen1:1
        var punIndx = surl.indexOf("#")
        if (punIndx > 0) {
            surl = surl.substring(0, punIndx)
        }
        var bcv = $("title").text();
        var ret = Uti.parse_bcv(bcv)
        if (ret) {
            surl = surl + "#" + bcv
        }
        window.open(surl, "_blank")
    })

    $("#All_e_Notes").on("click", function () {
        var surl = '' + window.location.href   ////removal url-ankor #bcv. #Gen1:1
        var punIndx = surl.indexOf("wdaws")
        if (punIndx > 0) {
            surl = surl.substring(0, punIndx)
        }else return alert("no wdaws in url");
        var repopathname = $("#SignOut_repopathname").text();
        //http://34.227.20.213/wdaws/ddir/usrs/github.com/bsnpghrepolist/wdingpba/
        surl += `wdaws/ddir/usrs/github.com/bsnpghrepolist/${repopathname}/index.htm`
        window.open(surl, "_blank")



        /*
        var punIndx = surl.indexOf("#")
        if (punIndx > 0) {
            surl = surl.substring(0, punIndx)
        }

        //var repopathname = $("#SignOut_repopathname").text();
        //const encodedUrl = decodeURIComponent(window.location.href);
        var surl = `https://bsnpghrepolist.github.io/admin/?_hosthref=${surl}`
        window.open(surl, "_blank")
        ****/
    })










    $("#Storage_clear").on("change", function () {
        MyStorage.clear();
        var _THIS = this
        setTimeout(function () {
            $(_THIS).prop('checked', false);
        }, 3000)
    })


    $(".StorageRepo_Signout").on("click", function () {
        if (!confirm("Are you sure to sign out?")) return;

        var api = new BsnpRestApi()
        var url = `./mySignIn.htm${window.location.search}`
        api.ajaxion(RestApi.ApiUsrAccount_logout, {
        }, function (ret) {
            $("body").attr("onbeforeunload", null)
            window.open(url, "_self")
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
