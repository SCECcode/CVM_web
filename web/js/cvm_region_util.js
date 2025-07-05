/****

  cvm_region_util.js

****/

// information on model 
var CVM_installed=[];

// str is a blob { 'models': ['cvmh','cvms5'] }
function makeInstallModelList(str) {
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
  var mlist=blob['models'];
  var cnt=mlist.length;
  var i;
  for(i=0;i<cnt;i++) {
    var item=mlist[i];
    CVM_installed.push(item);
  }

  setup_modeltype();
}

function isModelInstalled(pname) {
  var cnt=CVM_installed.length;
  var i=0;
  for(i=0; i<cnt;i++) {
     if(CVM_installed[i]==pname) {
        return 1;
     }
  }
  return 0;
}

function makeModelSelection() {
   var tb=CVM_tb['models'];
   var cnt=tb.length;
   var i;
   var option;
   var all_model_list=[];
   for(i=0; i<cnt; i++) {
     var item=tb[i];
     var color=item['color'];
     var aname=item['abb name'];
     var mname=item['name'];
     var pname=item['path name'];
     // check the model directory to make sure it exists before adding 
     // the option
     if(isModelInstalled(pname)) {
        var sel=document.getElementById('selectModelType');
        option = document.createElement("option");
        option.text = mname;
        option.label = mname;
        option.value= aname;
        sel.add(option);
        all_model_list.push(aname);
     }
   } 
   // special case
   var sel=document.getElementById('selectModelType');
   option = document.createElement("option");
   option.text = "-- Tiled Models --";
   option.setAttribute("disabled", true);
   option.value= "disabled";
   sel.add(option);

   if(isModelInstalled("cvmh") && isModelInstalled("cs248")) {
   option = document.createElement("option");
   option.text = "CS 248,CVM-H v15.1.1";
   option.label = "CS 248,CVM-H v15.1.1";
   option.value= "cs248,cvmh";
   sel.add(option);
   }

   if(isModelInstalled("cvmhlabn") && isModelInstalled("cvmsi")) {
   option = document.createElement("option");
   option.text = "CVM-H LA Basin,CVM-S4.26M01";
   option.label = "CVM-H LA Basin,CVM-S4.26M01";
   option.value= "cvmhlabn,cvmsi";
   sel.add(option);
   }

   if(isModelInstalled("cvms5") && isModelInstalled("cca")) {
   option = document.createElement("option");
   option.text = "CCA,CVM-S4.26,elygtl:ely";
   option.label = "CCA,CVM-S4.26,elygtl:ely";
   option.value= "cca,cvms5,elygtl:ely";
   sel.add(option);
   }

   if(isModelInstalled("cvmsi")) {
   option = document.createElement("option");
   option.text = "CVM-S4.26M01,elygtl:taper";
   option.label = "CVM-S4.26M01,elygtl:taper";
   option.value= "cvmsi,elygtl:taper";
   sel.add(option);
   }

   if(isModelInstalled("cvmsi")) {
   option = document.createElement("option");
   option.text = "CVM-S4.26M01,elygtl:ely";
   option.label = "CVM-S4.26M01,elygtl:ely";
   option.value= "cvmsi,elygtl:ely";
   sel.add(option);
   }

/***
   if(isModelInstalled("1d")) {
     option = document.createElement("option");
     option.text = "1D";
     option.label = "1D";
     option.value= "1d"; 
     sel.add(option);
   }

   if(isModelInstalled("1d")) {
     option = document.createElement("option");
     option.text = "BBP1D";
     option.text = "BBP1D";
     option.label = "BBP1D";
     option.value= "bbp1d"; 
     sel.add(option);
   }

   if(isModelInstalled("cvmhlabn") && isModelInstalled("cvmhsgbn"),
      isModelInstalled("cvmhvbn") && isModelInstalled("cvmhrbn"),
      isModelInstalled("cvmhibbn") && isModelInstalled("cvmhsmbn"),
      isModelInstalled("cvmhsbbn") && isModelInstalled("cvmhsbcbn"),
      isModelInstalled("cvmhstbn") && isModelInstalled("cvmsi")) {
        option = document.createElement("option");
        option.text = "CVM-H All Basins, CVM-S4.26.M01";
        option.value= "cvmhlabn,cvmhsgbn,cvmhvbn,cvmhrbn,cvmhibbn,cvmhsmbn,cvmhsbbn,cvmhsbcbn,cvmhstbn,cvmsi";
        sel.add(option);
   }

   if(isModelInstalled("sfcvm") && isModelInstalled("cca")) {
     option = document.createElement("option");
     option.text = "SFCVM,CCA";
     option.label = "SFCVM,CCA";
     option.value= "sfcvm,cca"; 
     sel.add(option);
   }

   if(isModelInstalled("sfcvm") && isModelInstalled("1d")) {
     option = document.createElement("option");
     option.text = "SFCVM,1D";
     option.label = "SFCVM,1D";
     option.value= "sfcvm,1d"; 
     sel.add(option);
   }

   if(isModelInstalled("sfcvm") && isModelInstalled("cca") && isModelInstalled("1d")) {
     option = document.createElement("option");
     option.text = "SFCVM,CCA,1D";
     option.label = "SFCVM,CCA,1D";
     option.value= "sfcvm,cca,1d";
     sel.add(option);
   }

// nc1d is with 1d
   if(isModelInstalled("sfcvm") && isModelInstalled("cca") && isModelInstalled("1d")) {
     option = document.createElement("option");
     option.text = "SFCVM,CCA,SF1D";
     option.label = "SFCVM,CCA,SF1D";
     option.value= "sfcvm,cca,sf1d";
     sel.add(option);
   }


// bbp1d is with 1d
   if(isModelInstalled("sfcvm") && isModelInstalled("cca") && isModelInstalled("1d")) {
     option = document.createElement("option");
     option.text = "SFCVM,CCA,BBP1D";
     option.label = "SFCVM,CCA,BBP1D";
     option.value= "sfcvm,cca,bbp1d";
     sel.add(option);
   }


   if(isModelInstalled("sjfz") && isModelInstalled("1d")) {
     option = document.createElement("option");
     option.text = "SJFZ,1D";
     option.label = "SJFZ,1D";
     option.value= "sjfz,1d"; 
     sel.add(option);
   }

   if(isModelInstalled("cvmhlabn") && isModelInstalled("cvmhsgbn") &&
      isModelInstalled("cvmhvbn") && isModelInstalled("cvmhrbn") &&
      isModelInstalled("cvmhibbn") && isModelInstalled("cvmhsmbn") &&
      isModelInstalled("cvmhsbbn") && isModelInstalled("cvmhsbcbn") &&
      isModelInstalled("cvmhstbn") && isModelInstalled("canvas")) {
        option = document.createElement("option");
        option.text = "CVM-H All Basins,CANVAS";
        option.label = "CVM-H All Basins,CANVAS";
        option.value= "cvmhlabn,cvmhsgbn,cvmhvbn,cvmhrbn,cvmhibbn,cvmhsmbn,cvmhsbbn,cvmhsbcbn,cvmhstbn,canvas";
        sel.add(option);
   }

        option.value= "cvmhlabn,cvmhsgbn,cvmhvbn,cvmhrbn,cvmhibbn,cvmhsmbn,cvmhsbbn,cvmhsbcbn,cvmhstbn,cvmsi";
        sel.add(option);
   }
***/

   if(isModelInstalled("cvmhlabn") 
	   && isModelInstalled("cvmhsmbn")
	   && isModelInstalled("cvms5") ) {
      option = document.createElement("option");
      option.text = "CVM-H LA Basin,CVM-H Santa Maria Basin,CVM-S4.26";
      option.label = "CVM-H LA Basin,CVM-H Santa Maria Basin,CVM-S4.26";
      option.value= "cvmhlabn,cvmhsmbn,cvms5";
      sel.add(option);
   }

  if(isModelInstalled("sfcvm") && isModelInstalled("cca")) {
   option = document.createElement("option");
   option.text = "SFCVM,CCA,SF1D";
   option.label = "SFCVM,CCA,SF1D";
   option.value= "sfcvm,cca,sf1d";
   sel.add(option);
   }

   // All of them
  if(all_model_list.length != 0) {
   option = document.createElement("option");
   option.text = "All models";
   option.label = "All models";
   option.value= all_model_list.toString();
   sel.add(option);
   }

}

