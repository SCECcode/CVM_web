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

$start_time = microtime(true);

include ("util.php");

$firstlat = ($_GET['firstlat']);
$firstlon = ($_GET['firstlon']);
$z = ($_GET['z']);
$sval = ($_GET['spacing']);
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

$file="../result/".$uid."_h.png";
$csvfile="../result/".$uid."_h_data.csv";
$pngfile="../result/".$uid."_h_data.png";
$pdffile="../result/".$uid."_h_data.pdf";

if($datatype != 'vs30') {
  $zval=(int) $z;
  $lstr = " -b ".$firstlat.",".$firstlon." -u ".$secondlat.",".$secondlon." -e ".$zval;

  if ($zrange != 'none') {
   $lstr=" -z ".$zrange.$lstr;
  }
  if ($floors != 'none') {
   $lstr=" -L ".$floors.$lstr;
  }

  $qstub=" -d all -c ".$model." -s ".$sval." -a sd -o ".$file." -n ".$InstallLoc."/conf/ucvm.conf -i ".$InstallLoc;

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

$vp_metafile="../result/".$uid."_vp_meta.json";
$vp_binfile="../result/".$uid."_vp_data.bin";
$vs_metafile="../result/".$uid."_vs_meta.json";
$vs_binfile="../result/".$uid."_vs_data.bin";
$density_metafile="../result/".$uid."_density_meta.json";
$density_binfile="../result/".$uid."_density_data.bin";
$cvsquery = $envstr." ucvm_horizontal_slice2csv_all.py ".$vp_binfile." ".$vp_metafile." ".$vs_binfile." ".$vs_metafile." ".$density_binfile." ".$density_metafile." ".$csvfile;
$cvsresult = exec(escapeshellcmd($cvsquery), $cvsretval, $cvsstatus);
#print($cvsquery);

#1=Vp; 2=Vs; 3=Density
$gtype=2;
if($datatype == "vp" ) $gtype=1;
if($datatype == "density" ) $gtype=3;

##old: csv, plotparam, plotfault, plotcities, potpts, cmap, range
##new: csv, plotparam, interp, plotpts, plotfault, plotcities, cmap, range
$gmtpl="../perl/plotCVM-horzSliceAll.pl";
$gmtcommand = $envstr." ".$gmtpl." ".$csvfile." ".$gtype." 0 0 0 0 1 0";
$gmtresult = exec(escapeshellcmd($gmtcommand), $gmtretval, $gmtstatus);

#print($gmtcommand);
#print("gmtresult:"); print($gmtresult); print("<br>");
#print("gmtstatus:"); print($gmtstatus); print("<br>");
#print("gmtretval:"); 
#print("<pre>");
#print_r($gmtretval);
#print("</pre>");
#print("<br>");
#
#
$end_time = microtime(true);
$elapsed_time = $end_time - $start_time;
#print("Elapsed time: ".round($elapsed_time, 2)." sec\n");

$resultarray = new \stdClass();
$resultarray->uid= $uid;
$resultarray->type="horizontal";
if (file_exists($file)) {
  $resultarray->plot= $uid."_h.png";
}
$resultarray->query= $query;
$resultarray->meta= $uid."_h_meta.json";
$resultarray->data= $uid."_h_data.bin";
$resultarray->csv= $uid."_h_data.csv";
$resultarray->gmtpng= $uid."_h_data.png";
$resultarray->gmtpdf= $uid."_h_data.pdf";
$resultarray->elapsed=round($elapsed_time, 2);
$jj=json_decode($gmtresult);
$jj->csv=$uid."_h_data.csv";
$jj->uid=$uid;
$gmtresult_n=json_encode($jj);
$resultarray->gmtresult= $gmtresult_n;

if ( $gmtstatus == 0 && file_exists($pngfile)) {
    $resultstring = htmlspecialchars(json_encode($resultarray), ENT_QUOTES, 'UTF-8');
    echo "<div data-side=\"horizontalSlice".$uid."\" data-params=\"";
    echo $resultstring;
    echo "\" style=\"display:flex\"></div>";
}  
?>
</body>
</html>

