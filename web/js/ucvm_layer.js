/***
   ucvm_layer.js
***/

// control whether the main mouseover control should be active or not
var skipPopup=false;

/***
   tracking data structure
***/

// leaflet layer for ucvm model boundaries
// oidx is the order index, when there are more than 1 model visible, the oidx 
// denotes the ordering. 1,2,3 etc
// [ { "model": modelname, "layer": layer, "style":styleblob, 'visible':1, 'oidx':v }, ... ]
var ucvm_model_list =[];

// material properties returned from backend per lat lon point
// mpblob is what ucvm_query returns
// [ { "uid": uid, "mp": mpblob }, ... ]
var ucvm_mp_list=[];

// meta list for a query, per job,
// meta is a json blob for timestamp, mode..
var ucvm_meta_list=[];
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
var ucvm_layer_list =[];

// { { "uid":uid, "filename":filename}]}
var ucvm_point_file_list=[];

// material property point
// { { "uid":uid, "latlngs":[{"lat":a,"lon":b}]}
var ucvm_point_list=[];

// material property by file
// { { "uid":uid, "latlngs":[{"lat":a,"lon":b},...,{"lat":c,"lon":d}]}
var ucvm_file_points_list=[];

// depth profile, also track the material property blob 
// { { "uid":uid, "latlngs":[{"lat":a,"lon":b}]}
var ucvm_profile_list=[];

// cross section
// latlngs can be more than 2 if there are multiple segments
// { { "uid":uid, "latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]}
var ucvm_line_list=[];

// horizontal area, 
// { { "uid":uid, "latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]}
var ucvm_area_list=[];

/*****************************************************************
*****************************************************************/
// suppress all  model layer on the map
function remove_all_models() {
  ucvm_model_list.forEach(function(element) {
      var l=element['layer'];
      if(element['visible']=1) {
        element['visible']=0;
        element['oidx']=0;
        viewermap.removeLayer(l);
      }
  });
}

