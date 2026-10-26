<!DOCTYPE html>
<html>
<head>
</head>
<body>

<?php
$InstallLoc=getenv('UCVM_INSTALL_PATH');

$result=array();
$modelDir = $InstallLoc . '/model/*';
$result = is_dir(dirname($modelDir)) 
    ? array_map('basename', glob($modelDir) ?: []) 
    : [];

$itemlist = new \stdClass();
$itemlist->models=$result;

$resultstring = htmlspecialchars(json_encode($itemlist), ENT_QUOTES, 'UTF-8');

#print($resultstring);

echo "<div data-side=\"installModelList\" data-params=\""; 
echo $resultstring;
echo "\" style=\"display:flex\"></div>";
?>
</body>
</html>

