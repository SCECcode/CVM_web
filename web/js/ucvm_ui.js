/***
   ucvm_ui.js
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
var ucvm_metaplottb_list=[];

// tracking the layer that contains CFM5.2 faults
var ucvm_cfm_layer;
var show_cfm=false;
// tracking the layer that contains CRM regions
var ucvm_crm_layer;
var show_crm=false;
// tracking the layer that contains CTM regions
var ucvm_ctm_layer;
var show_ctm=false;
// tracking the layer that contains CRM latlon points 
var ucvm_crm_point_layer;
var show_crm_point=false;


/******************************************/

function setup_model() {
    getInstallModelList();
}

function setup_modeltype() {
   var html=document.getElementById('modelTable-container').innerHTML=makeModelTable();
   makeModelSelection();
   make_all_model_layer();
}

function setup_parameter() {
   document.getElementById('parametersTable-container').innerHTML=makeParametersTable();
}

function setup_fileFormat() {
   document.getElementById('fileFormatTable-container').innerHTML=makeFileFormatTable();
}

function setup_ZMode() {
   document.getElementById('ZModeTable-container').innerHTML=makeZModeTable();
}

function setup_CFM() {
   ucvm_cfm_layer=readLocalAndProcessActiveCFMGeo();
}

function toggleShowCFM() {
   show_cfm=!show_cfm;
   if(show_cfm) {
     viewermap.addLayer(ucvm_cfm_layer);
     $('#ucvm_cfm_btn').removeClass('glyphicon-ok-sign');
     $('#ucvm_cfm_btn').addClass('glyphicon-remove-sign');
     } else {
       viewermap.removeLayer(ucvm_cfm_layer); 
       $('#ucvm_cfm_btn').addClass('glyphicon-ok-sign');
       $('#ucvm_cfm_btn').removeClass('glyphicon-remove-sign');
   }
} 

function setup_CRM() {
   ucvm_crm_layer=readLocalAndProcessActiveCRMGeo();
}

function toggleShowCRM() {
   show_crm=!show_crm;
   if(show_crm) {
     viewermap.addLayer(ucvm_crm_layer);
     $('#ucvm_crm_btn').removeClass('glyphicon-ok-sign');
     $('#ucvm_crm_btn').addClass('glyphicon-remove-sign');
     } else {
       viewermap.removeLayer(ucvm_crm_layer); 
       $('#ucvm_crm_btn').addClass('glyphicon-ok-sign');
       $('#ucvm_crm_btn').removeClass('glyphicon-remove-sign');
   }
} 

function setup_CTM() {
   ucvm_ctm_layer=readLocalAndProcessActiveCTMGeo();
}

function toggleShowCTM() {
   show_ctm=!show_ctm;
   if(show_ctm) {
     viewermap.addLayer(ucvm_ctm_layer);
     $('#ucvm_ctm_btn').removeClass('glyphicon-ok-sign');
     $('#ucvm_ctm_btn').addClass('glyphicon-remove-sign');
     } else {
       viewermap.removeLayer(ucvm_ctm_layer);
       $('#ucvm_ctm_btn').addClass('glyphicon-ok-sign');
       $('#ucvm_ctm_btn').removeClass('glyphicon-remove-sign');
   }
}

function setup_CRMPoints() {
   ucvm_crm_point_layer=readLocalAndProcessActiveLatlon();
}

function toggleShowCRMPoints() {
   show_crm_point=!show_crm_point;
   if(show_crm_point) {
     viewermap.addLayer(ucvm_crm_point_layer);
     $('#ucvm_crm_point_btn').removeClass('glyphicon-ok-sign');
     $('#ucvm_crm_point_btn').addClass('glyphicon-remove-sign');
     } else {
       viewermap.removeLayer(ucvm_crm_point_layer); 
       $('#ucvm_crm_point_btn').addClass('glyphicon-ok-sign');
       $('#ucvm_crm_point_btn').removeClass('glyphicon-remove-sign');
   }
} 

function processByLatlonForPoint() {
    document.getElementById('spinIconForProperty').style.display = "block";    
    getMaterialPropertyByLatlon();
}

function processByLatlonForProfile() {
    document.getElementById('spinIconForProfile').style.display = "block";    
    plotVerticalProfile();
}

function processByLatlonForLine() {
    document.getElementById('spinIconForLine').style.display = "block";    
    plotCrossSection();
}

