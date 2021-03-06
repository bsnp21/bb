
////////////////////////////////////
const CNST = {
}



var BibleInputMenuContainer = `
<style>
</style>
<!----------------------------->
<div id="divPopupMenu">
    <table id='xxrefslist' border="1" align="left">
    
    <tbody id="divPopupMenu_BcvTag">
        <tr>
            <td>
                <a id="blueletterbible" ref="https://www.blueletterbible.org/kjv/">blueletterbible.org</a>
            </td>
        </tr>
        <tr>
            <td>
                <!----- bkup ref="../../../../bible_concordance/rel/hgsbible/hgb/" title='Hebrew_Greek'   h_g---->
                <a id="qbible_com" ref="http://www.qbible.com/" sample="hebrew-old-testament/genesis/50.html#1" title='http://www.qbible.com/hebrew-old-testament/genesis/50.html#1'>qbible.com</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="biblehub" ref="https://biblehub.com/" samp="commentaries/genesis/2-24.htm" title='Hebrew_Greek'>BibleHub</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="gtw" ref="./myExt_Render_BibleGateway.htm" _ref="https://www.biblegateway.com/passage/?search=" title='biblegateway.com'>BibleGateway.com</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="studylight" ref="https://www.studylight.org/commentary/" title='studylight.org'>studylight</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="ccel_org" ref="http://www.ccel.org/study/" title='ChristianClassicEtherealLib'>ccel</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="crossReference" ref="https://www.openbible.info/labs/cross-references/search?q=" title='cross-references'>cross-references</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="BibleInput" ref="#" title='self open'>OpenNewWindow</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="Cluster_Documents" title='add tags'>Re-Cluster</a>
            </td>
        </tr>
    </tbody>
    <tbody id="divPopupMenu_EdiTag">
        <tr>
            <td>
                <a class="EdiTag_ToggleHideShow">Hide</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="RevTag_Edit_Local" disableEdit="Disable Edit" enableEdit="Enable Edit">Enable Edit</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="RevTag_Edit_External" target="_blank" href="myNoteEditor.htm">External Editor</a>
            </td>
        </tr>
        <tr>
        <td>
            <a id="RevTag_SocialNetworkPlatform" target="_blank" href="myNoteNetworkPlatform.htm">Cross-Network Platform</a>
        </td>
    </tr>
        <tr>
            <td>
                <a id="RevTag_Save">Save</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="RevTag_Load">Load</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="RevTag_Info"></a>
            </td>
        </tr>
        
    </tbody>
    <tbody id="divPopupMenu_RevTag">
        <tr>
            <td>
                <a class="EdiTag_ToggleHideShow">Hide</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="Copy2clipboard">Copy2Clipboard</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="AudioPlayer">AudioPlayer</a>
            </td>
        </tr>
    </tbody>
    <caption><div id='divPopupMenu_CaptionBCV' title='push to MemoryVerse; save to repository; copy to clickboard.'></div></caption>
    </table>
</div>

<!--------------------------------------->


<div id="MainMenuToggler">
    <a id="bk_name">Select A Book</a>
    <a id="minus_ChpVal" op='???'>&nbsp;-&nbsp;</a>
    <div id='chp_num'>chap</div>
    <a id="plus_ChpVal">&nbsp;:&nbsp;</a> 
    <div id='vrs_num'>ver</div>
</div>

<!----------------------------->

<div id="menuContainer">
    <div id="BibInputMenuHolder">
    
        <div id="GroupsContainer" style="display:visual">

            <div id="HorizMenuBar">
            <a sid='grp_Keyboard'>Keyboard</a> |
            <a sid='grp_Cluster'>Cluster</a> |
            <a sid='grp_Search'>Search</a> |
            <a sid='grp_Config'>Config</a> |
            <a sid='grp_SignOut' id="SignOut_repopathname">Reponame...</a>
    
            </div>

            <div class="GrpMenu" id="grp_Keyboard" style="float:left;display:none;">
                <table border="1">
                    <tbody id="SingleKeywordsBody">
                    </tbody>
                    <tbody id='DigitOfChapt'>
                    </tbody>
                    <tbody id='DigitOfVerse'>
                    </tbody>
                </table>
                
            </div>

            <!----------------------------->

            <div class="GrpMenu" id="grp_Cluster" style="float:left;display:none;">
                <table border="1" style="float:left;display:" id="Tab_CatagryOfBooks">
                    <caption class='' id='' title='Catagory of Books in Bible'>Category</caption>
                    <thead id=""></thead>
                    <tbody id=''>
                        <tr>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <table id="Tab_NamesOfBibleDocuments" border="1" style="float:left;">
                    <caption>
                    <div id='Tab_NamesOfBibleDocuments_caps'></div>
                    <button class='docSwitch' title='Selection' note='doclist'>=</button>
                    <button class='docSwitch' title='Sequences' note='uparrow'>&#8645;</button>
                    <a class='docSwitch' title='Searching' note='searchi' old='&#8635;'></a>
                    </caption>
                    <thead id=""></thead>
                    <tbody>
                        <tr>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <table id="Tab_MostRecent_BCV" border="1" style="float:left;">
                    <caption>
                       <div id='Tab_MostRecent_BCV_caps'></div>
                       <button class='docSwitch ColorRecentMarks' title="RecentBooks">B</button>
                       <button class='docSwitch' title="RecentTouch">T</button>
                       <button class='docSwitch' title="MemoryVerse">M</button><br>
                       
                    </caption>
                    <thead></thead>
                    <tbody id='RecentBooks'>
                        <tr>
                            <td>
                                Pleas click H button <br>for History.<br>
                                <br>
                                Pleas click ^ button <br>sort by str.<br>
                            </td>
                        </tr>
                    </tbody>
                    <tbody id='RecentTouch'>
                        <tr>
                            <td>
                                Pleas click H button <br>for History.<br>
                                <br>
                                Pleas click ^ button <br>sort by str.<br>
                            </td>
                        </tr>
                    </tbody>
                    <tbody id='MemoryVerse'>
                    </tbody>
                    <caption>
                       <a id="clearUnse" class="RecentBCVsBtn" title='delete selected items'> x </a> 
                       <a id="toggleSel" class="RecentBCVsBtn" title='toggle selected and unselected'> &#8767; </a>
                       <a id="sortTbIts" class="RecentBCVsBtn" title='sort the list'> &#8710; </a>
                       <a id="save2Repo" class="RecentBCVsBtn" style="display: none;" title='save to repo'>&#9635;</a>
                    </caption>
                </table>
            </div>

            <!----------------------------->

            <div class="GrpMenu" id="grp_Search" style="float:left;display:none;">
                
                <input id="sinput" cols='50' onkeyup="" ></input><br>
                <a id="searchNextresult" >...</a>
                <div style='float:right;' >
                <button id="Btn_Prev"  title="hili prev in page">Prev</button>
                <button id="Btn_Next"  title="hili next in page">Next</button>
                <button id="Btn_InPage" title="search on local table">Paging</button>
                </div><br>
                <div style='float:left;display:inline-block'>
                <a id="REGEXP_AND">AND</a> | 
                <a id="REGEXP_IgnoreCase">IgnoreCase</a> | 
                <a id="toggle_Case">toggleCase</a>  | 
                <a id="RemoveSearchStrn">Del</a>
                </div>  
                <br>
                <table id="Tab_selected_Doc_Search" border='1' style="float:left;">
                    <caption>SearchIn</caption>
                    <tbody id="Tab_doc_option_for_search">
                        <tr>
                            <td>
                                                       
    
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table id="Tab_regex_history_search" border='1' style="float:left;">
                    <caption>History</caption>
                    <tbody>
                        <tr>
                            <td>
                                click search results<br>
                                to show history serch<br>                           

                            </td>
                        </tr>
                    </tbody>
                </table>
                
           
            </div>

            <!----------------------------->

            <!----------------------------->

            <div class="GrpMenu" id="grp_Config"  style="float:left;display:none;">
                
             
                <table id='' border="1" style="width:100%;">
                    <thead>
                        <tr>
                            <td>desc</td>
                            <td>Setting</td>
                        </tr>
                    </thead>
                    <tbody id="">
                        
                       
                        <tr>
                            <td>Font</td>
                            <td>Size:
                            <button onclick="g_obt.incFontSize(-2);" title='font-size minus'>-</button>
                            <a id='fontsize'></a>
                            <button onclick="g_obt.incFontSize(2);" title='font-size plus'>+</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Lang</td>
                            <td><select id="LanguageSel" default_val="English">
                                <option value='English'>English</option>
                                <option value='Chinese'>Chinese</option>
                                <option value='India'>India</option>
                            </select></td>
                        </tr>
                        <tr>
                            <td>Storage</td>
                            <td>
                            <input type="radio" id="Storage_clear" title='clear up storage'>Clear</input>

                             
                            
                            <a type="radio" id="StorageRepo_load" title='load up storage'></a> 
                            
                            <a id="Storage_local_repos_exchange"></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div id="StorageRepo_save_res"></div>
                
            </div> 

            <!----------------------------->

            <div class="GrpMenu" id="grp_SignOut"  style="float:left;display:none;width:342px">
              
                <table border='1' style="float:right;right:10px; width:100%;">
                <tbody>
                <tr><td>
                
                <a href='https://bsnp21.github.io/home/' owner='williamwding' email='yahoo.com' xxxhref='https://wdingbox.github.io/ham12/'>Home</a> |
                <a id="account_helper" title='new user sign in'>Login</a> |
                <a id='NewPage' target='_blank' title='multiple browser'>Multi</a> | 

                
                <button class="StorageRepo_Signout">Sign Out</button>
                </td></tr>
                
                <tr>
                    <td>
                    <a id="account_history">Repository</a>: 
                    <div id="repository_assitance">
                    <a id="Format_Check" xxid="account_default">Format</a> | 
                    
                    </div>
                    <br>
                    <textarea id="repopath" value='https://github.com/bsnp21/pub_test01.git' placeholder='https://github.com/bsnp21/pub_test01.git' readonly></textarea>
                    <br>
                    
                    <a id="passcode_toggler">Password:</a> 
                    <span id="repository_description">
                    <a></a> 
                    </span><br>
                    <input id="passcode" type="password" value='' readonly></input><a onclick="$('#passcode').val('')"></a>
                    <br>
                    <a id="respdesc_history">ShareID</a>: 
                    <span id="repository_description">
                    <a id="share_public">public</a> | <a id="share_private">private</a> 
                    </span>
                    <br>
                    <input id="repodesc" value='' placeholder='' ></input>
                    <br>
                    <lable>Timeout(s):<lable> <input id="cacheTTL" type='number' min='1' max='100000000' maxlength='8' size='8' unit='s' placeholder='123'></input> <a id='idatetiemstampe'></a>
                    <br>
                    
                    <button id="account_updateStatus">UpdateStatus</button>
                    <div id="account_set_info"></div>
                    </td>
                    
                </tr>
                </tbody>
                </table>
                <div id="outConfig" style="display:none"></div>






                <button onclick="$('#DevTool').toggle();">*</button><a id="operation_res">+</a>
                <div id="DevTool" style='display:none;'>
                <button onclick="$('#txtarea').val('');$('#operation_res').text('+')" title='clearout txt'>x</button>
                <button id="Check_bcv">Check(bcv)</button>
                <a target='_blank' href='../index.htm'>.</a>  
                <textarea id="txtarea" style='width:100%;' rows='20'  value='search results...' title='log.'></textarea><br>
                </div>
                
                
               
                
                

            </div>
            <!--------- end of GroupsContainer ------>
        </div>
    </div>
</div>
<hr />





<!----------------------------->
<!----------------------------->
<table id="Tab_OutputBooksList" border="1">
    <caption></caption>
    <thead id="">
    </thead>
    <tbody>
    </tbody>
</table>
<!----------------------------->


<div id='oBible'>----</div>
<textarea id="txt_copy2clicpboard" style="position:fixed;width:180px;right:-175px;top:0px;padding:0;">
        `;//////backtick for multiple lines. 


