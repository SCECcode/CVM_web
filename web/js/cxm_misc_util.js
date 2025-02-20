/**
    cxm_misc_util.c

contains utilities used by cxm based functions

**/

// utils for progress bar  - MyProgressBar
function updatePrograssBar(width) {
  var element = document.getElementById("myProgressBar");
  element.style.width = width + '%';
//  element.innerHTML = width * 1  + '%';
  let elm = $("#waiton-progress");
  var n= width * 1  + '%';
  elm.val(n);
// window.console.log("Progress bar: update to ", n);
}

var waiton_counter_cnt;
// setup waiton-expected and init waiton-total
// {"total":1000}
function startWaitonCounter(blob) {
  let elm = $("#waiton-expected");
  elm.val(parseInt(blob['total']));
  elm = $("#waiton-total");
  elm.val(0);
  eq_counter_cnt=0;
  $("#modalwaiton").modal({ backdrop: 'static', keyboard: false });
}
function doneWaitonCounter() {
  $("#modalwaiton").modal('hide');
}

function add2WaitonCounter(v) {
  waiton_counter_cnt++;
  let elm = $("#waiton-total");
  let o=parseInt(elm.val());
  let n=o+v;
  elm.val(n);
  let maxelm  = $("#waiton-expected");
  let max = parseInt(maxelm.val());
  var width = Math.floor((n/max) * 100);
  updatePrograssBar(width);
}

/**************************************************************/
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

//"latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]
function sameLatlngs(first, second) {
   let lat1_f=first[0].lat; let lon1_f=first[0].lon;
   let lat2_f=first[1].lat; let lon2_f=first[1].lon;
   let lat1_s=second[0].lat; let lon1_s=second[0].lon;
   let lat2_s=second[1].lat; let lon2_s=second[1].lon;

   if( (lat1_f == lat1_s) && (lat2_f == lat2_s) && 
          (lon1_f == lon1_s) && (lon2_f == lon2_s) ) {
     return 1;
   }
   return 0;
}

// pop up the notify model with a timeout
function notify(msg) {
  let html=document.getElementById('notify-container');
  html.innerHTML=msg;
  $('#modalnotify').modal('show');
  setTimeout(function() {$('#modalnotify').modal('hide')}, 2000);
}


