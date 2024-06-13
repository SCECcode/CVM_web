
/*** iframe housekeeping ***/
function setIframSize(id) {
  let topH = document.documentElement.clientHeight;
  let topW = document.documentElement.clientWidth;
//  window.console.log("topH,",topH,"topW,", topW);
  let f_h = 58; //header or footer
  var height=topH -(f_h* 3);
  var width= topW/3;

  let oh=document.getElementById(id).height;
  let ow=document.getElementById(id).width;
//  window.console.log("oH,",oh,"oW,", ow);
 
  document.getElementById(id).height = height;
//  window.console.log("setH,",height,"setW,", width);
}

function plotly_profile_run(){
   var plist=get_all_highlight_profile_list();
   var data=[];
   var sz=plist.length;
   var i;

   for(i=0;i<sz;i++) {
     var d=readVProfileDataFile(plist[i]);
     if(d) {
       data.push(d);
     }
   }

   var ulist=JSON.stringify(plist);
   var srcstr= "plotly_profile/compare.html?uidlist="+ulist;
   window.console.log(srcstr);
//   var frameHeight=window.innerHeight;
//   document.getElementById("viewProfileIfram").height = frameHeight * 0.9 ;
   $('#viewProfileIfram').attr('src',srcstr);

   setTimeout(() => { send_to_profileIfram(JSON.stringify(data)) ; }, 2000);
}

/**** the profile uid ***/
function get_all_highlight_profile_list() {
   var cnt=ucvm_profile_list.length;
   var plist=[];
   if(cnt == 0) { // none to look at
     window.console.log("no highlighted profile data");
     return plist;
   } else {
     var i;
     var item;
     var uid;
     for(i=0;i<cnt;i++) {
       item=ucvm_profile_list[i];
       uid=item['uid']; 
       // it is highlighted 
       if(isLayergroupHigh(uid)) {
         plist.push(uid);
       }
     }
   }
   return plist;
}

function readVProfileDataFile(uid) {

  var fmeta=makeVProfileMetaFname(uid);
  var fmp=makeVProfileMPFname(uid);
  var fcsv=makeVProfileCSVFname(uid);
  fmeta="result/"+fmeta;
  fmp="result/"+fmp;

  var fmetablob=getTextFile(fmeta);
  var metajson=JSON.parse(fmetablob);
  var fmpblob=getTextFile(fmp);
  var mpjson=JSON.parse(fmpblob);
  if( "depth" in metajson ) {
    var data= { uid:uid, mp:mpjson, meta:metajson};
    return data;
    } else {
    return null;
  }
}

function send_to_profileIfram(data) {
  var loc = location.hostname;
  var profileWindow = document.getElementById('viewProfileIfram').contentWindow;
  // postMessage arguments: data to send, target origin
  if(loc=="moho.scec.org") {
    profileWindow.postMessage(data, 'http://moho.scec.org');
    } else {
      profileWindow.postMessage(data, 'http://localhost');
  }

}
