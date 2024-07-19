
/***
   cvm_expand.js

      expabigMapBtn and the leaflet map view
***/

/************************************************************************************/
var big_map=0; // 0,1(some control),2(none)

function _toMedView()
{
let elt = document.getElementById('banner-container');
let celt = document.getElementById('top-intro');
let c_height = elt.clientHeight+(celt.clientHeight/2);
let h=576+c_height;

$('#top-intro').css("display", "none");
$('#CVM_plot').css("height", h);
$('#search-container').css("display", "none");
$('.leaflet-control-attribution').css("width", "70rem");
$('#mapDataBig').removeClass('row').addClass('col-12');
$('#map-container').removeClass('col-7').addClass('row');
$('#map-container').removeClass("pl-2");
resize_map();
}

function _toMinView()
{
let height=window.innerHeight;
let width=window.innerWidth;

$('#top-control').css("display", "none");
$('#result-container').css("display", "none");

$('.navbar').css("margin-bottom", "0px");
$('.container').css("max-width", "100%");
$('#map-container').removeClass("pl-2");
$('.leaflet-control-attribution').css("width", "100rem");
$('.container').css("padding-left", "0px");
$('.container').css("padding-right", "0px");
// minus the height of the container top 
let elt = document.getElementById('banner-container');
let c_height = elt.clientHeight;
let h = height - c_height-4.5;
let w = width - 15;
$('#CVM_plot').css("height", h);
$('#CVM_plot').css("width", w);
resize_map();
}

function _toNormalView()
{
$('#top-control').css("display", "");
$('#result-container').css("display", "");
$('#CVM_plot').css("height", "576px");
$('#CVM_plot').css("width", "635px");
$('.navbar').css("margin-bottom", "20px");
$('.container').css("max-width", "1140px");
$('.leaflet-control-attribution').css("width", "35rem");
$('#top-intro').css("display", "");
$('#search-container').css("display","");
$('#mapDataBig').removeClass('col-12').addClass('row');
$('#map-container').removeClass('row').addClass('col-7');
$('#map-container').addClass("pl-2");
resize_map();
}

function toggleBigMap()
{
  switch (big_map)  {
    case 0:
      big_map=1;
      _toMedView();		   
      break;
    case 1:
      big_map=2;
      _toMinView();		   
      break;
    case 2:
      big_map=0;
      _toNormalView();		   
      break;
  }
}

// back to initial big map
function toBigMap()
{
   big_map=0;
   _toNormalView();
}
