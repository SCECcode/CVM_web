/***
   cvm_query.js

***/

// if there are too many file points, do not generate the mp layer
// limit it to 200 maximum
var MAX_FILEPOINTS=500;
var MODAL_REPLOT_SRC="";
var MODAL_REPLOT_TYPE="";
var MODAL_REPLOT_PAR=false; // start from a-fresh

function cleanResultDirectory() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            let cnt=processSearchResult("cleanResultDirectory");
            window.console.log("cleaned out files >",cnt['count']);
       }
    }
    xmlhttp.open("GET","php/cleanResultDirectory.php", true);
    xmlhttp.send();
}

function getInstallModelList() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            var str=processSearchResult("getInstallModelList");
            makeInstallModelList(str);
       }
    }
    xmlhttp.open("GET","php/getInstallModelList.php", true);
    xmlhttp.send();
}

function getTextFile(url) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  }
  return result;
}

function _getZrange(modelstr)
{
    var ret="none";
    if( typeof modelstr === 'string') {
        if(modelstr.endsWith("elygtl:ely") || modelstr.endsWith("elygtl:taper")) {
            var zstartstr=document.getElementById("zrangeStartTxt").value;
            var zstopstr=document.getElementById("zrangeStopTxt").value;
            ret=zstartstr+","+zstopstr;
        }
    }
    return ret;
}

// to set taper interpolation's vs/vp/density flooring
function _getFloors(modelstr)
{
    var ret="none";
    if( typeof modelstr === 'string') {
        if(modelstr.endsWith("elygtl:taper")) {
            var vsfloorstr=document.getElementById("vsFloorTxt").value;
            var vpfloorstr=document.getElementById("vpFloorTxt").value;
            var densityfloorstr=document.getElementById("densityFloorTxt").value;
            ret=vsfloorstr+","+vpfloorstr+","+densityfloorstr;
        }
    }
    return ret;
}


//
// get a data array
//    [[lon1,lat1,z1],...,[lonn,latn,zn]]
//     ...,
//      "n": { "lat":latvaln,"lon":lonvaln; "z":zn } }
// get the material properties of the latlon locations
//
function getMaterialPropertyByLatlonList(uid,dataarray,current_chunk, total_chunks, chunk_step) {
    if(current_chunk == total_chunks) 
        return;
    var cnt=dataarray.length;
    // start and last data
    var start_idx=current_chunk * chunk_step;
    var end_idx=current_chunk * chunk_step + chunk_step;
    if(end_idx > cnt)
        end_idx=cnt;

    var i;
    var dataset=[];
    for( i=start_idx; i<end_idx; i++) {
// collect up the string
        dataset.push(dataarray[i]);
    }
    var datastr=dataset.toString();

    _getMaterialPropertyByLatlonChunk(uid,datastr, dataarray, current_chunk, total_chunks,chunk_step);
           
}

// to be called by getMaterialPropertyByLatlonList
function _getMaterialPropertyByLatlonChunk(uid,datastr, dataarray, current_chunk, total_chunks, chunk_step) {
    var xmlhttp;
    // extract content of a file
    var zmodestr=document.getElementById("zModeType").value;
    var modelstr=document.getElementById("selectModelType").value;
    var zrangestr=_getZrange(modelstr);
    var floorstr=_getFloors(modelstr);

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            var str=processSearchResult("getMaterialPropertyByLatlonChunk",uid);

            getMaterialPropertyByLatlonList(uid,dataarray, current_chunk+1, total_chunks, chunk_step);
            if(current_chunk==0) { // first one, must have uid
              if( dataarray.length < MAX_FILEPOINTS) {
                set_point_UID(uid);    
                add_bounding_file_points(uid,dataarray);
              }
            }

            if(current_chunk==(total_chunks-1)) { // last one
              var mpname=str['mp'];
// create a download link to the actual data file
              var zstr=getZModeNameWithType(zmodestr);
              var mstr=getModelNameWithType(modelstr);
              var note="Material Property with "+mstr + " search by "+zstr;
              insertMetaPlotResultTable(note,uid, {"materialproperty":mpname});
              document.getElementById('spinIconForListProperty').style.display = "none";
              if( dataarray.length < MAX_FILEPOINTS) {
                reset_point_UID();
                toggle_a_layergroup(uid);
              }
            }
       }
    }
    xmlhttp.open("GET","php/getMaterialPropertyByLatlonChunk.php?datastr="+datastr+"&zmode="+zmodestr+"&chunkid="+current_chunk+"&chunks="+total_chunks+"&model="+modelstr+"&zrange="+zrangestr+"&floors="+floorstr+ "&uid="+uid, true);
    xmlhttp.send();
}

