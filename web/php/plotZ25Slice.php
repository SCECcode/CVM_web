<!DOCTYPE html>
<html>
<head>
</head>
<body>

<?php
/* plotZ25Slice.php,
       plot_z25_map.py
*/
include ("util.php");

$model = ($_GET['model']);
$uid = ($_GET['uid']);

$firstlat = ($_GET['firstlat']);
$firstlon = ($_GET['firstlon']);
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

$file="../result/".$uid."z25.png";

$lstr = " -b ".$firstlat.",".$firstlon." -u ".$secondlat.",".$secondlon;
$qstub= " -c ".$model." -s ".$sval." -a d -o ".$file." -n ../model/UCVM_TARGET/conf/ucvm.conf -i ../model/UCVM_TARGET ";
$query= $envstr." plot_z25_map.py ".$qstub.$lstr;

$result = exec(escapeshellcmd($query), $retval, $status);

$rc=checkResult($query,$result,$uid);

$resultarray = new \stdClass();
$resultarray->uid= $uid;
$resultarray->plot= $uid."z25.png";
$resultarray->query= $query;
$resultarray->meta= $uid."z25_meta.json";
$resultarray->data= $uid."z25_data.bin";

if ( $status == 0 && file_exists($file)) {
    $resultstring = htmlspecialchars(json_encode($resultarray), ENT_QUOTES, 'UTF-8');
    echo "<div data-side=\"z25Slice".$uid."\" data-params=\"";
    echo $resultstring;
    echo "\" style=\"display:flex\"></div>";
}  
?>
</body>
</html>

