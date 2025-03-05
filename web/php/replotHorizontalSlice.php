<!DOCTYPE html>
<html>
<head>
</head>
<body>

<?php
/* replotHorizontalSlice.php */
include ("util.php");

$oninterp = ($_GET['oninterp']);
$oncfm = ($_GET['oncfm']);
$onca = ($_GET['onca']);
$onrange = ($_GET['onrange']);
$onpoint = ($_GET['onpoint']);
$oncmap = ($_GET['oncmap']);
$onpar = ($_GET['onpar']);
$onmin = ($_GET['onmin']);
$onmax = ($_GET['onmax']);
$fname = ($_GET['fname']);
$uid = ($_GET['uid']);

$csvfile="../result/".$fname;

$gmtpl="../perl/plotCVM-horzSliceAll.pl";

$envstr=makeEnvString();

##Usage: csv, plotparam, interp, plotpts, plotfault, plotcities, cmap, range

if( $onrange == '1' ) {
  $gmtlstr=" ".$onpar." ".$oninterp." ".$onpoint." ".$oncfm." ".$onca." ".$oncmap." 1 ".$onmin." ".$onmax;
  } else {
    $gmtlstr=" ".$onpar." ".$oninterp." ".$onpoint." ".$oncfm." ".$onca." ".$oncmap." 0";
}
$gmtcommand = $envstr." ".$gmtpl." ".$csvfile.$gmtlstr;
$gmtresult = exec(escapeshellcmd($gmtcommand), $gmtretval, $gmtstatus);

#print($gmtcommand);print("<br>");
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

