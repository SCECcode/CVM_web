/***
   cvm_main.c

***/

var viewermap;

jQuery(document).ready(function() {

  frameHeight=window.innerHeight;
  frameWidth=window.innerWidth;

  if( screen.width <= 480 ) {
    window.console.log("OH NO.. I am on Mini.."+screen.width);
    //location.href = '/mobile.html';
  }

  viewermap=setup_viewer();

  $(".popup").hide();

  $(".openpop").click(function(e) {
    e.preventDefault();
    $("iframe").attr("src",$(this).attr('href'));
    $(".links").fadeOut('slow');
    $(".popup").fadeIn('slow');
  });

/*
  $(".close").click(function() {
    $(this).parent().fadeOut("slow");
    $(".links").fadeIn("slow");
  });
*/

  $("#searchType").change(function () {
      var s= document.getElementById("searchType").value;
      if( s == 'lineClick' || s == 'areaClick' ) { 
        $( "#zMode-elevClick" ).attr("disabled","disabled");
        } else {
          $( "#zMode-elevClick" ).attr("disabled",false);
      }
      var funcToRun = $(this).val();
      if (funcToRun != "") {
        window[funcToRun]();
      }
  });
  $("#searchType").trigger("change");

  $("#selectModelType").change(function () {
      var model = $(this).val();
      remove_all_models();
      load_selected_model(model);
      refreshModelDescription(model);
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

  // setup the iframe for profile page
  $("#plotProfileBtn").click(function(e) {
      plotly_profile_run();
  });

  $("#cvm-model-cfm").on('click', function () {
      if ($(this).prop('checked')) {
          CXM.showCFMFaults(viewermap);
      } else {
          CXM.hideCFMFaults(viewermap);
      }
  });
    
  $("#cvm-model-gfm").change(function() {
    if ($("#cvm-model-gfm").prop('checked')) { 
        CXM.showGFMRegions(viewermap);
        } else {
            CXM.hideGFMRegions(viewermap);
    } 
  });     

  $("#cvm-model-ctm").change(function() {
    if ($("#cvm-model-ctm").prop('checked')) {
        CXM.showCTMRegions(viewermap);
        } else {
            CXM.hideCTMRegions(viewermap);
    }
  });

  $("#cvm-model-cvm").change(function() {
    toggleShowModels();
  });

/***** reference popup modal *****/
  $('#modalreference').on('show.bs.modal', function (event) {
        var btn = $(event.relatedTarget); 
        var ref_info=btn.data('ref');        
	$("#modalreferencebody").html(ref_info);
  });
/***** info popup modal *****/
  $('#modalinfo').on('show.bs.modal', function (event) {
        var btn = $(event.relatedTarget); 
        var info_info=btn.data('info');        
	$("#modalinfobody").html(info_info);
  });
/***** tinyinfo popup modal *****/
  $('#modaltinyinfo').on('show.bs.modal', function (event) {
        var btn = $(event.relatedTarget); 
        var tinyinfo_info=btn.data('info');        
	$("#modaltinyinfobody").html(tinyinfo_info);
  });

/***** plotoption popup modal *****/
  $('#modalplotoption').on('show.bs.modal', function (event) {
    // button that triggered the modal
        var btn = $(event.relatedTarget); 
        var blob_btn=btn.data('blob');        
        var blob=document.getElementById(blob_btn).innerHTML;
        let type=updatePlotOptions(blob);

 	let json=JSON.parse(blob);
        let myfile=json['file'];
        // switch from ../reslut/pdffile to /cvm-explorer/result/pdffile 
//window.console.log("  myfile is  -->", myfile);
        MODAL_REPLOT_SRC=myfile.replace("..","/research/cvm-explorer");
        MODAL_REPLOT_TYPE=type;
        MODAL_REPLOT_PAR=false; // start as false initially
//window.console.log("  new myfile is  -->", MODAL_REPLOT_SRC);

    // Set the modal content dynamically
        var modal = $(this);

	$('#plotOptionIfram').attr('src',MODAL_REPLOT_SRC);
	let h=setIframHeight("plotOptionIfram");

        document.getElementById("plotoption-header").style.display="";

  });
// special case.. if onpar get changed, need to track and call refresh plot range
  $("#plotParamTxt").change(function() {
        MODAL_REPLOT_PAR=true;
	// clear the min/max 
        document.getElementById("minPlotScaleTxt").value=0;
        document.getElementById("maxPlotScaleTxt").value=0;
 
  });

  $('#giveUp').click(function() {
      document.getElementById('spinIconForArea').style.display = "none";
      document.getElementById('spinIconForLine').style.display = "none";
      CVM.hardReset();
  });


// MAIN SETUP
  CVM.setup_model();
  CVM.setupCVMInterface();
  cleanResultDirectory();
  // 11:00pm
  setDailyCleanResult(23, 0);

  $.event.trigger({ type: "page-ready", "message": "completed", });

}); // end of MAIN



