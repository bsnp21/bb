

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

        var msgary = { "-1": "Sign-in Time Off", "0": "In Hibernate Mode.", "1": "Normal Mode" }
        var clrary = { "-1": "red", "0": "yellow", "1": "green" }

        var caps = ""
        if (undefined !== ret.out.state.bRepositable) {
            var idx = "" + ret.out.state.bRepositable
            caps = `<a style='background-color:${clrary[idx]};color:black;'>${msgary[idx]}</a>`
        }

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
            var str = ar[i].repopath.replace(/[\.]git$/, "").replace("https://github.com/", "")
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
        if (!confirm("The Bible study notes you wrote in server-site will be erased.")) return
        if (bForce) {
            //Jsonpster.inp.usr = MyStorage.Repositories().repos_app_update() //force to destroy. test only.
        } else {
            Jsonpster.inp.SSID = MyStorage.SSID()
        }


        Jsonpster.inp.par = {}
        Jsonpster.api = RestApi.ApiUsrReposData_destroy
        Uti.Msg("start", Jsonpster)
        Jsonpster.RunAjaxPost_Signed(function (ret) {
            $("#otb").html("<font color='green'>Repos is undocked.</font>")
            Uti.Msg("ret", ret)
            MyStorage.SSID("")
        })
    },
    repo_status: function (showid) {
        $(showid).html("<font>start checking...</font>")

        var api = new BsnpRestApi()
        api.run(RestApi.ApiUsrReposData_status, null, function (ret) {
            Uti.Msg("ret.out.state", ret.out.state)

            $(showid).html("<font color='green'>ok.</font>")
            //PageUti.repos_status_display(ret, showid)
            var stb = PageUti.Repo_fstat_table(ret)
            $(showid).html(stb)
        })

        return
        ////////
        Jsonpster.api = RestApi.ApiUsrReposData_status
        Uti.Msg("start", Jsonpster)
        Jsonpster.RunAjaxPost_Signed(function (ret) {
            Uti.Msg("ret.out.state", ret.out.state)

            $(showid).html("<font color='green'>ok.</font>")
            //PageUti.repos_status_display(ret, showid)
            var stb = PageUti.Repo_fstat_table(ret)
            $(showid).html(stb)
        })
    },
    repos_status_display: function (ret, eid) {
        var sta = ret.out.state
        var msg = "<font color='red'>Invalid Repository</font>"
        if (sta) {
            if (sta.fstat) {
                var filename
                Object.keys(sta.fstat).forEach(function (fname) {
                    var size = sta.fstat[fname]
                })
            }

            var colr = (sta && 1 === sta.bEditable) ? "lightgreen" : "red"
            var msg = `<font color='${colr}'>bEditable=${sta.bEditable}</font>`

            var colr = (sta && 1 === sta.bRepositable) ? "lightgreen" : "yellow"
            msg += `,<font color='${colr}'>bRepositable=${sta.bRepositable}</font>`
            if (1 === sta.bEditable && 1 === sta.bRepositable) {
                msg = "<font color='lightgreen'> Repository works normally</font>"
            }
            if (sta.bEditable < 1 && sta.bRepositable < 1) {
                msg = "<font color='red'>Session timeout. Sign-in again.</font>"
            }
        }

        $(eid).html(msg).show()
    },
    repo_pushback: function (bForce) {
        var passcode = $("#passcode").val()
        if (passcode.trim().length === 0) return alert("passcode is required to push data into your repository.")
        if (!confirm("push data into repository")) return

        if (bForce) {
            Jsonpster.inp.usr = MyStorage.Repositories().repos_app_update() //force to destroy. test only.
        } else {
            Jsonpster.inp.SSID = MyStorage.SSID()
        }

        Jsonpster.api = RestApi.ApiUsrReposData_git_push
        Uti.Msg("start", Jsonpster)
        Jsonpster.RunAjaxPost_Signed(function (ret) {

            //Uti.Msg("ret", ret)
            $("#otb").html("<font color='green'>Push is done.</font>")
            Uti.Msg("output status:", ret.out)

            Uti.Msg("ret.out.git_add_commit_push_res.success.stderr=", ret.out.git_add_commit_push_res.success.stderr)
            var errmsg = "Invalid username or password."
            if (ret.out.git_add_commit_push_res.success.stderr.indexOf(errmsg) >= 0) {
                alert(errmsg)
            }
        })
    },
    repo_pulldown: function (bForce) {
        var passcode = $("#passcode").val()
        if (passcode.trim().length === 0) return alert("passcode is required to push data into your repository.")
        if (!confirm("pull down data")) return

        if (bForce) {
            Jsonpster.inp.usr = MyStorage.Repositories().repos_app_update() //force to destroy. test only.
        } else {
            Jsonpster.inp.SSID = MyStorage.SSID()
        }

        Jsonpster.api = RestApi.ApiUsrReposData_git_pull
        Uti.Msg("Jsonpster", Jsonpster)
        Jsonpster.RunAjaxPost_Signed(function (ret) {

            $("#otb").html("<font color='green'>Pull is done.</font>")
            //dbg_pster(ret)
            Uti.Msg("output status:", ret.out)

            //Uti.Msg("ret.out.git_push_res.success.stderr=", ret.out.git_push_res.success.stderr)
            var errmsg = "Invalid username or password."
            if (ret.out.git_pull_res.success.stderr.indexOf(errmsg) >= 0) {
                alert(errmsg)
            }
        })
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



            Jsonpster.inp.par = { cmdline: cmd }
            Jsonpster.api = RestApi.ApiUsr_Cmdline_Exec
            //dbg_pster()
            Jsonpster.RunAjaxPost_Signed(function (ret) {
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

        MyStorage.Repo_load(function (ret) {
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

