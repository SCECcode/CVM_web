/***
   cvm_layer.js
***/

// control whether the main mouseover control should be active or not
var skipPopup=false;

/***
   tracking data structure
***/

// leaflet layer for cvm model boundaries
// oidx is the order index, when there are more than 1 model visible, the oidx 
// denotes the ordering. 1,2,3 etc
// [ { "model": modelname, "layer": layer, "style":styleblob, 'visible':1, 'oidx':v }, ... ]
var cvm_model_list =[];

// material properties returned from backend per lat lon point
// mpblob is what cvm_query returns
// [ { "uid": uid, "mp": mpblob }, ... ]
var cvm_mp_list=[];

// meta list for a query, per job,
// meta is a json blob for timestamp, mode..
var cvm_meta_list=[];
// [ { "uid":uid, "meta": metablob }, ... ]


// for tracking uid that did not get 'used'
var dirty_layer_uid=0;
const POINT_ENUM=1,
      PROFILE_ENUM=2,
      LINE_ENUM=3,
      AREA_ENUM=4;

const EYE_NORMAL=0,
      EYE_HIGHLIGHT=1,
      EYE_HIDE=2;

// leaflet layer for query, group=LayerGroup
// [ { "uid": uid, "type": type_enum, "group":group, 'highlight':0/1/2 }, ... ]
var cvm_layer_list =[];

// { { "uid":uid, "filename":filename}]}
var cvm_point_file_list=[];

// material property point
// { { "uid":uid, "latlngs":[{"lat":a,"lon":b}]}
var cvm_point_list=[];

// material property by file
// { { "uid":uid, "latlngs":[{"lat":a,"lon":b},...,{"lat":c,"lon":d}]}
var cvm_file_points_list=[];

// depth profile, also track the material property blob 
// { { "uid":uid, "latlngs":[{"lat":a,"lon":b}]}
var cvm_profile_list=[];

// cross section
// latlngs can be more than 2 if there are multiple segments
// { { "uid":uid, "latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]}
var cvm_line_list=[];

// horizontal area, 
// { { "uid":uid, "latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]}
var cvm_area_list=[];

/*****************************************************************
*****************************************************************/

// suppress all  model layer on the map
function remove_all_models() {
  cvm_model_list.forEach(function(element) {
      var l=element['layer'];
      if(element['visible']=1) {
        element['visible']=0;
        element['oidx']=0;
        viewermap.removeLayer(l);
      }
  });
}

function load_a_model(name, order) {
   var cnt=cvm_model_list.length;
   var i;
   for(i=0;i<cnt;i++) {
     var t=cvm_model_list[i];
     if(t['model'] == name ) {
       if(t['visible']==0) {
          t['visible']=1; 
          t['oidx']=order;
          var layer=t['layer'];
          viewermap.addLayer(layer);
          return 1;
       }
       return 0;
     }
   }
   return 0;
}

function remove_a_model(name) {
   var cnt=cvm_model_list.length;
   var i;
   for(i=0;i<cnt;i++) {
     var t=cvm_model_list[i];
     if(t['name'] == name ) {
       if(t['visible']==1) {
          t['visible']=0; 
          t['oidx']=0;
          var layer=t['layer'];
          viewermap.removeLayer(layer);
          return 1;
       }
       return 0;
     }
   }
   return 0;
}


function make_all_model_layer() {
   // get all models
   var name_list=getAllModelNames();
   var cnt=name_list.length;
   var i;
   for(i=0;i<cnt;i++) {
      var name=name_list[i];
      var color=getModelColor(name);
      var latlngs=makeLatlngsCoordinate(name);
      var layer=makeModelLayer(latlngs,color);
      cvm_model_list.push({"model": name, "layer": layer, "visible": 0, "oidx":0 });
   }
}

// can be "cvmh" or "cvmh,cvmsi"
function load_selected_model(modelstr) {
   // special case,  if cvm_model_cvm btn is enabled.. clear it
   if ($("#cvm-model-cvm").prop('checked')) {
      // just uncheck it
      reset_cvm_save_list();
      $("#cvm-model-cvm").click();
   }
	
   var mlist=modelstr.split(",");
   var i;
   var cnt=mlist.length;
   for(i=0;i < cnt; i++) {
      load_a_model(mlist[i], i);
   }
   /* call refocus on map */
   switchMapFocus();
}