// get material property blob by lat lon z zmode
function getMaterialPropertyByLatlon() {
    document.getElementById('spinIconForProperty').style.display = "block";
    var xmlhttp;
    var latstr=document.getElementById("pointFirstLatTxt").value;
    var lonstr=document.getElementById("pointFirstLonTxt").value;
    var zstr=document.getElementById("pointZTxt").value;
    var zmodestr=document.getElementById("zModeType").value;
    var modelstr=document.getElementById("selectModelType").value;
    var zrangestr=_getZrange(modelstr);
    var floorstr=_getFloors(modelstr);
    var uid=document.getElementById("pointUIDTxt").value;

    if (latstr == "" || lonstr=="" || zstr=="" ) {
        document.getElementById('spinIconForProperty').style.display = "none";
        reset_point_UID();
        return;
    }

    if(uid == '') {
      uid=getRnd("CVM");
      set_point_UID(uid);    
      // must be coming from the sidebar and so need to plot on map..
      add_bounding_point(uid,latstr,lonstr);
      } else {
        reset_dirty_uid();
    }

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            var str=processSearchResult("getMaterialPropertyByLatlon",uid);
            makeMPTable(uid,str);
            document.getElementById('spinIconForProperty').style.display = "none";
            reset_point_UID();
        }
    }
    xmlhttp.open("GET","php/getMaterialPropertyByLatlon.php?lat="+latstr+"&lon="+lonstr+"&z="+zstr+"&zmode="+zmodestr+"&model="+modelstr+"&zrange="+zrangestr+"&floors="+floorstr+"&uid="+uid, true);
    xmlhttp.send();
}

function plotCrossSection() {
    document.getElementById('spinIconForLine').style.display = "block";
    $("#modalwaiton").modal({ backdrop: 'static', keyboard: false });
    var xmlhttp;
    var firstlatstr=document.getElementById("lineFirstLatTxt").value;
    var firstlonstr=document.getElementById("lineFirstLonTxt").value;
    var zstr=document.getElementById("lineZTxt").value;
    var zstartstr=document.getElementById("lineZStartTxt").value;
    var datatypestr=document.getElementById("lineDataTypeTxt").value;
    var zmodestr=document.getElementById("zModeType").value;
    var modelstr=document.getElementById("selectModelType").value;
    var zrangestr=_getZrange(modelstr);
    var floorstr=_getFloors(modelstr);

    var secondlatstr=document.getElementById("lineSecondLatTxt").value;
    var secondlonstr=document.getElementById("lineSecondLonTxt").value;

    if (firstlatstr == "" || firstlonstr=="" ||
              secondlatstr == "" || secondlonstr=="" || zstr=="" || zstartstr=="" ) {
        document.getElementById('spinIconForLine').style.display = "none";
	$("#modalwaiton").modal('hide');
        reset_line_UID();
        return;
    }

    // precalculate the spacing
    var flat1=parseFloat(firstlatstr);
    var flon1=parseFloat(firstlonstr);
    var flat2=parseFloat(secondlatstr);
    var flon2=parseFloat(secondlonstr);

    var dlon=flon2-flon1;
    var dlat=flat2-flat1;

    var z=Math.sqrt((dlon*dlon) + (dlat*dlat));

    var dz4 = (round2Four(z) * 1000.0);

    var uid=document.getElementById("lineUIDTxt").value;

    if(uid == '') {
      uid=getRnd("CVM");
      set_line_UID(uid);
      add_bounding_line(uid,firstlatstr,firstlonstr,secondlatstr,secondlonstr);
      } else {    
        reset_dirty_uid();
    }

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;

            var str=processSearchResult("plotCrossSection",uid);

         if (str != undefined) { 
                var zstr=getZModeNameWithType(zmodestr);
                var mstr=getModelNameWithType(modelstr);
                var note="Vertical "+zstr+" Cross Section("+datatypestr+") with "+mstr;
                insertMetaPlotResultTable(note,uid,str);
            }

            document.getElementById('spinIconForLine').style.display = "none";
	    $("#modalwaiton").modal('hide');
            reset_line_UID();
            }
    }
    xmlhttp.open("GET","php/plotCrossSection.php?firstlat="+firstlatstr+"&firstlon="+firstlonstr+"&secondlat="+secondlatstr+"&secondlon="+secondlonstr+"&z="+zstr+"&zmode="+zmodestr+"&model="+modelstr+"&zrange="+zrangestr+"&floors="+floorstr+"&zstart="+zstartstr+"&datatype="+datatypestr+"&uid="+uid+"&spacing="+dz4,true);
    xmlhttp.send();
}

