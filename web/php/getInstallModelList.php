<!DOCTYPE html>
<html>
<head>
</head>
<body>

<?php

$result=array();

$Files = glob("../model/UCVM_TARGET/model/*");
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

