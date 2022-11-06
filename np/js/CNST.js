
////////////////////////////////////
const CNST = {
}
///////////////////////////////
// Steps to add a new book or e_* book.
// 1. add the idential file name in FnameOfBibleObj in CNST.js. 
// 2. add the file in github(wdingbox).
//    a. if the file is a new version of the Bible, e.g. BBE.json.js,
//       add it in bible_obj_lib/jsdb/jsBibleObj/BBE.json.js 
//    b. if the file is the editiable e_* files,
//       add it in bible_obj_lib/jsdb/UsrDataTemplate/myoj/e_*_json.js. 
// 3. on svr (/var/www/html/wdas/) by (wdingbox/ham12/utility/wsaws/keypair, ssh)
//    a. git pull in bb/. 
//    b. git pull in bible_obj_lib/.
CNST.FnameOfBibleObj =
{
    "BBE": "Basic Bible in English",
    "CPDV": "Catholic Public Domain Version",
    "CUVS": "Chinese Union Version Simplified, 官話和合本, 1919",
    "CUVsen": "CUV Simplied with English Name",
    "CUVpy": "Chinese Union Version PinYing",
    "ESV": "English Standard Version",
    "H_G": "Hebrew and Greek",
    "KJV": "King James Version",
    "KJV_Jw": "King James Version Jesus' Words",
    "NHEB_yhwh": "New Heart English Bible, yhwy, 2021",
    "NIV": "New International Version",
    "NIV_Jw": "New International Version Jesus' Words",
    "STUS": "Studium Biblicum Version by Catholic,1968",
    "WLVS": "Wen Li Version. 文理和合本新約全書於1906年出版，新舊約全書於1919年出版.修訂新約後的新舊約全書，於1923年出版，至1934年印行最後一版, 原本分為官話、深文理、淺文理三種譯本，稱為「聖經唯一，譯本則三」。後來深淺文理合併為文理和合本 https://zh.wikisource.org/wiki/%E8%81%96%E7%B6%93_(%E5%92%8C%E5%90%88%E6%9C%AC) \n\nFor 1895 新約淺文理(包爾騰(John Shaw Burdon)、柏亨利(Henry Blodget)) https://bible.fhl.net/ob/nob.html?book=8 ",
    "cross_references": "cross-references",
    "e_CrossRef": "User can modify cross-references for related verses in the Bible. Recommended to follow the standard abbreviation format. For example, <br>Gen2:7 refers to Genesis, chapter 2, verse 7. <br>1Jn5:12 refers to 1-John, chapter 5, verse 12.",
    "e_Note": "personal biblical study notes, commentary, questions, testimony, reflections, takeaway, other website links etc.",
    "e_Prayer": "personal prayer, preach, prophect, paper or project related to the verse and real life..",
    "e_Subtitle": "sub-title of its following verses.",
    "e_Summary": "summary of chapter or pericope.",
    "e_YouTxt": "your any text unlimited.",
    "e_v_CUVS_enn2": "CUVS special names latinization. For easy reading/study, consistency to the West.",
    "e_v_CUVS_enn3": "CUVS divine God's names latinization."
};

