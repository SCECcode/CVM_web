<!DOCTYPE html>
<html>
<head>
</head>
<body>

<?php
/*  replotCrossSection.php,
*/

include ("util.php");

$oninterp = ($_GET['oninterp']);
$onmap = ($_GET['onmap']);
$oncfm = ($_GET['oncfm']);
$onca = ($_GET['onca']);
$onrange = ($_GET['onrange']);
$onpoint = ($_GET['onpoint']);
$onpad = ($_GET['onpad']);
$onpar = ($_GET['onpar']);
$oncmap = ($_GET['oncmap']);
$onmin = ($_GET['onmin']);
$onmax = ($_GET['onmax']);
$fname = ($_GET['fname']);
$uid = ($_GET['uid']);

$csvfile="../result/".$fname;

$envstr=makeEnvString();

#Usage: ./plotCVM-vertSection.pl path/to/file.csv 
#            plotParam interp plotPts plotMap plotFaults plotCities pad cMap forceRange zMin zMax

$gmtpl="../perl/plotCVM-vertSectionAll.pl";

if( $onrange == '1' ) {
  $gmtlstr=" ".$onpar." ".$oninterp." ".$onpoint." ".$onmap." ".$oncfm." ".$onca." ".$onpad. " ".$oncmap." 1 ".$onmin." ".$onmax;
  } else {
    $gmtlstr=" ".$onpar." ".$oninterp." ".$onpoint." ".$onmap." ".$oncfm." ".$onca." ".$onpad. " ".$oncmap." 0 ";
}

$gmtcommand = $envstr." ".$gmtpl." ".$csvfile.$gmtlstr;
$gmtresult = exec(escapeshellcmd($gmtcommand), $gmtretval, $gmtstatus);

#print($gmtcommand);
#print("<pre>");
#print_r($gmtresult);
#print("</pre>");

$resultarray = new \stdClass();
$resultarray->uid= $uid;
$jj=json_decode($gmtresult);
$jj->uid=$uid;
$jj->csv=$uid."_c_data.csv";
$gmtresult_n=json_encode($jj);
$resultarray->gmtresult= $gmtresult_n;

if ( $gmtstatus == 0 ) {
    $resultstring = htmlspecialchars(json_encode($resultarray), ENT_QUOTES, 'UTF-8');
    echo "<div data-side=\"crossSectionReplot\" data-params=\"";
    echo $resultstring;
    echo "\" style=\"display:flex\"></div>";
}
?>
</body>
</html>

