<!DOCTYPE html>
<html>
<head>
</head>
<body>

<?php
/* plotHorizontalSlice.php,
    for vs,vp,rho
        plot_horizontal_slice.py 
      or
        plot_elevation_horizontal_slice.py
    for vs30,
       plot_vs30_etree_map.py
*/
include ("util.php");

$firstlat = ($_GET['firstlat']);
$firstlon = ($_GET['firstlon']);
$z = ($_GET['z']);
$zmode = ($_GET['zmode']);
$model = ($_GET['model']);
$zrange = ($_GET['zrange']);
$floors = ($_GET['floors']);
$datatype = ($_GET['datatype']);
$uid = ($_GET['uid']);

$secondlat = ($_GET['secondlat']);
$secondlon = ($_GET['secondlon']);

$envstr=makeEnvString();

$lval= round(($secondlat - $firstlat), 3);
$llval=round(($secondlon - $firstlon), 3);

if ($lval == 0) {
echo "ERROR: Two points can not have same Latitute";
return;
}
if ($llval == 0) {
echo "ERROR: Two points can not have same Longitude";
return;
}

$sval= round(sqrt(($lval*$lval) + ($llval*$llval))/100,3);

if ($sval == 0) {
  $sval=0.001;
}

$file="../result/".$uid."_h.png";

if($datatype != 'vs30') {
  $zval=(int) $z;
  $lstr = " -b ".$firstlat.",".$firstlon." -u ".$secondlat.",".$secondlon." -e ".$zval;

  if ($zrange != 'none') {
   $lstr=" -z ".$zrange.$lstr;
  }
  if ($floors != 'none') {
   $lstr=" -L ".$floors.$lstr;
  }

  $qstub=" -d ".$datatype." -c ".$model." -s ".$sval." -a sd -o ".$file." -n ../model/UCVM_TARGET/conf/ucvm.conf -i ../model/UCVM_TARGET ";
#  $qstub=" -d ".$datatype." -c ".$model." -s ".$sval." -a s -o ".$file." -n ../model/UCVM_TARGET/conf/ucvm.conf -i ../model/UCVM_TARGET ";

  if( $zmode == 'd') {
    $query= $envstr." plot_horizontal_slice.py ".$qstub.$lstr;
    } else {
      $query= $envstr." plot_elevation_horizontal_slice.py ".$qstub.$lstr;
  }
  } else {
    $lstr = " -b ".$firstlat.",".$firstlon." -u ".$secondlat.",".$secondlon;
    $qstub=" -s ".$sval." -c ".$model." -a dd -o ".$file." -i ../model/UCVM_TARGET";
    $query= $envstr." plot_vs30_etree_map.py".$qstub.$lstr;
}

$result = exec(escapeshellcmd($query), $retval, $status);

$rc=checkResult($query,$result,$uid);

$resultarray = new \stdClass();
$resultarray->uid= $uid;
$resultarray->plot= $uid."_h.png";
$resultarray->query= $query;
$resultarray->meta= $uid."_h_meta.json";
$resultarray->data= $uid."_h_data.bin";

if ( $status == 0 && file_exists($file)) {
    $resultstring = htmlspecialchars(json_encode($resultarray), ENT_QUOTES, 'UTF-8');
    echo "<div data-side=\"horizontalSlice".$uid."\" data-params=\"";
    echo $resultstring;
    echo "\" style=\"display:flex\"></div>";
}  
?>
</body>
</html>

