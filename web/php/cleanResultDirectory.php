<!DOCTYPE html>
<html>
<head>
</head>
<body>

<?php

include ("util.php");

$result=array();
$ResultLoc=("../result/");
$Files = glob($ResultLoc."*");
$count=0;

// 24 hours in seconds
$maxAge = 24 * 60 * 60; 

foreach ($Files as $file) {

    $filePath = $ResultLoc.$file;
    $fileAge = time() - filemtime($filePath);

    if($fileAge > $maxAge) {
	         
       if(is_dir($filePath)) {
	 deleteDirectory($filePath);
         $count=$count+1;
         array_push($result,$file);
       } else {
         unlink($filePath); 
         $count=$count+1;
         array_push($result,$file);
       }
    }
}

$itemlist = new \stdClass();
$itemlist->count=$count;

$resultstring = htmlspecialchars(json_encode($itemlist), ENT_QUOTES, 'UTF-8');

echo "<div data-side=\"cleanResultDirectory\" data-params=\""; 
echo $resultstring;
echo "\" style=\"display:flex\"></div>";
?>
</body>
</html>

