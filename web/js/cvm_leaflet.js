/***
   cvm_leaflet.js
***/

var scecAttribution ='<a href="https://www.scec.org">SCEC</a>';

var init_map_zoom_level = 6.0;
var init_map_coordinates = [34.3, -118.4];

// This is leaflet specific utilities
var rectangle_options = {
       showArea: false,
       shapeOptions: {
              stroke: true,
              color: "blue",
              weight: 3,
              opacity: 0.5,
              fill: true,
              fillColor: null, //same as color by default
              fillOpacity: 0.02,
              clickable: false
       }
};
var rectangleDrawer;

var point_icon = L.AwesomeMarkers.icon({ icon: 'record', markerColor: 'blue'});
var point_options = { icon : point_icon };
var pointDrawer;

var myIcon = L.divIcon({className: 'blue-div-icon'});
var small_point_options = { icon : myIcon};

var profile_icon = L.AwesomeMarkers.icon({ icon: 'star', markerColor: 'blue'});
var profile_options = { icon: profile_icon };
var profileDrawer; //profile drawer is the same as point drawer

var line_options = {
       showLength: true,
       shapeOptions: {
              stroke: true,
              color: "blue",
              weight: 3,
              opacity: 0.6,
              clickable: false
       }
};
var lineDrawer;

// this is for drawing model's layer..
var polygon_options = {
    color:'red',
    fillOpacity:0.01,
    opacity:1.0,
    weight:1.8,
    shapeOptions: {
              clickable: false
    }
};
  
var mymap, baseLayers, layerControl, currentLayer;

function clear_popup()
{
  viewermap.closePopup();
}

function resize_map()
{
  viewermap.invalidateSize();
}

function refresh_map()
{
  if (viewermap == undefined) {
    window.console.log("refresh_map: BAD BAD BAD");
    } else {
      viewermap.setView(init_map_coordinates,init_map_zoom_level);
  }
}

function set_map(center,zoom)
{
  if (viewermap == undefined) {
    window.console.log("set_map: BAD BAD BAD");
    } else {
//window.console.log("set_map: calling setView");
      viewermap.setView(center, zoom);
  }
}

function get_bounds()
{
   var bounds=viewermap.getBounds();
   return bounds;
}

function get_map()
{
  var center=init_map_coordinates;
  var zoom=init_map_zoom_level;

  if (viewermap == undefined) {
    window.console.log("get_map: BAD BAD BAD");
    } else {
      center=viewermap.getCenter();
      zoom=viewermap.getZoom();
  }
  return [center, zoom];
}

/**************************************************/

function setup_viewer()
{
// esri
// web@scec.org  - ArcGIS apiKey, https://leaflet-extras.github.io/leaflet-providers/preview/
// https://www.esri.com/arcgis-blog/products/developers/developers/open-source-developers-time-to-upgrade-to-the-new-arcgis-basemap-layer-service/

  var esri_apiKey = "AAPK2ee0c01ab6d24308b9e833c6b6752e69Vo4_5Uhi_bMaLmlYedIB7N-3yuFv-QBkdyjXZZridaef1A823FMPeLXqVJ-ePKNy";
  var esri_topographic = L.esri.Vector.vectorBasemapLayer("ArcGIS:Topographic", {apikey: esri_apiKey});
  var esri_imagery = L.esri.Vector.vectorBasemapLayer("ArcGIS:Imagery", {apikey: esri_apiKey});
  var osm_streets_relief= L.esri.Vector.vectorBasemapLayer("OSM:StreetsRelief", {apikey: esri_apiKey});
  var esri_terrain = L.esri.Vector.vectorBasemapLayer("ArcGIS:Terrain", {apikey: esri_apiKey});

// otm topo
  var topoURL='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
  var topoAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreeMap</a> contributors,<a href=http://viewfinderpanoramas.org"> SRTM</a> | &copy; <a href="https://www.opentopomap.org/copyright">OpenTopoMap</a>(CC-BY-SA)';
  L.tileLayer(topoURL, { detectRetina: true, attribution: topoAttribution, maxZoom:16 })

  var otm_topographic = L.tileLayer(topoURL, { detectRetina: true, attribution: topoAttribution, maxZoom:16});

  var jawg_dark = L.tileLayer('https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 16,
	accessToken: 'hv01XLPeyXg9OUGzUzaH4R0yA108K1Y4MWmkxidYRe5ThWqv2ZSJbADyrhCZtE4l'});

  var jawg_light = L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 16,
	accessToken: 'hv01XLPeyXg9OUGzUzaH4R0yA108K1Y4MWmkxidYRe5ThWqv2ZSJbADyrhCZtE4l' });

