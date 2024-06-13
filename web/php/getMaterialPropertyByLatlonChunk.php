<!DOCTYPE html>
<html>
<head>
</head>
<body>

<?php
/* get string and then need to split and extract triplet out of them */
$datastr = ($_GET['datastr']); 
$zmode = ($_GET['zmode']);
$model = ($_GET['model']);
$zrange = ($_GET['zrange']);
$floors = ($_GET['floors']);
$chunkid = intVal($_GET['chunkid']);
$uid = ($_GET['uid']);
$lastchunks = intVal($_GET['chunks'])-1;

/* if chunkid == 0, it is first chunk, create 
   the .json file in result/UCVM_uid_p_matprops.json, 
   other ones, just 'append'               */

$fname="../result/".$uid."_p_matprops.json";

// setup the start
if ($chunkid == 0) {
   $fp= fopen($fname,"w") or die("Unable to open file!");
   $start=" { \"".$uid."\": [";
   fwrite($fp,$start); fwrite($fp,"\n");
   fclose($fp);
}

$datalist=explode(",",$datastr);

$tmpname="../result/".$uid."-".$chunkid.".txt";
$tmpfp= fopen($tmpname,"w") or die("Unable to open file!");

$cnt=count($datalist);
$set= intval($cnt/3);

for($i=0; $i< $set; $i++) {

  $idx= $i*3;
  $lon=$datalist[$idx];
  $lat=$datalist[$idx+1];
  $z=$datalist[$idx+2];

  $line=$lon." ".$lat." ".$z."\n";
  fwrite($tmpfp,$line); 
}

$estr = " -b -I ".$tmpname." -O ".$fname;

if ($zmode == 'e') {
  $estr=" -c ge".$estr;
  } else {
    $estr=" -c gd".$estr;
}
if ($zrange != 'none') {
  $estr=' -z '.$zrange.$estr;
}
if ($floors != 'none') {
  $estr=' -L '.$floors.$estr;
}

$query="../model/UCVM_TARGET/utilities/run_ucvm_query.sh -m ".$model." -f ../model/UCVM_TARGET/conf/ucvm.conf ".$estr;

$result = exec(escapeshellcmd($query), $retval, $status);

if($chunkid == $lastchunks) {
  $fp= fopen($fname,"a+") or die("Unable to open file!");
  fwrite($fp,"\n] }\n");
  fclose($fp);
}

// don't transfer back the material property..
$resultarray = new \stdClass();
$resultarray->uid= $uid;
$resultarray->mp= $uid."_p_matprops.json";
$resultarray->query= $query;

$resultstring = htmlspecialchars(json_encode($resultarray), ENT_QUOTES, 'UTF-8');

echo "<div data-side=\"materialPropertyByLatlonChunk".$uid."\" data-params=\""; 
echo $resultstring;
echo "\" style=\"display:flex\"></div>";
?>
</body>
</html>

