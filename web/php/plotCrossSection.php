<!DOCTYPE html>
<html>
<head>
</head>
<body>

<?php
/*  plotCrossSection.php,
    for vs,vp,rho 
       plot_cross_section.py
      or
       plot_elevation_cross_section.py
*/

$start_time = microtime(true);

include ("util.php");

$firstlat = ($_GET['firstlat']);
$firstlon = ($_GET['firstlon']);
$z = ($_GET['z']);
$zmode = ($_GET['zmode']);
$model= ($_GET['model']);
$zrange = ($_GET['zrange']);
$floors = ($_GET['floors']);
$zstart = ($_GET['zstart']);
$datatype = ($_GET['datatype']);
$uid = ($_GET['uid']);
$secondlat = ($_GET['secondlat']);
$secondlon = ($_GET['secondlon']);
$hval = ($_GET['spacing']);

$InstallLoc= getenv('UCVM_INSTALL_PATH');

$envstr=makeEnvString();

$file="../result/".$uid."_c.png";
$csvfile="../result/".$uid."_c_data.csv";
$pngfile="../result/".$uid."_c_data.png";
$pdffile="../result/".$uid."_c_data.pdf";

$lstr = " -b ".$firstlat.",".$firstlon." -u ".$secondlat.",".$secondlon;
if ($zrange != 'none') {
	$lstr= ' -z '.$zrange.$lstr;
}
if ($floors != 'none') {
	$lstr= ' -L '.$floors.$lstr;
}

// keep vertical to be 100 layers
$vval= intval(((float)$z-(float)$zstart)/100); 

$lstr=$lstr ." -e ".$z;
// always get a full set
$qstub=" -s ".$zstart." -h ".$hval." -d all -c ".$model." -a sd -o ".$file." -n ".$InstallLoc."/conf/ucvm.conf -i ".$InstallLoc." -v ".$vval;
if ($zmode == 'e') {
	$query= $envstr." plot_elevation_cross_section.py".$qstub.$lstr;
} else {
        $query= $envstr." plot_cross_section.py -S ".$qstub.$lstr;
}
//print($query);

$result = exec(escapeshellcmd($query), $retval, $status);
$rc=checkResult($query, $result, $uid);

$vp_metafile="../result/".$uid."_vp_meta.json";
$vp_binfile="../result/".$uid."_vp_data.bin";
$vs_metafile="../result/".$uid."_vs_meta.json";
$vs_binfile="../result/".$uid."_vs_data.bin";
$density_metafile="../result/".$uid."_density_meta.json";
$density_binfile="../result/".$uid."_density_data.bin";
$cvsquery = $envstr." ucvm_cross_section2csv_all.py ".$vp_binfile." ".$vp_metafile." ".$vs_binfile." ".$vs_metafile." ".$density_binfile." ".$density_metafile." ".$csvfile;
$cvsresult = exec(escapeshellcmd($cvsquery), $cvsretval, $cvsstatus);

#Usage: ./plotCVM-vertSectionAll.pl path/to/file.csv 
#              interp plotPts plotMap plotFaults plotCities pad cMap forceRange zMin zMax

#1=Vp; 2=Vs; 3=Density
$gtype=2;
if($datatype == "vp" ) $gtype=1;
if($datatype == "density" ) $gtype=3;

$gmtpl="../perl/plotCVM-vertSectionAll.pl";
$gmtcommand = $envstr." ".$gmtpl." ".$csvfile." ".$gtype. " 0 0 1 0 0 1 1 0"; 

$gmtresult = exec(escapeshellcmd($gmtcommand), $gmtretval, $gmtstatus);

#print($gmtcommand);
#print("<pre>");
#print_r($gmtretval);
#print("</pre>");

$end_time = microtime(true);
$elapsed_time = $end_time - $start_time;
#print("Elapsed time: ".round($elapsed_time, 2)." sec\n");

$resultarray = new \stdClass();
$resultarray->type= "cross";
$resultarray->uid= $uid;
if (file_exists($file)) {
$resultarray->plot= $uid."_c.png";
}
$resultarray->query= $query;
$resultarray->meta= $uid."_c_meta.json";
$resultarray->data= $uid."_c_data.bin";
$resultarray->csv= $uid."_c_data.csv";
$resultarray->gmtpng= $uid."_c_data.png";
$resultarray->gmtpdf= $uid."_c_data.pdf";
$resultarray->elapsed=round($elapsed_time, 2);
$jj=json_decode($gmtresult);
$jj->csv=$uid."_c_data.csv";
$jj->uid=$uid;
$gmtresult_n=json_encode($jj);
$resultarray->gmtresult= $gmtresult_n;

if ( $gmtstatus == 0 && file_exists($pngfile)) {
    $resultstring = htmlspecialchars(json_encode($resultarray), ENT_QUOTES, 'UTF-8');
    echo "<div data-side=\"crossSection".$uid."\" data-params=\"";
    echo $resultstring;
    echo "\" style=\"display:flex\"></div>";
}
?>
</body>
</html>

