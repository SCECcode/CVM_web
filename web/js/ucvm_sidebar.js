/**

  ucvm_sidebar.js

**/

var start_sidebar=false;
var point_sidebar=false;
var profile_sidebar=false;
var line_sidebar=false;
var area_sidebar=false;

var drawing_point=false;
var drawing_profile=false;
var drawing_line=false;
var drawing_area=false;

// initiate a click on the sidebar buttons
// to dismiss the sidebar
function dismiss_sidebar() {
  clear_popup(); 
  if(point_sidebar) pointClick();
  if(profile_sidebar) profileClick();
  if(line_sidebar) lineClick();
  if(area_sidebar) areaClick();
  if(start_sidebar) startClick();

//  var sidebarptr=$('#sidebar');
//  sidebarptr.css("display","none");
}

function refresh_sidebar() {
  dismiss_sidebar();
  reset_point_latlons();
  reset_profile_latlons();
  reset_line_latlons();
  reset_area_latlons();

  startClick();

  //var sidebarptr=$('#sidebar');
  //sidebarptr.css("display","none");
}

/***********************************************************/
// start sidebar js
// slide out
function startClick() {
  if(!start_sidebar) { dismiss_sidebar(); }

  start_sidebar = !start_sidebar;
  if(start_sidebar) {
    sidebar_start_slideOut();
    } else {
      sidebar_start_slideIn();
  }
}

//dismiss all popup and suppress the popup on map
function sidebar_start_slideOut() {
  var panelptr=$('#start');
  var sidebarptr=$('#sidebar');
  panelptr.css("display","");
  sidebarptr.css("display","");
  sidebarptr.css("background","whitesmoke");
  panelptr.removeClass('fade-out').addClass('fade-in');
}

// enable the popup on map
function sidebar_start_slideIn() {
  var panelptr=$('#start');
  panelptr.removeClass('fade-in').addClass('fade-out');
  panelptr.css("display","none");
}


/***********************************************************/


/***********************************************************/

// area sidebar js
// slide out
function areaClick() {
  if(!area_sidebar) { dismiss_sidebar(); }

  area_sidebar = !area_sidebar;
  if(area_sidebar) {
    sidebar_area_slideOut();
    $('#areaBtn').addClass('pick');
    markAreaLatlon();
    } else {
      // enable the popup on map
      sidebar_area_slideIn();
      $('#areaBtn').removeClass('pick');
  }
}

function set_area_latlons_preset() {
   var t= document.getElementById("zModeType").value;
   var tt= document.getElementById("areaDataTypeTxt").value;
   var areazptr=$('#areaZTxt');
   if(tt == "vs30" ) {
      areazptr.val(0);
      areazptr.css("display","none");
      return;
   }
   if(t == "d") {
      areazptr.val(1000);
      areazptr.css("display","");
      } else {
        areazptr.val(-1000);
        areazptr.css("display","");
   }
}

function set_area_latlons(uid, firstlat,firstlon,secondlat,secondlon) {
   // need to capture the lat lon and draw a area
   if(area_sidebar && drawing_area) {
       $( "#areaFirstLatTxt" ).val(round2Four(firstlat));
       $( "#areaFirstLonTxt" ).val(round2Four(firstlon));
       $( "#areaSecondLatTxt" ).val(round2Four(secondlat));
       $( "#areaSecondLonTxt" ).val(round2Four(secondlon));
       set_area_latlons_preset();
       $( "#areaDataTypeTxt" ).val("vs"); 
       $( "#areaUIDTxt" ).val(uid);
   }
}

function reset_area_latlons() {
   $( "#areaFirstLatTxt" ).val('');
   $( "#areaFirstLonTxt" ).val('');
   $( "#areaSecondLatTxt" ).val('');
   $( "#areaSecondLonTxt" ).val('');
   $( "#areaZTxt" ).val('');
   $( "#areaDataTypeTxt" ).val('');
   reset_area_UID();
}

