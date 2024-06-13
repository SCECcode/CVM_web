<?php
require_once("php/navigation.php");
$header = getHeader("Viewer");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>SCEC Community Models Viewer (prototype)</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="css/vendor/font-awesome.min.css">
    <link rel="stylesheet" href="css/vendor/bootstrap.min.css">
    <link rel="stylesheet" href="css/vendor/leaflet.awesome-markers.css">
    <link rel="stylesheet" href="css/vendor/leaflet.css">

    <link rel="stylesheet" href="css/vendor/bootstrap-grid.min.css">
    <link rel="stylesheet" href="css/vendor/jquery-ui.css">

    <link rel="stylesheet" href="css/vendor/glyphicons.css">
    <link rel="stylesheet" href="css/vendor/animation.css">

    <link rel="stylesheet" href="css/ucvm-ui.css">
    <link rel="stylesheet" href="css/scec-ui.css">
    <link rel="stylesheet" href="css/sidebar.css">

    <script type="text/javascript" src="js/vendor/leaflet.js"></script>
    <script type='text/javascript' src='js/vendor/leaflet.awesome-markers.js'></script>
    <script type='text/javascript' src='js/vendor/popper.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery.csv.js'></script>
    <script type='text/javascript' src='js/vendor/bootstrap.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery-ui.js'></script>
    <script type='text/javascript' src='js/vendor/ersi-leaflet.js'></script>
    <script type='text/javascript' src='js/vendor/FileSaver.js'></script>
    <script type='text/javascript' src='js/vendor/jszip.js'></script>
    <script type='text/javascript' src='js/vendor/jquery.floatThead.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery.tabletojson.min.js'></script>
    <!--
    https://leaflet.github.io/Leaflet.draw/docs/Leaflet.draw-latest.html#l-draw
    this is for including the Leaflet.draw plugin
    -->
    <link rel="stylesheet" href="plugin/Leaflet.draw/leaflet.draw.css">
    <script type='text/javascript' src="plugin/Leaflet.draw/Leaflet.draw.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/Leaflet.Draw.Event.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/Toolbar.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/Tooltip.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/ext/GeometryUtil.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/ext/LatLngUtil.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/ext/LineUtil.Intersect.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/ext/Polygon.Intersect.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/ext/Polyline.Intersect.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/ext/TouchEvents.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/DrawToolbar.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.Feature.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.SimpleShape.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.Polyline.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.Marker.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.Circle.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.CircleMarker.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.Polygon.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.Rectangle.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/EditToolbar.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/EditToolbar.Edit.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/EditToolbar.Delete.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/Control.Draw.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/Edit.Poly.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/Edit.SimpleShape.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/Edit.Rectangle.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/Edit.Marker.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/Edit.CircleMarker.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/Edit.Circle.js"></script>

    <!-- ucvm js -->
    <script type="text/javascript" src="js/debug.js"></script>
    <script type="text/javascript" src="js/ucvm_leaflet.js"></script>
    <script type="text/javascript" src="js/ucvm_layer.js"></script>
    <script type="text/javascript" src="js/ucvm_region.js"></script>
    <script type="text/javascript" src="js/ucvm_region_util.js"></script>
    <script type="text/javascript" src="js/ucvm_util.js"></script>
    <script type="text/javascript" src="js/ucvm_ui.js"></script>
    <script type="text/javascript" src="js/ucvm_main.js"></script>
    <script type="text/javascript" src="js/ucvm_query.js"></script>
    <script type="text/javascript" src="js/ucvm_sidebar.js"></script>
    <script type="text/javascript" src="js/ucvm_state.js"></script>
    <script type="text/javascript" src="js/cxm_misc_util.js"></script>
    <script type="text/javascript" src="js/gfm_region.js"></script>

    <!-- plotly profile -->
    <script type="text/javascript" src="js/ucvm_profile_util.js"></script>

<!-- Global site tag (gtag.js) - Google Analytics o
TODO: need a new id
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-495056-12"></script>
-->
    <script type="text/javascript">
        $ = jQuery;
        var tableLoadCompleted = false;
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        gtag('js', new Date());

        gtag('config', 'UA-495056-12');

        $(document).on("tableLoadCompleted", function () {
            tableLoadCompleted = true;
            var $download_queue_table = $('#metadataPlotTable');
            $download_queue_table.floatThead({
                scrollContainer: function ($table) {
                    return $table.closest('div#metadataPlotTable-container');
                },
            });

        });

    </script>
