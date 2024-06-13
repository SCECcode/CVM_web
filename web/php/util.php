<?php
function makeEnvString() {
   $myhost = gethostname();
   if ($myhost == "MeiPro.local") {
      $envstr="PROJ_LIB=/Users/mei/SCEC/anaconda2/share/proj PATH=/Users/mei/anaconda2/bin:/Users/mei/anaconda2/condabin:/anaconda2/bin:/usr/local/opt/libxml2/bin:/usr/local/opt/sqlite/bin:/usr/local/opt/libxml2/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/X11/bin:/Library/Apple/usr/bin PYTHONPATH=../model/UCVM_TARGET/ucvm_plotting";
   } else { 
	   $envstr="PROJ_LIB=../model/UCVM_TARGET/lib/proj/share/proj PATH=/usr/local/share/anaconda2/bin:/usr/local/share/anaconda2/condabin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin PYTHONPATH=../model/UCVM_TARGET/ucvm_plotting";
   }
   return $envstr;
}

function checkResult($query,$result,$uid) {
  $qname="../result/query_".$uid;
  $pos=strpos($result,"ERROR:");
  $fp= fopen($qname,"w+") or die("Unable to open file!");
  fwrite($fp,$query); fwrite($fp,"\n");
  fwrite($fp,$result); fwrite($fp,"\n");
  fclose($fp);
  if( $pos != FALSE ) { // found ERROR
     $fp= fopen($qname,"w+") or die("Unable to open file!");
     fwrite($fp,$query); fwrite($fp,"\n");
     fwrite($fp,$result); fwrite($fp,"\n");
     fclose($fp);
     return TRUE;
  } 
  return FALSE;
}

function makeCSVDepthProfile($uid) {
  $csvname="../result/".$uid."_v_data.csv";

  $cfp= fopen($csvname,"w+") or die("Unable to open file!");

  $metaname="../result/".$uid."_v_meta.json";
  $mpname="../result/".$uid."_v_matprops.json";

  $json = file_get_contents($metaname);
  $json_meta = json_decode($json,true);

#  print_r($json_meta);

  $json = file_get_contents($mpname);
  $json_mp = json_decode($json,true);

  $depth=$json_meta["ending_depth"];
  $start=$json_meta["starting_depth"];
  $cvm=$json_meta["cvm"];
  $lon=$json_meta["lon1"];
  $lat=$json_meta["lat1"];
  $step=$json_meta["vertical_spacing"];
  $comment=$json_meta["comment"];
  $depthlist=$json_meta["depth"];
  $mplist=$json_mp["matprops"];

  fwrite($cfp,"#UID:".$uid."\n");
  fwrite($cfp,"#CVM:".$comment." (".$cvm.")\n");
  fwrite($cfp,"#Lat:".$lat."\n");
  fwrite($cfp,"#Long:".$lon."\n");
  fwrite($cfp,"#Start_depth(m):".$start."\n");
  fwrite($cfp,"#End_depth(m):".$depth."\n");
  fwrite($cfp,"#Vert_spacing(m):".$step."\n");
  fwrite($cfp,"#Depth(m), Vp(m/s), Vs(m/s), Density(kg/m^3)\n");

  ### iterate through the mp list
  $len=count($depthlist);
  for($i=0; $i<$len; $i++) {
    $item=$mplist[$i];
    fwrite($cfp,$depthlist[$i].",".$item["vp"].",".$item["vs"].",".$item["density"]."\n");
  }
  fclose($cfp);
  return TRUE;
}

function makeCSVElevationProfile($uid) {
  $csvname="../result/".$uid."_v_data.csv";

  $cfp= fopen($csvname,"w+") or die("Unable to open file!");

  $metaname="../result/".$uid."_v_meta.json";
  $mpname="../result/".$uid."_v_matprops.json";

  $json = file_get_contents($metaname);
  $json_meta = json_decode($json,true);

  $json = file_get_contents($mpname);
  $json_mp = json_decode($json,true);

  $depth=$json_meta["ending_elevation"];
  $start=$json_meta["starting_elevation"];
  $cvm=$json_meta["cvm"];
  $lon=$json_meta["lon1"];
  $lat=$json_meta["lat1"];
  $step=$json_meta["vertical_spacing"];
  $comment=$json_meta["comment"];
  $evelist=$json_meta["elevation"];
  $mplist=$json_mp["matprops"];

  fwrite($cfp,"#UID:".$uid."\n");
  fwrite($cfp,"#CVM:".$comment." (".$cvm.")\n");
  fwrite($cfp,"#Lat:".$lat." Long:".$lon." Start_elevation(m):".$start." End_elevation(m):".$depth." Vert_spacing(m):".$step."\n");
  fwrite($cfp,"#Elevation(m), Vp(km/s), Vs(km/s), Density(kg/m^3)\n");

  ### iterate through the mp list
  $len=count($evelist);
  for($i=0; $i<$len; $i++) {
    $item=$mplist[$i];
    fwrite($cfp,$evelist[$i].",".$item["vp"].",".$item["vs"].",".$item["density"]."\n");
  }
  fclose($cfp);
  return TRUE;
}

?>