///////////////////////////////
// Steps to add a new book or e_* book.
// 1. add the idential file name in CNST FnameOfBibleObj. 
// 2. add bibl_obj_lib/jsdb/jsBibleObj/bbe.json.js
// 3. add in user myoj if it is e_* files. 
CNST.FnameOfBibleObj =
{
    "BBE": "Basic Bible in English",
    "CPDV": "Catholic Public Domain Version",
    "CUVS": "Chinese Union Version Simplified, ???????????????, 1919",
    "CUVsen": "CUV Simplied with English Name",
    "CUVpy": "Chinese Union Version PinYing",
    "ESV": "English Standard Version",
    "H_G": "Hebrew and Greek",
    "KJV": "King James Version",
    "KJV_Jw": "King James Version Jesus' Words",
    "NHEB_yhwh": "New Heart Enlish Bible, yhwy, 2021",
    "NIV": "New International Version",
    "NIV_Jw": "New International Version Jesus' Words",
    "STUS": "Studium Biblicum Version by Catholic,1968",
    "WLVS": "Wen Li Version. ??????????????????????????????1906??????????????????????????????1919?????????.???????????????????????????????????????1923???????????????1934?????????????????????, ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? https://zh.wikisource.org/wiki/%E8%81%96%E7%B6%93_(%E5%92%8C%E5%90%88%E6%9C%AC) \n\nFor 1895 ???????????????(?????????(John Shaw Burdon)????????????(Henry Blodget)) https://bible.fhl.net/ob/nob.html?book=8 ",
    "cross_references": "cross-references",
    "e_CrossRef": "User can modify cross-references for related verses in the Bible. Recommended to follow the standard abbreviation format. For example, <br>Gen2:7 refers to Genesis, chapter 2, verse 7. <br>1Jn5:12 refers to 1-John, chapter 5, verse 12.",
    "e_Note": "personal biblical study notes, commentary, questions, testimony, reflections, takeaway, other website links etc.",
    "e_Prayer": "personal prayer, preach, prophect, paper or project related to the verse and real life..",
    "e_Subtitle": "sub-title of its following verses.",
    "e_Summary": "summary of chapter or pericope.",
    "e_v_CUVS_enn2": "CUVS special names latinization. For easy reading/study, consistency to the West.",
    "e_v_CUVS_enn3": "CUVS divine God's names latinization."
};