</head>
<body>
<?php echo $header; ?>


<div class="container main container-fluid">
    <div class="spinDialog" style="position:absolute;top:50%;left:50%; z-index:9999;">
        <div id="spinIconForProperty" align="center" style="display:none;"><i class="glyphicon glyphicon-cog fa-spin" style="color:red"></i></div>
        <div id="spinIconForListProperty" align="center" style="display:none;"><i class="glyphicon glyphicon-cog fa-spin" style="color:red"></i></div>
        <div id="spinIconForProfile" align="center" style="display:none;"><i class="glyphicon glyphicon-cog fa-spin" style="color:red"></i></div>
        <div id="spinIconForLine" align="center" style="display:none;"><i class="glyphicon glyphicon-cog fa-spin" style="color:red"></i> </div>
        <div id="spinIconForArea" align="center" style="display:none;"><i class="glyphicon glyphicon-cog fa-spin" style="color:red"></i></div>
    </div>

    <div class="row">
        <div class="col-12">
            <p>The <a href="https://www.scec.org/research/ucvm">SCEC Community Models (CM) Viewer </a> provides an integrated view of SCEC CVMs, CFM, GFM and CTM models and also offers a browser access to the latest SCEC Unified Community Velocity Model(UCVM). User can query for material property from selected Community Velocity Model, generate Elevation profile plot, Depth Profile plot, Cross Section plot, or Horizontal Slice plot on demand using the plotting utility tools from UCVM.  See the <a href="guide.php">user guide</a> for more details and site usage instructions.</p>
        </div>
    </div>

<!--- MISC --->
<div id="miscTools">
  <div class="d-flex flex-row justify-content-end">
    <button class="btn ucvm-small-btn" title="display CFM5.3 faults" onclick='toggleShowCFM()'>
       <span id="ucvm_cfm_btn" class="glyphicon glyphicon-ok-sign"></span>CFM5.3</button>
    <button class="btn ucvm-small-btn" title="display GFM regions" onclick='toggleShowCRM()'>
       <span id="ucvm_crm_btn" class="glyphicon glyphicon-ok-sign"></span>GFM1.0</button>
    <button class="btn ucvm-small-btn" title="display CTM regions" onclick='toggleShowCTM()'>
       <span id="ucvm_ctm_btn" class="glyphicon glyphicon-ok-sign"></span>CTM</button>
<!--
    <button class="btn ucvm-small-btn" title="display CRM points" onclick='toggleShowCRMPoints()'>
       <span id="ucvm_crm_point_btn" class="glyphicon glyphicon-ok-sign"></span>CRM Points</button>
-->
   </div>
</div>
   
    <div class="row" style="display:none;">
        <div class="col justify-content-end custom-control-inline">
            <div style="display:none;" id="external_leaflet_control"></div>
        </div>
    </div>

  <!-- hidden btn to do profile comparison -->
    <div>
        <button id="plotProfileBtn" onclick="" class="btn ucvm-small-btn" data-toggle="modal" data-target="#modalProfile" style="display:none" onclick="$('#sidebar').hide();"></button>
    </div>

    <div id="content-container" class="row flex-row flex-wrap">
        <div id="control-container" class="col-5">
          <div class="col-12 mt-4" style="padding-top:10px; padding-left:0px; padding-righ:0px">
            <div class="input-group filters mb-1">
                <div class="input-group-prepend">
                    <label class="input-group-text" for="modelType" >Select Model Type</label>
                </div>
                <select id="modelType" class="custom-select"></select>&nbsp;<button class="btn ucvm-top-small-btn" data-toggle="modal" data-target="#modalmt" onclick="$('#sidebar').hide();"><span class="glyphicon glyphicon-info-sign"></span></button>
            </div>
<!-- special pull-out for elygtl -->
            <div id="zrange" class="input-group mt-1" style="display:none;"> 
                <div class="row offset-2">
                Z range:
                <div class="col-4 pr-0">
                    <input type="text"
                        id="zrangeStartTxt"
                        placeholder="Start"
                        title="zrange start"
                        onfocus="this.value=''"
                        class="form-control">
                </div>
                <div class="col-4 pr-0">
                    <input type="text"
                        id="zrangeStopTxt"
                        placeholder="Stop"
                        title="zrange stop"
                        onfocus="this.value=''"
                        class="form-control">
                </div>
                </div>
            </div>
