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

$InstallLoc= getenv('UCVM_INSTALL_PATH');

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
$metafile="../result/".$uid."_h_meta.json";
$binfile="../result/".$uid."_h_data.bin";

$csvfile="../result/".$uid."_h_data.csv";
$pngfile="../result/".$uid."_h_data.png";
$pdffile="../result/".$uid."_h_data.pdf";

$gmtpl="../perl/plotCVM-horzSlice.pl";

if($datatype != 'vs30') {
  $zval=(int) $z;
  $lstr = " -b ".$firstlat.",".$firstlon." -u ".$secondlat.",".$secondlon." -e ".$zval;

  if ($zrange != 'none') {
   $lstr=" -z ".$zrange.$lstr;
  }
  if ($floors != 'none') {
   $lstr=" -L ".$floors.$lstr;
  }

  $qstub=" -d ".$datatype." -c ".$model." -s ".$sval." -a sd -o ".$file." -n ".$InstallLoc."/conf/ucvm.conf -i ".$InstallLoc;

  if( $zmode == 'd') {
#    $query= $envstr." plot_horizontal_slice.py ".$qstub.$lstr;
    $query= $envstr." plot_horizontal_slice.py -S ".$qstub.$lstr;
    } else {
      $query= $envstr." plot_elevation_horizontal_slice.py ".$qstub.$lstr;
  }
  } else {
    $lstr = " -b ".$firstlat.",".$firstlon." -u ".$secondlat.",".$secondlon;
    $qstub=" -s ".$sval." -c ".$model." -a dd -o ".$file." -i ".$InstallLoc;
    $query= $envstr." plot_vs30_etree_map.py".$qstub.$lstr;
}

$result = exec(escapeshellcmd($query), $retval, $status);
$rc=checkResult($query,$result,$uid);
#print($result);

$cvsquery = $envstr." ucvm_horizontal_slice2csv_line.py ".$binfile." ".$metafile;
$cvsresult = exec(escapeshellcmd($cvsquery), $cvsretval, $cvsstatus);
#print($cvsquery);

# Usage: ./plotCVM-horzSlice.pl path/to/file.csv plotFaults plotCities forceRange zMin zMax
$gmtcommand = $envstr." ".$gmtpl." ".$csvfile." 0 0 0";
$gmtresult = exec(escapeshellcmd($gmtcommand), $gmtretval, $gmtstatus);

print($gmtcommand);
#print("<br>");
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
$resultarray->qtype="horizontal";
if (file_exists($file)) {
  $resultarray->plot= $uid."_h.png";
}
$resultarray->query= $query;
$resultarray->meta= $uid."_h_meta.json";
$resultarray->data= $uid."_h_data.bin";
$resultarray->csv= $uid."_h_data.csv";
$resultarray->gmtpng= $uid."_h_data.png";
$resultarray->gmtpdf= $uid."_h_data.pdf";

if ( $gmtstatus == 0 && file_exists($pngfile)) {
    $resultstring = htmlspecialchars(json_encode($resultarray), ENT_QUOTES, 'UTF-8');
    echo "<div data-side=\"horizontalSlice".$uid."\" data-params=\"";
    echo $resultstring;
    echo "\" style=\"display:flex\"></div>";
}  
?>
</body>
</html>