// show all model layers on the map
// show_cvm_save_list in cvm_ui.c
function load_all_models() {
   var save_list=[];
   var install_list=[];
   let cnt=cvm_model_list.length;

   for(let i=0;i<cnt;i++) {
     let t=cvm_model_list[i];
     if(isModelInstalled(t['model'])) {
       if(t['visible']==1) {
          save_list.push(i);
       }
       install_list.push(i);
     }
   }
   remove_all_models();
   cnt=install_list.length;
   for(let j=0;j<cnt;j++) {
     let idx=install_list[j];
     let t=cvm_model_list[idx];
     t['visible']=1;
     t['oidx']=(j+1);
     let layer=t['layer'];
     viewermap.addLayer(layer);
   }

   return save_list;
}

// from a saved list reload what is in there
function reload_models_from_list(mlist) {
   remove_all_models();
   let cnt=mlist.length;
   for(let i=0; i < cnt; i++) {
     let idx=mlist[i];
     let t=cvm_model_list[idx];
     t['visible']=1;
     t['oidx']=(i+1);
     let layer=t['layer'];
     viewermap.addLayer(layer);
   }
   return 0;
}

function refresh_model_type() {
   var sel=document.getElementById('selectModelType');
   var opt=sel[0]
   var model=opt.value;
// force a change on the selectModelType
   $( "#selectModelType" ).val(model);
}


function insert_materialproperty(uid, mp) {
   cvm_mp_list.push( { "uid":uid, "mp":mp });
}

function clear_materialproperty() {
   cvm_mp_list=[];
}

function get_materialproperty(target_uid) {
  var cnt=cvm_mp_list.length;
  for(var i=0; i<cnt; i++) {
    var element=cvm_mp_list[i];
    if (target_uid == element['uid']) {
       var mp=element["mp"];
       return mp;
    }
  }
  return {};
}

function get_all_materialproperty() {
  var mplist=[];
  var cnt=cvm_mp_list.length;
  for(var i=0; i<cnt; i++) {
    var element=cvm_mp_list[i];
    mplist.push(element["mp"]);
  }
  return mplist;
}


/* return meta item if id is in the meta list */
function find_meta_from_list(target_uid) {
   var found=0;
   cvm_meta_list.forEach(function(element) {
     if ( element['uid'] == target_uid )
        found=element;
   });
   return found;
}

function get_leaflet_id(layer) {
   var id=layer['layer']._leaflet_id;
   return id;
}

function find_layer_from_list(target_uid)
{
   var found=0;
   cvm_layer_list.forEach(function(element) {
     if ( element['uid'] == target_uid )
        found=element;
   });
   return found;
}

function remove_all_layers() {
   cvm_layer_list.forEach(function(element) {
     var uid=element['uid'];
     var type=element['type'];
     var group=element['group'];
     switch (type)  {
       case POINT_ENUM: removeFromList(cvm_point_list,uid); break;
       case LINE_ENUM: removeFromList(cvm_line_list,uid); break;
       case PROFILE_ENUM: removeFromList(cvm_profile_list,uid); break;
       case AREA_ENUM: removeFromList(cvm_area_list,uid); break;
     };
     group.eachLayer(function(layer) {
       viewermap.removeLayer(layer);
     });
   });
   cvm_layer_list=[];
}

function reset_dirty_uid() {
   dirty_layer_uid=0;
}

function remove_a_layer(uid) {
   var t=find_layer_from_list(uid);
   if(t) {
     var type=t['type'];
     switch (type)  {
       case POINT_ENUM: removeFromList(cvm_point_list,uid); break;
       case LINE_ENUM: removeFromList(cvm_line_list,uid); break;
       case PROFILE_ENUM: removeFromList(cvm_profile_list,uid); break;
       case AREA_ENUM: removeFromList(cvm_area_list,uid); break;
     };
     var group=t['group'];
     group.eachLayer(function(layer) {
         viewermap.removeLayer(layer);
     });
     var idx = cvm_layer_list.indexOf(t);
     if (idx > -1) {
       cvm_layer_list.splice(idx, 1);
     }
  }
}

