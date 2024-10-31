<?php
require_once("SpatialData.php");

class CVM extends SpatialData
{
  function __construct()
  {
    $this->connection = pg_connect("host=db port=5432 dbname=CVM_db user=webonly password=scec");
    if (!$this->connection) { die('Could not connect'); }
  }

  public function search($type, $spec="", $criteria="")
  {
    $query = "";

    if (!is_array($spec)) {
      $spec = array($spec);
    }
    if (!is_array($criteria)) {
      $criteria = array($criteria);
    }

// need to get the dataset, depth, metric
    if (count($spec) !== 3) {
      $this->php_result = "BAD spec";
      return $this;
    }
    list($model_tb, $depth, $metric) = $spec;

    if (count($criteria) !== 4) {
      $this->php_result = "BAD criteria";
      return $this;
    }

    $criteria = array_map("floatVal", $criteria);
    list($firstlat, $firstlon, $secondlat, $secondlon) = $criteria;

    $minlon = $firstlon;
    $maxlon = $secondlon;
    if($firstlon > $secondlon) {
      $minlon = $secondlon;
      $maxlon = $firstlon;
    }

    $minlat = $firstlat;
    $maxlat = $secondlat;
    if($firstlat > $secondlat) {
      $minlat = $secondlat;
      $maxlat = $firstlat;
    }

    $query = "SELECT * from ".$model_tb." WHERE ST_Contains(ST_MakeEnvelope(".$minlon.",".$minlat.",".$maxlon.",".$maxlat.", 4326),".$model_tb.".geom) and dep = ".$depth;
    
    $result = pg_query($this->connection, $query);

    $cvm_result = array();

    while($row = pg_fetch_object($result)) {
          $cvm_result[] = $row;
    }

    $this->php_result = $cvm_result;
    return $this;
  }


  public function searchForModel($type, $spec="")
  { 

    if (!is_array($spec)) {
      $spec = array($spec);
    }

//
    // need to get the dataset, property
    if (count($spec) !== 2) {
      $this->php_result = "BAD";
      return $this;
    }

    list($model_tb, $property) = $spec;

    $query = "SELECT lat,lon,".$property." from ".$model_tb." ORDER BY ".$property." ASC";
    $result = pg_query($this->connection, $query);

//    print($query);

    $latlist = array();
    $lonlist = array();
    $vallist = array();

    while($row = pg_fetch_row($result)) {
      array_push($latlist,$row[0]);
      array_push($lonlist,$row[1]);
      array_push($vallist,$row[2]);
    }

    $resultarray = new \stdClass();
    $resultarray->lat = $latlist;
    $resultarray->lon = $lonlist;
    $resultarray->val = $vallist;

    $this->php_result = $resultarray;
    return $this;
  }

  public function getAllMetaData()
  {
    $query = "SELECT * from cvm_meta";
	  
    $result = pg_query($this->connection, $query);

    $meta_data = array();

    while($row = pg_fetch_object($result)) {
      $meta_data[] = $row;
    }

    $this->php_result = $meta_data;
    return $this;
  }
}
