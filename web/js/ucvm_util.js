/***
   ucvm_util.js

***/

// remove an item from a list base on its matching 'uid'
function removeFromList(alist, uid) {
    var cnt=alist.length;
    var item;
    for(var i=0;i<cnt;i++) {
       item=alist[i];
       if(item['uid']==uid) { // found the item to remove
           var index = alist.indexOf(item);
           if (index > -1) {
             alist.splice(index, 1);
             return item;
           }
           return undefined; 
       }
    }
    return undefined;
}

//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
//    var rnd= Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

function getRnd(stub) {
//https://stackoverflow.com/questions/221294/how-do-you-get-a-timestamp-in-javascript
    let timestamp = $.now();
// timestamp is 13 digits, chop to tail end to 8 digits 
    let tt=timestamp % 100000000;
    if(stub == "" || stub == undefined) { 
      return tt;
      } else {	     
        return stub+"_"+tt;
    }
}

// [[lon1,lat1,z1],...,[lonn,latn,zn]]
// make sure it is unique
function makeLatlngs(darray) {
   var cnt=darray.length;
   var latlngs=[];
   for(var i=0;i<cnt;i++) {
      var item=darray[i];
      var lon=item[0];
      var lat=item[1];
      var z=item[2];
      var nitem= {"lat":lat,"lon":lon}
      if(latlngs.indexOf(nitem) == -1) {
        latlngs.push(nitem);
      }
   }
   return latlngs;
}

/*
   first latlon has to be sw side 
   second latlons is the ne side of the rectangle
*/
// [flat, flon, slat, slon ]=fixOrdering(firstlat, firstlon, secondlat, secondlon) 
function fixAreaOrdering(firstlat, firstlon, secondlat, secondlon) {
    var minlon = firstlon;
    var maxlon = secondlon;
    if(firstlon > secondlon) {
        minlon = secondlon;
        maxlon = firstlon;
    }

    var minlat = firstlat;
    var maxlat = secondlat;
    if( firstlat >  secondlat) {
        minlat = secondlat;
        maxlat = firstlat;
    }
    return [minlat, minlon, maxlat, maxlon];
}

/*
XXX ??? might need something so that backend would work 
plot tool can not do a complete horizontal line ???
*/
function fixLineOrdering(firstlat, firstlon, secondlat, secondlon) {

    return firstAreaOrdering(firstlat, firstlon, secondlat, secondlon);
}

function processSearchResult(rlist,uid=0) {
    if (rlist == 'plotHorizontalSlice') {
        dstr = '[data-side=\"'+"horizontalSlice"+uid+'\"]';
        str = $(dstr).data('params');
    }
    if (rlist == 'plotVerticalProfile') {
        dstr = '[data-side=\"'+"verticalProfile"+uid+'\"]';
        str = $(dstr).data('params');
    }
    if (rlist == 'plotCrossSection') {
        dstr = '[data-side=\"'+"crossSection"+uid+'\"]';
        str = $(dstr).data('params');
    }
    if (rlist == 'getMaterialPropertyByLatlon') {
        dstr = '[data-side=\"'+"materialPropertyByLatlon"+uid+'\"]';
        str = $(dstr).data('params');
    }
    if (rlist == 'getMaterialPropertyByLatlonChunk') {
        dstr = '[data-side=\"'+"materialPropertyByLatlonChunk"+uid+'\"]';
        str = $(dstr).data('params');
    }
    if (rlist == 'getMaterialPropertyByLatlonList') {
        dstr = '[data-side=\"'+"materialPropertyByLatlonList"+uid+'\"]';
        str = $(dstr).data('params');
    }

    if (rlist == 'getInstallModelList') {
        dstr = '[data-side=\"'+"installModelList"+'\"]';
        str = $(dstr).data('params');
    }

    if (rlist == undefined) {
       window.console.log("processSearchResult: BAD BAD BAD");
       return (undefined);
    }
    return (str);
}


// should be a very small file and used for testing and so can ignore
// >>Synchronous XMLHttpRequest on the main thread is deprecated
// >>because of its detrimental effects to the end user's experience.
function ckExist(url) {
  var http = new XMLHttpRequest();
  http.onreadystatechange = function () {
    if (this.readyState == 4) {
 // okay
    }
  }
  http.open("GET", url, false);
  http.send();
  if(http.status !== 404) {
    return http.responseText;
    } else {
      return null;
  }
}