function processByLatlonForArea() {
    document.getElementById('spinIconForArea').style.display = "block";    
    plotHorizontalSlice();
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

    html="<div class=\"links\" style=\"display:inline-block\">";
    for(i=0;i<sz;i++) {
       var val=str[keys[i]]; 
       switch(keys[i]) {
          case 'csv':
              html=html+"<div class=\"links\"><a class=\"openpop\" href=\"result/"+val+"\" target=\"downloadlink\"><span class=\"glyphicon glyphicon-download-alt\"></span></a>&nbsp;&nbsp;csv data file</div>";
              break;
          case 'plot':
              html=html+"<div class=\"links\"><a class=\"openpop\" href=\"result/"+val+"\" target=\"pngbox\"><span class=\"glyphicon glyphicon-picture\"></span></a>&nbsp;&nbsp;PNG plot</div>";
              break;
          case 'meta':
              html=html+"<div class=\"links\"><a class=\"openpop\" href=\"result/"+val+"\" target=\"downloadlink\"><span class=\"glyphicon glyphicon-download-alt\"></span></a>&nbsp;&nbsp;plot metadata file</div>";
              break;
          case 'data':
              html=html+"<div class=\"links\"><a class=\"openpop\" href=\"result/"+val+"\" target=\"downloadlink\"><span class=\"glyphicon glyphicon-download-alt\"></span></a>&nbsp;&nbsp;plot data file</div>";
              break;
          case 'dataset':
              html=html+"<div class=\"links\"><a class=\"openpop\" href=\"result/"+val+"\" target=\"downloadlink\"><span class=\"glyphicon glyphicon-download-alt\"></span></a>&nbsp;&nbsp;plot dataset file</div>";
              break;
          case 'materialproperty':
              html=html+"<div class=\"links\"><a class=\"openpop\" href=\"result/"+val+"\" target=\"downloadlink\"><span class=\"glyphicon glyphicon-download-alt\"></span></a>&nbsp;&nbsp;material property file</div>";
              break;
          case 'query':
              window.console.log("QUERY:",val);
              break; 
          case 'uid':
              window.console.log("QUERY:",val);
              break;
          default:
              window.console.log("HUM...This key is skipped:",keys[i]);
              break;
       }
    }
    html=html+"</div>";

    return html;
    
}

// plot + various datafiles
function insertMetaPlotResultTable(note,uid,str) {
    ucvm_metaplottb_list.push( { uid:uid, blob:str });
    var html=makeDownloadLinks(str);
    makeMetaPlotResultTable(note,uid,html);
}

function makeMetaPlotResultTable(note,uid,html) {
    
    var table=document.getElementById("metadataPlotTable");
    var hasLayer=find_layer_from_list(uid);
    if (ucvm_metaplottb_list.length == 1) {
      table.deleteRow(0); // delete the holdover
//label
      var row=table.insertRow(-1);
      row.innerHTML="<th style=\"width:10vw;background-color:whitesmoke\"><b>UID</b></th><th style=\"width:2vw;background-color:whitesmoke\"></th><th style=\"width:24vw;background-color:whitesmoke\"><b>Links</b></th><th style=\"width:24vw;background-color:whitesmoke\"><b>Description</b></th>";
//
    }

// insert at the end, row=table.insertRow(-1);
    row=table.insertRow(1);
    if(hasLayer!=0) {
        row.innerHTML="<td style=\"width:10vw\">"+uid+"<td style=\"width:4px\"><button class=\"btn btn-sm ucvm-small-btn\" title=\"toggle the layer\" onclick=toggle_a_layergroup(\""+uid+"\");><span value=0 id=\"ucvm_layer_"+uid+"\" class=\"glyphicon glyphicon-eye-open\"></span></button></td></td><td style=\"width:24vw\">"+html+"</td><td style=\"width:24vw\">"+note+"</td>";
      } else {
        row.innerHTML="<td style=\"width:10vw\">"+uid+"<td style=\"width:4px\"></td></td><td style=\"width:24vw\">"+html+"</td><td style=\"width:24vw\">"+note+"</td>";
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

        var mpline="<td style=\"width:4px\"><button class=\"btn btn-sm ucvm-small-btn\" title=\"toggle the layer\" onclick=toggle_a_layergroup(\""+uid+"\");><span value=0 id=\"ucvm_layer_"+uid+"\" class=\"glyphicon glyphicon-eye-open\"></span></button></td>";

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
    saveAsCSVBlobFile(csvblob, uid);
}

function saveAsCSVBlobFile(data, timestamp)
{
//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
//   var rnd= Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    var fname="UCVM_"+timestamp+".csv";
    var blob = new Blob([data], {
        type: "text/plain;charset=utf-8"
    });
    //FileSaver.js
    saveAs(blob, fname);
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


function saveAsBlobFile(data, timestamp)
{
//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
//   var rnd= Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    var fname="UCVM_"+timestamp+".json";
    var blob = new Blob([data], {
        type: "text/plain;charset=utf-8"
    });
    //FileSaver.js
    saveAs(blob, fname);
}

function saveAsURLFile(gid,url) {
  var dname=url.substring(url.lastIndexOf('/')+1);
  var dload = document.createElement('a');
  dload.href = url;
  dload.download = dname;
  dload.type="application/octet-stream";
  dload.style.display='none';
  document.body.appendChild(dload);
  dload.click();
  document.body.removeChild(dload);
  delete dload;
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
     $('#ucvm_collapse_mp_btn').removeClass('ucvm-active');
     $('#mpCollapseLi').text("Collapse");
     } else {
       elm.style.display='none';
       $('#ucvm_collapse_mp_btn').addClass('ucvm-active');
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
     $('#ucvm_collapse_result_btn').removeClass('ucvm-active');
      $('#mprCollapseLi').text("Collapse");
     } else {
       elm.style.display='none';
       $('#ucvm_collapse_result_btn').addClass('ucvm-active');
       $('#mprCollapseLi').text("Expand");
   }
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