// osm street
  var openURL='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var openAttribution ='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  var osm_street=L.tileLayer(openURL, {attribution: openAttribution, maxZoom:16});

  baseLayers = {
    "esri topo" : esri_topographic,
    "esri imagery" : esri_imagery,
    "jawg light" : jawg_light,
    "jawg dark" : jawg_dark,
    "osm streets relief" : osm_streets_relief,
    "otm topo": otm_topographic,
    "osm street" : osm_street,
    "esri terrain": esri_terrain
  };

  var overLayer = {};
  var basemap = L.layerGroup();
  currentLayer = esri_topographic;

// ==> mymap <==
  mymap = L.map('CVM_plot', { zoomSnap: 0.25, drawControl:false, zoomControl:true, maxZoom:16} );
  mymap.setView(init_map_coordinates,init_map_zoom_level);
  mymap.attributionControl.addAttribution(scecAttribution);

  esri_topographic.addTo(mymap);

// basemap selection
  var ctrl_div=document.getElementById('external_leaflet_control');

// ==> layer control <==
// add and put it in the customized place
//  L.control.layers(baseLayers, overLayer).addTo(mymap);
  layerControl = L.control.layers(baseLayers, overLayer,{collapsed: true });
  layerControl.addTo(mymap);
  var elem= layerControl._container;
  elem.parentNode.removeChild(elem);

  ctrl_div.appendChild(layerControl.onAdd(mymap));
  // add a label to the leaflet-control-layers-list
  var forms_div=document.getElementsByClassName('leaflet-control-layers-list');
  var parent_div=forms_div[0].parentElement;
  var span = document.createElement('span');
  span.style="font-size:14px;font-weight:bold;";
  span.className="leaflet-control-layers-label";
  span.innerHTML = 'Select background';
  parent_div.insertBefore(span, forms_div[0]);

// ==> scalebar <==
  L.control.scale({metric: 'false', imperial:'false', position: 'bottomleft'}).addTo(mymap);

  function onMapMouseOver(e) {
    if( in_drawing_point() ) {
      drawPoint();
      return;
    }
    if( in_drawing_profile() ) {
      drawProfile();
      return;
    }
    if( in_drawing_line() ) {
      drawLine();
      return;
    }
    if( in_drawing_area()) {
      drawArea();
      return;
    }
  }
  function onMapMouseOut(e) {
    if( in_drawing_point() ) {
      skipPoint();
      return;
    }
    if( in_drawing_profile() ) {
      skipProfile();
      return;
    }
    if( in_drawing_line() ) { 
      skipLine();
      return;
    }
    if( in_drawing_area()) { 
      skipArea();
      return;
    }
  }

  mymap.on('mouseover', onMapMouseOver);
  mymap.on('mouseout', onMapMouseOut);

// ==> point drawing control <==
  pointDrawer = new L.Draw.Marker(mymap, point_options);
// ==> profile drawing control <==
  profileDrawer = new L.Draw.Marker(mymap, profile_options);
// ==> line drawing control <==
  lineDrawer = new L.Draw.Polyline(mymap, line_options);
// ==> area/rectangle drawing control <==
  rectangleDrawer = new L.Draw.Rectangle(mymap, rectangle_options);

// https://stackoverflow.com/questions/42092095/how-to-complete-a-polyline-in-leaflet-draw-after-clicking-second-point
  mymap.on('draw:drawvertex', function(e) {
    if(in_drawing_line()) {
        const layerIds = Object.keys(e.layers._layers);
window.console.log("In draw:drawvertex, length is ", layerIds.length);
        if (layerIds.length > 1) {
          const secondVertex = e.layers._layers[layerIds[1]]._icon;
//window.console.log("In draw:drawvertex, click this one ");
          requestAnimationFrame(() => secondVertex.click());
// this solution causes error message of undefined vertex in DRAW  code
//          lineDrawer.completeShape();
        }
    }
  });

  mymap.on(L.Draw.Event.CREATED, function (e) {
    var type = e.layerType;
    var layer = e.layer;

    if (type === 'rectangle') {  // tracks retangles
        // get the boundary of the rectangle
        var latlngs=layer.getLatLngs();
        // first one is always the south-west,
        // third one is always the north-east
        var loclist=latlngs[0];
        var sw=loclist[0];
        var ne=loclist[2];
        if(sw != undefined && ne != undefined) {
          add_bounding_area_layer(layer,sw['lat'],sw['lng'],ne['lat'],ne['lng']);
//	  CVM.processByLatlonForArea(1);
        }
    } else if (type === 'marker') {  // can be a point or a profile
        var sw=layer.getLatLng();
        if( in_drawing_profile() ) {
          add_bounding_profile_layer(layer,sw['lat'],sw['lng']);
//	  CVM.processByLatlonForProfile(1);
          } else {
            add_bounding_point_layer(layer,sw['lat'],sw['lng']);
//            CVM.processByLatlonForPoint(1)
        }
    } else if (type === 'polyline') {  // tracks lines
        var latlngs=layer.getLatLngs();
window.console.log("In DRAW.Created polyline.. with ", latlngs.length);
        var sw=latlngs[0];
        var ne=latlngs[1];
        if(sw != undefined && ne != undefined) {
          add_bounding_line_layer(layer,sw['lat'],sw['lng'],ne['lat'],ne['lng']);
//          CVM.processByLatlonForLine(1)
        }
    }
  });