<!-- special pull-out for elygtl, taper -->
            <div id="floors" class="input-group mt-1" style="display:none;"> 
                <div class="row offset-2">
                Floors:
                <div class="col-3 pr-0">
                    <input type="text"
                        id="vsFloorTxt"
                        placeholder="vsFloor"
                        title="vs floor value"
                        onfocus="this.value=''"
                        class="form-control">
                </div>
                <div class="col-3 pr-0">
                    <input type="text"
                        id="vpFloorTxt"
                        placeholder="vsFloor"
                        title="vp floor value"
                        onfocus="this.value=''"
                        class="form-control">
                </div>
                <div class="col-3 pr-0">
                    <input type="text"
                        id="densityFloorTxt"
                        placeholder="densityFloor"
                        title="density floor value"
                        onfocus="this.value=''"
                        class="form-control">
                </div>
                </div>
            </div>
            <div class="input-group filters mb-3 mt-1">
                <div class="input-group-prepend">
                    <label class="input-group-text" for="zModeType" >Select Z Mode</label>
                </div>
                <select id="zModeType" class="custom-select">
                    <option value="d">Depth</option>
                    <option value="e">Elevation</option>
                </select>&nbsp;<button class="btn ucvm-top-small-btn" data-toggle="modal" data-target="#modalzm" onclick="$('#sidebar').hide();"><span class="glyphicon glyphicon-info-sign"></span></button>
            </div>
            <div class="input-group filters">
                <select id="search-type" class="custom-select">
                    <option value="startClick">Select</option>
                    <option value="pointClick">0D Point</option>
                    <option disabled>-- Advanced --</option>
                    <option value="profileClick">1D Vertical Profile</option>
                    <option value="lineClick">2D Vertical Cross Section</option>
                    <option value="areaClick">2D Horizontal Slice</option>
                </select>
                <div class="input-group-append">
                    <button onclick="refreshAll();" class="btn btn-dark pl-4 pr-4" type="button">Reset</button>
                </div>
            </div>
            <div class="row"> <!-- pull-out -->
                <div class="col input-group">
                    <ul id="sidebar" class="navigation pl-2 pb-2 pr-1" style="background:whitesmoke;display:none">

                        <li id='start' class='navigationLi' style="display:none">
                            <div id='startMenu' class='menu'>
                                <div class="row mt-2 pl-5">
                                    <div class="col-12 mt-2" style="font-size:14px" >
                                       <h5><span class="glyphicon glyphicon-chevron-down"></span> Pick a UCVM model</h5>
                                       <h5><span class="glyphicon glyphicon-chevron-down"></span> Select either Depth or Elevation mode</h5>
                                       <h5><span class="glyphicon glyphicon-chevron-down"></span> Select an option</h5>
                                       <div class="col-10">
                                       <ul>
                                          <li style="list-style-type:disc">Query for material properties with<br>0D Point option</lib> 
                                          <li style="list-style-type:disc">Plot depth or elevation profile with<br>1D Vertical Profile option</li> 
                                          <li style="list-style-type:disc">Plot cross section for vs, vp, density or poisson data type with<br>2D Vertical Cross Section option</li>
                                          <li style="list-style-type:disc">Plot horizontal slice of vs, vp, density, poisson or vs30 etree with<br>2D Horizontal Slice option </li>
                                       </ul>
                                       </div>
                                       <br>
                                       <h5> Preliminary: Plot vertical profile comparison plot with 1 or more vertical profiles(<span style="font-size:6px" class="glyphicon glyphicon-triangle-bottom"></span>)</h5>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li id='point' class='navigationLi' style="display:none">
                            <div id='pointMenu' class='menu'>
                                <div class="row mt-2">
                                    <div class="col-12">
                                       <p>Pick a point on the map, or enter latitude, longitude and Z value below or upload a file with LatLngs and matching Z values.</p>
                                    </div>
                                </div>
                                <div class="row d-flex">
                                    <div class="col-5 pr-0">
                                        <input type="text"
                                               id="pointFirstLatTxt"
                                               placeholder="Latitude"
                                               title="lat"
                                               onfocus="this.value=''"
                                               onchange="reset_point_presets()"
                                               class="form-control">
                                        <input type="text" 
                                               id="pointFirstLonTxt" 
                                               placeholder="Longitude" 
                                               title="lon"
                                               onfocus="this.value=''" 
                                               onchange="reset_point_presets()"
                                               class="form-control mt-1">
                                    </div>
                                    <div class="col-5 pr-0">
                                        <input type="text" 
                                               id="pointZTxt" 
                                               placeholder="Z" 
                                               title="Z"
                                               onfocus="this.value=''" 
                                               class=" form-control">
                                        <input type="text"
                                               id="pointUIDTxt" 
                                               placeholder="UID" 
                                               title="Uniqued ID"
                                               onfocus="this.value=''" 
                                               class="form-control mt-1" style="display:none">

                                    </div>
                                    <div class="col-0 pr-0">
                                        <button id="pointBtn" type="button" title="query with latlon"
                                                class="btn btn-default ucvm-small-btn " onclick="processByLatlonForPoint()">
                                            <span class="glyphicon glyphicon-search"></span>
                                        </button>
                                    </div>
                                    <div class="col-0 pr-0">
                                        <div id="spinIconForProperty" align="center" style="display:none;"><i class="glyphicon glyphicon-cog fa-spin" style="color:red"></i></div>
                                    </div>
                                </div>
                                <div class="mt-2">
                                     <input class="form-control" id='infileBtn' type='file' onchange='selectLocalFiles(this.files,1)' style='display:none;'></input>
                                     <button id="fileSelectBtn" class="btn ucvm-top-btn" style="width:85%" title="open a file to ingest" onclick='javascript:document.getElementById("infileBtn").click();'>
                                     <span class="glyphicon glyphicon-file"></span> Select file to use</button>