// target_nm is abb_name
function getModelIndex(nm) {
   let target=nm.trim();
   var tb=CVM_tb['models'];
   var icnt=tb.length;
   var i;
   for(i=0; i<icnt; i++) {
     var item=tb[i];
     if(item['abb name'] == target) {
        return i;
     }
  }
  return -1;
}

// using id in CVM_tb
function getModelDescriptionById(id) {
   let tb=CVM_tb['models'];
   let item=tb[id];
   var descript=item['description'];
   return descript;
}

function getModelDescriptionBriefById(id) {
   let tb=CVM_tb['models'];
   let item=tb[id];

   let tmp=item['description_brief'];
   if('description_brief' in item) { 
       return item['description_brief'];
   } else return null;
}

function getModelNameById(id) {
   let tb=CVM_tb['models'];
   let item=tb[id];
   var name=item['name'];
   return name;
}
function getModelAbbNameById(id) {
   let tb=CVM_tb['models'];
   let item=tb[id];
   var name=item['abb name'];
   return name;
}

// nm = 'abb name'
// return unique index list into references array
function getReferenceIndex(nm, olist,alist,rlist) {
   let target=nm.trim();
   let mlist=CVM_tb['references'];
   let foo=mlist[0];
   let mcnt=mlist.length;
   for(let i=0; i<mcnt; i++) {
      let fitem=mlist[i];
      let nlist=fitem['name'];
      let ncnt=nlist.length;
      for(let j=0; j<ncnt; j++) {
        if(nlist[j] == target) {
          if(olist.includes(i)) {
//            window.console.log("duplicate found..",i);
            } else {
             
              if( 'author' in fitem ) {
                olist.push(i);
                alist.push(fitem['author']);
                rlist.push(fitem['ref']);
              }
          }
        }
      }
   }
}

