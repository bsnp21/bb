Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
Date.prototype.toLocalY4MMDD = function () {
    var syear = this.getUTCFullYear().toString()
    var smonth = (1 + this.getMonth()).toString().padStart(2, "0")
    var sdate = this.getDate().toString().padStart(2, "0")
    return syear + smonth + sdate;
}
Date.prototype.toLocal_YY_MM_DD = function () {
    var syear = this.getUTCFullYear().toString().substr(2)
    var smonth = (1 + this.getMonth()).toString().padStart(2, "0")
    var sdate = this.getDate().toString().padStart(2, "0")
    return syear + "_" + smonth + "_" + sdate;
}
//https://www.infoplease.com/calendars/holidays/jewish-holidays
//NOTE: All Hebrew holidays begin at sundown on the evening before the date given.

var Festival_Website = {
    "Purim": "https://www.infoplease.com/culture-entertainment/holidays/what-purim",
    "Passover": "https://www.infoplease.com/encyclopedia/religion/judaism/info/passover",
    "Shavuot": "https://www.infoplease.com/encyclopedia/religion/judaism/info/shavuot",
    "RoshHashaah": "https://www.infoplease.com/culture-entertainment/holidays/rosh-hashanah-jewish-new-year",
    "YomKippur": "https://www.infoplease.com/culture-entertainment/holidays/what-yom-kippur",
    "Sukkot": "https://www.infoplease.com/encyclopedia/religion/judaism/info/tabernacles-feast-of",
    "ShemiiAtzeret": "https://www.infoplease.com/dictionary/shemini-atzereth"
}
var Jewish_Festival_Dates = {
    "20100228": "Purim",
    "20100330": "Passover",
    "20100519": "Shavuot",
    "20100909": "RoshHashaah",
    "20100918": "YomKippur",
    "20100923": "Sukkot",
    "20100930": "ShemiiAtzeret",
    "20110320": "Purim",
    "20110419": "Passover",
    "20110608": "Shavuot",
    "20110929": "RoshHashaah",
    "20111008": "YomKippur",
    "20111013": "Sukkot",
    "20111020": "ShemiiAtzeret",
    "20120308": "Purim",
    "20120407": "Passover",
    "20120527": "Shavuot",
    "20120917": "RoshHashaah",
    "20120926": "YomKippur",
    "20121001": "Sukkot",
    "20121008": "ShemiiAtzeret",
    "20130224": "Purim",
    "20130326": "Passover",
    "20130515": "Shavuot",
    "20130905": "RoshHashaah",
    "20130914": "YomKippur",
    "20130919": "Sukkot",
    "20130926": "ShemiiAtzeret",
    "20140316": "Purim",
    "20140415": "Passover",
    "20140604": "Shavuot",
    "20140925": "RoshHashaah",
    "20141004": "YomKippur",
    "20141009": "Sukkot",
    "20141016": "ShemiiAtzeret",
    "20150305": "Purim",
    "20150404": "Passover",
    "20150524": "Shavuot",
    "20150914": "RoshHashaah",
    "20150923": "YomKippur",
    "20150928": "Sukkot",
    "20151005": "ShemiiAtzeret",
    "20160324": "Purim",
    "20160423": "Passover",
    "20160612": "Shavuot",
    "20161003": "RoshHashaah",
    "20161012": "YomKippur",
    "20161017": "Sukkot",
    "20161024": "ShemiiAtzeret",
    "20170312": "Purim",
    "20170411": "Passover",
    "20170531": "Shavuot",
    "20170921": "RoshHashaah",
    "20170930": "YomKippur",
    "20171005": "Sukkot",
    "20171012": "ShemiiAtzeret",
    "20180301": "Purim",
    "20180331": "Passover",
    "20180520": "Shavuot",
    "20180910": "RoshHashaah",
    "20180919": "YomKippur",
    "20180924": "Sukkot",
    "20181001": "ShemiiAtzeret",
    "20190321": "Purim",
    "20190420": "Passover",
    "20190609": "Shavuot",
    "20190930": "RoshHashaah",
    "20191009": "YomKippur",
    "20191014": "Sukkot",
    "20191021": "ShemiiAtzeret",
    "20200310": "Purim",
    "20200409": "Passover",
    "20200529": "Shavuot",
    "20200919": "RoshHashaah",
    "20200928": "YomKippur",
    "20201030": "Sukkot",
    "20201010": "ShemiiAtzeret",
    "20210226": "Purim",
    "20210328": "Passover",
    "20210517": "Shavuot",
    "20210907": "RoshHashaah",
    "20210916": "YomKippur",
    "20210921": "Sukkot",
    "20210928": "ShemiiAtzeret",
    "20220317": "Purim",
    "20220416": "Passover",
    "20220605": "Shavuot",
    "20220926": "RoshHashaah",
    "20221005": "YomKippur",
    "20221010": "Sukkot",
    "20221017": "ShemiiAtzeret",
    "20230307": "Purim",
    "20230406": "Passover",
    "20230526": "Shavuot",
    "20230916": "RoshHashaah",
    "20230925": "YomKippur",
    "20230930": "Sukkot",
    "20231007": "ShemiiAtzeret",
    "20240324": "Purim",
    "20240423": "Passover",
    "20240612": "Shavuot",
    "20241003": "RoshHashaah",
    "20241012": "YomKippur",
    "20241017": "Sukkot",
    "20241024": "ShemiiAtzeret",
    "20250314": "Purim",
    "20250413": "Passover",
    "20250602": "Shavuot",
    "20250923": "RoshHashaah",
    "20251002": "YomKippur",
    "20251007": "Sukkot",
    "20251014": "ShemiiAtzeret",
    "20260303": "Purim",
    "20260402": "Passover",
    "20260522": "Shavuot",
    "20260912": "RoshHashaah",
    "20260921": "YomKippur",
    "20260926": "Sukkot",
    "20261003": "ShemiiAtzeret",
    "20270323": "Purim",
    "20270422": "Passover",
    "20270611": "Shavuot",
    "20271002": "RoshHashaah",
    "20271011": "YomKippur",
    "20271016": "Sukkot",
    "20271023": "ShemiiAtzeret",
    "20280312": "Purim",
    "20280411": "Passover",
    "20280531": "Shavuot",
    "20280921": "RoshHashaah",
    "20280930": "YomKippur",
    "20281005": "Sukkot",
    "20281012": "ShemiiAtzeret",
    "20290301": "Purim",
    "20290331": "Passover",
    "20290520": "Shavuot",
    "20290910": "RoshHashaah",
    "20290919": "YomKippur",
    "20290924": "Sukkot",
    "20291001": "ShemiiAtzeret",
    "20300319": "Purim",
    "20300418": "Passover",
    "20300607": "Shavuot",
    "20300928": "RoshHashaah",
    "20301007": "YomKippur",
    "20301012": "Sukkot",
    "20301019": "ShemiiAtzeret"
}//Jewish_Festival_Dates
var ReservedDays = {

}
for (let [sdate, desc] of Object.entries(Jewish_Festival_Dates)) {
    if (!ReservedDays[sdate]) ReservedDays[sdate] = []
    ReservedDays[sdate].push(desc)
}