<button class="btn ucvm-top-small-btn" data-toggle="modal" data-target="#modalfile" onclick="$('#sidebar').hide();"><span class="glyphicon glyphicon-info-sign"></span></button>
                                </div>
                            </div>
                        </li>

                        <li id='profile' class='navigationLi' style="display:none">
                            <div id='profileMenu' class='menu'>
                                <div class="row mt-2">
                                    <div class="col-12">
                                        <p>Pick a profile point on the map or enter latitude and longitude below.</p>
                                    </div>
                                </div>
                                <div class="row d-flex">
                                    <div class="col-5 pr-0">
                                        <input type="text"
                                               id="profileFirstLatTxt"
                                               placeholder="Latitude"
                                               title="lat"
                                               onfocus="this.value=''"
                                               onchange="reset_profile_presets()"
                                               class="form-control">
                                        <input type="text"
                                               id="profileFirstLonTxt" 
                                               placeholder="Longitude" 
                                               title="lon"
                                               onfocus="this.value=''" 
                                               onchange="reset_profile_presets()"
                                               class="form-control mt-1">
                                    </div>
                                    <div class="col-5 pr-0">
                                        <input type="text"
                                               id="profileZStartTxt" 
                                               placeholder="Z start" 
                                               title="Z start"
                                               onfocus="this.value=''" 
                                               class="form-control">
                                        <input type="text"
                                               id="profileZEndTxt" 
                                               placeholder="Z ends" 
                                               title="Z ends"
                                               onfocus="this.value=''" 
                                               class="form-control mt-1">
                                        <input type="text"
                                               id="profileZStepTxt" 
                                               placeholder="Z step" 
                                               title="Z start"
                                               onfocus="this.value=''" 
                                               class="form-control mt-1">
                                        <input type="text"
                                               id="profileUIDTxt" 
                                               placeholder="UID" 
                                               title="Uniqued ID"
                                               onfocus="this.value=''" 
                                               class="form-control mt-1" style="display:none">
                                    </div>
                                    <div class="col-0 pr-0">
                                        <button id="profileBtn" type="button" title="query with latlon"
                                                class="btn btn-default ucvm-small-btn " onclick="processByLatlonForProfile()">
                                            <span class="glyphicon glyphicon-search"></span>
                                        </button>
                                    </div>
                                </div>
<!---XXX----->
                                <div class="mt-2">
                                     <input class="form-control" id='inprofilefileBtn' type='file' onchange='selectLocalFiles(this.files,0)' style='display:none;'></input>
                                     <button id="profilefileSelectBtn" class="btn ucvm-top-btn" style="width:85%" title="open a file to ingest" onclick='javascript:document.getElementById("inprofilefileBtn").click();'>
                                     <span class="glyphicon glyphicon-file"></span> Select file to use</button>