function getReferenceByList(reflist,alist,rlist) {
   let mlist=CVM_tb['references'];
   let cnt=reflist.length;
   for(let i=0; i<cnt; i++) {
      let item=mlist[i];
      if('author' in item) {
        alist.push(item['author']);
        rlist.push(item['ref']);
      }
   }
   return alist,rlist;
}

function getInterpolatorIndex(nm) {
   let target=nm.trim()
   var tb=CVM_tb['interpolator'];
   var icnt=tb.length;
   var i;
   for(i=0; i<icnt; i++) {
     var item=tb[i];
     if(item['abb name'] == target) {
        return i;
     }
  }
  return -1;
}

function getInterpolatorDescriptionById(id) {
   let tb=CVM_tb['interpolator'];
   let item=tb[id];
   var descript=item['description'];
   return descript;
}

function getInterpolatorNameById(id) {
   let tb=CVM_tb['interpolator'];
   let item=tb[id];
   var name=item['name'];
   return name;
}

function getInterpolatorAbbNameById(id) {
   let tb=CVM_tb['interpolator'];
   let item=tb[id];
   var name=item['abb name'];
   return name;
}

function getInterpolatorReferenceById(id) {
   let tb=CVM_tb['interpolator'];
   let item=tb[id];
   if ('references' in item ) {
     return item['references'];
   } 
   return undefined;
}

