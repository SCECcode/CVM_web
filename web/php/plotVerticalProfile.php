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
$metafile="../result/".$uid."_v_meta.json";
$matpropsfile="../result/".$uid."_v_matprops.json";
$csvfile="../result/".$uid."_v_matprops.csv";
$pngfile="../result/".$uid."_v_matprops.png";
$pdffile="../result/".$uid."_v_matprops.pdf";

$gmtpl="../perl/plotCVM-1Dvert.pl";

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

//print($query);

$result = exec(escapeshellcmd($query), $retval, $status);
$rc=checkResult($query, $result, $uid);
//#print($result);

$cvsquery = $envstr." ucvm_vertical_profile2csv.py ".$matpropsfile." ".$metafile;
$cvsresult = exec(escapeshellcmd($cvsquery), $cvsretval, $cvsstatus);
//#print($cvsquery);

#if ($zmode == 'e') {
#  $rc=makeCSVElevationProfile($uid);
#  } else {
#    $rc=makeCSVDepthProfile($uid);
#}
$mode=4;
if ($datatype == 'vp') $mode=1;
if ($datatype == 'vs') $mode=2;
if ($datatype == 'density') $mode=3;

$gmtcommand = $envstr." ".$gmtpl." ".$csvfile." ".$mode;
$gmtresult = exec(escapeshellcmd($gmtcommand), $gmtretval, $gmtstatus);

#print($gmtcommand);
#print("<br>");
#print("gmtresult:"); print($gmtresult); print("<br>");
#print("gmtstatus:"); print($gmtstatus); print("<br>");
#print("gmtretval:"); 
#print("<pre>");
#print_r($gmtretval);
#print("</pre>");
#print("<br>");


$resultarray = new \stdClass();
$resultarray->uid= $uid;
$resultarray->plot= $uid."_v.png";
$resultarray->query= $query;
$resultarray->meta= $uid."_v_meta.json";
$resultarray->dataset= $uid."_v_matprops.json";
$resultarray->csv= $uid."_v_matprops.csv";
$resultarray->gmtpng= $uid."_v_matprops.png";
$resultarray->gmtpdf= $uid."_v_matprops.pdf";


if ( $gmtstatus == 0 && file_exists($pngfile)) {

$resultstring = htmlspecialchars(json_encode($resultarray), ENT_QUOTES, 'UTF-8');
echo "<div data-side=\"verticalProfile".$uid."\" data-params=\""; 
echo $resultstring;
echo "\" style=\"display:flex\"></div>";
}
?>
</body>
</html>