function load_a_layergroup(uid,type,group,highlight) {
   var t=find_layer_from_list(uid);
   if(t) {
     window.console.log("already plotted this layer ",uid);
     return 0;
   }
   cvm_layer_list.push({"uid":uid, "type":type, "group": group,"highlight":highlight});
   return 1;
}

function add_a_layer(uid,layer) {
   var t=find_layer_from_list(uid);
   if(!t) {
     window.console.log("should have a related layer group already ",uid);
     return 0;
   }
   var group=t["group"];
   group.addLayer(layer); 
   return 1;
}

/* LayerGroup */
function highlight_layergroup(group) {
    if(!viewermap.hasLayer(group)) {
       window.console.log("ERROR, layer is not on map\n");
       return;
    }
    viewermap.removeLayer(group);
    group.eachLayer(function(layer) {
       var op=layer.options;
       if(op.icon != undefined) {
          var iop=op.icon.options;
          if(iop['className']=='blue-div-icon') {
            iop['className']='red-div-icon';
            viewermap.addLayer(group);
            } else { 
// set it when adding this one and then reset to default
// this has to do the awesome marker problem..
            iop.markerColor="red";
            viewermap.addLayer(group);
            iop.markerColor="blue";
          }
          } else {
            op.color="red";
            viewermap.addLayer(group);
       } 
    });
}

function unhighlight_layergroup(group) {
    if(viewermap.hasLayer(group)) {
       viewermap.removeLayer(group);
    }
    group.eachLayer(function(layer) {
       var op=layer.options;
       if(op.icon != undefined) {
          var iop=op.icon.options;
          if(iop['className']=='red-div-icon') {
            iop['className']='blue-div-icon';
            } else { 
              iop.markerColor="blue";
          }
          } else {
            op.color="blue";
       } 
    });
    viewermap.addLayer(group);
}

function hide_layergroup(group) {
    if(viewermap.hasLayer(group)) {
        viewermap.removeLayer(group);
    }
}

function isLayergroupHigh(uid) {
   var found=find_layer_from_list(uid);
   if(found) {
      var h=found['highlight'];
      if(h==EYE_HIGHLIGHT) {
        return 1;
      }
   }
   return 0;
}

// highlight = 0, 1, 2, => normal, highlight, hide
function toggle_a_layergroup(uid) {
   var i;
   var found=find_layer_from_list(uid);
   if(found) {
      var group=found['group'];
      var h=found['highlight'];
      if(h==EYE_NORMAL) {
        highlight_layergroup(group);
        found['highlight']=EYE_HIGHLIGHT;
        $('#cvm_layer_'+uid).addClass('cvm-active');
      } else if (h==EYE_HIGHLIGHT) {
        hide_layergroup(group);
        found['highlight']=EYE_HIDE;
        $('#cvm_layer_'+uid).removeClass('cvm-active');
        $('#cvm_layer_'+uid).removeClass('glyphicon-eye-open');
        $('#cvm_layer_'+uid).addClass('glyphicon-eye-close');
      } else if (h==EYE_HIDE) {
        unhighlight_layergroup(group);
        found['highlight']=EYE_NORMAL;
        $('#cvm_layer_'+uid).addClass('glyphicon-eye-open');
        $('#cvm_layer_'+uid).removeClass('glyphicon-eye-close');
      }
      } else {
        window.console.log("toggle_a_layergroup.. can not find this uid ",uid);
   }
}


