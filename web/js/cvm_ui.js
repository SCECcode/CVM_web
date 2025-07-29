/***
   cvm_ui.js
***/

// global flag to show if material property is at the very start of
// insert
var hold_mptable=1;

/***
   tracking download handles
***/

// tracking the result blob coming in from the server
// blob can include plot name, mp file etc in an array form
/**** 
    $resultarray = new \stdClass();
    $resultarray->uid= $uid;
    $resultarray->plot= $uid."_c.png";
    $resultarray->query= $query;
    $resultarray->meta= $uid."_c_meta.json";
    $resultarray->data= $uid."_c_data.bin";
****/
// [ {"uid":uid, "blob":blob } ]
var cvm_metaplottb_list=[];

/******************************************/
// tracking showing all loaded models
var show_cvm_save_list=[];
var show_cvm=false;

function reset_cvm_save_list() {
   show_cvm_save_list=[];
}

function toggleShowModels() {
   show_cvm=!show_cvm;
   if(show_cvm) {
     show_cvm_save_list=load_all_models();
     } else {
       reload_models_from_list(show_cvm_save_list);
       show_cvm_save_list=[];
   }
}

/******************************************/
function _makeReferenceLink(author, reference) {
  let link="<button class=\"btn btn-sm cvm-small-btn\" data-toggle=\"modal\" data-body=\"reference\" data-target=\"#modalreference\">"+author+"</button>";
  return link;
}