function makeVProfileMetaFname(uid) {
  var s=uid+"_v_meta.json";
  return s;
}

function makeVProfileMPFname(uid) {
  var s=uid+"_v_matprops.json";
  return s;
}

function makeVProfileCSVFname(uid) {
  var s=uid+"_v_data.csv";
  return s;
}
//
// allow multiple bin files from ucvmc's plotting utilities
// example
//       BC_cvms5_gate_vs.svg or BC_cvms5_gate_vs.png	
//       BC_cvms5_gate_vs_meta.json
//       BC_cvms5_gate_vs_data.bin
//
function loadAndProcessBinfromFile(urls) {
  var nlist=[];
  var cnt=urls.length;

  for(var urlidx=0; urlidx < cnt; urlidx++ ) {
      var url=urls[urlidx]; 
//      var metaurl=makeMetaFname(url);
      var metaurl="BC_cvms5_gate_vs_meta.json";
      var metablob=ckExist(metaurl);

      var meta=JSON.parse(metablob);
      var lat1=parseFloat(meta['bottom-left lat']);
      var lon1=parseFloat(meta['bottom-left lon']);
      var lat2=parseFloat(meta['upper-right lat']);
      var lon2=parseFloat(meta['upper-right lon']);
      var step=parseFloat(meta['spacing']);
      var cvm=meta['cvm_selected'];
      var title = " TEST"+cvm+" ("+lat1.toFixed(2)+","+lon1.toFixed(2)+" to "+lat2.toFixed(2)+","+lon2.toFixed(2)+")"
      var xmax=parseInt(meta['nx'])
      var ymax=parseInt(meta['ny'])
      var datamax=xmax * ymax 

      var x_data = meta['lon_list']
      var y_data = meta['lat_list']


      var mRequest2 = new XMLHttpRequest();
      mRequest2.open('GET', url);

      mRequest2.responseType = 'arraybuffer';

      mRequest2.onreadystatechange = function () {
      if (mRequest2.readyState === 4) {

        // Get bytes
        var buffer = mRequest2.response;
        var dataview = new DataView(buffer);

        // Create buffer (4 bytes / float)
        var mFloatArray = new Float32Array(buffer.byteLength / 4);

        // Copy floats
        for (var i = 0; i < mFloatArray.length; i++) 
        {
            mFloatArray[i] = dataview.getFloat32(i * 4, true); // At every 4th byte
        }

        console.log("Loaded "+mFloatArray.length+" floats");

        var z_data=[]
        var row=[]
        for(var idx=0;idx<datamax;idx++)
        {
          var f=mFloatArray[idx]
          if(f < 0) {
//window.console.log("less than 0");
             row.push(NaN)
          } else  {
             row.push(-1 * f)
          }
          if((idx+1) % xmax == 0) { // every set
             z_data.push(row)
             row=[]
          }
        }

// 100x100
       var data = [{
           x:x_data,
           y:y_data,
           z:z_data,
           type:'surface',
           "reversescale": true,
           colorscale : 'Viridis'
        }];
  
        var layout = {
          title: title,
          width: plotWidth,
          height: plotHeight,
          scene: {
            aspectratio : { x:1.0, y:1.0, z:0.02 },
          },
          margin: {
            l: 5,
            r: 5,
            b: 20,
            t: 80,
          }
        };

        Plotly.newPlot('myDiv', data, layout);
      }
    }

    mRequest2.send();
  }
}


var CHUNK_SIZE=100;

//https://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects-by-property
/* sorting json blobs
var homes = [
   {"h_id":"3","city":"Dallas","state":"TX","zip":"75201","price":"162500"},
   {"h_id":"4","city":"Bevery Hills","state":"CA","zip":"90210","price":"319250"}]
-- Sort by price high to low
homes.sort(sort_by('price', true, parseInt));
-- Sort by city, case-insensitive, A-Z
homes.sort(sort_by('city', false, function(a){return a.toUpperCase()}));
*/
var sort_by=function(field, reverse, primer){

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}

