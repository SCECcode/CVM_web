<?php
function makeEnvString() {
   $myhost = gethostname();
   $installLoc= getenv('UCVM_INSTALL_PATH');
   $conda3Loc= getenv('ANACONDA3_TOP_DIR');
   $plottingLoc= getenv('PLOTTING_TOP_DIR');
   $syspathstr= getenv('PATH');
   $pycvmLoc= $conda3Loc."/lib/python3.11/site-packages";
   $projstr= $installLoc."/lib/proj/share/proj";
   $metadataLoc= $plottingLoc."/metadata_utilities";

   $condaenvLoc=$conda3Loc."/envs/cvm_explorer_conda_env";

   $pathstr= $metadataLoc."/bin:".$conda3Loc."/bin:".$conda3Loc."/condabin:".$condaenvLoc."/bin:".$syspathstr;

   $pythonstr=$plottingLoc."/ucvm_plotting";
   $envstr="PROJ_LIB=".$projstr." PATH=".$pathstr." PYTHONPATH=".$pythonstr;
//   print($envstr);
   return $envstr;
}

function checkResult($query,$result,$uid) {
  $qname="../result/query_".$uid;
  $pos=strpos($result,"ERROR:");
  $fp= fopen($qname,"w+") or die("Unable to open query command file!");
  fwrite($fp,$query); fwrite($fp,"\n");
  fwrite($fp,$result); fwrite($fp,"\n");
  fclose($fp);
  if( $pos != FALSE ) { // found ERROR
     $fp= fopen($qname,"w+") or die("Unable to open query command file!");
     fwrite($fp,$query); fwrite($fp,"\n");
     fwrite($fp,$result); fwrite($fp,"\n");
     fclose($fp);
     return TRUE;
  } 
  return FALSE;
}

function makeCSVDepthProfile($uid) {
  $csvname="../result/".$uid."_v_data.csv";

  $cfp= fopen($csvname,"w+") or die("Unable to open cvs data file!");

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

  $cfp= fopen($csvname,"w+") or die("Unable to open cvs data file!");

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
