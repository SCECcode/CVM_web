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
function setup_modeltype() {
   var html=document.getElementById('modelTable-container').innerHTML=makeModelTable();
   makeModelSelection();
   make_all_model_layer();
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
              html=html+"<div class=\"links\"><a class=\"openpop\" href=\"result/"+val+"\" target=\"downloadlink\"><span class=\"glyphicon glyphicon-download-alt\"></span></a>&nbsp;&nbsp;csv data file</div>";
              break;
          case 'gmtpdf':
              html=html+"<div class=\"links\"><a class=\"openpop\" href=\"result/"+val+"\" target=\"downloadlink\"><span class=\"glyphicon glyphicon-picture\"></span></a>&nbsp;&nbsp;PDF plot&nbsp;&nbsp;<button id=\""+uid+"_show_btn\" class=\"btn cvm-small-btn\" data-blob=\""+uid+"_state_blob\" data-toggle=\"modal\" data-target=\"#modalplotoption\"><span class=\"glyphicon glyphicon-adjust\"></span></button></div>";
//                html=html+"<div class=\"links\"><a class=\"openpop\" href=\"result/"+val+"\" target=\"downloadlink\"><span class=\"glyphicon glyphicon-picture\"></span></a>&nbsp;&nbsp;PDF plot</div>";
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
          default:
              window.console.log("BAD...This key is skipped:",keys[i]);
              break;
       }
    }
    html=html+"</div>";

    return html;
    
}

function updatePlotOptions(blob) {

    let json=JSON.parse(blob);
    let range=json['range'];
    let minv=range['min'];
    let maxv=range['max'];
    document.getElementById("minScaleTxt").value=minv;
    document.getElementById("maxScaleTxt").value=maxv;

    if(json['faults'] == 0) {
      document.getElementById("plotoption-cfm").value=0;
      document.getElementById("plotoption-cfm").checked=false;
      } else {
        document.getElementById("plotoption-cfm").value=1;
        document.getElementById("plotoption-cfm").checked=true;
    }
    if(json['cities'] == 0) {
      document.getElementById("plotoption-ca").value=0;
      document.getElementById("plotoption-ca").checked=false;
      } else {
        document.getElementById("plotoption-ca").value=1;
        document.getElementById("plotoption-ca").checked=true;
    }
    if(json['forceRange'] == 0) {
      document.getElementById("plotoption-range").value=0;
      document.getElementById("plotoption-range").checked=false;
      } else {
        document.getElementById("plotoption-range").value=1;
        document.getElementById("plotoption-range").checked=true;
    }
    if('pad' in json) {
      document.getElementById("plotoption-pad-option").style.display='block';
      document.getElementById("plotPadTxt").value=json['pad'];
      document.getElementById("plotoption-pad").value=json['pad'];
      document.getElementById("plotoption-pad").checked=false;
      } else {
        document.getElementById("plotoption-pad").value=json['pad'];
        document.getElementById("plotoption-pad-option").style.display='none';
    }

    if('plotPar' in json) {
      document.getElementById("plotoption-par-option").style.display='block';
      document.getElementById("plotParTxt").value=json['plotPar'];
      document.getElementById("plotoption-par").value=json['plotPar'];
      document.getElementById("plotoption-par").checked=false;
      } else {
        document.getElementById("plotoption-par").value=json['plotPar'];
        document.getElementById("plotoption-par-option").style.display='none';
    }

    if('cMap' in json) {
      document.getElementById("plotoption-cmap-option").style.display='block';
      document.getElementById("cmapTxt").value=json['cMap'];
      document.getElementById("plotoption-cmap").value=json['cMap'];
      document.getElementById("plotoption-cmap").checked=false;
      } else {
        document.getElementById("plotoption-cmap").value=json['cMap'];
        document.getElementById("plotoption-cmap-option").style.display='none';
    }


    let type=json['type'];
    return type;
}

function replotPlots() {

   if(MODAL_REPLOT_TYPE == "horizontal") {
     replotHorizontalSlice();
   }
   if(MODAL_REPLOT_TYPE == "cross") {
     replotCrossSection();
   }
   if(MODAL_REPLOT_TYPE == "profile") {
     replotVerticalProfile();
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
    if(hasLayer!=0) {
        row.innerHTML="<td style=\"width:4px\"><button class=\"btn btn-sm cvm-small-btn\" title=\"toggle the layer\" onclick=toggle_a_layergroup(\""+uid+"\");><span value=0 id=\"cvm_layer_"+uid+"\" class=\"glyphicon glyphicon-eye-open\"></span></button></td><td style=\"width:10vw\">"+uid+"</td><td style=\"width:24vw\">"+html+"</td><td style=\"width:24vw\">"+note+"</td>";
      } else {
        row.innerHTML="<td style=\"width:4px\"></td><td style=\"width:10vw\">"+uid+"</td><td style=\"width:24vw\">"+html+"</td><td style=\"width:24vw\">"+note+"</td>";
    }

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
      $("#plotProfileBtn").click();
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
       } else {
         $( "#zrangeStartTxt" ).val('0');
         $( "#zrangeStopTxt" ).val('-350');
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