function calculateDistanceMeter(start_latlng, end_latlng) {
    let start_lat = start_latlng.lat;
    let start_lng = start_latlng.lng;
    let end_lat = end_latlng.lat;
    let end_lng = end_latlng.lng;

    // from http://www.movable-type.co.uk/scripts/latlong.html
    const R = 6371e3; // metres
    const theta1 = start_lat * Math.PI/180; // φ, λ in radians
    const theta2 = end_lat * Math.PI/180;
    const deltaTheta = (end_lat-start_lat) * Math.PI/180;
    const deltaLamda = (end_lng-start_lng) * Math.PI/180;

    const a = Math.sin(deltaTheta/2) * Math.sin(deltaTheta/2) +
                   Math.cos(theta1) * Math.cos(theta2) *
                   Math.sin(deltaLamda/2) * Math.sin(deltaLamda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // in metres
    return d;
}

function truncateNumber(num, digits) {
    let numstr = num.toString();
    if (numstr.indexOf('.') > -1) {
        return numstr.substr(0 , numstr.indexOf('.') + digits+1 );
    } else {
        return numstr;
    }
}

function isObject(objV) {
  return objV && typeof objV === 'object' && objV.constructor === Object;
}

//  dict={}.  dict={"key1":val1}
function isEmptyDictionary(dicV) {
  return Object.keys(dicV).length === 0;
}

// color from blue to red
//                     red, green, blue
// Orig: red to blue (255,0,0) -> (0,0,255)
// new :  (R1,G1,B1) -> (R2,G2,B2)

function makeRGB(val, maxV, minV) {
    // blue
    let R2=0;
    let G2=110;
    let B2=144;
    // light orange
    let R1=255;
    let G1=80;
    let B1=26;

    let v= (val-minV) / (maxV-minV);
    let red = Math.round(R1+ (v * (R2-R1)));
    let green = Math.round(G1+ (v * (G2-G1)));
    let blue = Math.round(B1+ (v * (B2-B1)));
    let color="RGB(" + red + "," + green + "," + blue + ")";
    return color;
}


function getRnd(stub="") {
//https://stackoverflow.com/questions/221294/how-do-you-get-a-timestamp-in-javascript
    let timestamp = $.now();
    let rnd;
    if(stub == "") { 
      rnd=timestamp;
      } else {
        rnd=stub+"_"+timestamp;
    }
    return rnd;
}

// should be a very small file and used for testing and so can ignore
// >>Synchronous XMLHttpRequest on the main thread is deprecated
// >>because of its detrimental effects to the end user's experience.
//     url=http://localhost/data/synapse/segments-dummy.csv
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

// return true if target is in the glist
// glist=[]
// target any item
function inList(target, glist) {
   var found=0;
   if(glist.length == 0)
     return found;

   glist.forEach(function(element) {
     if ( element == target )
        found=1;
   });
   return found;
}


/***************************************
  not sure where this is used (from cgm_util.js)

  function MapFeature(gid, properties, geometry, scec_properties) {
    this.type = "FeatureCollection";
    this.gid = gid;
    this.features =[{
        type: "Feature",
        id: gid,
        properties: properties,
        geometry: geometry,
    }];
    this.layer = null;
    this.scec_properties = scec_properties;
  }
****************************************/


function updateDownloadCounter(select_count) {
    let downloadCounterElem = $("#download-counter");
    let downloadBtnElem = $("#download-all");
    if (select_count <= 0) {
        downloadCounterElem.hide();
        downloadBtnElem.prop("disabled", true);
    } else {
       downloadCounterElem.show();
       downloadBtnElem.prop("disabled", false);
    }
    downloadCounterElem.html("(" + select_count + ")");
}


/***
   Metadata table at the bottom
***/

// https://www.w3schools.com/howto/howto_js_sort_table.asp
// n is which column to sort-by
// type is "a"=alpha "n"=numerical
function sortMetadataTableByRow(n,type) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("metadata-table");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc"; 

//window.console.log("Calling sortMetadataTableByRow..",n);

  while (switching) {
    switching = false;
    rows = table.rows;
    if(rows.length < 3) // no switching
      return;

/* loop through except first and last */
    for (i = 1; i < (rows.length - 2); i++) {
      shouldSwitch = false;

      x = rows[i].getElementsByTagName("td")[n];
      y = rows[i + 1].getElementsByTagName("td")[n];

      if (dir == "asc") {
        if(type == "a") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
          } else {
            if (Number(x.innerHTML) > Number(y.innerHTML)) {
              shouldSwitch = true;
              break;
            }
         }
      } else if (dir == "desc") {
        if(type == "a") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
          } else {
            if (Number(x.innerHTML) < Number(y.innerHTML)) {
              shouldSwitch = true;
              break;
            }
        }
      }
    }
    if (shouldSwitch) {
//window.console.log("need switching..");
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++; 
    } else {

//window.console.log("done switching..");
      if(switchcount != 0) {

      }

      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
  var id="#sortCol_"+n;
  var t=$(id);
  if(dir == 'asc') {
    t.removeClass("fa-angle-down").addClass("fa-angle-up");
    } else {
      t.removeClass("fa-angle-up").addClass("fa-angle-down");
  }
}


/************************************************************************************/
function saveAsJSONBlobFile(fstub, data, timestamp)
{
//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
//   var rnd= Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    var fname=fstub+timestamp+".json";
    var blob = new Blob([data], {
        type: "text/plain;charset=utf-8"
    });
    //FileSaver.js
    saveAs(blob, fname);
}

function saveAsCSVBlobFile(fstub, data, timestamp)
{
//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
//   var rnd= Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    var fname=fstub+timestamp+".csv";
    var blob = new Blob([data], {
        type: "text/plain;charset=utf-8"
    });
    //FileSaver.js
    saveAs(blob, fname);
//window.console.log("saving csv file", fname);
}

function saveAsBlobFile(fstub,data)
{
    let timestamp = $.now();
    let fname=fstub+timestamp+".txt";
    let blob = new Blob([data], {
        type: "text/plain;charset=utf-8"
    });
    //FileSaver.js
    saveAs(blob, fname);
}

function saveAsURLFile(url) {
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