CNST.BiBookName = {
    "Gen": ['Genesis', 'genesis', '创世纪',],
    "Exo": ['Exodus', 'exodus', '出埃及记',],
    "Lev": ['Leviticus', 'leviticus', '利未记',],
    "Num": ['Numbers', 'numbers', '民数记',],
    "Deu": ['Deuteronomy', 'deuteronomy', '申命记',],
    "Jos": ['Joshua', 'joshua', '约书亚记',],
    "Jug": ['Judges', 'judges', '士师记',],
    "Rut": ['Ruth', 'ruth', '路得记',],
    "1Sa": ['1_Samuel', '1-samuel', '撒母耳记上',],
    "2Sa": ['2_Samuel', '2-samuel', '撒母耳记下',],
    "1Ki": ['1_Kings', '1-kings', '列王记上',],
    "2Ki": ['2_Kings', '2-kings', '列王记下',],
    "1Ch": ['1_Chronicles', '1-chronicles', '历代志上',],
    "2Ch": ['2_Chronicles', '2-chronicles', '历代志下',],
    "Ezr": ['Ezra', 'ezra', '以斯拉记',],
    "Neh": ['Nehemiah', 'nehemiah', '尼希米记',],
    "Est": ['Esther', 'esther', '以斯帖记',],
    "Job": ['Job', 'job', '约伯记',],
    "Psm": ['Psalm', 'psalm', '诗篇',],
    "Pro": ['Proverbs', 'proverbs', '箴言',],
    "Ecc": ['Ecclesiastes', 'ecclesiastes', '传道书',],
    "Son": ['SongOfSolomon', 'song-of-solomon', '雅歌',],
    "Isa": ['Isaiah', 'isaiah', '以赛亚书',],
    "Jer": ['Jeremiah', 'jeremiah', '耶利米书',],
    "Lam": ['Lamentations', 'lamentations', '耶利米哀歌',],
    "Eze": ['Ezekiel', 'ezekiel', '以西结书',],
    "Dan": ['Daniel', 'daniel', '但以理书',],
    "Hos": ['Hosea', 'hosea', '何西阿书',],
    "Joe": ['Joel', 'joel', '约珥书',],
    "Amo": ['Amos', 'amos', '阿摩司书',],
    "Oba": ['Obadiah', 'obadiah', '俄巴底亚书',],
    "Jon": ['Jonah', 'jonah', '约拿书',],
    "Mic": ['Micah', 'micah', '弥迦书',],
    "Nah": ['Nahum', 'nahum', '那鸿书',],
    "Hab": ['Habakkuk', 'habakkuk', '哈巴谷书',],
    "Zep": ['Zephaniah', 'zephaniah', '西番雅书',],
    "Hag": ['Haggai', 'haggai', '哈该书',],
    "Zec": ['Zechariah', 'zechariah', '撒迦利亚',],
    "Mal": ['Malachi', 'malachi', '玛拉基书',],
    "Mat": ['Matthew', 'matthew', '马太福音',],
    "Mak": ['Mark', 'mark', '马可福音',],
    "Luk": ['Luke', 'luke', '路加福音',],
    "Jhn": ['John', 'john', '约翰福音',],
    "Act": ['Acts', 'acts', '使徒行传',],
    "Rom": ['Romans', 'romans', '罗马书',],
    "1Co": ['1_Corinthians', '1-corinthians', '哥林多前书',],
    "2Co": ['2_Corinthians', '2-corinthians', '哥林多后书',],
    "Gal": ['Galatians', 'galatians', '加拉太书',],
    "Eph": ['Ephesians', 'ephesians', '以弗所书',],
    "Phl": ['Philippians', 'philippians', '腓立比书',],
    "Col": ['Colossians', 'colossians', '歌罗西书',],
    "1Ts": ['1_Thessalonians', '1-thessalonians', '帖撒罗尼迦前书',],
    "2Ts": ['2_Thessalonians', '2-thessalonians', '帖撒罗尼迦后书',],
    "1Ti": ['1_Timothy', '1-timothy', '提摩太前书',],
    "2Ti": ['2_Timothy', '2-timothy', '提摩太后书',],
    "Tit": ['Titus', 'titus', '提多书',],
    "Phm": ['Philemon', 'philemon', '腓利门书',],
    "Heb": ['Hebrews', 'hebrews', '希伯来书',],
    "Jas": ['James', 'james', '雅各书',],
    "1Pe": ['1_Peter', '1-peter', '彼得前书',],
    "2Pe": ['2_Peter', '2-peter', '彼得后书',],
    "1Jn": ['1_John', '1-john', '约翰一书',],
    "2Jn": ['2_John', '2-john', '约翰二书',],
    "3Jn": ['3_John', '3-john', '约翰三书',],
    "Jud": ['Jude', 'jude', '犹大书',],
    "Rev": ['Revelation', 'revelation', '启示录',],
};

