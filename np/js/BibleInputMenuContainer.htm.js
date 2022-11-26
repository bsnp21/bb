



var BibleInputMenuContainer = `
<style>
</style>
<!----------------------------->
<div id="divPopupMenu">
    <table id='xxrefslist' border="1" align="left">
    <tbody id="divPopupMenu_BcvTag">
        <tr>
            <td>
                <a id='divPopupMenu_CaptionBCV' title='push to MemoryRequired; save to repository; copy to clickboard.'></a>
            </td>
        </tr>
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
                <a id="RevTag_Save">Save (to svr)</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="RevTag_Load">Load (from svr)</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="RevTag_ReadLocalStorage">Read External Editor Storage</a>
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
    <caption><a xid='divPopupMenu_CaptionBCV' title='push to MemoryRequired; save to repository; copy to clickboard.'></a></caption>
    </table>
</div>

<!--------------------------------------->


<div id="MainMenuToggler">
    <a id="bk_name">Select A Book</a>
    <a id="minus_ChpVal" op='—'>&nbsp;-&nbsp;</a>
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

            <div class="GrpMenu" id="grp_Cluster" style="float:left;display:none;overflow-x:scroll;">
            <table n='frames of containers.'>
            <tr>
            <td>
                <table border="1" style="float:left;display:" id="Tab_CatagryOfBooks">
                    <caption class='' id='' title='Catagory of Books in Bible'>Category</caption>
                    <thead id=""></thead>
                    <tbody id=''>
                        <tr>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </td>
            <td>

                <table id="Tab_VersionNamesOfTheBible" border="1" style="float:left;">
                    <caption>
                        <div id='Tab_VersionNamesOfTheBible_caps'></div>
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
            </td>
            <td>
                <div id="Tab_MostRecent_BCV" border="1" style="float:left;">
                    <div>
                       <input list="input_browsers" name="browser"  id='Mr_Input_Datalist'>
                       <datalist id="input_browsers">
                           <option value="RecentAccessed">
                           <option value="MemoryRequired">
                           <option value="Chrome">
                           <option value="Opera">
                           <option value="Safari">
                       </datalist>
                       </input>
                       <button class='docSwitchRecent ColorRecentMarks' title='RecentAccessed' id='RecentTouch_Btn'>Rx</button>
                       <button class='docSwitchRecent' title="MemoryRequired" id='MemoryVerse_Btn'>Mr</button><a id='clear_Tab_MostRecent_BCV_caps'>X</a><br>
                       
                    </div>
            
                    <div id='RecentAccessed' class='RecentTable'>
                    </div>
                    <div id='MemoryRequired' class='RecentTable'>
                    </div>
                
                    
                    <div>
                    <a id="clearUnse" class="RecentBCVsBtn" title='delete selected items'>&nbsp;&empty;&nbsp;</a> 
                    <a id="toggleSel" class="RecentBCVsBtn" title='toggle selected and unselected &#8767;'>&nbsp; &excl;* &nbsp; </a>
                    
                    <a id="save2Repo" class="RecentBCVsBtn RestSvrBtn" xstyle="display: none;" title='save to repo'>&#9635;</a>
                    <a id="load2Repo" class="RecentBCVsBtn RestSvrBtn" xstyle="display: none;" title='load to repo'>&#9842;</a>
                    </div>
                </div>
            </td>
            </tr>
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
                <a id="REGEXP__OR">OR</a> | 
                <a id="REGEXP_IgnoreCase">IgnoreCase</a> | 
                <a id="toggle_Case">toggleCase</a>  | 
                
                </div>  <br>
               
                <table xborder="1" note="frame">
                <tr>
                <td>
                    <table id="Tab_selected_Doc_Search" border='1' style="float:left;">
                        <caption>SearchIn</caption>
                        <tbody id="Tab_doc_option_for_search">
                            <tr>
                                <td>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td>
                    <table id="Tab_regex_history_search" border="1" style="float:left;">
                        <caption>History</caption>
                        <tbody>

                        </tbody>
                    </table>
                </td>
                </tr>
                <tr>
                <td>
                </td>
                <td>
                    <div> 
                        <a id="RemoveSearchStrn">&nbsp; &empty; &nbsp;</a>
                        <a id="save_SearchHistory2Repo" class="RecentBCVsBtn RestSvrBtn" xstyle="display: none;" title='save to repo'>&#9635;</a>
                        <a id="load_SearchHistory2Repo" class="RecentBCVsBtn RestSvrBtn" xstyle="display: none;" title='load to repo'>&#9842;</a>
                        <input list="MrSearchHistoryDatalist" name="browser"  id='MrSearchHistoryInput' value='MostRecentSearch'>
                           <datalist id="MrSearchHistoryDatalist">
                               <option value="MostRecentSearch">
                            </datalist>
                        </input>
                        <a id='clear_MrSearchHistoryInput'>X</a>
                    </div>
                </td>
                </tr>
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
                <a id="account_reSignIn" title='more user sign in without destroying current repositoary'>SignIn</a> |
                <a id='NewPage' target='_blank' href="${window.location.href}" title='clone browser'>Clone</a> | 
                <a id='myExt_Diary' target='_blank' xxhref="./myExt_Diary.htm${window.location.searc}&repo=${$('#repopath').val()}" title='Diary'>Calendar</a> | 

                
                <button class="StorageRepo_Signout">Sign Out</button>
                </td></tr>
                
                <tr>
                    <td>
                    <a id="account_history">Username</a>: 
                    <div id="repository_assitance">
                    
                    
                    </div>
                    <br>
                    <input id="repopath" value='' placeholder='username' readonly></input>
                      <a id='idatetiemstampe'></a>
                    <br>
                    
                
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
<table id="Tab_OutputVolumnNamesList" border="1">
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
// 1. add the idential file name in FnameOfBibleObj in BsnpRestConst.js. 
// 2. add the file in github(wdingbox).
//    a. if the file is a new version of the Bible, e.g. BBE.json.js,
//       add it in bible_obj_lib/jsdb/jsBibleObj/BBE.json.js 
//    b. if the file is the editiable e_* files,
//       add it in bible_obj_lib/jsdb/UsrDataTemplate/myoj/e_*_json.js. 
// 3. on svr (/var/www/html/wdas/) by (wdingbox/ham12/utility/wsaws/keypair, ssh)
//    a. git pull in bb/. 
//    b. git pull in bible_obj_lib/.