function load_a_model(name, order) {
   var cnt=ucvm_model_list.length;
   var i;
   for(i=0;i<cnt;i++) {
     var t=ucvm_model_list[i];
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
   var cnt=ucvm_model_list.length;
   var i;
   for(i=0;i<cnt;i++) {
     var t=ucvm_model_list[i];
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
      ucvm_model_list.push({"model": name, "layer": layer, "visible": 0, "oidx":0 });
   }

   { // initialize with the default model
     var sel=document.getElementById('modelType');
     var opt=sel[0]
     var model=opt.value;
     load_selected_model(model);
   }
}

// can be "cvmh" or "cvmh,cvmsi"
function load_selected_model(modelstr) {
   var mlist=modelstr.split(",");
   var i;
   var cnt=mlist.length;
   for(i=0;i < cnt; i++) {
      load_a_model(mlist[i], i);
   }
   /* call refocus on map */
   switchMapFocus();
}

function insert_materialproperty(uid, mp) {
   ucvm_mp_list.push( { "uid":uid, "mp":mp });
}

function clear_materialproperty() {
   ucvm_mp_list=[];
}

function get_materialproperty(target_uid) {
  var cnt=ucvm_mp_list.length;
  for(var i=0; i<cnt; i++) {
    var element=ucvm_mp_list[i];
    if (target_uid == element['uid']) {
       var mp=element["mp"];
       return mp;
    }
  }
  return {};
}

function get_all_materialproperty() {
  var mplist=[];
  var cnt=ucvm_mp_list.length;
  for(var i=0; i<cnt; i++) {
    var element=ucvm_mp_list[i];
    mplist.push(element["mp"]);
  }
  return mplist;
}


/* return meta item if id is in the meta list */
function find_meta_from_list(target_uid) {
   var found=0;
   ucvm_meta_list.forEach(function(element) {
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
   ucvm_layer_list.forEach(function(element) {
     if ( element['uid'] == target_uid )
        found=element;
   });
   return found;
}

function remove_all_layers() {
   ucvm_layer_list.forEach(function(element) {
     var uid=element['uid'];
     var type=element['type'];
     var group=element['group'];
     switch (type)  {
       case POINT_ENUM: removeFromList(ucvm_point_list,uid); break;
       case LINE_ENUM: removeFromList(ucvm_line_list,uid); break;
       case PROFILE_ENUM: removeFromList(ucvm_profile_list,uid); break;
       case AREA_ENUM: removeFromList(ucvm_area_list,uid); break;
     };
     group.eachLayer(function(layer) {
       viewermap.removeLayer(layer);
     });
   });
   ucvm_layer_list=[];
}

function reset_dirty_uid() {
   dirty_layer_uid=0;
}

function remove_a_layer(uid) {
   var t=find_layer_from_list(uid);
   if(t) {
     var type=t['type'];
     switch (type)  {
       case POINT_ENUM: removeFromList(ucvm_point_list,uid); break;
       case LINE_ENUM: removeFromList(ucvm_line_list,uid); break;
       case PROFILE_ENUM: removeFromList(ucvm_profile_list,uid); break;
       case AREA_ENUM: removeFromList(ucvm_area_list,uid); break;
     };
     var group=t['group'];
     group.eachLayer(function(layer) {
         viewermap.removeLayer(layer);
     });
     var idx = ucvm_layer_list.indexOf(t);
     if (idx > -1) {
       ucvm_layer_list.splice(idx, 1);
     }
  }
}

function load_a_layergroup(uid,type,group,highlight) {
   var t=find_layer_from_list(uid);
   if(t) {
     window.console.log("already plotted this layer ",uid);
     return;
   }
   ucvm_layer_list.push({"uid":uid, "type":type, "group": group,"highlight":highlight});
}

function add_a_layer(uid,layer) {
   var t=find_layer_from_list(uid);
   if(!t) {
     window.console.log("should have a related layer group already ",uid);
     return;
   }
   var group=t["group"];
   group.addLayer(layer); 
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
        $('#ucvm_layer_'+uid).addClass('ucvm-active');
      } else if (h==EYE_HIGHLIGHT) {
        hide_layergroup(group);
        found['highlight']=EYE_HIDE;
        $('#ucvm_layer_'+uid).removeClass('ucvm-active');
        $('#ucvm_layer_'+uid).removeClass('glyphicon-eye-open');
        $('#ucvm_layer_'+uid).addClass('glyphicon-eye-close');
      } else if (h==EYE_HIDE) {
        unhighlight_layergroup(group);
        found['highlight']=EYE_NORMAL;
        $('#ucvm_layer_'+uid).addClass('glyphicon-eye-open');
        $('#ucvm_layer_'+uid).removeClass('glyphicon-eye-close');
      }
      } else {
        window.console.log("toggle_a_layergroup.. can not find this uid ",uid);
   }
}


// this one come from the user interactive mode
function add_bounding_area(uid, a,b,c,d) {
  var group=addAreaLayerGroup(a,b,c,d);
  var tmp={"uid":uid,"latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]};
  ucvm_area_list.push(tmp);
  load_a_layergroup(uid, AREA_ENUM, group, EYE_NORMAL);
}

function remove_bounding_area_layer(uid) {
  remove_a_layer(uid);
}

// this one comes from the map
function add_bounding_area_layer(layer,a,b,c,d) {
  if(dirty_layer_uid) {
    remove_a_layer(dirty_layer_uid);
  }
  var uid=getRnd("UCVM");
  var tmp={"uid":uid,"latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]};
  set_area_latlons(uid,a,b,c,d);
  ucvm_area_list.push(tmp);
  var group=L.layerGroup([layer]);
  viewermap.addLayer(group);

  load_a_layergroup(uid,AREA_ENUM,group, EYE_NORMAL);
  dirty_layer_uid=uid;
}
/*** special handle for a file of points ***/
function add_file_of_point(uid, fobj) {
  var tmp={"uid":uid,"file":fobj.name};
  ucvm_point_file_list.push(tmp);
}

function add_bounding_file_points(uid, darray) {
   var latlngs=makeLatlngs(darray);
   var group=addPointsLayerGroup(latlngs);
   var tmp={"uid":uid, "latlngs":latlngs};
   ucvm_file_points_list.push(tmp);
   load_a_layergroup(uid, POINT_ENUM, group, EYE_HIGHLIGHT);
}

function add_bounding_point(uid,a,b) {
  if(dirty_layer_uid) {
    remove_a_layer(dirty_layer_uid);
  }
  var group=addPointLayerGroup(a,b);
  var tmp={"uid":uid,"latlngs":[{"lat":a,"lon":b}]};
  ucvm_point_list.push(tmp);
  load_a_layergroup(uid,POINT_ENUM,group, EYE_NORMAL);
}

function add_bounding_point_layer(layer,a,b) {
  if(dirty_layer_uid) {
    remove_a_layer(dirty_layer_uid);
  }
  var uid=getRnd("UCVM");
  var tmp={"uid":uid,"latlngs":[{"lat":a,"lon":b}]};
  set_point_latlons(uid,a,b);
  ucvm_point_list.push(tmp);
  var group=L.layerGroup([layer]);
  viewermap.addLayer(group);

  load_a_layergroup(uid,POINT_ENUM,group, EYE_NORMAL);
  dirty_layer_uid=uid;
}

function remove_bounding_point_layer(uid) {
  remove_a_layer(uid);
}

function add_bounding_profile(uid,a,b) {
  window.console.log("adding_bounding_profile");
  var group=addProfileLayerGroup(a,b);
  var tmp={"uid":uid,"latlngs":[{"lat":a,"lon":b}]};
  ucvm_profile_list.push(tmp);
  load_a_layergroup(uid,PROFILE_ENUM,group,EYE_NORMAL);
}

function add_bounding_profile_layer(layer,a,b) {
  window.console.log("adding_bounding_profile_layer");
  if(dirty_layer_uid) {
    remove_a_layer(dirty_layer_uid);
  }
  var uid=getRnd("UCVM");
  var tmp={"uid":uid,"latlngs":[{"lat":a,"lon":b}]};
  set_profile_latlons(uid,a,b);
  ucvm_profile_list.push(tmp);
  var group=L.layerGroup([layer]);
  viewermap.addLayer(group);

  load_a_layergroup(uid,PROFILE_ENUM,group,EYE_NORMAL);
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
  ucvm_line_list.push(tmp);
  load_a_layergroup(uid,LINE_ENUM,group);
}

function remove_bounding_line_layer(uid) {
  remove_a_layer(uid);
}

function add_bounding_line_layer(layer,a,b,c,d) {
  if(dirty_layer_uid) {
    remove_a_layer(dirty_layer_uid);
  }
  var uid=getRnd("UCVM");
  var tmp={"uid":uid,"latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]};
  set_line_latlons(uid,a,b,c,d);
  ucvm_line_list.push(tmp);
  var group=L.layerGroup([layer]);
  viewermap.addLayer(group);

  load_a_layergroup(uid,LINE_ENUM,group,EYE_NORMAL);
  dirty_layer_uid=uid;
}
