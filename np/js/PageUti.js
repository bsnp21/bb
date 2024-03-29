

var PageUti = {
    Repo_fstat_table: function (ret) {
        var trs = ""
        if (ret.out.state && ret.out.state.fstat) {
            Object.keys(ret.out.state.fstat).forEach(function (key) {
                var str = ret.out.state.fstat[key]

                var nam = key.replace(/_json\.js$/, "");//.split("_")[0]
                if (nam === "localStorage") return
                var clsn = ""
                if (str.indexOf("*") > 0) {
                    clsn = "repo_warn"
                }
                if (str.indexOf("**") > 0) {
                    clsn = "repo_alert"
                }
                trs += `<tr class='${clsn}'><td>${nam}</td><td>${str}</td></tr>`
            })
        }
        var accesstr = (ret.out.ghapinfo) ? (ret.out.ghapinfo.visibility) : ("");
        var alertclrary = ["lightblue", "yellow", "red"]
        var accesclrary = { "public": "lightgreen", "private": "lightgray" }

        var caps = ""

        var idx = ret.out.state.repo_alertLevel
        caps = `<a style='background-color:${accesclrary[accesstr]};color:black;'>${accesstr}</a><br><a style='background-color:${alertclrary[idx]};color:black;'>${ret.out.state.repo_usage}</a><br> `


        var tbs = `<table border='1'><caption>${caps}</caption><thead><tr><th>NoteFile</th><th>MemUsage</th></tr></thead>${trs}</table>`
        return tbs
    },
    Repositories_History: function (showid, cid) {
        if (-1 === cid || undefined === cid) {
            $(showid).slideUp("slow")
            return
        }
        var capary = ["", "Recent_Repositories", "Recent_ShareIDs"]
        var ar = MyStorage.Repositories().repos_app_init()
        var uniqTmp = {}
        var stb = `<table id='account_history_table' class='center' border='1'><caption>${capary[cid]}</caption><tbody>`
        for (var i = 0; i < ar.length; i++) {
            if (!ar[i].repopath) continue
            var str = ar[i].repopath;//.replace(/[\.]git$/, "").replace("https://github.com/", "")
            var clsname = ["", "repo_history", "desc_history"]
            var showval = ["", str, ar[i].repodesc]
            if (uniqTmp[showval[cid]]) continue
            uniqTmp[showval[cid]] = 1;

            stb += `<tr><td class='repo_delete'>${i}</td>`
            stb += `<td class='${clsname[cid]}' repopath='${ar[i].repopath}' repodesc='${ar[i].repodesc}' passcode='${ar[i].passcode}'>${showval[cid]}</td></td>`
            stb += "</tr>"
        }
        stb += "</tbody></table>"

        $(showid).html(stb);
        $(showid).find(".repo_history").bind("click", function () {
            $(".HiliFocused").removeClass('HiliFocused')
            $(this).addClass("HiliFocused")
            var repopath = $(this).attr("repopath")
            var repodesc = $(this).attr("repodesc")
            var passcode = $(this).attr("passcode")
            MyStorage.Repositories().repos_app_set({ repopath: repopath, repodesc: !repodesc ? "" : repodesc, passcode: passcode })
            //$("#repopath").focus()'
            $("#repopath").addClass("HiliFocused")
        });

        $(showid).find(".desc_history").bind("click", function () {
            $(".HiliFocused").removeClass('HiliFocused')
            $(this).addClass("HiliFocused")
            var repodesc = $(this).attr("repodesc")
            $("#repodesc").val(repodesc).addClass("HiliFocused")

            var repopath = $("#repopath").val()
            var repodesc = $("#repodesc").val()
            var passcode = $("#passcode").val()
            MyStorage.Repositories().repos_app_set({ repopath: repopath, repodesc: repodesc, passcode: passcode })
        });


        $(showid).find(".repo_delete").bind("click", function () {
            var rep = $(this).next().attr("repopath")
            var pws = $(this).next().attr("passcode")

            $(this).next().toggleClass("deleted_repo")
            if ($(this).next()[0].classList.contains("deleted_repo")) {
                console.log("contains: deleted_repo")
                MyStorage.Repositories().repos_store_del({ repopath: rep, passcode: pws })
            } else {
                console.log("not have: deleted_repo")
                MyStorage.Repositories().repos_app_set({ repopath: rep, repodesc: !repodesc ? "" : repodesc, passcode: pws })
            }
        })

        $(showid).slideUp("fast")
        $(showid).slideDown("slow")
    },

    repo_create: function (bNewWin) {

    },
    repo_Signin: function (showid, cbf) {

    },
    repo_destroy: function (bForce) {
        var api = new BsnpRestApi()
        api.ajaxion(RestApi.ApiUsrRepos_toolkids, {

        }, function (ret) {
            $("#otb").html("<font color='green'>Repos is undocked.</font>")
            Uti.Msg("ret", ret)
        })
    },
    repo_status: function (showid) {
        $(showid).html("<font>start checking...</font>")

        var uiv = $("#repodesc").val();//MyStorage.Repositories().repos_store_get().repodesc
        var par = {}
        par.aux = { Update_repodesc: uiv }//aux need to be fixed in svr.


        var api = new BsnpRestApi()
        api.ajaxion(RestApi.ApiUsrReposData_status, par, function (ret) {
            Uti.Msg("ret.out.state", ret.out.state)

            $(showid).html("<font color='green'>ok.</font>")
            var stb = PageUti.Repo_fstat_table(ret)
            $(showid).html(stb)
        })

        return
    },

    repo_pushback: function (bForce) {

    },
    repo_pulldown: function (bForce) {

    },
    gen_cmdline_table: function (eid, ar) {
        var cmdary =
            [
                "pwd",
                "ls -al",
                "ls -al account",
                "ls -al account/dat",
                "ls -al account/myoj",
                "git status",
                "git status -sb",
                "git diff",
                "git log",
                "git add *",
                "git commit -m 'updat'",
                "-S git pull",
                "git push",
                "-S GIT_TERMINAL_PROMPT=0 git push",
                "ps aux"
            ]
        if (!ar) ar = cmdary
        var stab = "<table border='1'><caption>cmdline</caption><tbody>"
        for (var i = 0; i < ar.length; i++) {
            stab += `<tr><td>${i}</td><td class='cmdln'>${ar[i]}</td></tr>`
        }
        stab += "</tbody></table>"
        $(eid).html(stab).find(".cmdln").bind("click", function () {
            $(eid).find(".hili").removeClass("hili")
            $(this).addClass("hili")
            var cmd = $(this).text()
            console.log(cmd)


            var api = new BsnpRestApi()
            api.ajaxion(RestApi.ApiUsr_Cmdline_Exec,
                {
                    cmdline: cmd
                },
                function (ret) {
                    Uti.Msg(ret)
                    var res = ret.out.cmd_exec_res.success
                    var str2 = ""
                    Object.keys(res).forEach(function (key) {
                        var str = res[key];
                        if (!!str) {
                            str2 += "\n" + str.replace("\\n", "\n")
                        }
                        //dbg_pster(key)
                    })
                    Uti.Msg(str2)
                })
        })
    },
    LoadStorageInRepos: function (eid) {

        MyStorage.Repo_load_data_MostRecentVerses(function (ret) {
            console.log("data", ret)
            Uti.Msg("LoadStorage", ret)
            if (!ret.out || !ret.out.data) return alert("repository data not available.")
            var stb = "<table border='1'><thead><tr><th></th><th>Keys</th><th>Repo</th><th>localStorage</th></tr></thead><tbody>"
            Object.keys(ret.out.data).forEach(function (key, i) {
                key = key.trim()
                var locVal = localStorage.getItem(key)
                stb += `<tr><td>${i}</td><td>${key}</td><td>${ret.out.data[key]}</td><td>${locVal}</td></tr>`
            })
            Object.keys(localStorage).forEach(function (key, i) {
                key = key.trim()
                if (undefined === ret.out.data[key]) {
                    var locVal = localStorage.getItem(key)
                    stb += `<tr><td>${i}</td><td>${key}</td><td></td><td>${locVal}</td></tr>`
                }
            })
            stb += "</tbody></table>"
            $(eid).html(stb)
        })
    }
}

