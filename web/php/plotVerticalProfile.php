<!DOCTYPE html>
<html>
<head>
</head>
<body>

<?php
include ("util.php");

$lat = ($_GET['lat']);
$lon = ($_GET['lon']);
$z = ($_GET['z']);
$zstart = ($_GET['zstart']);
$zstep = ($_GET['zstep']);
$datatype = ($_GET['datatype']);
$zmode = ($_GET['zmode']);
$model = ($_GET['model']);
$comment = "'".($_GET['comment'])."'";
$zrange = ($_GET['zrange']);
$floors = ($_GET['floors']);
$uid = ($_GET['uid']);

$InstallLoc= getenv('UCVM_INSTALL_PATH');

$file="../result/".$uid."_v.png";
$matpropsfile="../result/".$uid."_v_matprops.json";
$metafile="../result/".$uid."_v_meta.json";

$envstr=makeEnvString();

$lstr = " -v ".$zstep." -b ".$zstart." -s ".$lat.",".$lon." -e ".$z;

if ($zrange != 'none') {
  $lstr = " -z ".$zrange.$lstr;
}
if ($floors != 'none') {
  $lstr = " -L ".$floors.$lstr;
}

if ($comment != 'none') {
  $lstr = " -C ".$comment.$lstr;
}

$qstub=" -n ".$InstallLoc."/conf/ucvm.conf -i ".$InstallLoc." -d ".$datatype." -c ".$model." -o ".$file;

if ($zmode == 'e') {
  $query= $envstr." plot_elevation_profile.py ".$qstub.$lstr;
  } else {
    $query= $envstr." plot_depth_profile.py ".$qstub.$lstr;
}

print($query);

$result = exec(escapeshellcmd($query), $retval, $status);
$rc=checkResult($query, $result, $uid);

print($result);

$cvsquery = $envstr." ucvm_vertical_profile2csv.py ".$matpropsfile." ".$metafile;
$cvsresult = exec(escapeshellcmd($cvsquery), $cvsretval, $cvsstatus);
#print($cvsquery);
#$cvsrc=checkResult($cvsquery, $cvsresult, $uid);

#if ($zmode == 'e') {
#  $rc=makeCSVElevationProfile($uid);
#  } else {
#    $rc=makeCSVDepthProfile($uid);
#}

$resultarray = new \stdClass();
$resultarray->uid= $uid;
$resultarray->plot= $uid."_v.png";
$resultarray->query= $query;
$resultarray->meta= $uid."_v_meta.json";
$resultarray->dataset= $uid."_v_matprops.json";
$resultarray->csv= $uid."_v_matprops.csv";

if ( $status == 0 && file_exists($file)) {

$resultstring = htmlspecialchars(json_encode($resultarray), ENT_QUOTES, 'UTF-8');
echo "<div data-side=\"verticalProfile".$uid."\" data-params=\""; 
echo $resultstring;
echo "\" style=\"display:flex\"></div>";
}
?>
</body>
</html>

