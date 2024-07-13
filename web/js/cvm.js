/***
   cvm.js
***/

var CVM = new function () {

  this.model_debug = 0;
  this.mdoel_initialized = false;

// gather up the valid cvm models for this instance
  this.setup_model = function() {
    getInstallModelList();
  };

  this.setupCVMInterface = function() {

// setup various info tables
// parameter table 
     document.getElementById('parametersTable-container').innerHTML=makeParametersTable();
// file format table
     document.getElementById('fileFormatTable-container').innerHTML=makeFileFormatTable();
// zmode table
     document.getElementById('ZModeTable-container').innerHTML=makeZModeTable();

//??? starting mode, first model one list, option for point, option for depth
	  //
   };

   this.resetAll = function() {

     //document.getElementById("search-type").value = "freezeClick";
     document.getElementById("phpResponseTxt").innerHTML = "";

     refreshMPTable();
     refreshResultTable();
     remove_all_layers();

     refresh_zmode();
     refresh_model_type();
     refresh_select(); // option

     // back to inital stte
     $("#modelType").trigger("change");
     reset_presets();

   };

/******************************************/
    this.processByLatlonForPoint = function(fromMap) {
      document.getElementById('spinIconForProperty').style.display = "block";
      getMaterialPropertyByLatlon();
    };
 
    this.processByLatlonForProfile = function(fromMap) {
      document.getElementById('spinIconForProfile').style.display = "block";
      plotVerticalProfile();
    };

    this.processByLatlonForLine = function(fromMap) {
      document.getElementById('spinIconForLine').style.display = "block";
      plotCrossSection();
    };

    this.processByLatlonForArea = function(fromMap) {
      document.getElementById('spinIconForArea').style.display = "block";
      plotHorizontalSlice();
    };

};