function refreshModelDescription(modelstr) {
    let b_description=null;
    let description=" ";
    let name=" ";
    let abbname=" ";
    let reference=" ";

    let justname=[];
    let justinterp=[];

    let mlist=modelstr.split(",");
    let cnt=mlist.length;
    let sp="";
    let rsp="";
    let rcnt=0;

    let reflist=[]; //reference index list	 
    let alist=[];   //reference author list
    let rlist=[];   //reference ref list

    for(let i=0; i<cnt; i++) {
      let nm=mlist[i];
      let idx=getModelIndex(nm);
      if(idx != -1) {
// found Model
        description=description+sp+getModelDescriptionById(idx);
        b_description=getModelDescriptionBriefById(idx);
        name=name+sp+getModelNameById(idx);
        let tmp=getModelAbbNameById(idx);
        justname.push(tmp);
        abbname=abbname+sp+tmp;
        sp=", ";
        getReferenceIndex(nm,reflist,alist,rlist);
        } else { // something else ??
          let idx=getInterpolatorIndex(nm);
          if(idx != -1) {
// found Interpolator
            description=description+sp+getInterpolatorDescriptionById(idx);
            name=name+sp+getInterpolatorNameById(idx);
            let tmp=getInterpolatorAbbNameById(idx);
            justinterp.push(tmp);
            abbname=abbname+sp+tmp;
            sp=", ";
            getReferenceIndex(nm,reflist,alist,rlist);
            } else {  // 1D ? 
              let idx=get1DModelIndex(nm);
              if(idx != -1) {
// found 1D
                description=description+sp+get1DModelDescriptionById(idx);
                name=name+sp+get1DModelNameById(idx);
                let tmp=get1DModelAbbNameById(idx);
                justname.push(tmp);
                abbname=abbname+sp+tmp;
                sp=", ";
                getReferenceIndex(nm,reflist,alist,rlist);
                } else { //
                     window.console.log("BAD BAD..wrong name ??",nm);
              }
         }
      }
    }

    let jcnt=justname.length;
    let justnamestring="";
    sp="";
    for(let i=0; i<jcnt; i++) {
      justnamestring=justnamestring+sp+justname[i];
      if(i == (jcnt-2)) {
           sp=" and ";
        } else {
		sp= ", ";
      }
    }

//should just be 1
    let icnt=justinterp.length;
    if(icnt > 1) {
       window.console.log("BAD BAD,  should have just 1 interpolator function allowed..");
    }
    if(icnt == 1) {
      justnamestring=justnamestring+" with " +justinterp[0];
    }

    let t_description=" A tiled CVM that combines the "+justnamestring+" into a single model. Tiling is accomplished by model ordering using UCVM. For descriptions of the individual models refer to their descriptions by selecting the relevant model in the CVM Explorer";

// show model name and abbrevshow
    if(name.length + abbname.length > 200) {
      $("#modalselectedbody").html("<div><b>Model Selected:</b>"+name+"</div>");
      $("#cvm-model-selected").html("<b>Model Selected:</b><button class=\"btn btn-sm cvm-small-btn\" data-toggle=\"modal\" data-target=\"#modalselected\"><span class=\"glyphicon glyphicon-expand\"></span></button><br><b>UCVM Abbreviation:</b>"+abbname);
      } else {
        $("#cvm-model-selected").html("<b>Model Selected:</b>"+name+"<br><b>UCVM Abbreviation:</b>"+abbname);
    }

// show description 
    if(jcnt+icnt > 1) {
      description=t_description;
      if(t_description.length > 200) {
        let idx= t_description.indexOf(".");
        b_description = idx !== -1 ? t_description.substring(0, idx) : t_description;
        if(b_description.length > 200) {
          b_description = " A Tiled CVM that combines ";
        }
        } else {
          b_description=null;
      }
    }

    if(description.length > 350 || b_description != null) {

        $("#modaldescriptionbody").html("<div><b>Description:</b>"+description+"</div>");
        // if there is a description_brief.. prepend it
        if(b_description == null) {
          $("#cvm-model-description").html("<b>Description: </b><button class=\"btn btn-sm cvm-small-btn\" data-toggle=\"modal\" data-target=\"#modaldescription\"><span class=\"glyphicon glyphicon-expand\"></span></button>");
          } else {
              $("#cvm-model-description").html("<b>Description: </b>"+b_description+" <button class=\"btn btn-sm cvm-small-btn\" data-toggle=\"modal\" data-target=\"#modaldescription\"><span class=\"glyphicon glyphicon-expand\"></span></button>");
        }

        } else {
          $("#cvm-model-description").html("<b>Description:</b>"+description);
    }

// show author/references popup
    let astr="<b>Reference:</b>";
    if(reflist.length != 0) {
        let cnt=reflist.length;
        let tmp="";
        for(let i=0; i<cnt; i++) {
          astr=astr+rsp+"<button class=\"btn btn-sm cvm-small-btn\" data-toggle=\"modal\" data-target=\"#modalreference\" data-ref=\""+rlist[i]+"\">"+alist[i]+"</button>";
          tmp=tmp+rsp+reflist[i];
          rsp=" ";
        }
        if(cnt > 4 ) {
          $("#modalreferencebody").html("<div>"+astr+"</div>");
          $("#cvm-model-reference").html("<b>Reference: </b><button class=\"btn btn-sm cvm-small-btn\" data-toggle=\"modal\" data-target=\"#modalreference\"><span class=\"glyphicon glyphicon-expand\"></span></button>");
          } else {
              $("#cvm-model-reference").html(astr);
        }

        } else {
          $("#cvm-model-reference").html("");
    }
}

function setup_modeltype() {
   var html=document.getElementById('modelTable-container').innerHTML=makeModelTable();
   makeModelSelection();
   make_all_model_layer();

   // initialize with the default model
   var sel=document.getElementById('selectModelType');
   var opt=sel[0]
   var model=opt.value;
   load_selected_model(model);
   refreshModelDescription(model);
}

// it is filelist
// forPoint==1 is for latlon
// forPoint==0 is for depth/elevation profile
function selectLocalFiles(_urls,forPoint) {

    document.getElementById('spinIconForListProperty').style.display = "block";

    if(_urls == undefined) {
      throw new Error("must have an url!");
    }
    var _url=_urls[0];
    if( _url instanceof File) {
      readAndProcessLocalFile(_url, forPoint);
    } else {
      throw new Error("local file must be a File object type!");
    }

    // clear the the btn
    if(forPoint) {
      document.getElementById("infileBtn").value="";
      } else {
        document.getElementById("inprofilefileBtn").value="";
    }
}

function clearSearchResult() {
    refreshMPTable();
}

