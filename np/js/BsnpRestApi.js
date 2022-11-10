
var BsnpRestUti = {
    ajax_post: function (urls, inp, cbf) {
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
                cbf(ret)
            })
            .fail(function (xhr, textStatus, errorThrown) {
                alert("xhr.responseText=" + xhr.responseText + "\n,textStatus=" + textStatus);
                //alert("textStatus="+textStatus);
            });
    },
    ajax_get: function (urls, datum, cbf) {
        $.ajax({
            type: "GET",
            url: urls,//

            data: datum,
            crossDomain: true,
            success: function (dat, err) {
                console.log(dat)
                console.log(err)
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

    Init_RestApiStrn: function (uPar_Validate, RestApi) {
        for (var property in uPar_Validate) {
            RestApi[property] = property
        }
    }
}
var RestApi_uPar_Validate = {
    "Get_OTK": function (upar) { },
    "Jsonpster": "Jsonpster",
    "ApiUsrReposData_signin": function (usr) { },
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
    "ApiUsrReposData_destroy": function () { },
    "________ApiUsrReposData_create___test_only": "________ApiUsrReposData_create___test_only",
    "ApiUsrReposData_status": "ApiUsrReposData_status",
    "ApiUsrReposData_git_push": "ApiUsrReposData_git_push",
    "ApiUsrReposData_git_pull": "ApiUsrReposData_git_pull",
    "ApiUsr_Cmdline_Exec": "ApiUsr_Cmdline_Exec",
    "ApiBibleObj_read_crossnetwork_BkcChpVrs_txt": "ApiBibleObj_read_crossnetwork_BkcChpVrs_txt",
    "test_https_work": "test_https_work"
}


var RestApi = {}
BsnpRestUti.Init_RestApiStrn(RestApi_uPar_Validate, RestApi)



function BsnpRestApi() {
    this.init_param_fr_url()
}
BsnpRestApi.prototype.init_param_fr_url = function (usr, cbf) {

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
    this.svrurl = ip

    //const urlParams = new URLSearchParams(window.location.search);
    var ssid = urlParams.get('SSID');
    if (ssid) this.SSID = ssid


    //other param form url param ?ip=0.0.0.0:778&#Gen2:7
    var idx = window.location.href.indexOf("#") //case: ?ip=1.1.1.1#Gen1:1
    var bcv = ""
    if (idx >= 0) {
        //ip = window.location.href.substr(0, idx)
        bcv = window.location.href.substr(1 + idx)
        window.m_bcv = bcv
        console.log("ip,pcv:", ip, bcv)
    }
}
BsnpRestApi.prototype.urlRedirectParam = function () {
    var spar = `?ip=${this.svrurl}`
    if ("SSID" in this) {
        if (this.SSID.length > 10) {
            spar += "&SSID=" + this.SSID
        }
    }
    return spar
}
BsnpRestApi.prototype.signin = function (usr, cbf) { // usr = {repopath:"", passcode:"", ttl:9999}
    if (!usr.repopath || !usr.passcode || !usr.ttl) return alert("usr dat err:" + JSON.stringify(usr))
    var _this = this
    BsnpRestUti.ajax_get(`${this.svrurl}/Get_OTK`, {}, function (otk) {
        var inp = _this._get_encrypt_usr_inp(otk, usr)
        BsnpRestUti.ajax_post(`${_this.svrurl}/ApiUsrReposData_signin`, inp, function (ret) {
            if (ret.out.state.SSID) {
                _this.SSID = ret.out.state.SSID //for urlRedirectParam
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
BsnpRestApi["prototype"]["ajaxion"] = function (sapi, par, cbf) {
    console.log("BsnpRestApi input par:", par)
    var inp = { SSID: this.SSID }
    if (!inp.SSID) return alert("missing SSID.")
    inp.api = sapi
    inp.par = par

    RestApi_uPar_Validate[sapi](par)

    BsnpRestUti.ajax_post(`${this.svrurl}/${sapi}`, inp, cbf)
}





var sample_apiPar = {
    ApiUsrReposData_signin: [{ repopath: "", passcode: "", ttl: 9999 }],
    ApiUsrReposData_destroy: [{}],
    ApiBibleObj_load_by_bibOj: [{ fnames: ['NIV', 'CUVS', 'e_v_CUVS_enn2'], bibOj: { Gen: { 1: { 1: '' } } } }],
    ApiBibleObj_write_Usr_BkcChpVrs_txt: [{ fnames: ['e_v_CUVS_enn2'], inpObj: { Gen: { '1': { '1': 'in the beginning' } } } }],
    ApiBibleObj_search_txt: [{ fnames: ['NIV', 'e_Note'], bibOj: { Gen: {} }, Search: { File: "NIV", Strn: "Melchizedek" } }],
    ApiUsrDat_load: [
        {
            fnames: ["./dat/MostRecentVerses"], //MyBiblicalDiary
            data: {
                "MostRecent_Searches": {},
                "MostRecent_Verses": {},
            }
        },
        {
            fnames: ["./dat/MostRecentVerses"], //MyBiblicalDiary
            data: {
                "MostRecent_Searches": { MostRecentSearch: '', Group01: '' },
                "MostRecent_Verses": {},
            }
        }
    ],
    ApiUsrDat_save: [{
        fnames: ["./dat/MostRecentVerses"], //MyBiblicalDiary
        data: {
            "MostRecent_Searches": {
                Group01: [{ "Melchizedek": "1" }, { "x": "1" }],
                Group02: [{ "Melchizedekxxx": "3000", "YHWH": "4000" }],
                Group03: [{ "Melchizedekyyy": "5000", "YHWH": "6000" }]
            },
            "MostRecent_Verses": {
                Group01: [{ "Gen30:1": "1000" }],
                Group02: [{ "Gen3:1": "1000", "Gen4:1": "2000" }],
                Group03: [{ "Gen5:1": "1000", "Gen6:1": "2000" }],
                "MemoryVerse": [
                    {
                        "Amo1:4": "221105 080029"
                    }
                ],
                "RecentTouch": [
                    {
                        "Amo1:4": "221105 080029",
                        "Gen1:4": "221105 080020"
                    }
                ]
            },
        }
    }],
}

for (var property in sample_apiPar) {
    //RestApi[property] = property
    if ("ApiUsrReposData_signin" === property) {
        BsnpRestApi.prototype["ApiUsrReposData_signin"] = function (usr, cbf) { // usr = {repopath:"", passcode:"", ttl:9999}
            if (!usr.repopath || !usr.passcode || !usr.ttl) return alert("usr dat err:" + JSON.stringify(usr))
            var _this = this
            BsnpRestUti.ajax_get(`${this.svrurl}/Get_OTK`, {}, function (otk) {
                var inp = _this._get_encrypt_usr_inp(otk, usr)
                BsnpRestUti.ajax_post(`${_this.svrurl}/ApiUsrReposData_signin`, inp, function (ret) {
                    if (ret.out.state.SSID) {
                        _this.SSID = ret.out.state.SSID //for urlRedirectParam
                    }
                    cbf(ret, !_this.SSID)
                })
            })
        }
    } else {
        BsnpRestApi["prototype"][property] = function (par, cbf) {
            console.log("BsnpRestApi input par:", par)
            var inp = { SSID: this.SSID }
            if (!inp.SSID) return alert("missing SSID.")
            inp.api = property
            inp.par = par

            RestApi_uPar_Validate[property](par)

            BsnpRestUti.ajax_post(`${this.svrurl}/${property}`, inp, cbf)
        }
    }

}