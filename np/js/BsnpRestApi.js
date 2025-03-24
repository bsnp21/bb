
var BsnpRestUti = {
    ajax_post: function (urls, inp, cbf) {
        BsnpRestUti.Dbugar_store(inp)
        $.ajax({
            type: "POST",
            dataType: 'text',
            contentType: "application/json; charset=utf-8",
            url: urls,
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
                //BsnpRestUti.Dbugar_store(ret)
                cbf(ret)
            })
            .fail(function (xhr, textStatus, errorThrown) {
                alert("xhr.responseText=" + xhr.responseText + "\n,textStatus=" + textStatus);
                //alert("textStatus="+textStatus);
            });
    },
    ajax_get: function (urls, datum, cbf) {
        BsnpRestUti.Dbugar_store({ datum: datum })
        $.ajax({
            type: "GET",
            url: urls,//

            data: datum,
            crossDomain: true,
            success: function (dat, err) {
                console.log(dat)
                console.log(err)
                BsnpRestUti.Dbugar_store({ err, err })
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
        });
    },
    Dbugar_store: function (obj) {
        var ar = this.Dbugar_load()
        ar.unshift(obj)
        ar.pop()
        var str = JSON.stringify(ar)
        localStorage.setItem("DbugarStore", str)
    },
    Dbugar_load: function () {
        var str = localStorage.getItem("DbugarStore")
        if ("null"===str || !str) {
            str = JSON.stringify([{}, {}, {}, {}])
        }
        var ar = JSON.parse(str)
        return ar;
    },
    walk_obj: function (upar, obj) {
        function obj_iterate_walk(obj, par, cbf) {
            for (var property in obj) {
                if (obj.hasOwnProperty(property)) {
                    if (par.hasOwnProperty(property)) {
                        if (typeof obj[property] == "object") {
                            obj_iterate_walk(obj[property], par[property], cbf);
                        }
                    } else {
                        cbf(property)
                    }
                }
            }
        }
        obj_iterate_walk(obj, upar, function (prop) {
            alert("Api uPar missed key: " + prop)
        })
    },

    Init_RestApiStrn: function (uPar_Validate, restApi) {
        for (var property in uPar_Validate) {
            restApi[property] = property
        }
    }
}
var RestApi_uPar_Validate = {
    "Get_OTK": function (upar) { },
    "ApiUsrAccount_login": function (usr) { },
    "ApiUsrAccount_logout": function (usr) { },
    "ApiUsrAccount_create": function (usr) { },
    "ApiUsrAccount_update": function (usr) { },

    "ApiBibleObj_search_txt": function (upar) { BsnpRestUti.walk_obj(upar, { Search: { Strn: "", File: "" }, bibOj: {} }) },
    "ApiBibleObj_load_by_bibOj": function (upar) { BsnpRestUti.walk_obj(upar, { fnames: [], bibOj: {} }) },
    "ApiBibleObj_write_Usr_BkcChpVrs_txt": function (upar) { BsnpRestUti.walk_obj(upar, { fnames: [], inpObj: {} }) },
    "ApiUsrDat_save": function (upar) {
        BsnpRestUti.walk_obj(upar, {
            fnames: ["./dat/MostRecentVerses"], //MyBiblicalDiary
            data: ""
        })
    },
    "ApiUsrDat_load": function (upar) {
        BsnpRestUti.walk_obj(upar, {
            fnames: ["./dat/MostRecentVerses"], //MyBiblicalDiary
            data: ""
        })
    },
    "ApiUsrRepos_toolkids": function () { },
    "ApiBibleObj_read_crossnetwork_BkcChpVrs_txt": function () { },
    "________ApiUsrReposData_create___test_only": "________ApiUsrReposData_create___test_only",
    "ApiUsrReposData_status": "ApiUsrReposData_status",
    "ApiUsrReposData_git_push": "ApiUsrReposData_git_push",
    "ApiUsrReposData_git_pull": function () { },
    "ApiUsr_Cmdline_Exec": function () { },
    "test_https_work": function () { },
}


var RestApi = {
}

BsnpRestUti.Init_RestApiStrn(RestApi_uPar_Validate, RestApi)



function BsnpRestApi() {
    this.SSID = ""
    this.svrurl = ""
    this.urlParams = null
    this.init_param_fr_url()
}
BsnpRestApi.prototype.init_param_fr_url = function (usr, cbf) {
    function test_ip(ip) {
        if (!ip) {
            //use self ip.
            ip = window.location.host
        }
        if (!ip) {
            //use self ip.
            ip = window.location.hostname
        }
        if (!ip) {
            return alert("not localhost or missed in url with ?sip=x.x.x.x")
        }
        if ("undefined" === ip) {
            return alert("not localhost or missed in url with ?sip=undefined")
        }

        if (ip.indexOf(":") < 0) return alert(ip += ":7778 ---missed port")

        if (ip.indexOf("http") < 0) {
            if (ip.indexOf("7778") > 0) {//ssl
                ip = `http://${ip}`;
            } else {
                ip = `https://${ip}`;
            }
        }
        return ip
    }

    this.urlParams = new URLSearchParams(window.location.search);
    var ip = this.urlParams.get('sip');
    this.svrurl = test_ip(ip)
    this.SSID = this.urlParams.get('SSID');

}
BsnpRestApi.prototype.urlRedirectParam = function () {
    var spar = `?sip=${this.svrurl}`
    if (this.SSID && this.SSID.length > 1) {
        spar += "&SSID=" + this.SSID
    }
    return spar
}
BsnpRestApi.prototype.signin = function (usr, cbf) { // usr = {repopath:"", passcode:"", ttl:9999}
    if (!usr.repopath || !usr.passcode || !usr.ttl) return alert("usr dat err:" + JSON.stringify(usr))
    var _this = this
    BsnpRestUti.ajax_get(`${this.svrurl}/Get_OTK`, {}, function (otk) {
        var inp = _this._get_encrypt_usr_inp(otk, usr)
        BsnpRestUti.ajax_post(`${_this.svrurl}/ApiUsrReposData_signin`, inp, function (ret) {
            if (ret.out.SSID) {
                _this.SSID = ret.out.SSID //for urlRedirectParam
            }
            cbf(ret, !_this.SSID)
        })
    })
}
BsnpRestApi.prototype._get_encrypt_usr_inp = function (otk, usr) {
    console.log("BsnpRestApi input usr:", usr)
    var inp = { CUID: otk.CUID }
    if (!inp.CUID) return alert("missing CUID.")
    if (otk.pkb64.length === 0) return alert("no pubkey. Please load page again.")

    if ('object' != typeof usr) return alert("missing usr.")
    var usrs = JSON.stringify(usr)
    if (usrs.length > 500) { return alert("max 4096-bit rsa: 501B. len=" + usrs.length) }

    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(atob(otk.pkb64));
    inp.cipherusrs = encrypt.encrypt(usrs);

    console.log("cipherusrs.len:", inp.cipherusrs.length)
    return inp
}
BsnpRestApi.prototype.redirect_page = function (surl) {

}
BsnpRestApi.prototype.ajaxion = function (sapi, par, cbf) {
    console.log("BsnpRestApi input par:", par)
    var inp = { SSID: this.SSID }
    if (!inp.SSID) return alert("missing SSID.")
    inp.api = sapi
    inp.par = par

    RestApi_uPar_Validate[sapi](par)

    BsnpRestUti.ajax_post(`${this.svrurl}/${sapi}`, inp, cbf)
}

//////////////////////////////////////////////////////////////////////
// for easier to use.
BsnpRestApi.prototype.ApiUsrAccount_create = function (par, cbf) {
    par.passcode = btoa(par.passcode)
    var _this = this
    _this.SSID = "-" //create/login do not need ssid. others need.
    return this.ajaxion("ApiUsrAccount_create", par, cbf)
}

BsnpRestApi.prototype.ApiUsrAccount_login = function (par, cbf) {
    par.passcode = btoa(par.passcode) 
    var _this = this
    _this.SSID = "-" //create/login do not need ssid. others need.
    return this.ajaxion("ApiUsrAccount_login", par, function (ret) {
        if (ret.out.SSID) {
            _this.SSID = ret.out.SSID //for urlRedirectParam
        } else {
            console.log("missed SSID in ret.out.state. login failed.")
        }
        if (cbf) cbf(ret)
    })
}

BsnpRestApi.prototype.ApiUsrAccount_logout = function (par, cbf) {
    return this.ajaxion("ApiUsrAccount_logout", par, cbf)
}
BsnpRestApi.prototype.ApiUsrAccount_update = function (par, cbf) {
    par.passcodeNew = btoa(par.passcodeNew) 
    return this.ajaxion("ApiUsrAccount_update", par, cbf)
}

BsnpRestApi.prototype.ApiUsrRepos_toolkids = function (par, cbf) {
    return this.ajaxion("ApiUsrRepos_toolkids", par, cbf)
}
BsnpRestApi.prototype.ApiUsr_Cmdline_Exec = function (par, cbf) {
    return this.ajaxion("ApiUsr_Cmdline_Exec", par, cbf)
}

BsnpRestApi.prototype.ApiBibleObj_load_by_bibOj = function (par, cbf) {
    return this.ajaxion("ApiBibleObj_load_by_bibOj", par, cbf)
}

BsnpRestApi.prototype.ApiBibleObj_write_Usr_BkcChpVrs_txt = function (par, cbf) {
    return this.ajaxion("ApiBibleObj_write_Usr_BkcChpVrs_txt", par, cbf)
}

BsnpRestApi.prototype.ApiBibleObj_search_txt = function (par, cbf) {
    return this.ajaxion("ApiBibleObj_search_txt", par, cbf)
}

BsnpRestApi.prototype.ApiUsrDat_load = function (par, cbf) {
    return this.ajaxion("ApiUsrDat_load", par, cbf)
}

BsnpRestApi.prototype.ApiUsrDat_save = function (par, cbf) {
    return this.ajaxion("ApiUsrDat_save", par, cbf)
}


BsnpRestApi.prototype.ApiBibleObj_read_crossnetwork_BkcChpVrs_txt = function (par, cbf) {
    return this.ajaxion("ApiBibleObj_read_crossnetwork_BkcChpVrs_txt", par, cbf)
}