// create a links to png, metadata, data file if exist
function makeDownloadLinks(str) {
    var html="";

window.console.log("downloadlinks>>",str);
    // just one
    if( typeof str === 'string') { 
       // if the file ends with png 
       if(str.endsWith(".png")) {
          html="<div class=\"links\"><a class=\"openpop\" href=\"result/"+str+"\" target=\"pngbox\"><span class=\"glyphicon glyphicon-picture\"></span></a></div>";
         } else {
            html="<div class=\"links\"><a class=\"openpop\" href=\"result/"+str+"\" target=\"downloadlink\"><span class=\"glyphicon glyphicon-download-alt\"></span></a></div>";
       }
       return html;
    }

    // a set of them,  obj['key1'] and obj['key2']
    var keys=Object.keys(str);
    var sz=(Object.keys(str).length);
    var i;

    let type = str['type'];
    let uid = str['uid'];

    html="<div class=\"links\" style=\"display:inline-block\">";
    for(i=0;i<sz;i++) {
       var val=str[keys[i]]; 
       switch(keys[i]) {
          case 'csv':
              html=html+"<div class=\"links\"><a class=\"openpop\" href=\"result/"+val+"\" target=\"downloadlink\"><span class=\"glyphicon glyphicon-download-alt\"></span></a>&nbsp;&nbsp;Download data (.csv format)</div>";
              break;
          case 'gmtpdf':
              html=html+"<div style=\"margin-left:-6px\"><button id=\""+uid+"_show_btn\" class=\"btn btn-sm cvm-small-btn\" data-blob=\""+uid+"_state_blob\" data-toggle=\"modal\" data-target=\"#modalplotoption\"><span class=\"glyphicon glyphicon-picture\"></span></button>Plot data</div>";
              break;
          case 'gmtpng':
//              html=html+"<div class=\"links\"><a class=\"openpop\" href=\"result/"+val+"\" target=\"pngbox\"><span class=\"glyphicon glyphicon-picture\"></span></a>&nbsp;&nbsp;PNG plot</div>";
              break;
          case 'plot':
              html=html+"<div class=\"links\"><a class=\"openpop\" href=\"result/"+val+"\" target=\"pngbox\"><span class=\"glyphicon glyphicon-picture\"></span></a>&nbsp;&nbsp;PNG plot</div>";
              break;
          case 'meta':
//              html=html+"<div class=\"links\"><a class=\"openpop\" href=\"result/"+val+"\" target=\"downloadlink\"><span class=\"glyphicon glyphicon-download-alt\"></span></a>&nbsp;&nbsp;plot metadata file</div>";
              break;
          case 'data':
//              html=html+"<div class=\"links\"><a class=\"openpop\" href=\"result/"+val+"\" target=\"downloadlink\"><span class=\"glyphicon glyphicon-download-alt\"></span></a>&nbsp;&nbsp;plot data file</div>";
              break;
          case 'dataset':
//              html=html+"<div class=\"links\"><a class=\"openpop\" href=\"result/"+val+"\" target=\"downloadlink\"><span class=\"glyphicon glyphicon-download-alt\"></span></a>&nbsp;&nbsp;plot dataset file</div>";
              break;
          case 'materialproperty':
              html=html+"<div class=\"links\"><a class=\"openpop\" href=\"result/"+val+"\" target=\"downloadlink\"><span class=\"glyphicon glyphicon-download-alt\"></span></a>&nbsp;&nbsp;material property file</div>";
              break;
          case 'query':
              window.console.log("QUERY:",val);
              break; 
          case 'uid':
              window.console.log("QUERY uid:",val);
              break;
          case 'type':
              window.console.log("QUERY type:",val);
              break;
          case 'gmtresult':
              window.console.log("QUERY result:",val);
              html=html+"<div id=\""+uid+"_state_blob\" style=\"display:none\">"+val+"</div>";
              break;
          case 'elapsed':
              window.console.log("elapsed time(sec):",val);
              html=html+"<div style=\"display:\">Extraction time: "+val+" sec</div>";
              break;
          default:
              window.console.log("This key is skipped:",keys[i]);
              break;
       }
    }
    html=html+"</div>";

    return html;
    
}