<button class="btn ucvm-top-small-btn" data-toggle="modal" data-target="#modalprofilefile" onclick="$('#sidebar').hide();"><span class="glyphicon glyphicon-info-sign"></span></button>
                                </div>
<!---XXX----->
                            </div>
                        </li>

                        <li id='line' class='navigationLi ' style="display:none">
                            <div id='lineMenu' class='menu'>
                                <div class="row mt-2">
                                    <div class="col-12">
                                        <p>Draw a line on the map or enter latitudes and longitudes below.</p>
                                    </div>
                                </div>
                                <div class="row d-flex ">
                                    <div class="col-5 pr-0">
                                        <input type="text"
                                               placeholder="Latitude"
                                               id="lineFirstLatTxt"
                                               title="first lat"
                                               onfocus="this.value=''"
                                               onchange="reset_line_presets()"
                                               class="form-control">
                                        <input type="text"
                                               id="lineFirstLonTxt" 
                                               placeholder='Longitude'
                                               title="first lon"
                                               onfocus="this.value=''" 
                                               onchange="reset_line_presets()"
                                               class="form-control mt-1">
                                        <input type="text"
                                               id="lineZStartTxt" 
                                               placeholder="Z start" 
                                               title="lineZStartTxt"
                                               onfocus="this.value=''" 
                                               class="form-control mt-1">
                                        <input type="text"
                                               id="lineZTxt" 
                                               placeholder="Z ends" 
                                               title="lineZTxt"
                                               onfocus="this.value=''" 
                                               class="form-control mt-1">
                                        <select title="Datatype" id="lineDataTypeTxt" class="my-custom-select custom-select mt-1">
                                               <option value="">DataType</option>
                                               <option value="vs">vs</option>
                                               <option value="vp">vp</option>
                                               <option value="density">density</option>
                                               <option value="poisson">poisson</option>
                                        </select>
                                    </div>
                                    <div class="col-5 pr-0">
                                        <input type="text"
                                               id="lineSecondLatTxt"
                                               title="second lat"
                                               placeholder='2nd Latitude'
                                               onfocus="this.value=''"
                                               onchange="reset_line_presets()"
                                               class="form-control">
                                        <input type="text"
                                               id="lineSecondLonTxt"
                                               title="second lon"
                                               placeholder='2nd Longitude'
                                               onfocus="this.value=''"
                                               onchange="reset_line_presets()"
                                               class="form-control mt-1">
                                        <input type="text"
                                               id="lineUIDTxt" 
                                               placeholder="UID" 
                                               title="Uniqued ID"
                                               onfocus="this.value=''" 
                                               class="form-control mt-1" style="display:none">
                                    </div>
                                    <div class="col-0 pr-0">
                                        <button id="areaBtn" type="button" title="query with latlon"
                                                class="btn btn-default ucvm-small-btn " onclick="processByLatlonForLine()">
                                            <span class="glyphicon glyphicon-search"></span>
                                        </button>
                                    </div>
                                    <div class="col-1 pr-0">
                                        <div id="spinIconForLine" align="center" style="display:none;"><i class="glyphicon glyphicon-cog fa-spin" style="color:red"></i> </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li id='area' class='navigationLi ' style="display:none">
                            <div id='areaMenu' class='menu'>
                                <div class="row mt-2">
                                    <div class="col-12">
                                        <p>Draw a rectangle on the map or enter latitudes and longitudes below.</p>
                                    </div>
                                </div>
                                <div class="row d-flex ">
                                    <div class="col-5 pr-0">
                                        <input type="text"
                                               placeholder="Latitude"
                                               id="areaFirstLatTxt"
                                               title="first lat"
                                               onfocus="this.value=''"
                                               onchange="reset_area_presets()"
                                               class="form-control">
                                        <input type="text"
                                               id="areaFirstLonTxt" 
                                               placeholder='Longitude'
                                               title="first lon"
                                               onfocus="this.value=''" 
                                               onchange="reset_area_presets()"
                                               class="form-control mt-1">
                                        <input type="text"
                                               id="areaZTxt"
                                               placeholder="Z"
                                               title="areaZTxt"
                                               onfocus="this.value=''"
                                               class="form-control mt-1">
                                        <select title="Datatype" id="areaDataTypeTxt" class="my-custom-select custom-select mt-1">
                                               <option value="">DataType</option>
                                               <option value="vs">vs</option>
                                               <option value="vp">vp</option>
                                               <option value="density">density</option>
                                               <option value="poisson">poisson</option>
                                               <option value="vs30">vs30 etree</option>
                                        </select>
                                    </div>
                                    <div class="col-5 pr-0">
                                        <input type="text"
                                               id="areaSecondLatTxt"
                                               title="second lat"
                                               placeholder='2nd Latitude'
                                               onfocus="this.value=''"
                                               onchange="reset_area_presets()"
                                               class="form-control">
                                        <input type="text"
                                               id="areaSecondLonTxt"
                                               title="second lon"
                                               placeholder='2nd Longitude'
                                               onfocus="this.value=''"
                                               onchange="reset_area_presets()"
                                               class="form-control mt-1">
                                        <input type="text"
                                               id="areaUIDTxt" 
                                               placeholder="UID" 
                                               title="Uniqued ID"
                                               onfocus="this.value=''" 
                                               class="form-control mt-1" style="display:none">
                                    </div>
                                    <div class="col-0 pr-0">
                                        <button id="areaBtn" type="button" title="query with latlon"
                                                class="btn btn-default ucvm-small-btn " onclick="processByLatlonForArea()">
                                            <span class="glyphicon glyphicon-search"></span>
                                        </button>
                                    </div>
                                    <div class="col-1 pr-0">
                                        <div id="spinIconForArea" align="center" style="display:none;"><i class="glyphicon glyphicon-cog fa-spin" style="color:red"></i></div>
                                    </div>

                                </div>
                            </div>
                        </li>
                    </ul> 
                </div>
            </div> <!-- pull-out -->
          </div>
        </div> <!-- control-container -->
        <div id="map-container" class="col-7">
            <div class="col-8 d-flex mb-1" style="margin-left:35%">
                <div class="input-group input-group-sm" id="map-controls">
                    <div class="input-group-prepend">
                        <label class="input-group-text" for="mapLayer">Select Map Type</label>
                    </div>
                    <select id="mapLayer" class="custom-select custom-select-sm" onchange="switchBaseLayer(this.value);">
                        <option selected value="esri topo">ESRI Topographic</option>
                        <option value="esri NG">ESRI National Geographic</option>
                        <option value="esri imagery">ESRI Imagery</option>
                        <option value="otm topo">OTM Topographic</option>
                        <option value="osm street">OSM Street</option>
                    </select>
                </div>
            </div>
            <div class="row mapData">
                <div class="col-12 pr-0 pl-2 pt-0"> 
                    <div class="row w-100 mb-1" id='UCVM_plot'
                         style="position:relative;border:solid 1px #ced4da; height:576px;">
                    </div>
                </div>
            </div>
        </div> <!-- map-container -->
        <div class="col-12 mt-0">
        <div id="result-container" class="row d-flex flex-column">

           <div class="col-12 flex-row" align="end">
               <button class="btn ucvm-top-small-btn" title="download all the material property in the table" onclick="downloadMPTable()" ><span class="glyphicon glyphicon-download"></span></button>
               <button class="btn ucvm-top-small-btn" title="material property  parameters displayed in the table" data-toggle="modal" data-target="#modalParameters" onclick="$('#sidebar').hide();"><span class="glyphicon glyphicon-info-sign"></span></button></td>
            </div>
            <div class="col-12 mb-0" id="mp-table">
                <div id="materialPropertyTable-container" style="overflow:auto;max-height:20vh;margin:0px 0px 0px 0px;">
                    <table id="materialPropertyTable">
                        <tr id="placeholder-row">
                            <td colspan="11">Material Property for selected locations will appear here </td>
                        </tr>
                    </table>
                </div>
            </div> <!-- mp-table -->

            <div class="col-12 flex-row" align="end">
                <button class="btn ucvm-top-small-btn dropdown-toggle" data-toggle="dropdown"></button>
                <ul id='processMetaPlotResultTableList' class="dropdown-menu list-inline" role="menu">
                   <li data-id='s' hidden >Save All</li>
                   <li id='mprCollapseLi' data-id='c' hidden>Collapse</li>
                   <li data-id='p'>plot Depth Profile</li>
                </ul>
                <button class="btn ucvm-top-small-btn" data-toggle="modal" data-target="#modalff" onclick="$('#sidebar').hide();"><span class="glyphicon glyphicon-info-sign"></span></button></td>
            </div>
            <div class="col-12  mt-0 mb-4" id="result-table">
               <div id="metadataPlotTable-container" style="overflow:auto;max-height:20vh;margin:0px 0px 0px 0px;">
                    <table id="metadataPlotTable">
                        <tr id="placeholder-row">
                            <td colspan="12">Downloadable Batch Result will appear here </td>
                        </tr>
                    </table>
               </div>
            </div>

            <div id="phpResponseTxt"></div>
        </div> <!-- result-container -->
        </div> <!-- wrap result -->
    </div> <!-- content-container -->