function getInterpolatorAuthorById(id) {
   let tb=CVM_tb['interpolator'];
   let item=tb[id];
   if ('authors' in item ) {
     return item['authors'];
   } 
   return undefined;
}

function getInterpolatorAuthorById(id) {
   let tb=CVM_tb['interpolator'];
   let item=tb[id];
   if ('authors' in item ) {
     return item['authors'];
   } 
   return undefined;
}


function get1DModelIndex(nm) {
   let target=nm.trim();
   var tb=CVM_tb['1D model'];
   var icnt=tb.length;
   var i;
   for(i=0; i<icnt; i++) {
     var item=tb[i];
     if(item['abb name'] == target) {
        return i;
     }
  }
  return -1;
}

function get1DModelDescriptionById(id) {
   let tb=CVM_tb['1D model'];
   let item=tb[id];
   var descript=item['description'];
   return descript;
}

function get1DModelNameById(id) {
   let tb=CVM_tb['1D model'];
   let item=tb[id];
   var name=item['name'];
   return name;
}

function get1DModelAbbNameById(id) {
   let tb=CVM_tb['1D model'];
   let item=tb[id];
   var name=item['abb name'];
   return name;
}

function get1DModelReferenceById(id) {
   let tb=CVM_tb['1D model'];
   let item=tb[id];
   if ('references' in item ) {
     return item['references'];
   } 
   return undefined;
}

function get1DModelAuthorById(id) {
   let tb=CVM_tb['1D model'];
   let item=tb[id];
   if ('authors' in item ) {
     return item['authors'];
   } 
   return undefined;
}

function get1DModelAuthorById(id) {
   let tb=CVM_tb['1D model'];
   let item=tb[id];
   if ('authors' in item ) {
     return item['authors'];
   } 
   return undefined;
}



function getModelColor(nm) {
// this is an optional field, vs30/topo etree map
   let target=nm.trim();
   var tb=CVM_tb['models'];
   var icnt=tb.length;
   var i;
   for(i=0; i<icnt; i++) {
     var item=tb[i];
     if(item['abb name'] == target) {
        var color=item['color'];
        return color;
     }
  }
  return "black";
}

// this is an optional field, vs30/topo etree map
function getModelMap(nm) {
   let target=nm.trim();
   var tb=CVM_tb['models'];
   var icnt=tb.length;
   var i;
   for(i=0; i<icnt; i++) {
     var item=tb[i];
     if(item['abb name'] == target) {
        if(item.has('map')) {
           return item['map'];
        }
     }
  }
  return NULL;
}

function makeLatlngsCoordinate(nm) {
   let target=nm.trim();
   var ret=[];
   var tb=CVM_tb['models'];
   var icnt=tb.length;
   var lon, lat;
   var i,j;
   for(i=0; i<icnt; i++) {
     var item=tb[i];
     if(item['abb name'] == target) {
        var coord=item['coordinates'];
        var jcnt=coord.length;
        for(j=0;j<jcnt;j++) {
          var c=coord[j];
          lon=c['lon'];
          lat=c['lat'];
          ret[ret.length]=([lat, lon]);      
        }
//        window.console.log(ret);
        return ret;
      }
   }
   return ret;
}

function makeModelTable() {
   var tb=CVM_tb['models'];
   var cnt=tb.length;
   var i;
   var tbhtml="<table><tbody><tr><td style=\"border:1px solid white;\">CVM Model Table</td></tr></tbody></table>";
   tbhtml=tbhtml+"<div class=\"cvm-table\"><table><tbody>";
   tbhtml=tbhtml+"<tr><th style=\"width:8vw\"><b>Model</b></th><th style=\"width:6vw\"><b>CVM abbreviation</b></th><th style=\"width:40vw\"><b>Description</b></th></tr>";

   for( i=0; i<cnt; i++) {
     var item=tb[i];
     var mname=item['name'];
     var aname=item['abb name'];
     var pname=item['path name'];
     if(isModelInstalled(pname)) {
       var descript=item['description'];
       var t="<tr><td style=\"width:6vw\">"+mname+"</td><td style=\"width:6vw\">"+aname+"</td><td style=\"width:40vw\">"+descript+"</td></tr>";
       tbhtml=tbhtml+t;
     }
   }
   tbhtml=tbhtml+"</tbody></table></div>";
   return tbhtml;
}

