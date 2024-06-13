/***
   ucvm_state.js

***/

// utilities to track user state  
//   recovery and restart the user 
//   tracks uid+meta in external state_uid.json
function saveUserStateToFile(stateblob) {
   var uid=getRnd("");
   var sname="ucvm_state_"+uid+".json";
}


// mpPlotTable
function makeMPStateBlob()
{
   var blob=$('#materialPropertyTable').tableToJSON();
   var bstr=JSON.stringify(blob);
   window.console.log(bstr);
   return blob;
}

// metadataPlotTable
function makeMetaPlotResultStateBlob()
{
   var blob=$('#metadataPlotTable').tableToJSON();
   var bstr=JSON.stringify(blob);
   window.console.log(bstr);
   return blob;
}
