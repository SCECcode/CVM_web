<!DOCTYPE html>
<html>
<head>
</head>
<body>

<?php
$lat = ($_GET['lat']);
$lon = ($_GET['lon']);
$z = ($_GET['z']);
$zmode = ($_GET['zmode']);
$model = ($_GET['model']);
$zrange = ($_GET['zrange']);
$floors = ($_GET['floors']);
$uid = ($_GET['uid']);

$InstallLoc= getenv('UCVM_INSTALL_PATH');

$estr = " -b -l ".$lat.",".$lon.",".$z." ";

if ($zmode == 'e') {
  $estr=" -c ge".$estr;
  } else {
    $estr=" -c gd".$estr;
}
if ($zrange != 'none') {
  $estr=" -z ".$zrange.$estr;
}
if ($floors != 'none') {
  $estr=" -L ".$floors.$estr;
}

$query=$InstallLoc."/utilities/run_ucvm_query.sh -m ".$model." -f ".$InstallLoc."/conf/ucvm.conf ".$estr;
$result = exec(escapeshellcmd($query), $retval, $status);

$item=json_decode($result);
$item->{"Zmode"} = $zmode;
$nresult= json_encode($item);
$itemlist = new \stdClass();

$itemlist->mp=$nresult;

$resultstring = htmlspecialchars(json_encode($itemlist), ENT_QUOTES, 'UTF-8');

echo "<div data-side=\"materialPropertyByLatlon".$uid."\" data-params=\""; 
echo $resultstring;
echo "\" style=\"display:flex\"></div>";
?>
</body>
</html>