// this one come from the user interactive mode
function add_bounding_area(uid, a,b,c,d) {
  var group=addAreaLayerGroup(a,b,c,d);
  var tmp={"uid":uid,"latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]};
  if(load_a_layergroup(uid, AREA_ENUM, group, EYE_NORMAL)) {
    cvm_area_list.push(tmp);
  }
}

function remove_bounding_area_layer(uid) {
  remove_a_layer(uid);
}

// this one comes from the map
function add_bounding_area_layer(layer,a,b,c,d) {
  if(dirty_layer_uid) {
    remove_a_layer(dirty_layer_uid);
  }
  var uid=getRnd("CVM");
  var tmp={"uid":uid,"latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]};
  set_area_latlons(uid,a,b,c,d);
  var group=L.layerGroup([layer]);

  if(load_a_layergroup(uid,AREA_ENUM,group, EYE_NORMAL)) {
    cvm_area_list.push(tmp);
    viewermap.addLayer(group);
  }
  dirty_layer_uid=uid;
}
/*** special handle for a file of points ***/
function add_file_of_point(uid, fobj) {
  var tmp={"uid":uid,"file":fobj.name};
  cvm_point_file_list.push(tmp);
}

function add_bounding_file_points(uid, darray) {
   var latlngs=makeLatlngs(darray);
   var group=addPointsLayerGroup(latlngs);
   var tmp={"uid":uid, "latlngs":latlngs};
   cvm_file_points_list.push(tmp);
   if( load_a_layergroup(uid, POINT_ENUM, group, EYE_HIGHLIGHT)) {
     cvm_file_points_list.push(tmp);
   }
}

function add_bounding_point(uid,a,b) {
  if(dirty_layer_uid) {
    remove_a_layer(dirty_layer_uid);
  }
  var group=addPointLayerGroup(a,b);
  var tmp={"uid":uid,"latlngs":[{"lat":a,"lon":b}]};
  if( load_a_layergroup(uid,POINT_ENUM,group, EYE_NORMAL)) {
    cvm_point_list.push(tmp);;
  }
}

function add_bounding_point_layer(layer,a,b) {
  if(dirty_layer_uid) {
    remove_a_layer(dirty_layer_uid);
  }
  var uid=getRnd("CVM");
  var tmp={"uid":uid,"latlngs":[{"lat":a,"lon":b}]};
  set_point_latlons(uid,a,b);
  var group=L.layerGroup([layer]);

  if( load_a_layergroup(uid,POINT_ENUM,group, EYE_NORMAL)) {
    cvm_point_list.push(tmp);
    viewermap.addLayer(group);
  }
  dirty_layer_uid=uid;
}

function remove_bounding_point_layer(uid) {
  remove_a_layer(uid);
}

// can come from map or from manual input through the 'plotting' part
function add_bounding_profile(uid,a,b) {
  // uid is already in the list, no need to add to the list 
  if(dirty_layer_uid) {
    remove_a_layer(dirty_layer_uid);
  }

  // if the profile layer is already on the map, don't try to add again
  let t=cvm_profile_list;

  if(checkInList(cvm_profile_list,uid)!= undefined) {
    window.console.log("add_bounding_profile, already in the list ", uid);
    } else {
      var group=addProfileLayerGroup(a,b);
      var tmp={"uid":uid,"latlngs":[{"lat":a,"lon":b}]};
      if(load_a_layergroup(uid,PROFILE_ENUM,group,EYE_NORMAL)) {
        cvm_profile_list.push(tmp);
     }
   }
}

// came from the map
function add_bounding_profile_layer(layer,a,b) {
  if(dirty_layer_uid) {
    remove_a_layer(dirty_layer_uid);
  }
  var uid=getRnd("CVM");
  var tmp={"uid":uid,"latlngs":[{"lat":a,"lon":b}]};
  set_profile_latlons(uid,a,b);
  var group=L.layerGroup([layer]);

  if(load_a_layergroup(uid,PROFILE_ENUM,group,EYE_NORMAL)) {
    cvm_profile_list.push(tmp);
    viewermap.addLayer(group);
  }
  dirty_layer_uid=uid;
}

function remove_bounding_profile_layer(uid) {
  remove_a_layer(uid);
}

// TODO: this is future special case when we allow mulitple segments
// in the polyline drawing.. 
function add_bounding_line(uid,a,b,c,d) {
  var group =addLineLayerGroup(a,b,c,d);
  var tmp={"uid":uid,"latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]};
  if(load_a_layergroup(uid,LINE_ENUM,group,EYE_NORMAL)) {
    cvm_line_list.push(tmp);
  }
}

function remove_bounding_line_layer(uid) {
  remove_a_layer(uid);
}

function add_bounding_line_layer(layer,a,b,c,d) {
  if(dirty_layer_uid) {
    remove_a_layer(dirty_layer_uid);
  }
  var uid=getRnd("CVM");
  var tmp={"uid":uid,"latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]};
  set_line_latlons(uid,a,b,c,d);
  var group=L.layerGroup([layer]);

  if(load_a_layergroup(uid,LINE_ENUM,group,EYE_NORMAL)) {
    cvm_line_list.push(tmp);
    viewermap.addLayer(group);
  }
  dirty_layer_uid=uid;
}