function updatePlotOptions(blob) {

window.console.log("XX calling updatePlotOptions.. with ",blob);

    let json=JSON.parse(blob);
    let range=json['range'];
    let minv=round2Four(range['min']);
    let maxv=round2Four(range['max']);

    let type=json['type']; // 'profile'
    let plotparam = json['plotParam'];
	

// for color scale: cross/horizonal, vs=1, vp=2, density=3
    switch (plotparam) {
      case 1:
      case 2:	 
        document.getElementById("setPlotRange").innerHTML="Set Plot Range (km/s)";
	break;
      case 3:
        document.getElementById("setPlotRange").innerHTML="Set Plot Range (g/cm^3)";
        break;
      case 4:
        document.getElementById("setPlotRange").innerHTML="Set Plot Range";
        break;
    }

    document.getElementById("minPlotScaleTxt").value=minv;
    document.getElementById("maxPlotScaleTxt").value=maxv;
    document.getElementById("plotoption-plotrange-option").style.display='block';

    if( type == 'profile') {
      $("#plotoption-param-all" ).attr("disabled",false);
      } else {
        $("#plotoption-param-all" ).attr("disabled","disabled");
    }

    if(json['faults'] == 0) {
      document.getElementById("plotoption-cfm").value=0;
      document.getElementById("plotoption-cfm").checked=false;
      } else {
        document.getElementById("plotoption-cfm").value=1;
        document.getElementById("plotoption-cfm").checked=true;
    }

    if('interp' in json) {
      document.getElementById("plotoption-interp-option").style.display='block';
      if(json['interp'] == 0) {
        document.getElementById("plotoption-interp").value=0;
        document.getElementById("plotoption-interp").checked=false;
        } else {
          document.getElementById("plotoption-interp").value=1;
          document.getElementById("plotoption-interp").checked=true;
      }
      } else {
        document.getElementById("plotoption-interp-option").style.display='none';
    }

    if(json['cities'] == 0) {
      document.getElementById("plotoption-ca").value=0;
      document.getElementById("plotoption-ca").checked=false;
      } else {
        document.getElementById("plotoption-ca").value=1;
        document.getElementById("plotoption-ca").checked=true;
    }

    if('points' in json) {
      document.getElementById("plotoption-point-option").style.display='block';
      if(json['points'] == 0) {
        document.getElementById("plotoption-point").value=0;
        document.getElementById("plotoption-point").checked=false;
        } else {
          document.getElementById("plotoption-point").value=1;
          document.getElementById("plotoption-point").checked=true;
      }
      } else {
        document.getElementById("plotoption-point-option").style.display='none';
    }

    if('plotMap' in json) {
      document.getElementById("plotoption-map-option").style.display='block';
      if(json['plotMap'] == 1) {
        document.getElementById("plotoption-map").value=1;
        document.getElementById("plotoption-map").checked=true;
        document.getElementById("plotoption-ca-option").style.display='block';
        document.getElementById("plotoption-cfm-option").style.display='block';
        } else {
          document.getElementById("plotoption-map").value=0;
          document.getElementById("plotoption-map").checked=false;
          document.getElementById("plotoption-ca-option").style.display='none';
          document.getElementById("plotoption-cfm-option").style.display='none';
      }
      } else {
        document.getElementById("plotoption-map-option").style.display='none';
    }

    if('pad' in json) {
      document.getElementById("plotoption-pad-option").style.display='block';
      document.getElementById("plotPadTxt").value=json['pad'];
      } else {
        document.getElementById("plotoption-pad-option").style.display='none';
    }

    if('plotParam' in json) {
      document.getElementById("plotoption-param-option").style.display='block';
      document.getElementById("plotParamTxt").value=json['plotParam'];
      } else {
        document.getElementById("plotoption-param-option").style.display='none';
    }

    if('cMap' in json) {
      document.getElementById("plotoption-cmap-option").style.display='block';
      document.getElementById("cmapTxt").value=json['cMap'];
      } else {
        document.getElementById("plotoption-cmap-option").style.display='none';
    }

    return type;
}