//
// Reading files using the HTML5 FileReader.
//
function readAndProcessLocalFile(fobj,forPoint) {
  if(forPoint==1) {
    readAndProcessLocalFileForPoint(fobj);
    } else {
      readAndProcessLocalFileForProfile(fobj);
  }
}

function readAndProcessLocalFileForPoint(fobj) {

  var reader = new FileReader();

  reader.onload=function(event) {
    var csv = event.target.result; 
    var ffline = reader.result.split('\n');
    var cnt=ffline.length;
    var fdata=[];
    if(cnt == 0) { 
      window.console.log("ERROR, can not process the upload file ");
      return;
    }
    for(i=0;i<cnt;i++) {
      var fline=ffline[i];
      if(fline[0]=='#')
        continue;
        
      if(fline.includes(",")) { 
        $.csv.toArray(fline, {}, function(err, data) {
           var v=[];
           if( data != "" && data.length >= 3 ) {
             v.push(data[0]);
             v.push(data[1]);
             v.push(data[2]);
             fdata.push(v);
           }
        }); 
        } else {
// space separated format 
           var data=fline.split(' ');
           var v=[]; 
           if( data != "" && data.length >= 3 ) {
             v.push(data[0]);
             v.push(data[1]);
             v.push(data[2]);
             fdata.push(v);
           }
      }
    }

    var cnt=fdata.length;
    var chunk_size=CHUNK_SIZE;
    var chunks=Math.ceil(cnt/chunk_size);
    if(chunks == 1)
       chunk_size=cnt;

    var uid=getRnd("UCVM");
     
    add_file_of_point(uid,fobj);
    getMaterialPropertyByLatlonList(uid,fdata,0, chunks, chunk_size);

  };
  reader.readAsText(fobj);
  
}

function readAndProcessLocalFileForProfile(fobj) {

  var reader = new FileReader();

  reader.onload=function(event) {
    var csv = event.target.result; 
    var ffline = reader.result.split('\n');
    var cnt=ffline.length;
    var fdata=[];
    if(cnt == 0) { 
      window.console.log("ERROR, can not process the upload file ");
      return;
    }

    for(i=0;i<cnt;i++) {
      var fline=ffline[i];
      if(fline[0] == '#')
        continue; 	     
      if(fline.includes(",")) { 
        $.csv.toArray(fline, {}, function(err, data) {
           var v=data;
           if(v != "" && v.length >= 5) {
             fdata.push(v);
           }
        }); 
        } else {
// space separated format 
          var v=fline.split(' ');
          if(v != "" && v.length >= 5) {
            fdata.push(v);
          }
      }
    }

    for(let i=0; i< fdata.length; i++) {
       let item=fdata[i];
       let stub=item[5];
       let uid=getRnd(stub); // rewrite the stub
       fdata[i][5]=uid;
    }
    plotVerticalProfileByList(fdata,0,fdata.length);

  };
  reader.readAsText(fobj);
}

function refreshMPTable() {
    var table=document.getElementById("materialPropertyTable");
    table.innerHTML="<tbody><tr id=\"placeholder-row\"><td colspan=\"12\">Material Property for selected locations will appear here. </td></tr></tbody>";
    hold_mptable=1;
    clear_materialproperty();
}

function refreshResultTable() {
    var table=document.getElementById("metadataPlotTable");
    table.innerHTML="<tbody><tr id=\"placeholder-row\"><td colspan=\"12\">Result, Plot and Metadata will appear here. </td></tr></tbody>";
}

function refreshAll() {
  reset_markAreaLatlon();
  reset_markPointLatlon();
  reset_markLineLatlon();
  reset_markProfileLatlon();

  document.getElementById("search-type").value = "freezeClick";
  document.getElementById("phpResponseTxt").innerHTML = "";

  refreshMPTable();
  refreshResultTable();
  remove_all_layers();
  refresh_map();
  refresh_sidebar();
}

// https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary

function round2Four(val) {
  var ep;
  if (Number.EPSILON === undefined) {
    ep= Math.pow(2, -52);
    } else {
      ep=Number.EPSILON;
  }

  var ret=Math.round( ( val + Number.EPSILON ) * 10000 ) / 10000;
  return ret;
}