function replotCrossSection() {
    document.getElementById('spinIconForArea').style.display = "block";
    let map=$('#plotoption-map').prop('checked');
    let cfm=$('#plotoption-cfm').prop('checked');
    let ca=$('#plotoption-ca').prop('checked');
    let point=$('#plotoption-point').prop('checked');
    let interp=$('#plotoption-interp').prop('checked');

    // replace src .pdf with .csv and grab just filename
    let file=MODAL_REPLOT_SRC.replace("pdf","csv");
    let token=file.split('/');
    let fname=token[token.length - 1];
    // fname is CVM_id_X_data.pdf
    let ttoken=fname.split('_');
    let uid="CVM_"+ttoken[1];

    let onmap=0;
    if(map) onmap=1;
    let oncfm=0;
    if(cfm) oncfm=1;
    let onca=0;
    if(ca) onca=1;
    let onpoint=0;
    if(point) onpoint=1;
    let oninterp=0;
    if(interp) oninterp=1;

    let onrange=1;
    // if PAR means needs to get original min/max range
    if(MODAL_REPLOT_PAR) onrange=0;

    let onmin=document.getElementById("minPlotScaleTxt").value;
    let onmax=document.getElementById("maxPlotScaleTxt").value;
    let onpad=document.getElementById("plotPadTxt").value;
    let oncmap=document.getElementById("cmapTxt").value;
    let onpar=document.getElementById("plotParamTxt").value;

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            let responseText = this.responseText;
            var str=processSearchResult("replotCrossSection");
// needs to retrieve gmtresult blob, and update uid_state_blob 
            updateMetaReplotResultTable(str);

/* refresh the plot on the plotoption iframe */
             var srcloc=MODAL_REPLOT_SRC+"?"+new Date().getTime();
 window.console.log("srcloc",srcloc);
             $('#plotOptionIfram').attr('src',srcloc);

            document.getElementById('spinIconForArea').style.display = "none";
        }
    }

    xmlhttp.open("GET","php/replotCrossSection.php?onmap="+onmap+"&oncfm="+oncfm+"&onca="+onca+"&oncmap="+oncmap+"&onrange="+onrange+"&oninterp="+oninterp+"&onpoint="+onpoint+"&onmin="+onmin+"&onmax="+onmax+"&onpar="+onpar+"&onpad="+onpad+"&oncmap="+oncmap+"&fname="+fname+"&uid="+uid,true);
    xmlhttp.send();
}

// directly
function plotVerticalProfileByList(dataarray,idx,total) {
    if(idx >= total) { 
      document.getElementById('spinIconForListProperty').style.display = "none";
      return;
    }

    let item=dataarray[idx];
    var lonstr=item[0];
    var latstr=item[1];
    var zstartstr=item[2];
    var zendstr=item[3];
    var zstepstr=item[4];
    var datatypestr=item[5];
    var uid=item[6]; // could change to json blob            

    var zmodestr=document.getElementById("zModeType").value;
    var modelstr=document.getElementById("selectModelType").value;
    var zrangestr=_getZrange(modelstr);
    var floorstr=_getFloors(modelstr);
    var elt=document.getElementById("selectModelType");
    var commentstr = elt.options[elt.selectedIndex].innerHTML;

    var xmlhttp;
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
        } else {
        // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            var str=processSearchResult("plotVerticalProfile",uid);

            if (str != undefined) {
                var zstr=getZModeNameWithType(zmodestr);
                var mstr=getModelNameWithType(modelstr);
                var note="Vertical "+zstr+" Profile ("+datatypestr+") with "+mstr;
		add_bounding_profile(uid,latstr,lonstr);
                insertMetaPlotResultTable(note, uid,str);
                reset_profile_UID();
                } else { // failed to produce valid vertical profile plot, remove marker
                    remove_bounding_profile_layer(uid);
            }
            document.getElementById('spinIconForProfile').style.display = "none";
		
            // call next one
            plotVerticalProfileByList(dataarray,idx+1,total);
        }
    }
    xmlhttp.open("GET","php/plotVerticalProfile.php?lat="+latstr+"&lon="+lonstr+"&z="+zendstr+"&zmode="+zmodestr+"&model="+modelstr+"&comment="+commentstr+"&zrange="+zrangestr+"&floors="+floorstr+"&zstart="+zstartstr+"&zstep="+zstepstr+"&datatype="+datatypestr+"&uid="+uid,true);
    xmlhttp.send();
}