// enable the expand view key
  $("#CVM_plot").prepend($("#expand-view-key-container").html());

// should  only have 1, adjust the attribution's location
  let v= document.getElementsByClassName("leaflet-control-attribution")[0];
  v.style.right="1.5rem";
  v.style.height="1.4rem";
  v.style.width="35rem";

// finally,
  return mymap;
}


function drawArea(){ rectangleDrawer.enable(); }
function skipArea(){ rectangleDrawer.disable(); }

function drawPoint(){ pointDrawer.enable(); }
function skipPoint(){ pointDrawer.disable(); }

function drawProfile(){ profileDrawer.enable(); }
function skipProfile(){ profileDrawer.disable(); }

function drawLine(){ window.console.log("LINE:enable"); lineDrawer.enable(); }
function skipLine(){ window.console.log("LINE:disable"); lineDrawer.disable(); }

// https://gis.stackexchange.com/questions/148554/disable-feature-popup-when-creating-new-simple-marker
function unbindPopupEachFeature(layer) {
    layer.unbindPopup();
    layer.off('click');
}

function makeModelLayer(latlngs,color) {
  var mypoly=polygon_options;
  mypoly['color']=color;
  var layer= new L.FeatureGroup([
    new L.polygon(latlngs, mypoly)
  ]);
  return layer;
}

function makeModelLayer2(latlngs,color,note) {
  var mypoly=polygon_options;
  mypoly['color']=color;
  let poly=new L.polygon(latlngs, mypoly);
  poly.bindToolTip(note);
  var layer= new L.FeatureGroup([ poly ]);

  return layer;
}

function addAreaLayerGroup(latA,lonA,latB,lonB) {
  var bounds = [[latA, lonA], [latB, lonB]];
  var layer =new L.rectangle(bounds,rectangle_options);
  var group = L.layerGroup([layer]);
  mymap.addLayer(group);
  return group;
}

function addPointsLayerGroup(latlngs) {
  var cnt=latlngs.length;
  if(cnt < 1)
    return null;
  var group = L.layerGroup();
  var i;
  for(i=0;i<cnt;i++) {
     var item=latlngs[i];
     var lat=parseFloat(item['lat']);
     var lon=parseFloat(item['lon']);
     var bounds = [lat,lon ];
     var layer = L.marker(bounds, small_point_options);
     var icon = layer.options.icon;
     icon.options.iconSize = [10, 10];
     layer.setIcon(icon);
     group.addLayer(layer);
  }
  mymap.addLayer(group);
  return group;
}

function addPointLayerGroup(lat,lon) {
  var bounds = [lat, lon];
  var layer = L.marker(bounds,point_options);
  var group = L.layerGroup([layer]);
  mymap.addLayer(group);
  return group;
}

function addProfileLayerGroup(lat,lon) {
  var bounds = [lat, lon];
  var layer = new L.marker(bounds,profile_options);
  var group = L.layerGroup([layer]);
  mymap.addLayer(group);
  return group;
}

function addLineLayerGroup(latA,lonA,latB,lonB) {
  var bounds = [[latA, lonA], [latB, lonB]];
  var layer = new L.polyline(bounds,line_options);
  var group = L.layerGroup([layer]);
  mymap.addLayer(group);
  return group;
}

function switchBaseLayer(layerString) {
    mymap.removeLayer(currentLayer);
    mymap.addLayer(baseLayers[layerString]);
    currentLayer = baseLayers[layerString];
}

// https://stackoverflow.com/questions/45286918/leafletjs-dynamically-bound-map-to-visible-overlays
function switchMapFocus() {
    var bounds = new L.LatLngBounds();
    viewermap.eachLayer(function (layer) {
        var l=layer;
            // FeatureGroup with polygon is only for the model boundary layer
        if (layer instanceof L.FeatureGroup) {
            bounds.extend(layer.getBounds());
        } 
    });
    if (bounds.isValid()) {
        viewermap.fitBounds(bounds, {padding:[20,20]});
    }
}