</div> <!-- container main -->

<!--Modal: Parameters Table -->
<div class="modal" id="modalParameters" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalParametersDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalParametersContent">
      <!--Body-->
      <div class="modal-body" id="modalParametersBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">
          <div class="col-12" id="parametersTable-container"></div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="close" data-dismiss="modal" onclick="$('#sidebar').show();">&times;</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: Name-->

<!--Modal: FileFormat -->
<div class="modal" id="modalff" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalffDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalffContent">
      <!--Body-->
      <div class="modal-body" id="modalffBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">
          <div class="col-12" id="fileFormatTable-container"></div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="close" data-dismiss="modal" onclick=$('#sidebar').show();>&times;</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: Name-->

<!--Modal: ModelType -->
<div class="modal" id="modalmt" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalmtDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalmtContent">
      <!--Body-->
      <div class="modal-body" id="modalmtBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">
          <div class="col-12" id="modelTable-container"></div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="close" data-dismiss="modal" onclick="$('#sidebar').show();">&times;</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: Name-->

<!--Modal: ZMode -->
<div class="modal" id="modalzm" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalzmDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalzmContent">
      <!--Body-->
      <div class="modal-body" id="modalzmBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">
          <div class="col-12" id="ZModeTable-container"></div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="close" data-dismiss="modal" onclick="$('#sidebar').show();">&times;</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: Name-->