function plotVerticalProfile() {
    document.getElementById('spinIconForProfile').style.display = "block";
    var latstr=document.getElementById("profileFirstLatTxt").value;
    var lonstr=document.getElementById("profileFirstLonTxt").value;
    var zendstr=document.getElementById("profileZEndTxt").value;
    var zstartstr=document.getElementById("profileZStartTxt").value;
    var zstepstr=document.getElementById("profileZStepTxt").value;
    var datatypestr=document.getElementById("profileDataTypeTxt").value;
    var uid=document.getElementById("profileUIDTxt").value;

    if (latstr == "" || lonstr=="" || zendstr=="" || zstartstr=="" || zstepstr==""  || datatypestr=="") {
        document.getElementById('spinIconForProfile').style.display = "none";
        reset_profile_UID();
        return;
    }

    if(uid == '') {
      uid=getRnd("CVM");
      set_profile_UID(uid);
      add_bounding_profile(uid,latstr,lonstr);
      } else {
        reset_dirty_uid();
    }

    // setup a dataarray
    let v=[]
    v.push(lonstr); v.push(latstr); 
    v.push(zstartstr); v.push(zendstr); v.push(zstepstr); 
    v.push(datatypestr);v.push(uid);
    var dataarray=[];
    dataarray.push(v);
    plotVerticalProfileByList(dataarray,0,1);
}

function replotVerticalProfile() {
    document.getElementById('spinIconForArea').style.display = "block";
    let map=$('#plotoption-map').prop('checked');
    let cfm=$('#plotoption-cfm').prop('checked');
    let ca=$('#plotoption-ca').prop('checked');
    let point=$('#plotoption-point').prop('checked');

    // replace src .pdf with .csv and grab just filename
    let file=MODAL_REPLOT_SRC.replace("pdf","csv");
    let token=file.split('/');
    let fname=token[token.length - 1];
    // fname is CVM_id_X_data.pdf
    let ttoken=fname.split('_');
    let uid="CVM_"+ttoken[1];

    let onmap=0;
    if(map) onmap=1;
    let oncfm=0;
    if(cfm) oncfm=1;
    let onca=0;
    if(ca) onca=1;
    let onpoint=0;
    if(point) onpoint=1;

    let onmin=document.getElementById("minPlotScaleTxt").value;
    let onmax=document.getElementById("maxPlotScaleTxt").value;
    let onpad=document.getElementById("plotPadTxt").value;

    let onrange=1;
    if(MODAL_REPLOT_PAR == true) onrange=0;

    let onpar=document.getElementById("plotParamTxt").value;

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            let responseText = this.responseText;
            var str=processSearchResult("replotVerticalProfile");
// needs to retrieve gmtresult blob, and update uid_state_blob 
            updateMetaReplotResultTable(str);

/* refresh the plot on the plotoption iframe */
             var srcloc=MODAL_REPLOT_SRC+"?"+new Date().getTime();
 window.console.log("srcloc",srcloc);
             $('#plotOptionIfram').attr('src',srcloc);

            document.getElementById('spinIconForArea').style.display = "none";
        }
    }

    xmlhttp.open("GET","php/replotVerticalProfile.php?onmap="+onmap+"&oncfm="+oncfm+"&onca="+onca+"&onrange="+onrange+"&onpoint="+onpoint+"&onmin="+onmin+"&onmax="+onmax+"&onpad="+onpad+"&onpar="+onpar+"&fname="+fname+"&uid="+uid,true);
    xmlhttp.send();
}