var MonthName = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]


var storage = {
    save_note: function (id, htms) {
        var obj = this.get_notesObj()
        obj[id] = htms;
        var str2 = JSON.stringify(obj)
        $("#info").text("size:" + str2.length)
        localStorage.setItem("notes", str2)
    },
    get_notesObj: function () {
        var str = localStorage.getItem("notes")
        if (!str) str = JSON.stringify({})
        var obj = JSON.parse(str)
        return obj
    }
}

var uuti = {
    export_notes: function () {
        var data = {}
        $(".noteTag").each(function () {
            var txt = $(this).html().trim()
            var sdate = $(this).attr("id")
            if (txt.length > 1 && txt != "<ol><li></li></ol>" && txt != "<ol type=\"a\"><li></li></ol>" && txt != "<ul><li></li></ul>") {
                data[sdate] = txt
            }
        })
        //var str = JSON.stringify(data, null, 4)
        return data
    },
    Clear: function () {
        if (confirm("Empty notes of Calendar?") == false) return
        $(".noteTag").html("")
        setTimeout(() => {
            if (confirm("Clear all notes data in local storage? (unrecoverable)") == false) return
            localStorage.setItem("notes", "")
        }, 1)
    },

    render2ui: function (str) {
        var obj = JSON.parse(str)
        if (!obj) return alert("not obj:" + str)
        for (let [sdate, txt] of Object.entries(obj)) {
            $(`#${sdate}`).html(txt)
        }
        return obj
    },


    increase_width: function (idlta) {
        var width = $("#tab1 td").width();
        width += idlta
        $("td").width(width)
        $(".noteTag").css({ "width": width })
    },




    svrApi: {

        getY4: function (y4mmdd) {
            return y4mmdd.substr(0, 4)
        },
        getMMDD: function (y4mmdd) {
            return y4mmdd.substr(4)
        },

        MyBiblicalDiary_save: function (y4, mmdd, txt, cbf) {
            var par = {
                "fnames": [
                    "./dat/MyBiblicalDiary"
                ],
                "data": {
                }
            }
            par.data[y4] = {}
            par.data[y4][mmdd] = txt
            var api = new BsnpRestApi()
            api.ApiUsrDat_save(par, cbf)
        },
        MyBiblicalDiary_load: function (y4, mmdd, cbf) {
            var par = {
                "fnames": [
                    "./dat/MyBiblicalDiary"
                ],
                "data": {
                }
            }

            par.data[y4] = {}
            if (mmdd.length === 4) {
                par.data[y4][mmdd] = ""
            }
            var api = new BsnpRestApi()
            api.ApiUsrDat_load(par, cbf)
        }
    }


}