CNST.BiBookName = {
    "Gen": ['Genesis', 'genesis', '?????????',],
    "Exo": ['Exodus', 'exodus', '????????????',],
    "Lev": ['Leviticus', 'leviticus', '?????????',],
    "Num": ['Numbers', 'numbers', '?????????',],
    "Deu": ['Deuteronomy', 'deuteronomy', '?????????',],
    "Jos": ['Joshua', 'joshua', '????????????',],
    "Jug": ['Judges', 'judges', '?????????',],
    "Rut": ['Ruth', 'ruth', '?????????',],
    "1Sa": ['1_Samuel', '1-samuel', '???????????????',],
    "2Sa": ['2_Samuel', '2-samuel', '???????????????',],
    "1Ki": ['1_Kings', '1-kings', '????????????',],
    "2Ki": ['2_Kings', '2-kings', '????????????',],
    "1Ch": ['1_Chronicles', '1-chronicles', '????????????',],
    "2Ch": ['2_Chronicles', '2-chronicles', '????????????',],
    "Ezr": ['Ezra', 'ezra', '????????????',],
    "Neh": ['Nehemiah', 'nehemiah', '????????????',],
    "Est": ['Esther', 'esther', '????????????',],
    "Job": ['Job', 'job', '?????????',],
    "Psm": ['Psalm', 'psalm', '??????',],
    "Pro": ['Proverbs', 'proverbs', '??????',],
    "Ecc": ['Ecclesiastes', 'ecclesiastes', '?????????',],
    "Son": ['SongOfSolomon', 'song-of-solomon', '??????',],
    "Isa": ['Isaiah', 'isaiah', '????????????',],
    "Jer": ['Jeremiah', 'jeremiah', '????????????',],
    "Lam": ['Lamentations', 'lamentations', '???????????????',],
    "Eze": ['Ezekiel', 'ezekiel', '????????????',],
    "Dan": ['Daniel', 'daniel', '????????????',],
    "Hos": ['Hosea', 'hosea', '????????????',],
    "Joe": ['Joel', 'joel', '?????????',],
    "Amo": ['Amos', 'amos', '????????????',],
    "Oba": ['Obadiah', 'obadiah', '???????????????',],
    "Jon": ['Jonah', 'jonah', '?????????',],
    "Mic": ['Micah', 'micah', '?????????',],
    "Nah": ['Nahum', 'nahum', '?????????',],
    "Hab": ['Habakkuk', 'habakkuk', '????????????',],
    "Zep": ['Zephaniah', 'zephaniah', '????????????',],
    "Hag": ['Haggai', 'haggai', '?????????',],
    "Zec": ['Zechariah', 'zechariah', '????????????',],
    "Mal": ['Malachi', 'malachi', '????????????',],
    "Mat": ['Matthew', 'matthew', '????????????',],
    "Mak": ['Mark', 'mark', '????????????',],
    "Luk": ['Luke', 'luke', '????????????',],
    "Jhn": ['John', 'john', '????????????',],
    "Act": ['Acts', 'acts', '????????????',],
    "Rom": ['Romans', 'romans', '?????????',],
    "1Co": ['1_Corinthians', '1-corinthians', '???????????????',],
    "2Co": ['2_Corinthians', '2-corinthians', '???????????????',],
    "Gal": ['Galatians', 'galatians', '????????????',],
    "Eph": ['Ephesians', 'ephesians', '????????????',],
    "Phl": ['Philippians', 'philippians', '????????????',],
    "Col": ['Colossians', 'colossians', '????????????',],
    "1Ts": ['1_Thessalonians', '1-thessalonians', '?????????????????????',],
    "2Ts": ['2_Thessalonians', '2-thessalonians', '?????????????????????',],
    "1Ti": ['1_Timothy', '1-timothy', '???????????????',],
    "2Ti": ['2_Timothy', '2-timothy', '???????????????',],
    "Tit": ['Titus', 'titus', '?????????',],
    "Phm": ['Philemon', 'philemon', '????????????',],
    "Heb": ['Hebrews', 'hebrews', '????????????',],
    "Jas": ['James', 'james', '?????????',],
    "1Pe": ['1_Peter', '1-peter', '????????????',],
    "2Pe": ['2_Peter', '2-peter', '????????????',],
    "1Jn": ['1_John', '1-john', '????????????',],
    "2Jn": ['2_John', '2-john', '????????????',],
    "3Jn": ['3_John', '3-john', '????????????',],
    "Jud": ['Jude', 'jude', '?????????',],
    "Rev": ['Revelation', 'revelation', '?????????',],
};