function plotHorizontalSlice() {
    document.getElementById('spinIconForArea').style.display = "block";
    $("#modalwaiton").modal({ backdrop: 'static', keyboard: false });
    var xmlhttp;
    var firstlatstr=document.getElementById("areaFirstLatTxt").value;
    var firstlonstr=document.getElementById("areaFirstLonTxt").value;
    var zstr=document.getElementById("areaZTxt").value;
    var datatypestr=document.getElementById("areaDataTypeTxt").value;
    var zmodestr=document.getElementById("zModeType").value;
    var modelstr=document.getElementById("selectModelType").value;
    var zrangestr=_getZrange(modelstr);
    var floorstr=_getFloors(modelstr);
    var uid=document.getElementById("areaUIDTxt").value;

    var secondlatstr=document.getElementById("areaSecondLatTxt").value;
    var secondlonstr=document.getElementById("areaSecondLonTxt").value;

    if (firstlatstr == "" || firstlonstr=="" ||
              secondlatstr == "" || secondlonstr=="" ) {
        document.getElementById('spinIconForArea').style.display = "none";
	$("#modalwaiton").modal('hide');
        reset_area_UID();
        return;
    }

    if(uid == '') {
      uid=getRnd("CVM");
      set_area_UID(uid);
      add_bounding_area(uid,firstlatstr,firstlonstr,secondlatstr,secondlonstr);
      } else {    
        reset_dirty_uid();
    }

    // to catch when user input or alter the input coordinates
    // first set should always  be the south-west,
    // second set should always be the north-east
    var flat1=parseFloat(firstlatstr);
    var flon1=parseFloat(firstlonstr);
    var flat2=parseFloat(secondlatstr);
    var flon2=parseFloat(secondlonstr);
    [flat1,flon1,flat2,flon2]=fixAreaOrdering(flat1,flon1,flat2,flon2)

    // precalculate the spacing
    var dlon=flon2-flon1;
    var dlat=flat2-flat1;
    var ds= Math.sqrt((dlon * dlat) / 10000.0);
    var ds4=round2Four(ds);
    if(ds4 == 0) {
      ds4=0.001; 
    }

    var dchk= (dlat/ds4) * (dlon/ds4);

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            var str=processSearchResult("plotHorizontalSlice",uid);

            if (str != undefined) { 
                var zstr=getZModeNameWithType(zmodestr);
                var mstr=getModelNameWithType(modelstr);
                var note="Horizontal Slice("+datatypestr+") by "+zstr+" with "+mstr;
                insertMetaPlotResultTable(note,uid,str);
            }

            document.getElementById('spinIconForArea').style.display = "none";
	    $("#modalwaiton").modal('hide');
            reset_area_UID();
        }
    }
    xmlhttp.open("GET","php/plotHorizontalSlice.php?firstlat="+flat1+"&firstlon="+flon1+"&secondlat="+flat2+"&secondlon="+flon2+"&z="+zstr+"&zmode="+zmodestr+"&model="+modelstr+"&zrange="+zrangestr+"&floors="+floorstr+"&datatype="+datatypestr+"&uid="+uid+"&spacing="+ds4,true);
    xmlhttp.send();
}

function replotHorizontalSlice() {
    document.getElementById('spinIconForArea').style.display = "block";
    let cfm=$('#plotoption-cfm').prop('checked');
    let ca=$('#plotoption-ca').prop('checked');
    let point=$('#plotoption-point').prop('checked');
    let interp=$('#plotoption-interp').prop('checked');

    // replace src .pdf with .csv and grab just filename
    let file=MODAL_REPLOT_SRC.replace("pdf","csv");
    let token=file.split('/');
    let fname=token[token.length - 1];
    // fname is CVM_id_X_data.pdf
    let ttoken=fname.split('_');
    let uid="CVM_"+ttoken[1];

    let oncfm=0;
    if(cfm) oncfm=1;
    let onca=0;
    if(ca) onca=1;
    let onpoint=0;
    if(point) onpoint=1;
    let oninterp=0;
    if(interp) oninterp=1;

    let onrange=1;
    // if PAR means needs to get original min/max range
    if(MODAL_REPLOT_PAR) onrange=0;

    let onmin=document.getElementById("minPlotScaleTxt").value;
    let onmax=document.getElementById("maxPlotScaleTxt").value;
    let oncmap=document.getElementById("cmapTxt").value;
    let onpar=document.getElementById("plotParamTxt").value;

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            let responseText = this.responseText;
            var str=processSearchResult("replotHorizontalSlice");
window.console.log("??? str",str);
// needs to retrieve gmtresult blob, and update uid_state_blob 
            updateMetaReplotResultTable(str);

/* refresh the plot on the plotoption iframe */
             var srcloc=MODAL_REPLOT_SRC+"?"+new Date().getTime();
 window.console.log("srcloc",srcloc);
             $('#plotOptionIfram').attr('src',srcloc);

            document.getElementById('spinIconForArea').style.display = "none";
        }
    }

    xmlhttp.open("GET","php/replotHorizontalSlice.php?oncfm="+oncfm+"&onca="+onca+"&oncmap="+oncmap+"&onrange="+onrange+"&oninterp="+oninterp+"&onpoint="+onpoint+"&onmin="+onmin+"&onmax="+onmax+"&onpar="+onpar+"&fname="+fname+"&uid="+uid,true);
    xmlhttp.send();
}

