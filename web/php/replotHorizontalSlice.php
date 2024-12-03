<!DOCTYPE html>
<html>
<head>
</head>
<body>

<?php
/* replotHorizontalSlice.php */
include ("util.php");

$oncfm = ($_GET['oncfm']);
$onca = ($_GET['onca']);
$onrange = ($_GET['onrange']);
$onmin = ($_GET['onmin']);
$onmax = ($_GET['onmax']);
$fname = ($_GET['fname']);
$uid = ($_GET['uid']);

$csvfile="../result/".$fname;

$gmtpl="../perl/plotCVM-horzSlice.pl";

$envstr=makeEnvString();

#./plotCVM-horzSlice.pl path/to/file.csv plotFaults plotCities plotPts forceRange zMin zMax
if( $onrange == '1' ) {
  $gmtlstr=" ".$oncfm." ".$onca." 0 1 ".$onmin." ".$onmax;
  } else {
    $gmtlstr=" ".$oncfm." ".$onca." 0 0 ";
}

$gmtcommand = $envstr." ".$gmtpl." ".$csvfile.$gmtlstr;
$gmtresult = exec(escapeshellcmd($gmtcommand), $gmtretval, $gmtstatus);

#print($gmtcommand);

#print("gmtresult:"); print($gmtresult); print("<br>");
#print("gmtstatus:"); print($gmtstatus); print("<br>");
#print("gmtretval:"); 
#print("<pre>");
#print_r($gmtretval);
#print("</pre>");
#print("<br>");

$resultarray = new \stdClass();
$resultarray->uid= $uid;
$jj=json_decode($gmtresult);
$jj->uid=$uid;
$jj->csv=$uid."_h_data.csv";
$gmtresult_n=json_encode($jj);
$resultarray->gmtresult= $gmtresult;

if ( $gmtstatus == 0 ) {
    $resultstring = htmlspecialchars(json_encode($resultarray), ENT_QUOTES, 'UTF-8');
    echo "<div data-side=\"horizontalSliceReplot\" data-params=\"";
    echo $resultstring;
    echo "\" style=\"display:flex\"></div>";
}  
?>
</body>
</html>