CNST.StdBkID_variantNames = {
    "Gen": ['Genesis', 'genesis', '?????????',],
    "Exo": ['Exodus', 'exodus', '????????????',],
    "Lev": ['Leviticus', 'leviticus', '?????????',],
    "Num": ['Numbers', 'numbers', '?????????',],
    "Deu": ['Deuteronomy', 'deuteronomy', '?????????',],
    "Jos": ['Joshua', 'joshua', '????????????',],
    "Jug": ['Judges', 'judges', '?????????',],
    "Rut": ['Ruth', 'ruth', '?????????',],
    "1Sa": ['1_Samuel', '1-samuel', '???????????????',],
    "2Sa": ['2_Samuel', '2-samuel', '???????????????',],
    "1Ki": ['1_Kings', '1-kings', '????????????',],
    "2Ki": ['2_Kings', '2-kings', '????????????',],
    "1Ch": ['1_Chronicles', '1-chronicles', '????????????',],
    "2Ch": ['2_Chronicles', '2-chronicles', '????????????',],
    "Ezr": ['Ezra', 'ezra', '????????????',],
    "Neh": ['Nehemiah', 'nehemiah', '????????????',],
    "Est": ['Esther', 'esther', '????????????',],
    "Job": ['Job', 'job', '?????????',],
    "Psm": ['Psalm', 'psalm', '??????', 'Psa'],
    "Pro": ['Proverbs', 'proverbs', '??????',],
    "Ecc": ['Ecclesiastes', 'ecclesiastes', '?????????',],
    "Son": ['SongOfSolomon', 'song-of-solomon', '??????',],
    "Isa": ['Isaiah', 'isaiah', '????????????',],
    "Jer": ['Jeremiah', 'jeremiah', '????????????',],
    "Lam": ['Lamentations', 'lamentations', '???????????????',],
    "Eze": ['Ezekiel', 'ezekiel', '????????????',],
    "Dan": ['Daniel', 'daniel', '????????????',],
    "Hos": ['Hosea', 'hosea', '????????????',],
    "Joe": ['Joel', 'joel', '?????????',],
    "Amo": ['Amos', 'amos', '????????????',],
    "Oba": ['Obadiah', 'obadiah', '???????????????',],
    "Jon": ['Jonah', 'jonah', '?????????',],
    "Mic": ['Micah', 'micah', '?????????',],
    "Nah": ['Nahum', 'nahum', '?????????',],
    "Hab": ['Habakkuk', 'habakkuk', '????????????',],
    "Zep": ['Zephaniah', 'zephaniah', '????????????',],
    "Hag": ['Haggai', 'haggai', '?????????',],
    "Zec": ['Zechariah', 'zechariah', '????????????',],
    "Mal": ['Malachi', 'malachi', '????????????',],
    "Mat": ['Matthew', 'matthew', '????????????',],
    "Mak": ['Mark', 'mark', '????????????',],
    "Luk": ['Luke', 'luke', '????????????',],
    "Jhn": ['John', 'john', '????????????',],
    "Act": ['Acts', 'acts', '????????????',],
    "Rom": ['Romans', 'romans', '?????????',],
    "1Co": ['1_Corinthians', '1-corinthians', '???????????????',],
    "2Co": ['2_Corinthians', '2-corinthians', '???????????????',],
    "Gal": ['Galatians', 'galatians', '????????????',],
    "Eph": ['Ephesians', 'ephesians', '????????????',],
    "Phl": ['Philippians', 'philippians', '????????????',],
    "Col": ['Colossians', 'colossians', '????????????',],
    "1Ts": ['1_Thessalonians', '1-thessalonians', '?????????????????????',],
    "2Ts": ['2_Thessalonians', '2-thessalonians', '?????????????????????',],
    "1Ti": ['1_Timothy', '1-timothy', '???????????????',],
    "2Ti": ['2_Timothy', '2-timothy', '???????????????',],
    "Tit": ['Titus', 'titus', '?????????',],
    "Phm": ['Philemon', 'philemon', '????????????',],
    "Heb": ['Hebrews', 'hebrews', '????????????',],
    "Jas": ['James', 'james', '?????????',],
    "1Pe": ['1_Peter', '1-peter', '????????????',],
    "2Pe": ['2_Peter', '2-peter', '????????????',],
    "1Jn": ['1_John', '1-john', '????????????',],
    "2Jn": ['2_John', '2-john', '????????????',],
    "3Jn": ['3_John', '3-john', '????????????',],
    "Jud": ['Jude', 'jude', '?????????',],
    "Rev": ['Revelation', 'revelation', '?????????',],
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
    "Custom": []
};
var BookJsFlavor = {
    OTNT: ['#510000', 'wholistic Bible', '????????????'],
    OT: ['#001040', 'O.T.', '????????????'],
    Moses: ['#002E63', 'Moses', '????????????'],
    History: ['#002E63', 'History', '??????'],
    Literature: ['#002E63', 'Literature', '??????'],
    Major_Prophets: ['#002E63', 'Major_Prophets', '?????????'],
    Minor_Prophets: ['#002E63', 'Minor_Prophets', '?????????'],
    NT: ['#4053A9', 'N.T.', '????????????'],
    Gospels: ['#003399', 'Gospels', '????????????'],
    HisSayings: ['#003399', 'HisSayings', '????????????'],
    Pauls: ['#003399', 'Pauls', '????????????'],
    Other_Epistles: ['#003399', 'OtherEpistles', '????????????'],
};

