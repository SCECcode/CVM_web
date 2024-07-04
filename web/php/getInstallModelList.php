<!DOCTYPE html>
<html>
<head>
</head>
<body>

<?php

$result=array();

$InstallLoc= getenv('UCVM_INSTALL_PATH');
$Files = glob($InstallLoc."/model/*");

foreach ($Files as $file) {
    $bname=basename($file);
    array_push($result,$bname);
}

$itemlist = new \stdClass();
$itemlist->models=$result;

$resultstring = htmlspecialchars(json_encode($itemlist), ENT_QUOTES, 'UTF-8');

echo "<div data-side=\"installModelList\" data-params=\""; 
echo $resultstring;
echo "\" style=\"display:flex\"></div>";
?>
</body>
</html>