function on_editorboard_hide(e) {
    console.log("on_editorboard_hide-------")
    $(".afterload").removeClass("afterload")
    $("#outx").val("")
    //alert("saves")
}
function on_editorboard_show(e) {
    console.log("show-------")
    //alert("loades")
}
var calendar3yr = {
    gen_tbody: function (eid, inext) {
        var today = new Date()
        var todayID = today.toLocalY4MMDD();//toLocal_YY_MM_DD()
        $("#ScrollToToday").text(todayID.slice(0, 4) + "-" + todayID.slice(4))

        //var yr = prompt("enter year xxxx", );
        var yr = today.getUTCFullYear()
        yr += inext

        var date = new Date(yr, 0, 1);
        //var yearEnd = new Date(2019, 11, 1);
        var trs = "", weekidx = 0, idaycounter = 0
        for (var i = 0; i <= 3650; i++) {
            var odat = date.addDays(i);
            var iweek = odat.getDay()
            var iyear = odat.getUTCFullYear()
            var imont = 1 + odat.getMonth()
            var idate = odat.getDate()
            var sdateID = odat.toLocalY4MMDD();// toLocal_YY_MM_DD()

            var special = ""
            if (ReservedDays[sdateID]) {
                ReservedDays[sdateID].forEach((desc) => {
                    special = `<a class='ReservedDesc' title='${desc}' href='${Festival_Website[desc]}'>${desc.substr(0, 5)}</a><br>`
                })
            }

            if (idaycounter >= 364) break


            if (0 === iweek) {
                trs += `<tr><th class='mnth month${imont}'><a class='thidx vertxt'>${++weekidx}</a><a class='vertxt month${imont} month_mark'>${MonthName[imont]}</a></th>`;
            }
            if (weekidx === 0) continue;
            idaycounter++

            trs += `<td class='month${imont}'><div class='dayNum' title=${sdateID}  iweek='${iweek}'>${idate}</div><div class='ReservedDay'>${special}</div><div class='noteTag' id=${sdateID} y4md='${odat.toLocalY4MMDD()}' title=${sdateID}></div></td>`;

            if (6 === iweek) {
                trs += "</tr>";
            }
        }
        //$("#year").html(yr)
        $(`${eid} caption`).text(yr);
        $(`${eid} caption`).on("click", function () {
            var notesObj = storage.get_notesObj()
            var y4 = $(this).text().trim()
            var _THIS = this
            $(".hili_run_start, .hili_run_stop").removeClass("hili_run_start").removeClass("hili_run_stop")
            $(this).parent().find("tbody").slideToggle("slow", function (e) {
                if ($(this).is(":visible")) {
                    $(_THIS).addClass("hili_run_start")
                    uuti.svrApi.MyBiblicalDiary_load(y4, "", function (ret) {
                        console.log(ret)
                        $(_THIS).addClass("hili_run_stop").removeClass("hili_run_start")
                        var yobj = ret.out.data[y4]
                        if (yobj && "object" === typeof (yobj)) {
                            for ([mmdd, txt] of Object.entries(yobj)) {
                                var id = y4 + mmdd
                                var sdiff = ""
                                if (id in notesObj) {
                                    var storedtxt = notesObj[id]
                                    if (storedtxt != txt) {
                                        sdiff = "diff_note"
                                        txt = storedtxt
                                    }
                                }
                                $(`#${id}`).html(txt).addClass(sdiff)
                            }
                        } else {
                            alert("loaded err.")
                        }
                    })
                }
            })
        })
        $(`${eid} tbody`).html(trs)
            .find("td").on("click", function () {
                $(".hili_td").removeClass("hili_td")
                $(this).toggleClass("hili_td")
            })


        $(`${eid} tbody`).find(`#${todayID}`).each(function () {
            $(this).parent().find(".dayNum").addClass("todayNum");
            //$(this)[0].scrollIntoView() //run in post_gen
        })

        return $(`${eid} tbody`)
    },
    gen_all_tbodies_evt: function () {

        //set noteTag width
        var width = $("td").width()
        $(".noteTag").css({ "width": width - 2 })

        //
        $(".noteTag").on("click", function (evt) {
            evt.stopImmediatePropagation()
            var _This = this
            var display = $("#editorboard").css("display")

            var bhasHili = $(this).hasClass("hili_notes")
            $(".hili_notes").removeClass("hili_notes")
            if (!bhasHili) {
                $(this).addClass("hili_notes")
            }
            bhasHili = $(this).hasClass("hili_notes")
            if (!bhasHili) {
                $("#editorboard").hide("slow", on_editorboard_hide)
                return false
            }

            if (('none' == display) && bhasHili) {
                $("#editorboard").show("slow", on_editorboard_show)
            } else {
                //$("#editxt").hide()
            }

            //present editorboard
            var sWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            var iweek = $(this).parent().index() - 1;
            var sid = $(this).attr("id")
            sid = sid.slice(0,4)+"-"+sid.slice(4) + ", " + sWeek[iweek]

            var htm = $(this).html()
            $("#editHtm").html(htm)
            $("#editxar").val(htm)
            $("#editinf").html(htm.length)
            $("#edi_showDate").text(sid)



            console.log("window.scrollY=", window.scrollY)
            var rectTag = $(this)[0].getBoundingClientRect();
            console.log("rectTag", rectTag)
            console.log("evt.pageY", evt.pageY)
            var rect = $("#tab1")[0].getBoundingClientRect();
            console.log(rect)

            var width = $("#tab1").width()
            $("#editorboard").width(width)
            console.log("width", width)

            $("#editorboard").css({
                left: 15 + rect.left,
                top: window.scrollY + rectTag.top + rectTag.height,   //20 + evt.pageY,
                width: width - 50,
            })
                .focus()


        })
        $(".dayNum").on("click", function () {
            $(this).toggleClass("hili_day")
        })


    },

    gen_evt_edit: function () {
        ////////////////////////////
        // Svc operation on editxt. 
        $("#LoadTxt").on("click", function (e) {
            var _THIS = this
            e.stopImmediatePropagation()
            $(".hili_run_start, .hili_run_stop").removeClass("hili_run_start").removeClass("hili_run_stop")
            $(_THIS).addClass("hili_run_start")
            $(".afterload").removeClass("afterload")
            var id = $(".hili_notes").attr("id")
            var tx = $("#editHtm").html().trim()
            var y4md = $(".hili_notes").attr("y4md")
            var y4 = uuti.svrApi.getY4(id)
            var mmdd = uuti.svrApi.getMMDD(id)
            console.log(id, ":", id, tx)
            uuti.svrApi.MyBiblicalDiary_load(y4, mmdd, function (ret) {
                $(_THIS).removeClass("hili_run_start").addClass("hili_run_stop")
                console.log(ret)
                $("#outx").val(JSON.stringify(ret, null, 4))
                //$("#editxt").addClass("afterload")
                if (!ret.out.data) {
                    return alert("loaded data is empty.")
                }
                if (ret.out.data[y4][mmdd] && "string" === typeof ret.out.data[y4][mmdd] && ret.out.data[y4][mmdd].trim().length > 0) {
                    var loadedtxt = ret.out.data[y4][mmdd].trim()
                    if (tx != loadedtxt) {
                        var msg = ""
                        if (tx.indexOf(loadedtxt) >= 0) { msg = `loaded txt(${loadedtxt.length}) is part of current text(${tx.length}).` }
                        else if (loadedtxt.indexOf(tx) >= 0) { msg = `loaded txt(${loadedtxt.length}) contains current txt(${tx.length}).` }
                        else { msg = `loaded txt(${loadedtxt.length}) differs to current txt(${tx.length}).` }

                        if (confirm(`${msg}\n-Ok to overwite current text?`)) {
                            //loadedtxt += "<div class='mergedtxt'>" + tx + "</div>"
                            $(`#${id}`).html(loadedtxt)
                            $("#editHtm").html(loadedtxt).addClass("afterload")
                            $("#editxar").val(loadedtxt)
                            $("#editinf").html(loadedtxt.length)
                        }
                    }
                } else {
                    return alert("loaded empty.")
                }
            })
        })
        $("#SaveTxt").on("click", function (e) {
            var _THIS = this
            e.stopImmediatePropagation()
            if (!confirm("Save it?")) return;
            $(".hili_run_start, .hili_run_stop").removeClass("hili_run_start").removeClass("hili_run_stop")
            $(this).addClass("hili_run_start")
            $(".afterload").removeClass("afterload")
            var id = $(".hili_notes").attr("id")
            var tx = $("#editHtm").html()
            var y4md = $(".hili_notes").attr("y4md")
            console.log(id, ":", y4md, tx)
            uuti.svrApi.MyBiblicalDiary_save(uuti.svrApi.getY4(y4md), uuti.svrApi.getMMDD(y4md), tx, function (ret) {
                $("#outx").val(JSON.stringify(ret, null, 4))
                $("#editHtm").addClass("afterload")
                $(_THIS).removeClass("hili_run_start").addClass("hili_run_stop")
            })
        })
        $("#ord_lst").on("click", function (e) {
            $(this).blur()
            e.stopImmediatePropagation()
            //$('#editxt').focus()
            $('#editHtm').append('<ol><li></li></ol>');
        })
        ///////////////////////////////




        /////////////////////////////////
        // Editxt
        $("#editHtm").off("keyup").on("keyup", function (evt) {
            if (evt.keyCode === 13) {
                // insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
                //document.execCommand('insertLineBreak', true, '<br/>');
                // prevent the default behaviour of return key pressed
                //return true;
            }
            var htms = $(this).html().replace(/\&nbsp\;/g, " ")
            var id = $("#edi_showDate").text()
            $(`#${id}`).html(htms)
            storage.save_note(id, htms)
            $("#editxar").val(htms)
            $("#editinf").text(htms.length)
        }).on("click", function (evt) {
            evt.stopImmediatePropagation()
            var htms = $(this).html()
            $("#editxar").val(htms.replace(/\&nbsp\;/g, " "))
            return false
        })

        $("#editxar").slideToggle()
        $("#editxar").on("keyup", function () {
            var htms = $(this).val()
            $("#editHtm").html(htms)
            $("#editinf").text(htms.length)
        }).on("click", function (evt) {
            evt.stopImmediatePropagation()
            return false
        })
        $("#editinf").on("click", function (evt) {
            evt.stopImmediatePropagation()
            $("#editxar").slideToggle()
            return false
        })

    },
    gen_evt_others: function () {

        $("#editorboard").on("click", function () {
            $(this).hide("slow", on_editorboard_hide)
        })
        $("body").on("click", function () {
            $("#editorboard").hide("slow")
        })


        $("#ScrollToToday").on("click", function () {
            $(".todayNum")[0].scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
        })
        setTimeout(function () {
            $(".todayNum")[0].scrollIntoView()
        }, 500)


        ///

        $("#_MenuPanel").slideToggle()
        $("#menuPanelToggler").on("click", function () {
            $("#_MenuPanel").slideToggle()
        })

        $("#info").on("click", function () {
            uuti.format_obj_txa()
        })

        $("#emailto").on("click", function () {
            var smail = $("#email_addr").val()
            var sbody = JSON.stringify(uuti.export_notes())
            var str = `mailto:${smail}?subject=https://bsnp21.github.io/tools/calendars/calendar3yr.htm&body=${encodeURIComponent(sbody)}`
            $(this).attr("href", str)

        })

        var api = new BsnpRestApi()
        $("#menuPanelToggler").text(api.urlParams.get("repo"))
        $("#DiarySite").attr("href", `../myExt_Diary.htm${window.location.search}`)
    },
    post_gen: function () {
        this.gen_all_tbodies_evt()
        this.gen_evt_edit()
        this.gen_evt_others()

        $("#tab1 caption").trigger("click")
    },
    end: function () {
        setTimeout(function () {
            calendar3yr.post_gen()
        }, 500)
    },
}

//{"22_09_02":"Seattle: arrived<div><br><div><br></div></div>","22_09_03":"hiking","22_09_04":"Moderna:Safeway<div>VitaminB</div><div>RoomTemp=90</div>","22_09_05":"Reaction: less food, more sleep","22_09_06":"normal<div>痰 phlegm/sputum/Spittle </div>","22_09_07":"throat sounds but no pain or uncomfort<div>hiking 3 hrs</div>","22_09_08":"hiking 3hr<div>RoomTemp=97</div>","22_09_09":"Timberlake Park, 5 hrs 5 mi.","22_09_10":"Golden Beach; Botanical Garden.&nbsp;","22_09_11":"crossroad church:Heb10:25","22_09_27":"flight 2 atlanta","22_11_09":"yty<div>af-op</div>"}