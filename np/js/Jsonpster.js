
var Jsonpster = {
    SvrUrl: "${SvrUrl}",
    api: "",
    inp: { CUID:"${sCUID}", usr:null, SSID:null, par:null, aux:null},
    pkb64:"${pkb64}",
onBeforeRun : function(){},
onAfterRun : function(){},

onSignin : function(){
    this.inp.SSID = null
    if (!this.inp.CUID) return alert("missing CUID.")
    if ('object' != typeof this.inp.usr)return alert("missing usr.")
    if (this.pkb64.length === 0)return alert("no pubkey. Please load page again.")
    
    var usrs = JSON.stringify(this.inp.usr)
    if (usrs.length > 500) {return alert("max 4096-bit rsa: 501B. len="+usrs.length)}

    //alert(this.inp.usr)
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(atob(this.pkb64));
    this.inp.cipherusrs = encrypt.encrypt(usrs);
    this.inp.usr = null

    this.api = "UsrReposPost_Signin"

    console.log(this.inp.cipherusrs.length)
    console.log(this.inp)
    console.log("Jsonpster")
    console.log(Jsonpster)
},
onSigned : function(){
    if (this.inp.SSID === null) return alert("lost inp.SSID")
    //if (!this.inp.par) return alert("miissing inp.par="+this.inp.par)
    if (this.inp.usr !== null) return alert("forbidden inp.usr")
},

RunAjaxPost_Signed : function(cbf){
    this.onSigned()
    this.RunAjax_PostTxt (cbf)
},
RunAjaxPost_Signin : function (cbf) {
    this.onSignin()
    this.RunAjax_PostTxt (cbf)
},
RunAjax_PostTxt : function(cbf){
    this.onBeforeRun()
    if (!this.api) return alert("ErrApi="+this.api)
    this.inp.api = this.api
    $.ajax({
        type: "POST",
        dataType: 'text',
        contentType: "application/json; charset=utf-8",
        url: Jsonpster.SvrUrl + Jsonpster.api,
        data: JSON.stringify(this.inp),
        username: 'user',
        password: 'pass',
        crossDomain : true,
        xhrFields: {
            withCredentials: false
        }
    })
        .success(function( data ) {
            //console.log("success",data);
            //cbf(JSON.parse(data))
        })
        .done(function( ret ) {
            var ret = JSON.parse(ret)
            Jsonpster.onAfterRun(ret)
            cbf (ret)
            Jsonpster.api = Jsonpster.inp.par = Jsonpster.inp.usr = null;
        })
        .fail( function(xhr, textStatus, errorThrown) {
            console.log("err surlapi=",Jsonpster.SvrUrl + Jsonpster.api)
            alert("xhr.responseText="+xhr.responseText+",textStatus="+textStatus);
            //alert("textStatus="+textStatus);
        });
},
}
