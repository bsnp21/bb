


var BsnpRestUti = {
    Jsonpster_crossloader_get_ip: function (ip) {
        if (!ip) {
            //get ip from url param. ?ip=0.0.0.0:7778
            const urlParams = new URLSearchParams(window.location.search);
            var ip = urlParams.get('ip');
            if (!ip) {
                //use self ip.
                ip = window.location.host
            }
            if (!ip) {
                //use self ip.
                ip = window.location.hostname
            }
            if (!ip) {
                return alert("not localhost or missed in url with ?ip=x.x.x.x")
            }
            if ("undefined" === ip) {
                return alert("not localhost or missed in url with ?ip=undefined")
            }

            if (ip.indexOf(":") < 0) return alert(ip += ":7778 ---missed port")

            if (ip.indexOf("http") < 0) {
                if (ip.indexOf("7778") > 0) {//ssl
                    ip = `http://${ip}`;
                } else {
                    ip = `https://${ip}`;
                }
            }



            //other param form url param ?inp=0.0.0.0:778&#Gen2:7
            var idx = window.location.href.indexOf("#") //case: ?ip=1.1.1.1#Gen1:1
            var bcv = ""
            if (idx >= 0) {
                //ip = window.location.href.substr(0, idx)
                bcv = window.location.href.substr(1 + idx)
                window.m_bcv = bcv
            }
            console.log("ip,pcv:", ip, bcv)
        }

        if ("undefined" != typeof RestApi) {
            console.log("Jsonpster is already loaded. Ignore", ip)
        }

        return ip
    },
}

function BsnpRestApi() {
    var url = BsnpRestUti.Jsonpster_crossloader_get_ip()
    this.svrurl = url

    const urlParams = new URLSearchParams(window.location.search);
    var ssid = urlParams.get('SSID');
    if (ssid) this.SSID = ssid
}
BsnpRestApi.prototype.signin = function (usr, cbf) {
    var _this = this
    this._get_otk(function (otk) {
        _this._gen_ssid(otk, usr, function (ret) {
            if (ret.out.state.SSID) {
                _this.SSID = ret.out.state.SSID
            }
            cbf(ret)
        })
    })
}
BsnpRestApi.prototype.getRedirectParam = function () {
    var spar = `?ip=${this.svrurl}`
    if ("SSID" in this) {
        if (this.SSID.length > 10) {
            spar += "&SSID=" + this.SSID
        }
    }
    return spar
}
BsnpRestApi.prototype._get_otk = function (cbf) {
    var _this = this
    var url = this.svrurl
    $.ajax({
        type: "GET",
        url: `${url}/Get_OTK`,//

        data: {},
        crossDomain: true,
        success: function (dat, err) {
            console.log(dat)
            console.log(err)

            _this.SSID = dat.CUID
            cbf(dat)
        },
        dataType: "json", //exe script.

        //no effect
        xhrFields: {
            withCredentials: false
        },
        //no effect
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },

    }).done(function (data) {
        console.log("done");
    }).fail(function (xhr, textStatus, errorThrown) {
        alert(xhr.responseText);
        alert(textStatus);
    });;
}
BsnpRestApi.prototype._gen_ssid = function (otk, usr, cbf) {
    var inp = { CUID: otk.CUID }
    if (!inp.CUID) return alert("missing CUID.")
    if (otk.pkb64.length === 0) return alert("no pubkey. Please load page again.")

    if ('object' != typeof usr) return alert("missing usr.")
    var usrs = JSON.stringify(usr)
    if (usrs.length > 500) { return alert("max 4096-bit rsa: 501B. len=" + usrs.length) }

    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(atob(otk.pkb64));
    inp.cipherusrs = encrypt.encrypt(usrs);

    console.log(inp.cipherusrs.length)

    var _this = this;
    $.ajax({
        type: "POST",
        dataType: 'text',
        contentType: "application/json; charset=utf-8",
        url: _this.svrurl + "/UsrReposPost_Signin",
        data: JSON.stringify(inp),
        username: 'user',
        password: 'pass',
        crossDomain: true,
        xhrFields: {
            withCredentials: false
        }
    })
        .success(function (data) {
            //console.log("success",data);
            //cbf(JSON.parse(data))
        })
        .done(function (ret) {
            var ret = JSON.parse(ret)
            cbf(ret)
        })
        .fail(function (xhr, textStatus, errorThrown) {
            alert("xhr.responseText=" + xhr.responseText + "\n,textStatus=" + textStatus);
            //alert("textStatus="+textStatus);
        });
}
BsnpRestApi.prototype.redirect_page = function (surl) {

}
BsnpRestApi.prototype.run = function (sapi, obj, cbf) {
    var inp = { SSID: this.SSID }
    if (!inp.SSID) return alert("missing SSID.")
    inp.par = obj
    inp.api = sapi


    var _this = this;
    $.ajax({
        type: "POST",
        dataType: 'text',
        contentType: "application/json; charset=utf-8",
        url: _this.svrurl + "/" + sapi,
        data: JSON.stringify(inp),
        username: 'user',
        password: 'pass',
        crossDomain: true,
        xhrFields: {
            withCredentials: false
        }
    })
        .success(function (data) {
            //console.log("success",data);
            //cbf(JSON.parse(data))
        })
        .done(function (ret) {
            var ret = JSON.parse(ret)
            cbf(ret)
        })
        .fail(function (xhr, textStatus, errorThrown) {
            alert("xhr.responseText=" + xhr.responseText + "\n,textStatus=" + textStatus);
            //alert("textStatus="+textStatus);
        });
}





var RestApi = {
    "Get_OTK": "Get_OTK",
    "PostUsr_getSSID": "PostUsr_getSSID",
    "Jsonpster": "Jsonpster",
    "ApiBibleObj_search_txt": "ApiBibleObj_search_txt",
    "ApiBibleObj_load_by_bibOj": "ApiBibleObj_load_by_bibOj",
    "ApiBibleObj_write_Usr_BkcChpVrs_txt": "ApiBibleObj_write_Usr_BkcChpVrs_txt",
    "ApiBibleObj_read_crossnetwork_BkcChpVrs_txt": "ApiBibleObj_read_crossnetwork_BkcChpVrs_txt",
    "ApiUsrDat_save": "ApiUsrDat_save",
    "ApiUsrDat_load": "ApiUsrDat_load",
    "________ApiUsrReposData_create___test_only": "________ApiUsrReposData_create___test_only",
    "UsrReposPost_Signin": "UsrReposPost_Signin",
    "ApiUsrReposData_destroy": "ApiUsrReposData_destroy",
    "ApiUsrReposData_status": "ApiUsrReposData_status",
    "ApiUsrReposData_git_push": "ApiUsrReposData_git_push",
    "ApiUsrReposData_git_pull": "ApiUsrReposData_git_pull",
    "ApiUsr_Cmdline_Exec": "ApiUsr_Cmdline_Exec",
    "test_https_work": "test_https_work"
}