function plotZ10Slice() {
    var xmlhttp;
    var firstlatstr=document.getElementById("areaFirstLatTxt").value;
    var firstlonstr=document.getElementById("areaFirstLonTxt").value;
    var modelstr=document.getElementById("selectModelType").value;
    var uid=document.getElementById("areaUIDTxt").value;
    var secondlatstr=document.getElementById("areaSecondLatTxt").value;
    var secondlonstr=document.getElementById("areaSecondLonTxt").value;

    if (firstlatstr == "" || firstlonstr=="" ||
              secondlatstr == "" || secondlonstr=="" ) {
        document.getElementById('spinIconForArea').style.display = "none";
        reset_area_UID();
        return;
    }

    if(uid == '') {
      uid=getRnd("CVM");
      set_area_UID(uid);
      add_bounding_area(uid,firstlatstr,firstlonstr,secondlatstr,secondlonstr);
      } else {    
        reset_dirty_uid();
    }

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            var str=processSearchResult("plotZ10Slice",uid);

            if (str != undefined) { 
                var zstr=getZModeNameWithType(zmodestr);
                var mstr=getModelNameWithType(modelstr);
                var note="Z10 Slice with "+mstr;
                insertMetaPlotResultTable(note,uid,str);
            }

            document.getElementById('spinIconForArea').style.display = "none";
            reset_area_UID();
        }
    }
    xmlhttp.open("GET","php/plotZ10Slice.php?firstlat="+firstlatstr+"&firstlon="+firstlonstr+"&secondlat="+secondlatstr+"&secondlon="+secondlonstr+"&model="+modelstr+"&uid="+uid,true);
    xmlhttp.send();
}


function plotZ25Slice() {
    var xmlhttp;
    var firstlatstr=document.getElementById("areaFirstLatTxt").value;
    var firstlonstr=document.getElementById("areaFirstLonTxt").value;
    var modelstr=document.getElementById("selectModelType").value;
    var uid=document.getElementById("areaUIDTxt").value;
    var secondlatstr=document.getElementById("areaSecondLatTxt").value;
    var secondlonstr=document.getElementById("areaSecondLonTxt").value;

    if (firstlatstr == "" || firstlonstr=="" ||
              secondlatstr == "" || secondlonstr=="" ) {
        document.getElementById('spinIconForArea').style.display = "none";
        reset_area_UID();
        return;
    }

    if(uid == '') {
      uid=getRnd("CVM");
      set_area_UID(uid);
      add_bounding_area(uid,firstlatstr,firstlonstr,secondlatstr,secondlonstr);
      } else {    
        reset_dirty_uid();
    }

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            var str=processSearchResult("plotZ25Slice",uid);

            if (str != undefined) { 
                var zstr=getZModeNameWithType(zmodestr);
                var mstr=getModelNameWithType(modelstr);
                var note="Z25 Slice with "+mstr;
                insertMetaPlotResultTable(note,uid,str);
            }

            document.getElementById('spinIconForArea').style.display = "none";
            reset_area_UID();
        }
    }
    xmlhttp.open("GET","php/plotZ25Slice.php?firstlat="+firstlatstr+"&firstlon="+firstlonstr+"&secondlat="+secondlatstr+"&secondlon="+secondlonstr+"&model="+modelstr+"&uid="+uid,true);
    xmlhttp.send();
}