function replotPlots() {

   if(MODAL_REPLOT_TYPE == "horizontal") {
     replotHorizontalSlice();
     MODAL_REPLOT_PAR=false;
   }
   if(MODAL_REPLOT_TYPE == "cross") {
     replotCrossSection();
     MODAL_REPLOT_PAR=false;
   }
   if(MODAL_REPLOT_TYPE == "profile") {
     replotVerticalProfile();
     MODAL_REPLOT_PAR=false;
   }
}

function updateMetaReplotResultTable(str){
// extract gmtresult str
    let uid=str['uid'];
    let blob=str['gmtresult'];
    updatePlotOptions(blob);

    document.getElementById(uid+"_state_blob").innerHTML = blob;
}

// plot + various datafiles
function insertMetaPlotResultTable(note,uid,str) {
    cvm_metaplottb_list.push( { uid:uid, blob:str });
    var html=makeDownloadLinks(str);
    makeMetaPlotResultTable(note,uid,html);
}

function makeMetaPlotResultTable(note,uid,html) {
    
    var table=document.getElementById("metadataPlotTable");
    var hasLayer=find_layer_from_list(uid);
    if (cvm_metaplottb_list.length == 1) {
      table.deleteRow(0); // delete the holdover
//label
      var row=table.insertRow(-1);
      row.innerHTML="<th style=\"width:2vw;background-color:whitesmoke\"></th><th style=\"width:10vw;background-color:whitesmoke\"><b>UID</b></th><th style=\"width:24vw;background-color:whitesmoke\"><b>Links</b></th><th style=\"width:24vw;background-color:whitesmoke\"><b>Description</b></th>";
//
    }

// insert at the end, row=table.insertRow(-1);
    row=table.insertRow(1);
    let myhtml;
    if(hasLayer!=0) {
      myhtml="<td style=\"width:4px\"><button class=\"btn btn-sm cvm-small-btn\" title=\"toggle the layer\" onclick=toggle_a_layergroup(\""+uid+"\");><span value=0 id=\"cvm_layer_"+uid+"\" class=\"glyphicon glyphicon-eye-open\"></span></button></td><td style=\"width:10vw\">"+uid+"</td><td style=\"width:24vw\">"+html+"</td><td style=\"width:24vw\">"+note+"</td>";
      } else {
        myhtml="<td style=\"width:4px\"></td><td style=\"width:10vw\">"+uid+"</td><td style=\"width:24vw\">"+html+"</td><td style=\"width:24vw\">"+note+"</td>";
    }
    row.innerHTML=myhtml;

}