CNST.StdBkID_variantNames = {
    "Gen": ['Genesis', 'genesis', '创世纪',],
    "Exo": ['Exodus', 'exodus', '出埃及记',],
    "Lev": ['Leviticus', 'leviticus', '利未记',],
    "Num": ['Numbers', 'numbers', '民数记',],
    "Deu": ['Deuteronomy', 'deuteronomy', '申命记',],
    "Jos": ['Joshua', 'joshua', '约书亚记',],
    "Jug": ['Judges', 'judges', '士师记',],
    "Rut": ['Ruth', 'ruth', '路得记',],
    "1Sa": ['1_Samuel', '1-samuel', '撒母耳记上',],
    "2Sa": ['2_Samuel', '2-samuel', '撒母耳记下',],
    "1Ki": ['1_Kings', '1-kings', '列王记上',],
    "2Ki": ['2_Kings', '2-kings', '列王记下',],
    "1Ch": ['1_Chronicles', '1-chronicles', '历代志上',],
    "2Ch": ['2_Chronicles', '2-chronicles', '历代志下',],
    "Ezr": ['Ezra', 'ezra', '以斯拉记',],
    "Neh": ['Nehemiah', 'nehemiah', '尼希米记',],
    "Est": ['Esther', 'esther', '以斯帖记',],
    "Job": ['Job', 'job', '约伯记',],
    "Psm": ['Psalm', 'psalm', '诗篇', 'Psa'],
    "Pro": ['Proverbs', 'proverbs', '箴言',],
    "Ecc": ['Ecclesiastes', 'ecclesiastes', '传道书',],
    "Son": ['SongOfSolomon', 'song-of-solomon', '雅歌',],
    "Isa": ['Isaiah', 'isaiah', '以赛亚书',],
    "Jer": ['Jeremiah', 'jeremiah', '耶利米书',],
    "Lam": ['Lamentations', 'lamentations', '耶利米哀歌',],
    "Eze": ['Ezekiel', 'ezekiel', '以西结书',],
    "Dan": ['Daniel', 'daniel', '但以理书',],
    "Hos": ['Hosea', 'hosea', '何西阿书',],
    "Joe": ['Joel', 'joel', '约珥书',],
    "Amo": ['Amos', 'amos', '阿摩司书',],
    "Oba": ['Obadiah', 'obadiah', '俄巴底亚书',],
    "Jon": ['Jonah', 'jonah', '约拿书',],
    "Mic": ['Micah', 'micah', '弥迦书',],
    "Nah": ['Nahum', 'nahum', '那鸿书',],
    "Hab": ['Habakkuk', 'habakkuk', '哈巴谷书',],
    "Zep": ['Zephaniah', 'zephaniah', '西番雅书',],
    "Hag": ['Haggai', 'haggai', '哈该书',],
    "Zec": ['Zechariah', 'zechariah', '撒迦利亚',],
    "Mal": ['Malachi', 'malachi', '玛拉基书',],
    "Mat": ['Matthew', 'matthew', '马太福音',],
    "Mak": ['Mark', 'mark', '马可福音',],
    "Luk": ['Luke', 'luke', '路加福音',],
    "Jhn": ['John', 'john', '约翰福音',],
    "Act": ['Acts', 'acts', '使徒行传',],
    "Rom": ['Romans', 'romans', '罗马书',],
    "1Co": ['1_Corinthians', '1-corinthians', '哥林多前书',],
    "2Co": ['2_Corinthians', '2-corinthians', '哥林多后书',],
    "Gal": ['Galatians', 'galatians', '加拉太书',],
    "Eph": ['Ephesians', 'ephesians', '以弗所书',],
    "Phl": ['Philippians', 'philippians', '腓立比书',],
    "Col": ['Colossians', 'colossians', '歌罗西书',],
    "1Ts": ['1_Thessalonians', '1-thessalonians', '帖撒罗尼迦前书',],
    "2Ts": ['2_Thessalonians', '2-thessalonians', '帖撒罗尼迦后书',],
    "1Ti": ['1_Timothy', '1-timothy', '提摩太前书',],
    "2Ti": ['2_Timothy', '2-timothy', '提摩太后书',],
    "Tit": ['Titus', 'titus', '提多书',],
    "Phm": ['Philemon', 'philemon', '腓利门书',],
    "Heb": ['Hebrews', 'hebrews', '希伯来书',],
    "Jas": ['James', 'james', '雅各书',],
    "1Pe": ['1_Peter', '1-peter', '彼得前书',],
    "2Pe": ['2_Peter', '2-peter', '彼得后书',],
    "1Jn": ['1_John', '1-john', '约翰一书',],
    "2Jn": ['2_John', '2-john', '约翰二书',],
    "3Jn": ['3_John', '3-john', '约翰三书',],
    "Jud": ['Jude', 'jude', '犹大书',],
    "Rev": ['Revelation', 'revelation', '启示录',],
};
CNST.StdBkID = function (sAnyBookName) {
    if (!sAnyBookName) return ""
    if (sAnyBookName.length < 3) return ""

    var reg = new RegExp(sAnyBookName, "gi")
    var retary = ''
    for (const stdBkId in CNST.StdBkID_variantNames) {
        for (let sname of CNST.StdBkID_variantNames[stdBkId]) {
            if (sname == sAnyBookName) {
                retary = stdBkId
            }
        }
    }
    if (retary.length === 0) return ""
    //if (retary.length > 1) alert("wrong sAnyBookName:" + sAnyBookName)
    return retary
};
CNST.StdBcvAry_FromAnyStr = function (str) {
    var regexp = new RegExp(/(\w+\s*\d+\:\d+)/gi)
    var regexp2 = new RegExp(/(\w+)\s*(\d+)\:(\d+)/i)
    var ret3 = []
    var mat = str.match(regexp)
    if (mat) {
        for (const name of mat) {
            console.log("name", name)
            var mat2 = name.match(regexp2)
            if (mat2) {
                console.log("mat2:", mat2)
                var stdbkid = CNST.StdBkID(mat2[1])
                console.log("stdbkid", stdbkid)
                ret3.push(stdbkid + mat2[2] + ":" + mat2[3])
            }
        }
    }
    return ret3
}
CNST.BibVolNameEngChn = function (Vid, slan) {

    switch (slan) {
        case "Chinese": return CNST.BiBookName[Vid][0] + " " + CNST.BiBookName[Vid][2];
    }
    return CNST.BiBookName[Vid][0]
};
CNST.isNT = function (Vid) {
    return (CNST.BibVol_OTorNT(Vid) === "t_NT")
};
CNST.BibVol_OTorNT = function (Vid) {
    if (CNST.OT_Bkc_Ary.indexOf(Vid) >= 0) {
        return "t_OT"
    }
    if (CNST.NT_Bkc_Ary.indexOf(Vid) >= 0) {
        return "t_NT"
    }
    return console.log("ERROR", Vid);
};
CNST.BibVolName_Studylight = function (Vid) {
    return CNST.BiBookName[Vid][1];
};
CNST.BibVolName_ccel = function (Vid) {
    return CNST.BiBookName[Vid][0];
};
//std:blue
CNST.BlueLetterBibleCode = {
    "Gen": "Gen",
    "Exo": "Exo",
    "Lev": "Lev",
    "Num": "Num",
    "Deu": "Deu",
    "Jos": "Jos",
    "Jug": "Jdg",//diff
    "Rut": "Rth",//diff
    "1Sa": "1Sa",
    "2Sa": "2Sa",
    "1Ki": "1Ki",
    "2Ki": "2Ki",
    "1Ch": "1Ch",
    "2Ch": "2Ch",
    "Ezr": "Ezr",
    "Neh": "Neh",
    "Est": "Est",
    "Job": "Job",
    "Psm": "Psa",//diff
    "Pro": "Pro",
    "Ecc": "Ecc",
    "Son": "Sng",//diff
    "Isa": "Isa",
    "Jer": "Jer",
    "Lam": "Lam",
    "Eze": "Eze",
    "Dan": "Dan",
    "Hos": "Hos",
    "Joe": "Joe",
    "Amo": "Amo",
    "Oba": "Oba",
    "Jon": "Jon",
    "Mic": "Mic",
    "Nah": "Nah",
    "Hab": "Hab",
    "Zep": "Zep",
    "Hag": "Hag",
    "Zec": "Zec",
    "Mal": "Mal",
    "Mat": "Mat",
    "Mak": "Mar",
    "Luk": "Luk",
    "Jhn": "Jhn",
    "Act": "Act",
    "Rom": "Rom",
    "1Co": "1Co",
    "2Co": "2Co",
    "Gal": "Gal",
    "Eph": "Eph",
    "Phl": "Phl",
    "Col": "Col",
    "1Ts": "1Ts",
    "2Ts": "2Ts",
    "1Ti": "1Ti",
    "2Ti": "2Ti",
    "Tit": "Tit",
    "Phm": "Phm",
    "Heb": "Heb",
    "Jas": "Jas",
    "1Pe": "1Pe",
    "2Pe": "2Pe",
    "1Jn": "1Jn",
    "2Jn": "2Jn",
    "3Jn": "3Jn",
    "Jud": "Jud",
    "Rev": "Rev",
};//BookChapterVerseMax
CNST.BookID2IdxCode = {
    _Gen: ['01', 'h'],
    _Exo: ['02', 'h'],
    _Lev: ['03', 'h'],
    _Num: ['04', 'h'],
    _Deu: ['05', 'h'],
    _Jos: ['06', 'h'],
    _Jug: ['07', 'h'],
    _Rut: ['08', 'h'],
    _1Sa: ['09', 'h'],
    _2Sa: ['10', 'h'],
    _1Ki: ['11', 'h'],
    _2Ki: ['12', 'h'],
    _1Ch: ['13', 'h'],
    _2Ch: ['14', 'h'],
    _Ezr: ['15', 'h'],
    _Neh: ['16', 'h'],
    _Est: ['17', 'h'],
    _Job: ['18', 'h'],
    _Psm: ['19', 'h'],
    _Pro: ['20', 'h'],
    _Ecc: ['21', 'h'],
    _Son: ['22', 'h'],
    _Isa: ['23', 'h'],
    _Jer: ['24', 'h'],
    _Lam: ['25', 'h'],
    _Eze: ['26', 'h'],
    _Dan: ['27', 'h'],
    _Hos: ['28', 'h'],
    _Joe: ['29', 'h'],
    _Amo: ['30', 'h'],
    _Oba: ['31', 'h'],
    _Jon: ['32', 'h'],
    _Mic: ['33', 'h'],
    _Nah: ['34', 'h'],
    _Hab: ['35', 'h'],
    _Zep: ['36', 'h'],
    _Hag: ['37', 'h'],
    _Zec: ['38', 'h'],
    _Mal: ['39', 'h'],
    _Mat: ['40', 'b'],
    _Mak: ['41', 'b'],
    _Luk: ['42', 'b'],
    _Jhn: ['43', 'b'],
    _Act: ['44', 'b'],
    _Rom: ['45', 'b'],
    _1Co: ['46', 'b'],
    _2Co: ['47', 'b'],
    _Gal: ['48', 'b'],
    _Eph: ['49', 'b'],
    _Phl: ['50', 'b'],
    _Col: ['51', 'b'],
    _1Ts: ['52', 'b'],
    _2Ts: ['53', 'b'],
    _1Ti: ['54', 'b'],
    _2Ti: ['55', 'b'],
    _Tit: ['56', 'b'],
    _Phm: ['57', 'b'],
    _Heb: ['58', 'b'],
    _Jas: ['59', 'b'],
    _1Pe: ['60', 'b'],
    _2Pe: ['61', 'b'],
    _1Jn: ['62', 'b'],
    _2Jn: ['63', 'b'],
    _3Jn: ['64', 'b'],
    _Jud: ['65', 'b'],
    _Rev: ['66', 'b'],
};
CNST.OT_Bkc_Ary = [
    "Gen",
    "Exo",
    "Lev",
    "Num",
    "Deu",
    "Jos",
    "Jug",
    "Rut",
    "1Sa",
    "2Sa",
    "1Ki",
    "2Ki",
    "1Ch",
    "2Ch",
    "Ezr",
    "Neh",
    "Est",
    "Job",
    "Psm",
    "Pro",
    "Ecc",
    "Son",
    "Isa",
    "Jer",
    "Lam",
    "Eze",
    "Dan",
    "Hos",
    "Joe",
    "Amo",
    "Oba",
    "Jon",
    "Mic",
    "Nah",
    "Hab",
    "Zep",
    "Hag",
    "Zec",
    "Mal"
];
CNST.NT_Bkc_Ary = [
    "Mat",
    "Mak",
    "Luk",
    "Jhn",
    "Act",
    "Rom",
    "1Co",
    "2Co",
    "Gal",
    "Eph",
    "Phl",
    "Col",
    "1Ts",
    "2Ts",
    "1Ti",
    "2Ti",
    "Tit",
    "Phm",
    "Heb",
    "Jas",
    "1Pe",
    "2Pe",
    "1Jn",
    "2Jn",
    "3Jn",
    "Jud",
    "Rev"
];
CNST.Cat2VolArr = {
    "OT": CNST.OT_Bkc_Ary,
    "Moses": ["Gen", "Exo", "Lev", "Num", "Deu"],
    "History": ["Jos", "Jug", "Rut", "1Sa", "2Sa", "1Ki", "2Ki", "1Ch", "2Ch", "Ezr", "Neh", "Est"],
    "Literature": ["Job", "Psm", "Pro", "Ecc", "Son"],
    "MajProph": ["Isa", "Jer", "Lam", "Eze", "Dan"],
    "MinProph": ["Joe", "Amo", "Oba", "Jon", "Mic", "Nah", "Hab", "Zep", "Hag", "Zec", "Mal"],
    "NT": CNST.NT_Bkc_Ary,
    "Gospel": ["Mat", "Mak", "Luk", "Jhn"],
    "Paulines": ["Rom", "1Co", "2Co", "Gal", "Eph", "Phl", "Col", "1Ts", "2Ts", "1Ti", "2Ti", "Tit", "Phm"],
    "Epistles": ["Heb", "Jas", "1Pe", "2Pe", "1Jn", "2Jn", "3Jn", "Jud"],
    "UserDef": []
};
var BookJsFlavor = {
    OTNT: ['#510000', 'wholistic Bible', '圣经全书'],
    OT: ['#001040', 'O.T.', '旧约全书'],
    Moses: ['#002E63', 'Moses', '摩西五经'],
    History: ['#002E63', 'History', '历史'],
    Literature: ['#002E63', 'Literature', '文学'],
    Major_Prophets: ['#002E63', 'Major_Prophets', '大先知'],
    Minor_Prophets: ['#002E63', 'Minor_Prophets', '小先知'],
    NT: ['#4053A9', 'N.T.', '新约全书'],
    Gospels: ['#003399', 'Gospels', '四福音书'],
    HisSayings: ['#003399', 'HisSayings', '耶稣话语'],
    Pauls: ['#003399', 'Pauls', '保罗书信'],
    Other_Epistles: ['#003399', 'OtherEpistles', '其他书信'],
};

