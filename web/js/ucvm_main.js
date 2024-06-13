/***
   ucvm_main.c

***/

var viewermap;

jQuery(document).ready(function() {

  frameHeight=window.innerHeight;
  frameWidth=window.innerWidth;

  viewermap=setup_viewer();
  setup_model();
  setup_fileFormat();
  setup_parameter();
  setup_ZMode();
  setup_CFM();
  setup_CRM();
  setup_CTM();
//  setup_CRMPoints();

  $(".popup").hide();

  $(".openpop").click(function(e) {
    e.preventDefault();
    $("iframe").attr("src",$(this).attr('href'));
    $(".links").fadeOut('slow');
    $(".popup").fadeIn('slow');
  });

  $(".close").click(function() {
    $(this).parent().fadeOut("slow");
    $(".links").fadeIn("slow");
  });

  $("#search-type").change(function () {
    var funcToRun = $(this).val();
    if (funcToRun != "") {
      window[funcToRun]();
    }
  });
  $("#search-type").trigger("change");

  $("#modelType").change(function () {
      var model = $(this).val();
      remove_all_models();
      load_selected_model(model);
      set_point_latlons_special();
      // special case.. elygtl:ely or elygtl:taper
      var v=document.getElementById('zrange').style.display;
      var vv=document.getElementById('floors').style.display;
      var ely=model.includes("elygtl:ely");
      var taper=model.includes("elygtl:taper");

      if(ely) {
         if( v == "none" ) { 
           document.getElementById('zrange').style.display="block";
         }
         if(vv != "none") {
           document.getElementById('floors').style.display="none";
         }
         set_zrange_presets();
	 set_zrange_stop(350);     
         return;
      }
      if(taper) {
         if(v == "none") {
           document.getElementById('zrange').style.display="block";
         }
         if(vv == "none") {
           document.getElementById('floors').style.display="block";
         }
         set_zrange_presets();
         set_zrange_stop(700);
         set_floors_presets();
         return;
      }
      if(v=="block" && !ely && !taper) {
         document.getElementById('zrange').style.display="none";
         set_zrange_presets();
      }
      if(vv=="block" && !taper) {
         document.getElementById('floors').style.display="none";
      }
  });

  $("#zModeType").change(function () {
      set_zrange_presets();
      reset_presets();
  });

  $("#areaDataTypeTxt").change(function () {
      reset_presets();
  });

  $('#processMPTableList li').click(function() {
      var v=$(this).data('id');
      processMPTable(v);
  });

  $('#processMetaPlotResultTableList li').click(function() {
      var v=$(this).data('id');
      processMetaPlotResultTable(v);
  });

  // setup the iframe for profile pageh
  $("#plotProfileBtn").click(function(e) {
      plotly_profile_run();
  });

}) // end of MAIN