<!--Modal: ModelType -->
<div class="modal" id="modalfile" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalfileDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalfileContent">
      <!--Body-->
      <div class="modal-body" id="modalfileBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">

          <div class="col-12" id="file-container">
<h5>Local input file format is 3 columns of Longitude, Latitude and Z separated by a comma or a space </h5>
<pre>
lon1 lat1 z1             lon1,lat1,z1
lon2 lat2 z2      or     lon2,lat2,z2
</pre>
<h5> Z value should match the Z mode selection from the main viewer, maximum display points is 200</h5>
          </div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="close" data-dismiss="modal" onclick="$('#sidebar').show();">&times;</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: Name-->

<!--Modal: ModelType -->
<div class="modal" id="modalprofilefile" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalprofilefileDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalprofilefileContent">
      <!--Body-->
      <div class="modal-body" id="modalprofilefileBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">

          <div class="col-12" id="profilefile-container">

<h5>Local input file format is 6 columns of Longitude, Latitude, Starting Depth, Ending Depth, Z Step and
a label that is being used as datafile prefix separated by a comma or a space </h5>
<pre>
   lon,lat,start,end,step,label
    or
   lon lat start end step label
</pre>
<h5> Z Step value should match the Z mode selection from the main viewer</h5>

          </div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="close" data-dismiss="modal" onclick="$('#sidebar').show();">&times;</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: Name-->

<!--Modal: profileIfram -->
<div class="modal" id="modalProfile" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalProfileDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalProfileContent">
      
      <!--Body-->
      <div class="modal-body" id="modalProfileBody">
        <div id="profile-iframe-container" class="col-12" style="overflow:auto;">

<iframe id="viewProfileIfram" src="" height="0" width="100%" onload="setIframSize(this.id)" allowfullscreen></iframe>

        </div>
      </div>

      <div class="modal-footer justify-content-center">
        <button type="button" class="btn btn-outline-primary btn-md" data-dismiss="modal" onclick="$('#sidebar').show();">Close</button>
      </div> 
<!--
      <div class="modal-footer justify-content-center">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
      </div>
--->


    </div> <!--Content-->
   </div>
</div> <!--Modal: Name-->
</body>
</html>
