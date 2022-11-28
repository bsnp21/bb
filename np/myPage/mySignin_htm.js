

function MySignBasePage() {
    this.sTitle = "Login Page"
    this.LoginTag = "button"
    this.CreateTag = "a"
    this.OtherParts = ""
    this.part_CreateInput = `
<tr>
<td>
    <br>
    <a for="editor1" id="label_password">Comfirm Password</a> : (<a
        style="color:red;" id="passcode2_required">required</a>)<br>
    <input id="passcode2" type="password" maxlength="120" class="inputxt" value=""  maxlength="125"></input>
</td>
<td class="clearout">
    <br><br>X
</td>
</tr>


<tr>
<td><br>
    <a id="">Personal Hints:</a> (<font color=''>optional</font>)<br>
    <input id="hintword" class="inputxt" value="" placeholder="personal hints(email, phone)"
        note="https://github.com/bsnp21/pub_test.git"></input>
</td>
<td class="clearout">
    <br><br>X
</td>
</tr>

<tr colspan="2">
<td><br>
    <label>Visibility:</label>
    <input type="radio" name="a" checked="true" value="public" id="public" note="Username is visible in public."></input><label
        for="public">public</label>
    <input type="radio" name="a" id="private" value="private" note="Username is invisible in public."></input><label
        for="private">private</label>
</td>

</tr>

`
}

MySignBasePage.prototype.set_Create_Page = function () {
    this.sTitle = "Create Account Page"
    this.LoginTag = "a"
    this.CreateTag = "button"
}
MySignBasePage.prototype.set_Login_Page = function () {
    this.sTitle = "Login Page"
    this.part_CreateInput = ""
}
MySignBasePage.prototype.gen_htm = function () {
    var mySignin_htm = `

<h2 style="text-align: center;margin-top: 10px;"><a href="https://bsnp21.github.io/home/">Bible Study Note Pad</a>
</h2>

<h3 id="Enter" style="text-align: center;margin-top: 10px;">${this.sTitle}</h3>
<div style="text-align: center;margin-top: 10px;" id="usrstot">.</div>





<div id="input_area">
    <form action="">

        <br>


        <table xborder="1">
            <tr>
                <td>
                    <a id="">Username:</a> (<font color='red'>required</font>)<br>
                    <input id="repopath" class="inputxt" value="" placeholder="username"
                        note="https://github.com/bsnp21/pub_test.git"  maxlength="125"></input>
                </td>
                <td class="clearout">
                    <br>X
                </td>
            </tr>




            <tr>
                <td>
                    <br>
                    <a for="editor1" id="label_password">Password</a> : (<a style="color:red;">required</a>)<br>
                    <input id="passcode" type="password" maxlength="120" class="inputxt" value=""  maxlength="125"></input>
                </td>
                <td class="clearout">
                    <br><br>X
                </td>
            </tr>

            ${this.part_CreateInput}

            <tr>
                <td colspan="2"><br>
                    
                    <${this.LoginTag} class="signinBtn" id="loginAsUser" title="login to account" >Log-in</${this.LoginTag} >
                    
                    <${this.CreateTag}  id="SignOnCreate" href=""> Create </${this.CreateTag} >
                    <br><br>
                    <font color=''><a id="errmsg">status</a></font>

                </td>
            </tr>
        </table>

        <br>
    </form>

    <div id="output_res" style="text-align: center;margin-top: 10px;">.</div>
</div>




<hr id="toggle_txtarea">

<div id="footer" style="text-align: center;margin-top: 50px;">
    <textarea id="txtarea" rows="25"></textarea>
</div>

`

    return mySignin_htm;
}



function create_acct(cbf) {
    $(".signinBtn").attr("disabled", true)
    $("#errmsg").text("runing ...")
    $("#output_res").html("")

    var api = new BsnpRestApi()
    var usr = remeber_ui();   //
    usr.hintword = $("#hintword").val().trim()
    usr.accesstr = $("input[type='radio']:checked").val().trim()
    //alert($("input[type='radio']:checked").val())

    api.ApiUsrAccount_create(usr, function (rob) {
        $(".signinBtn").removeAttr("disabled")
        console.log(rob)
        $("#txtarea").val(JSON.stringify(rob, null, 4))
        if (rob.out.err) {
            $("#errmsg").html(rob.out.err).addClass("failed")
        } else {
            var tb = PageUti.Repo_fstat_table(rob)
            var a = `<font color="green">Successfully created<br>${usr.repopath}</font></a>`
            $("#errmsg").html(a)
            $("#output_res").html(tb)
        }

        cbf(rob)
    })
}
function login_acct(cbf) {
    $(".signinBtn").attr("disabled", true)
    $("#errmsg").text("runing ...")

    var api = new BsnpRestApi()
    var usr = remeber_ui();   //

    api.ApiUsrAccount_login(usr, function (rob) {
        $(".signinBtn").removeAttr("disabled")
        console.log(rob)
        $("#txtarea").val(JSON.stringify(rob, null, 4))
        if (rob.out.err) {
            $("#errmsg").html(rob.out.err).addClass("failed")
        }
        else {
            var ur = `./BibleStudyNotePad.htm${api.urlRedirectParam()}`
            if (cbf && !cbf(rob)) {
                return
            }
            window.open(ur, "_self")
        }


    })
}

function failure() {
    $("#errmsg").text("failed to sign in.")
}

function remeber_ui() {
    var paths = $("#repopath").val()
    var codes = $("#passcode").val()
    localStorage.setItem("repopath", paths)
    localStorage.setItem("passcode", codes)
    //localStorage.setItem("hintword", $("#hintword").val())
    var usr = { repopath: paths, passcode: codes };
    return usr
}

function mySignin_init() {
    $("#repopath").val(!localStorage.getItem("repopath") ? "" : localStorage.getItem("repopath"))
    $("#passcode").val(!localStorage.getItem("passcode") ? "" : localStorage.getItem("passcode"))
    $("#hintword").val(!localStorage.getItem("hintword") ? "" : localStorage.getItem("hintword"))




    $(".signinBtn").removeAttr("disabled")


    $(".clearout").on("click", function () {
        $(this).prev().find("input").val("")
    })
    $("#label_password").on("click", function () {
        var styp = $("#passcode").attr("type")
        var type = styp === "password" ? "text" : "password"
        $(`input[type='${styp}']`).attr("type", type)
    })
    $(`input[type='radio']`).on("click",function(){
        $("#errmsg").text($(this).attr("note"))
    })

    $(".signinBtn").removeAttr("disabled")



    $("#errmsg").on("click", function () {
        $("*[disabled").removeAttr("disabled")
        //$(this).toggle("slow")
        $("#errmsg").removeClass("successed failed")
        $("#output_res").html("--")
        var paths = $("#repopath").val()
        login_acct(function (rob) {
            var tb = PageUti.Repo_fstat_table(rob)
            var a = `Success: ${paths}`

            if (rob.out.sponsorDiskUsage) {
                $("#usrstot").text(rob.out.sponsorDiskUsage.tot_reposNumber)
            }


            $("#errmsg").html(a).addClass("successed")
            $("#output_res").html(tb)
            //$("#errmsg").html(a+tb)
            //$("#input_area, #account_history_table").hide()
            return false;//stop next open.
        })
    })

    $("#footer").toggleClass("ShowDebug")
    $("#toggle_txtarea").on("click", function () {
        $("#footer").toggleClass("ShowDebug")
    })
}