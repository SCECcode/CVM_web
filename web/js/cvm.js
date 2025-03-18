/***
   cvm.js
***/

var CVM = new function () {

  this.model_debug = 0;
  this.model_initialized = false;

// gather up the valid cvm models for this instance
  this.setup_model = function() {
    getInstallModelList();
  };

  this.setupCVMInterface = function() {

// setup parameter table 
     document.getElementById('parametersTable-container').innerHTML=makeParametersTable();
   };

// possible layer's slices
// z2.5  z1.0  velocity(vs,vp,density)
   var cvm_csv_keys= {
       lon:'LON',
       lat:'LAT',
       vs:'VS',
       vp:'VP',
       density:'DENSITY'
   };    

// PIXI
   this.changePixiLayerOpacity= function (alpha) {
    
      let spec = [];
      let spec_idx = [];
      let spec_data = [];
      [ spec, spec_idx, spec_data ] = this.getSpec();
    
      let pixiuid= this.lookupModelLayers(
                    spec_idx[0], spec_idx[1], spec_idx[2]);
      let old=pixiGetPixiOverlayOpacity(pixiuid);
      if(alpha != old) {
        pixiSetPixiOverlayOpacity(pixiuid, alpha);
      } 
   }   

// HOW TO DEFINE spec
// spec = [ tmodel, ddepth, mmetric ];
// spec_idx = [ tidx,midx,didx ];
// spec_data = [ data_min, data_max ]; a range specific to model and metric
   this.getSpec = function() {
        
     let tidx=parseInt($("#modelType").val());
     let model=this.csm_models[tidx];
     let tmodel=model['table_name'];
          
     if( (this.searchingType ==this.searchType.latlon) &&
                          (model['data'] != undefined) ) { 
         tmodel=model['data'];
     }   
         
     let d=model['jblob']['meta'];
     let dd=d['dataByDEP'];

     let tdepth=parseInt($("#modelDepth").val());
	         let didx=0;
      for(let i=0; i<dd.length; i++) {
         let t=dd[i];
         if(t["dep"] == tdepth) {
           didx=i;
           break;
         }
      }
      let ddd=dd[didx];
      let ddepth=ddd["dep"];
//window.console.log("SPEC:modelDepth_idx is "+didx+"("+ddepth+"km)");

      let m=model['jblob']['metric'];
      let tmetric=$("#modelMetric").val();
      let mdix=0;
      for(let i=0; i<m.length; i++) {
        if(m[i] == tmetric) {
          midx=i;
          break;
        }
      }
      let mmetric=m[midx];
//window.console.log("SPEC:modelMetric_idx is "+midx+"("+mmetric+")");

      let datamin=null;
      let datamax=null;
      // if metric is "aphi"
      if(mmetric=="Aphi") {
        datamax=3.0;
	              datamin=0.0;
      } else if(mmetric=="SHmax") {
        datamax=90.0;
        datamin=-90.0;
      } else if(mmetric=="Iso") {
        let keys=Object.keys(ddd);

        if( keys.indexOf('iso_001qs') >= 0 ) {
          datamin=ddd['iso_001qs'];
          datamax=ddd['iso_999qs'];
          } else {
            datamin=ddd['iso_001q'];
            datamax=ddd['iso_999q'];
        }
      } else if(mmetric=="Dif") {
        let keys=Object.keys(ddd);
        if( keys.indexOf('dif_001qs') >= 0 ) {
          datamin=ddd['dif_001qs'];
          datamax=ddd['dif_999qs'];
          } else {
            datamin=ddd['dif_001q'];
            datamax=ddd['dif_999q'];
        }
      }
// special case, if diplaying model data is different from download model data
      let spec = [ tmodel, ddepth, mmetric ];

      let spec_idx = [ tidx,midx,didx ];
      let spec_data = [datamin, datamax];

//window.console.log("using: spec is >> ",spec);
//window.console.log("spec_idx is: ",spec_idx);

      return [spec, spec_idx, spec_data];
   }

   this.resetAll = function() {

     document.getElementById("phpResponseTxt").innerHTML = "";

     refreshMPTable();
     refreshResultTable();
     remove_all_layers();

     refresh_zmode();
     refresh_model_type();
     refresh_select(); // option

     // back to inital state
     $("#selectModelType").trigger("change");
   };

   this.hardReset = function() {
     window.location.reload();
     return false;
   }

/******************************************/
    this.processByLatlonForPoint = function(fromMap) {
      getMaterialPropertyByLatlon();
    };
 
    this.processByLatlonForProfile = function(fromMap) {
      plotVerticalProfile();
    };

    this.processByLatlonForLine = function(fromMap) {
      plotCrossSection();
    };

    this.processByLatlonForArea = function(fromMap) {
      plotHorizontalSlice();
    };

};



