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

$csvfile="../result/".$fname;

$gmtpl="../perl/plotCVM-horzSlice.pl";

$envstr=makeEnvString();

# plotCVM-horzSlice.pl path/to/file.csv plotFaults plotCities forceZrange zMin zMax
# plotFaults, plotCities, and forceZrange are either 0=no 1=yes
# zMin and zMax are the forced ranges and note: zMin and zMax 
# only need to be specified if forceZrange=1
if( $onrange == '1' ) {
  $gmtlstr=" ".$oncfm." ".$onca." 1 ".$onmin." ".$onmax;
  } else {
    $gmtlstr=" ".$oncfm." ".$onca." 0";
}

$gmtcommand = $envstr." ".$gmtpl." ".$csvfile.$gmtlstr;
$gmtresult = exec(escapeshellcmd($gmtcommand), $gmtretval, $gmtstatus);

print("<br>");
print($gmtcommand);
print("<br>");

#print("gmtresult:"); print($gmtresult); print("<br>");
#print("gmtstatus:"); print($gmtstatus); print("<br>");
#print("gmtretval:"); 
#print("<pre>");
#print_r($gmtretval);
#print("</pre>");
#print("<br>");

$resultarray = new \stdClass();
$resultarray->qtype="horizontal";
$resultarray->csv= $cvsfile;

if ( $gmtstatus == 0 ) {
    $resultstring = htmlspecialchars(json_encode($resultarray), ENT_QUOTES, 'UTF-8');
    echo "<div data-side=\"horizontalSliceReplot\" data-params=\"";
    echo $resultstring;
    echo "\" style=\"display:flex\"></div>";
}  
?>
</body>
</html>