// takes 1 or more sets of result
// of { 'first':{...}, 'second':{...}, ...}
function makeMPTable(uid,str)
{
    var i;
    var blob;
    if( str == undefined || str == "" ) {
       window.console.log("ERROR: no return result");
       return "";
    }
    if( typeof str === 'string') { 
       blob=JSON.parse(str);
       } else {
         blob=str;
    }

    var dkeys=Object.keys(blob); // dkeys: first, second
    var dsz=(Object.keys(blob).length); // 2

    if(dsz < 1) {
       window.console.log("ERROR: expecting at least 1 set of material properties");
       return;
    }

    var datablob=blob[dkeys[0]]; // first set of data { 'X':..,'Y':...  }

    if( datablob == "" ) {
       window.console.log("ERROR: no return result");
       return "";
    } 

    if( typeof datablob === 'string') { 
       datablob=JSON.parse(datablob);
    }

    insert_materialproperty(uid,datablob); // save a copy

    var table=document.getElementById("materialPropertyTable");

    // create the key first
    var labelline="<th style=\"width:10vw;background-color:whitesmoke;\"></th>";
    var key;
    
    var datakeys=Object.keys(datablob);
    var sz=(Object.keys(datablob).length);

    var tmp;
    if(hold_mptable) {
        for(i=0; i<sz; i++) {
            key=datakeys[i];
            // special case
            if(!showInTable(key))
              continue;
            if(key == 'Z') { 
              labelline=labelline+"<th style=\"width:48vw;background-color:whitesmoke;\"><b>"+key+"</b></th>";
              } else {
                labelline=labelline+"<th style=\"width:24vw;background-color:whitesmoke\"><b>"+key+"</b></th>";
            }
        }
        table.deleteRow(0); // delete the holdover
        hold_mptable=0;
    
        row=table.insertRow(-1);
        row.innerHTML=labelline;
    }
    
    // now adding the data part..
    for(j=0; j< dsz; j++) {
        var datablob=blob[dkeys[j]];
        if(datablob == "")
           continue;
        if( typeof datablob === 'string') { 
           datablob=JSON.parse(datablob);
        }

        var mpline="<td style=\"width:4px\"><button class=\"btn btn-sm cvm-small-btn\" title=\"toggle the layer\" onclick=toggle_a_layergroup(\""+uid+"\");><span value=0 id=\"cvm_layer_"+uid+"\" class=\"glyphicon glyphicon-eye-open\"></span></button></td>";

        var tmp;
        for(i=0; i<sz; i++) {
            var key2=datakeys[i];
            var val2=datablob[key2];
            var zmodestr=datablob["Zmode"];
            if(!showInTable(key2))
              continue;
            if(key2=="Z") {
              if(zmodestr == "e")
                val2=val2+"(by&nbsp;elevation)";
                else
                  val2=val2+"(by&nbsp;depth)";
              tmp="<td style=\"width:24vw\">"+val2+"</td>";
              } else { 
                  tmp="<td style=\"width:24vw\">"+val2+"</td>";
            }
            mpline=mpline+tmp;
         }
         row=table.insertRow(1);
         row.innerHTML=mpline;
    }
}


// go through the table and pick up the label that has valid entry
// chunk and extract the old mp date from backend
function downloadMPTable() {
    // create a uniq uid also for this tasks.,
    var uid=$.now();

    var mplist=get_all_materialproperty();
    window.console.log(">>mp downloading..cnt is",mplist.length);
    var csvblob=getCSVFromJSON(mplist);
    saveAsCSVBlobFile("CVM_",csvblob, uid);
}

// make link to result/  directory
function linkDownload(str)
{
    var html="";
    // just one
    if( typeof str === 'string') { 
       html="<div class=\"links\"><a class=\"openpop\" href=\"result/"+str+"\" target=\"downloadlink\"><span class=\"glyphicon glyphicon-download-alt\"></span></a></div>";
       return html;
    }
    return html;
}

function processMPTable(v)
{
  switch(v) {
    case 'e':
      edit_mp_table();
      break;
    case 'c':
      collapse_mp_table();
      break;
    case 's':
      save_mp_table();
      break;
    case 'd':
      save_mp_data();
      break;
  }
}

function edit_mp_table()
{
   window.console.log("calling edit_mp_table");
}

function save_mp_data()
{
   downloadMPTable();
}

function save_mp_table()
{
   window.console.log("calling save_mp_table");
   makeMPStateBlob();
}

function collapse_mp_table()
{
   window.console.log("calling collapse_mp_table");
   var elm=document.getElementById('materialProperty-viewer-container');
   var v=elm.style.display;
   if(v=="none") {
     elm.style.display='block';
     $('#cvm_collapse_mp_btn').removeClass('cvm-active');
     $('#mpCollapseLi').text("Collapse");
     } else {
       elm.style.display='none';
       $('#cvm_collapse_mp_btn').addClass('cvm-active');
       $('#mpCollapseLi').text("Expand");
   }
}

function processMetaPlotResultTable(v)
{
  switch(v) {
    case 'e':
      edit_mpr_table();
      break;
    case 'c':
      collapse_mpr_table();
      break;
    case 's':
      save_mpr_table();
      break;
    case 'p':
      let plist=get_all_highlight_profile_list();
      if(plist.length !=0) {
        $("#plotProfileBtn").click();
        } else {
          alert("Please select one or more profile to compare");
          return;
      }
      break;
  }
}

function edit_mpr_table()
{
   window.console.log("calling edit_mpr_table");
}

