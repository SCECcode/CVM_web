<!DOCTYPE html>
<html>
<head>
</head>
<body>

<?php
/*  replotCrossSection.php,
*/

include ("util.php");

$oncfm = ($_GET['oncfm']);
$onca = ($_GET['onca']);
$onrange = ($_GET['onrange']);
$onpad = ($_GET['pad']);
$onmin = ($_GET['onmin']);
$onmax = ($_GET['onmax']);
$fname = ($_GET['fname']);
$uid = ($_GET['uid']);

$csvfile="../result/".$fname;

$envstr=makeEnvString();

$gmtpl="../perl/plotCVM-vertSection.pl";

#./plotCVM-vertSection.pl path/to/file.csv plotFaults plotCities plotPts pad forceRange zMin zMax
if( $onrange == '1' ) {
  $gmtlstr=" ".$oncfm." ".$onca." 0 ".$onpad." 1 ".$onmin." ".$onmax;
  } else {
    $gmtlstr=" ".$oncfm." ".$onca." 0 ".$onpad." 0 ";
}

$gmtcommand = $envstr." ".$gmtpl." ".$csvfile.$gmtlstr;
$gmtresult = exec(escapeshellcmd($gmtcommand), $gmtretval, $gmtstatus);

print($gmtcommand);
print("<br>");
print("gmtresult:"); print("<br>");
print("gmtstatus:");  print("<br>");
print("gmtretval:"); 
print("<pre>");
print_r($gmtretval);
print("</pre>");
print("<br>");

$resultarray = new \stdClass();
$resultarray->uid= $uid;
$jj=json_decode($gmtresult);
$jj->uid=$uid;
$jj->csv=$uid."_c_data.csv";
$gmtresult_n=json_encode($jj);
$resultarray->gmtresult= $gmtresult;
$resultarray = new \stdClass();
$resultarray->type= "cross";
$resultarray->uid= $uid;
if (file_exists($file)) {
$resultarray->plot= $uid."_c.png";

if ( $gmtstatus == 0 ) {
    $resultstring = htmlspecialchars(json_encode($resultarray), ENT_QUOTES, 'UTF-8');
    echo "<div data-side=\"crossSectionReplot\" data-params=\"";
    echo $resultstring;
    echo "\" style=\"display:flex\"></div>";
}
?>
</body>
</html>