function set_area_UID(uid) {
   $( "#areaUIDTxt" ).val(uid);
}
function reset_area_UID() {
   $( "#areaUIDTxt" ).val('');
}

function in_drawing_area() { 
   if(drawing_area && area_sidebar) {
     return 1;
   } 
   return 0;
}

// need to capture the lat lon and draw a area but
// not when in the map-marking mode : drawing_area==true
function chk_and_add_bounding_area() {
  
  if(drawing_area) {
    return;
  }
  var firstlatstr=document.getElementById("areaFirstLatTxt").value;
  var firstlonstr=document.getElementById("areaFirstLonTxt").value;
  var secondlatstr=document.getElementById("areaSecondLatTxt").value;
  var secondlonstr=document.getElementById("areaSecondLonTxt").value;

  if(secondlatstr == "optional" && secondlonstr == "optional") {
    if(firstlatstr && firstlonstr) { // 2 values
       var t1=parseFloat(firstlatstr);
       var t2=parseFloat(firstlonstr);
       park_a=t1-0.001;
       park_b=t2-0.001;
       park_c=t1+0.001;
       park_d=t2+0.001;
       add_bounding_area(park_a,park_b,park_c,park_d);
    } 
    } else {
       if(secondlatstr && secondlonstr) {
         if(firstlatstr && firstlonstr) { // 4 values
           park_a=parseFloat(firstlatstr);
           park_b=parseFloat(firstlonstr);
           park_c=parseFloat(secondlatstr);
           park_d=parseFloat(secondlonstr);
           add_bounding_area(park_a,park_b,park_c,park_d);
         }
       }
  }
}