function _getModelItemWithID(id) {
   var tb=CVM_tb['models'];
   var cnt=tb.length;
   var i;
   for(i=0; i<cnt;i++) {
      var model=tb[i];
      if(model['id'] == id) {
        return model;
      }
   }
   return undefined;
}

function getModelNameWithID(id) {
   var item=_getModelItemWithID(id);
   if(item != undefined) {
       var n= item['name'];
       return n;
   }
   return undefined;
}

function getModelNameWithType(t) {
   // t could be multiple, "albacore,cvms"
   var rt="";
   var mlist=t.split(',');
   var mcnt=mlist.length;
   var tlist=CVM_tb['models'];
   var tcnt=tlist.length;
   var i,j;

   for(i=0;i<mcnt;i++) {
      for(j=0; j<tcnt;j++) {
         var target=tlist[j];
         if(target['abb name'] == mlist[i]) {
            rt=rt+target['name'];
            if(mcnt>1 && i!=(mcnt-1))
               rt=rt+", ";
            break;
	 } 
      }
      if(j == tcnt) { // not found
         rt=rt+mlist[i];
      }
   }
   if(rt=="") {
       rt=undefined;
   }

   return rt;
}
function getZModeNameWithType(t) {
   var tb=CVM_tb['zmodes'];
   var cnt=tb.length;
   var i;
   for(i=0; i<cnt;i++) {
      var zmode=tb[i];
      if(zmode['value'] == t) {
        return zmode['mode name'];
      }
   }
   return undefined;
}

function getModelColorWithID(id) {
   var item=_getModelItemWithID(id);
   if(item != undefined) {
       var c= item['color'];
       return c;
   }
   return undefined;
}

function getModelCoordinatesWithID(id) {
   var item=_getModelItemWithID(id);
   if(item != undefined) {
       var coord= item['coordinates'];
       return coord;
   }
   return undefined;
}

function getAllModelNames() {
   var ret=[];
   var tb=CVM_tb['models'];
   var cnt=tb.length;
   var i,item,aname;
   for(i=0; i<cnt; i++) {
     item=tb[i]; 
     aname=item['abb name'];
     ret.push(aname);
   }
   return ret;
}

function showInTable(key) {
   var tb=CVM_tb['descript'];
   var cnt=tb.length;
   for( i=0; i<cnt; i++) {
     var item=tb[i];
     var label=item['id'];
     if(label == key) {
       return item['show'];
     }
  }
  window.console.log("ERROR, showInTable, no such key",key);
  return 0;
}

function makeParametersTable() {
   var tb=CVM_tb['descript'];
   var cnt=tb.length;
   var i;
   var tbhtml="<table><tbody><tr><td style=\"border:1px solid white;\">CVM Parameters Table</td></tr></tbody></table>";
   tbhtml=tbhtml+"<div class=\"cvm-table\"><table><tbody>";
   tbhtml=tbhtml+"<tr><th style=\"width:10vw\"><b>Parameter</b></th><th style=\"width:45vw\"><b>Description</b></th></tr>";
   for( i=0; i<cnt; i++) {
     var item=tb[i];
     var label=item['id'];
     var descript=item['descript'];
     if( item['show'] ) {
       var t="<tr><td style=\"width:10vw\">"+label+"</td><td style=\"width:45vw\">"+descript+"</td></tr>";
       tbhtml=tbhtml+t;
     }
   }
   tbhtml=tbhtml+"</tbody></table></div>";
   return tbhtml;
}