function save_mpr_table()
{
    window.console.log("calling save_mpr_table");
    makeMetaPlotResultStateBlob(); 
}

function collapse_mpr_table()
{
   var elm=document.getElementById('metadataPlotTable-container');
   var v=elm.style.display;
   if(v=="none") {
     elm.style.display='block';
     $('#cvm_collapse_result_btn').removeClass('cvm-active');
      $('#mprCollapseLi').text("Collapse");
     } else {
       elm.style.display='none';
       $('#cvm_collapse_result_btn').addClass('cvm-active');
       $('#mprCollapseLi').text("Expand");
   }
}

function refresh_zmode() {
    $("#zModeType").val('d');
    set_floors_presets();
    set_zrange_presets();
}

function set_zrange_presets()
{
   var t= document.getElementById("zModeType").value;
   if( t == 'd' ) {
       $( "#zrangeStartTxt" ).val('0');
       $( "#zrangeStopTxt" ).val('350');
// enable all search type
       $( "#searchType-lineClick" ).attr("disabled",false);
       $( "#searchType-areaClick" ).attr("disabled",false);
       } else {
         $( "#zrangeStartTxt" ).val('0');
         $( "#zrangeStopTxt" ).val('-350');
// disable the crosssection and horizontal slice
         $( "#searchType-lineClick" ).attr("disabled","disabled");
         $( "#searchType-areaClick" ).attr("disabled","disabled");
   }
}

function set_floors_presets()
{
   var t= document.getElementById("zModeType").value;
   if( t == 'd' ) {
       $( "#vsFloorTxt" ).val('500');
       $( "#vpFloorTxt" ).val('1700');
       $( "#densityFloorTxt" ).val('1700');
       } else {
         $( "#vsFloorTxt" ).val('-1');
         $( "#vpFloorTxt" ).val('-1');
         $( "#densityFloorTxt" ).val('-1');
   }
}

function set_zrange_start(v) {
   $( "#zrangeStartTxt" ).val(v);
}
function set_zrange_stop(v) {
   $( "#zrangeStopTxt" ).val(v);
}

function getCSVFromJSON(jblob) {
    var objs=Object.keys(jblob);
    var len=objs.length;
    var last=len-1;

    var jfirst=jblob[0];
    var keys=Object.keys(jfirst);
    var csvblob = keys.join(",");
    csvblob +='\n';
    for(var i=0; i< len; i++) {
       var jnext=jblob[i];
       var values=Object.values(jnext)
       var vblob=values.join(",");
       csvblob += vblob;
       if(i != last) {
         csvblob +='\n';
       }
   }
//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    return csvblob;
}

// move current popup modal to a new tab
function movePlotview() {
  var yourDOCTYPE = "<!DOCTYPE html>"; // your doctype declaration
  var copyPreview = window.open();
  var newCopy = copyPreview.document;
  newCopy.open();
  // remove header panel
  document.getElementById("plotoption-header").style.display="none";
  var newInner=document.documentElement.innerHTML;
  newCopy.write(yourDOCTYPE+"<html>"+ newInner+ "</html>");
  newCopy.close();
  document.getElementById("viewPlotClosebtn").click();
}

// move current popup modal to a new window
function movePlotview2() {
  var yourDOCTYPE = "<!DOCTYPE html>"; // your doctype declaration
  var copyPreview = window.open('about:blank', 'CVM_plot', "resizable=yes,scrollbars=yes,status=yes");
  var newCopy = copyPreview.document;
  newCopy.open();
  // remove header panel
  document.getElementById("plotoption-header").style.display="none";
  var newInner=document.documentElement.innerHTML;
  newCopy.write(yourDOCTYPE+"<html>"+ newInner+ "</html>");
  newCopy.close();
  document.getElementById("viewPlotClosebtn").click();
}

function savePDFPlotview() {
  let file=MODAL_REPLOT_SRC;
  window.console.log("MODAL_REPLOT_SRC >>> ", file);
  saveAsURLFile(file);
}

function savePNGPlotview() {
  let file=MODAL_REPLOT_SRC.replace("pdf","png");
  saveAsURLFile(file);
}

