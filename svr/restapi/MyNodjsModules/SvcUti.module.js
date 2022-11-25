//2018/05/12 MyNodejsModuels/Uti.module.js

const fs = require('fs');
const path = require('path');
var url = require('url'); //for web app.


var SvcUti = {
    GetApiInputParamObj: function (req) {
        console.log("req.url=", req.url);
        var q = url.parse(req.url, true).query;
        console.log("q=", q);
        if (q.inp === undefined) {
            console.log("q.inp undefined. Maybe unload or api err");
            return q;
        }
        var s = decodeURIComponent(q.inp);//must for client's encodeURIComponent
        var inpObj = JSON.parse(s);
        console.log("inp=", inpObj);
        return inpObj;
    },
    BindApp2Api: function (app, svcApi) {
        Object.keys(svcApi).forEach(function (api) {
            app.get("/" + api, (req, res) => {
                var inpObj = SvcUti.GetApiInputParamObj(req);
                console.log(typeof svcApi[api], api);

                var ret = svcApi[api](inpObj);
                res.writeHead(200, { 'Content-Type': 'text/javascript' });
                res.write(".Response(" + ret + ");");
                res.end();
            });
        });
    }
};






module.exports.SvcUti = SvcUti;