//dismiss all popup and suppress the popup on map
function sidebar_area_slideOut() {
  if (jQuery('#area').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#area');
  var sidebarptr=$('#sidebar');
  panelptr.css("display","");
  sidebarptr.css("display","");
  sidebarptr.css("background","whitesmoke");
  panelptr.removeClass('fade-out').addClass('fade-in');
}

function markAreaLatlon() {
  window.console.log("in markArea..");
  if(skipPopup == false) { // enable marking
    clear_popup();
    skipPopup = true;
    drawing_area=true;
    } else {
       skipPopup = false;
       drawing_area=false;
       skipArea();
  }
}

function reset_markAreaLatlon() {
  window.console.log("in reset markArea..");
  skipPopup = false;
  drawing_area=false;
  skipArea();
}


// enable the popup on map
function sidebar_area_slideIn() {
  if (jQuery('#area').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#area');
  panelptr.removeClass('fade-in').addClass('fade-out');
  panelptr.css("display","none");
  reset_markAreaLatlon();
}


/***********************************************************/

// point sidebar js
// slide out
function pointClick() {
  if(!point_sidebar) { dismiss_sidebar(); }

  point_sidebar = !point_sidebar;
  if(point_sidebar) {
    sidebar_point_slideOut();
    $('#pointBtn').addClass('pick');
    set_point_latlons_special();
    markPointLatlon();
    } else {
      // enable the popup on map
      sidebar_point_slideIn();
      reset_point_latlons();
      $('#pointBtn').removeClass('pick');
  }
}


function set_point_latlons_preset()
{
    $( "#pointZTxt" ).val(0);
}

/*  special preset case for ivslu/cvlsu because they are sparse */
function set_point_latlons_special() 
{
    reset_point_latlons();
/*  special preset case for ivslu/cvlsu because they are sparse */
    var model=document.getElementById("modelType").value;
    if(model == "ivlsu") {
        $( "#pointFirstLatTxt" ).val(32.686);
        $( "#pointFirstLonTxt" ).val(-116.05);
        reset_point_UID();
        $( "#pointZTxt" ).val(1000);
    } 
    if(model == "cvlsu") {
        $( "#pointFirstLatTxt" ).val(33.31);
        $( "#pointFirstLonTxt" ).val(-116.57);
        reset_point_UID();
        $( "#pointZTxt" ).val(1000);
    } 
}
 
function set_point_latlons(uid,lat,lon) {
   // need to capture the lat lon and draw a point
   if(point_sidebar && drawing_point) {
       $( "#pointFirstLatTxt" ).val(round2Four(lat));
       $( "#pointFirstLonTxt" ).val(round2Four(lon));
       $( "#pointUIDTxt" ).val(uid);
       set_point_latlons_preset()
   }
}
function reset_point_latlons() {
   $( "#pointFirstLatTxt" ).val('');
   $( "#pointFirstLonTxt" ).val('');
   $( "#pointZTxt" ).val('');
   reset_point_UID();
}

function set_point_UID(uid) {
   $( "#pointUIDTxt" ).val(uid);
}

function reset_point_UID() {
   $( "#pointUIDTxt" ).val('');
}

function in_drawing_point() {
   if(point_sidebar && drawing_point) {
     return 1;
   }
   return 0;
}

// need to capture the lat lon and draw a point but
// not when in the map-marking mode : drawing_point==true
function chk_and_add_point() {
  
  if(drawing_point) {
    return;
  }

  var firstlatstr=document.getElementById("pointFirstLatTxt").value;
  var firstlonstr=document.getElementById("pointFirstLonTxt").value;

  if(firstlatstr && firstlonstr) { // 2 values
    var park_a=parseFloat(firstlatstr);
    var park_b=parseFloat(firstlonstr);
    add_bounding_point(park_a,park_b);
  }
}
//dismiss all popup and suppress the popup on map
function sidebar_point_slideOut() {
  if (jQuery('#point').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#point');
  var sidebarptr=$('#sidebar');
  panelptr.css("display","");
  sidebarptr.css("display","");
  sidebarptr.css("background","whitesmoke");
  panelptr.removeClass('fade-out').addClass('fade-in');
}

function markPointLatlon() {
  if(skipPopup == false) { // enable marking
    clear_popup();
    skipPopup = true;
    drawing_point=true;
    } else {
       skipPopup = false;
       drawing_point=false;
       skipPoint();
  }
}

function reset_markPointLatlon() {
  skipPopup = false;
  drawing_point=false;
  skipPoint();
}


// enable the popup on map
function sidebar_point_slideIn() {
  if (jQuery('#point').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#point');
  panelptr.removeClass('fade-in').addClass('fade-out');
  panelptr.css("display","none");
  reset_markPointLatlon();
}


/***********************************************************/

// line sidebar js
// slide out
function lineClick() {
  if(!line_sidebar) { dismiss_sidebar(); }

  line_sidebar = !line_sidebar;
  if(line_sidebar) {
    sidebar_line_slideOut();
    $('#lineBtn').addClass('pick');
    markLineLatlon();
    } else {
      // enable the popup on map
      sidebar_line_slideIn();
      $('#lineBtn').removeClass('pick');
  }
}

function set_line_latlons_preset() {
   var t= document.getElementById("zModeType").value;
   if(t == "d") {
      $( "#lineZTxt" ).val(5000);
      $( "#lineZStartTxt" ).val(0);
      } else {
          $( "#lineZTxt" ).val(-4000);
          $( "#lineZStartTxt" ).val(300);
   }
}

function set_line_latlons(uid,firstlat,firstlon,secondlat,secondlon) {
   // need to capture the lat lon and draw a line
   if(line_sidebar && drawing_line) {
       $( "#lineFirstLatTxt" ).val(round2Four(firstlat));
       $( "#lineFirstLonTxt" ).val(round2Four(firstlon));
       $( "#lineSecondLatTxt" ).val(round2Four(secondlat));
       $( "#lineSecondLonTxt" ).val(round2Four(secondlon));
       set_line_latlons_preset();
       $( "#lineDataTypeTxt" ).val("vs"); 
       $( "#lineUIDTxt" ).val(uid);
   }
}

function reset_line_latlons(){
   $( "#lineFirstLatTxt" ).val('');
   $( "#lineFirstLonTxt" ).val('');
   $( "#lineSecondLatTxt" ).val('');
   $( "#lineSecondLonTxt" ).val('');
   $( "#lineZTxt" ).val('');
   $( "#lineZStartTxt" ).val('');
   $( "#lineDataTypeTxt" ).val('');
   reset_line_UID();
}

function set_line_UID(uid){
   $( "#lineUIDTxt" ).val(uid);
}
function reset_line_UID(){
   $( "#lineUIDTxt" ).val('');
}

function in_drawing_line() {
   if(line_sidebar && drawing_line) {
     return 1;
   }
   return 0;
}

// need to capture the lat lon and draw a line but
// not when in the map-marking mode : drawing_line==true
function chk_and_add_bounding_line() {
  
  if(drawing_line) {
    return;
  }
  var firstlatstr=document.getElementById("lineFirstLatTxt").value;
  var firstlonstr=document.getElementById("lineFirstLonTxt").value;
  var secondlatstr=document.getElementById("lineSecondLatTxt").value;
  var secondlonstr=document.getElementById("lineSecondLonTxt").value;

  if(secondlatstr == "optional" && secondlonstr == "optional") {
    if(firstlatstr && firstlonstr) { // 2 values
       var t1=parseFloat(firstlatstr);
       var t2=parseFloat(firstlonstr);
       park_a=t1-0.001;
       park_b=t2-0.001;
       park_c=t1+0.001;
       park_d=t2+0.001;
       add_bounding_line(park_a,park_b,park_c,park_d);
    } 
    } else {
       if(secondlatstr && secondlonstr) {
         if(firstlatstr && firstlonstr) { // 4 values
           park_a=parseFloat(firstlatstr);
           park_b=parseFloat(firstlonstr);
           park_c=parseFloat(secondlatstr);
           park_d=parseFloat(secondlonstr);
           add_bounding_line(park_a,park_b,park_c,park_d);
         }
       }
  }
}

//dismiss all popup and suppress the popup on map
function sidebar_line_slideOut() {
  if (jQuery('#line').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#line');
  var sidebarptr=$('#sidebar');
  panelptr.css("display","");
  sidebarptr.css("display","");
  sidebarptr.css("background","whitesmoke");
  panelptr.removeClass('fade-out').addClass('fade-in');
}

function markLineLatlon() {
  if(skipPopup == false) { // enable marking
    clear_popup();
    skipPopup = true;
    drawing_line=true;
    } else {
       skipPopup = false;
       drawing_line=false;
       skipLine();
  }
}

function reset_markLineLatlon() {
  skipPopup = false;
  drawing_line=false;
  skipLine();
}


// enable the popup on map
function sidebar_line_slideIn() {
  if (jQuery('#line').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#line');
  panelptr.removeClass('fade-in').addClass('fade-out');
  panelptr.css("display","none");
  reset_markLineLatlon();
}


/***********************************************************/

// profile sidebar js
// slide out
function profileClick() {
  if(!profile_sidebar) { dismiss_sidebar(); }

  profile_sidebar = !profile_sidebar;
  if(profile_sidebar) {
    sidebar_profile_slideOut();
    $('#profileBtn').addClass('pick');
    markProfileLatlon();
    } else {
      // enable the popup on map
      sidebar_profile_slideIn();
      $('#profileBtn').removeClass('pick');
  }
}

function set_profile_latlons_preset()
{
   var t= document.getElementById("zModeType").value;
   if( t == 'd' ) {
       $( "#profileZEndTxt" ).val(30000);
       $( "#profileZStartTxt" ).val(0);
       $( "#profileZStepTxt" ).val(100);
       } else {
           $( "#profileZEndTxt" ).val(-25000);
           $( "#profileZStartTxt" ).val(500);
           $( "#profileZStepTxt" ).val(-100);
   }
}

function set_profile_latlons(uid,lat,lon) {
   // need to capture the lat lon and draw a profile
   if(profile_sidebar && drawing_profile) {
       $( "#profileFirstLatTxt" ).val(round2Four(lat));
       $( "#profileFirstLonTxt" ).val(round2Four(lon));
       $( "#profileUIDTxt" ).val(uid);
// should put in some default values for Z start, Z end, Z step
       set_profile_latlons_preset();
   }
}

function reset_profile_latlons() {
   $( "#profileFirstLatTxt" ).val('');
   $( "#profileFirstLonTxt" ).val('');
   $( "#profileZEndTxt" ).val('');
   $( "#profileZStartTxt" ).val('');
   $( "#profileZStepTxt" ).val('');
   reset_profile_UID();
}

function set_profile_UID(uid) {
   $( "#profileUIDTxt" ).val(uid);
}
function reset_profile_UID() {
   $( "#profileUIDTxt" ).val('');
}

function in_drawing_profile() {
   if(profile_sidebar && drawing_profile) {
     return 1;
   }
   return 0;
}

// need to capture the lat lon and draw a profile but
// not when in the map-marking mode : drawing_profile==true
function chk_and_add_profile() {
  
  if(drawing_profile) {
    return;
  }

  var firstlatstr=document.getElementById("profileFirstLatTxt").value;
  var firstlonstr=document.getElementById("profileFirstLonTxt").value;

  if(firstlatstr && firstlonstr) { // 2 values
    var park_a=parseFloat(firstlatstr);
    var park_b=parseFloat(firstlonstr);
    add_bounding_profile(park_a,park_b);
  }
}
//dismiss all popup and suppress the popup on map
function sidebar_profile_slideOut() {
  if (jQuery('#profile').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#profile');
  var sidebarptr=$('#sidebar');
  panelptr.css("display","");
  sidebarptr.css("display","");
  sidebarptr.css("background","whitesmoke");
  panelptr.removeClass('fade-out').addClass('fade-in');
}

function markProfileLatlon() {
  if(skipPopup == false) { // enable marking
    clear_popup();
    skipPopup = true;
    drawing_profile=true;
    } else {
       skipPopup = false;
       drawing_profile=false;
       skipProfile();
  }
}

function reset_markProfileLatlon() {
  skipPopup = false;
  drawing_profile=false;
  skipProfile();
}


// enable the popup on map
function sidebar_profile_slideIn() {
  if (jQuery('#profile').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#profile');
  panelptr.removeClass('fade-in').addClass('fade-out');
  panelptr.css("display","none");
  reset_markProfileLatlon();
}

/****************************************************************/
function reset_presets()
{
  if(point_sidebar) {
    set_point_latlons_preset();
  }
  if(profile_sidebar) {
    set_profile_latlons_preset();
  }
  if(line_sidebar) {
    set_line_latlons_preset();
  }
  if(area_sidebar) {
    set_area_latlons_preset();
  }
}

// this is when either lat or lon or z for point gets altered
// and if there is a dirty uid, clear it
function reset_area_presets()
{
  if(dirty_layer_uid) {
    remove_a_layer(dirty_layer_uid);
    reset_dirty_uid();
  }
  reset_area_UID();
}

function reset_line_presets()
{
  if(dirty_layer_uid) {
    remove_a_layer(dirty_layer_uid);
    reset_dirty_uid();
  }
  reset_line_UID();
}

function reset_profile_presets()
{
  if(dirty_layer_uid) {
    remove_a_layer(dirty_layer_uid);
    reset_dirty_uid();
  }
  reset_profile_UID();
}

function reset_point_presets()
{
  if(dirty_layer_uid) {
    remove_a_layer(dirty_layer_uid);
    reset_dirty_uid();
  }
  reset_point_UID();
}
