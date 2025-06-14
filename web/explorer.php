<?php
require_once("php/navigation.php");
$header = getHeader("Explorer");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>SCEC Community Velocity Model Explorer</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="css/vendor/font-awesome.min.css">
    <link rel="stylesheet" href="css/vendor/bootstrap.min.css">
    <link rel="stylesheet" href="css/vendor/bootstrap-grid.min.css">
    <link rel="stylesheet" href="css/vendor/leaflet.awesome-markers.css">
    <link rel="stylesheet" href="css/vendor/leaflet.css">
    <link rel="stylesheet" href="css/vendor/jquery-ui.css">
    <link rel="stylesheet" href="css/vendor/glyphicons.css">
    <link rel="stylesheet" href="css/vendor/all.css">

    <link rel="stylesheet" href="css/vendor/animation.css">

    <link rel="stylesheet" href="css/cvm-ui.css">
    <link rel="stylesheet" href="css/cxm-ui.css">

    <script type="text/javascript" src="js/vendor/leaflet.js"></script>
    <script type='text/javascript' src='js/vendor/leaflet.awesome-markers.js'></script>

    <script type='text/javascript' src='js/vendor/popper.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery.csv.js'></script>
    <script type='text/javascript' src='js/vendor/bootstrap.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery-ui.js'></script>

    <script type='text/javascript' src='js/vendor/esri-leaflet.js'></script>
    <script type='text/javascript' src='js/vendor/esri-leaflet-vector.js' crossorigin=""></script>

    <script type='text/javascript' src='js/vendor/FileSaver.js'></script>
    <script type='text/javascript' src='js/vendor/jszip.js'></script>
    <script type='text/javascript' src='js/vendor/togeojson.js'></script>
    <script type='text/javascript' src='js/vendor/leaflet-kmz-src.js'></script>
    <script type='text/javascript' src='js/vendor/leaflet.markercluster-src.js'></script>

    <script type='text/javascript' src='js/vendor/jquery.floatThead.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery.tabletojson.min.js'></script>

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

    <!-- cvm js -->
    <script type="text/javascript" src="js/debug.js"></script>
    <script type="text/javascript" src="js/cvm.js"></script>
    <script type="text/javascript" src="js/cvm_layer.js"></script>
    <script type="text/javascript" src="js/cvm_util.js"></script>
    <script type="text/javascript" src="js/cvm_ui.js"></script>
    <script type="text/javascript" src="js/cvm_main.js"></script>
    <script type="text/javascript" src="js/cvm_query.js"></script>
    <script type="text/javascript" src="js/cvm_select.js"></script>
    <script type="text/javascript" src="js/cvm_state.js"></script>
    <script type="text/javascript" src="js/cvm_leaflet.js"></script>
    <script type="text/javascript" src="js/cvm_region.js"></script>
    <script type="text/javascript" src="js/cvm_region_util.js"></script>
    <script type="text/javascript" src="js/cvm_expand.js"></script>

    <script type="text/javascript" src="js/cxm_misc_util.js"></script>
    <script type="text/javascript" src="js/gfm_region.js"></script>
    <script type="text/javascript" src="js/cxm_kml.js?v=1"></script>
    <script type="text/javascript" src="js/cxm_model_util.js?v=1"></script>

    <!-- plotly profile -->
    <script type="text/javascript" src="js/cvm_profile_util.js"></script>

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

<div class="container container-fluid">

<div id="cvmMain" class="main">

<!-- hidden btn to do profile comparison -->
    <div>
        <button id="plotProfileBtn" onclick="" class="btn cvm-small-btn" data-toggle="modal" data-target="#modalProfile" style="display:none"></button>
    </div>

<!-- spinners -->
    <div class="spinDialog" style="position:absolute;top:52%;left:49%; z-index:9999;">
        <div id="spinIconForProperty" align="center" style="display:none;"><i class="glyphicon glyphicon-cog fa-spin" style="color:red"></i></div>
        <div id="spinIconForListProperty" align="center" style="display:none;"><i class="glyphicon glyphicon-cog fa-spin" style="color:red"></i></div>
        <div id="spinIconForProfile" align="center" style="display:none;"><i class="glyphicon glyphicon-cog fa-spin" style="color:red"></i></div>
        <div id="spinIconForLine" align="center" style="top:55%;display:none;"><i class="glyphicon glyphicon-cog fa-spin" style="color:red"></i> </div>
        <div id="spinIconForArea" align="center" style="display:none;"><i class="glyphicon glyphicon-cog fa-spin" style="color:red"></i></div>
    </div> <!-- spinDialog -->

<!-- intro -->
     <div id="top-intro" class="row">
        <div class="col-1 links d-none d-md-block align-self-end">
            <div>
                <a href="https://www.scec.org/about">About SCEC</a>
                <a href="https://www.scec.org/science/cem">About CEM</a>
            </div>
        </div>
<p class="col-11 intro-text">
	The <a href="https://www.scec.org/research/cvm">SCEC Community Velocity Model (CVM) Explorer </a>
allows easy access to a range of seismic velocity models using the UCVM package. The interface allows for downloading data in csv format and various visualization capabilities including 2D horizonal slices, 2D vertical cross sections, and 1D vertical profiles. See the <a href="guide.php">user guide</a> for more details and usage instructions.</p> </div>

<!-- leaflet control -->
    <div class="row" style="display:none;">
        <div class="col justify-content-end custom-control-inline">
            <div style="display:none;" id="external_leaflet_control"></div>
        </div>
    </div>

<!-- top-control -->
    <div id="top-control" class="row justify-content-end mb-2" style="border:0px solid blue">
            <div id='model-options' class="form-check-inline">
                <div class="form-check form-check-inline">
                     <label class='form-check-label ml-1 mini-option'
                             title='Show Community Fault Model v7.0 on map'
                             for="cvm-model-cfm">
                     <input class='form-check-inline mr-1'
                             type="checkbox"
                             id="cvm-model-cfm" value="1" />CFM7.0
                     </label>
                </div>

                <div class="form-check form-check-inline">
                    <label class='form-check-label ml-1 mini-option'
                             title='Show Community Geological Framework regions on map'
                             for="cvm-model-gfm">
                    <input class='form-check-inline mr-1'
                             type="checkbox"
                             id="cvm-model-gfm" value="1" />GFM
                    </label>
                </div>

                <div class="form-check form-check-inline">
                    <label class='form-check-label ml-1 mini-option'
                             title='Show Community Thermal Model regions on map'
                             for="cvm-model-ctm">
                    <input class='form-check-inline mr-1'
                             type="checkbox"
                             id="cvm-model-ctm" value="1" />CTM
                    </label>
                </div>

<!--
                <div class="form-check form-check-inline">
                    <label class='form-check-label ml-1 mini-option'
                             title='Show All Available CVMs on map'
                             for="cvm-model-cvm">
                    <input class='form-check-inline mr-1'
                             type="checkbox"
                             id="cvm-model-cvm" value="1" />CVM
                    </label>
                </div>
-->


            </div>

<!-- KML/KMZ overlay -->
            <div id="kml-row" class="col-2 custom-control-inline">
                    <input id="fileKML" type='file' multiple onchange='uploadKMLFile(this.files)' style='display:none;'></input>
                    <button id="kmlBtn" class="btn"
                      onclick='javascript:document.getElementById("fileKML").click();'
                      title="Upload your own kml/kmz file to be displayed on the map interface. We currently support points, lines, paths, polygons, and image overlays (kmz only)."
                      style="color:#395057;background-color:#f2f2f2;border:1px solid #ced4da;border-radius:0.2rem;padding:0.15rem 0.5rem;"><span>Upload kml/kmz</span></button>
                    <button id="kmlSelectBtn" class="btn cxm-small-no-btn"
                      title="Show/Hide uploaded kml/kmz files"
                      style="display:none;" data-toggle="modal" data-target="#modalkmlselect">
                      <span id="eye_kml"  class="glyphicon glyphicon-eye-open"></span></button>
            </div> <!-- kml-row -->

            <div id="basemap-control" class="input-group input-group-sm custom-control-inline">
                <div class="input-group-prepend">
                    <label class="input-group-text" for="basemapLayer">Select Map Type</label>
                </div>
                <select id="basemapLayer" class="custom-select custom-select-sm"
                                           onchange="switchBaseLayer(this.value);">
                    <option selected value="esri topo">ESRI Topographic</option>
                    <option value="esri imagery">ESRI Imagery</option>
                    <option value="jawg light">Jawg Light</option>
                    <option value="jawg dark">Jawg Dark</option>
                    <option value="osm streets relief">OSM Streets Relief</option>
                    <option value="otm topo">OTM Topographic</option>
                    <option value="osm street">OSM Street</option>
                    <option value="esri terrain">ESRI Terrain</option>
                </select>
            </div>
    </div> <!-- top-control -->

<!-- model map control -->
    <div id="mapDataBig" class="row mapData">
        <div id="search-container" class="col-5 button-container flex-column pr-0" style="overflow:hidden;border:solid 0px green;">

            <div class="input-group input-group-sm custom-control-inline" style="max-width:450px;border:solid 0px green;">
               <div class="input-group-prepend">
                     <label class="input-group-text" for="selectModelType">Select CVM Model</label>
               </div>
	       <select id="selectModelType" class="custom-select custom-select-sm"></select>&nbsp;

               <button class="btn cvm-top-small-btn" data-toggle="modal" data-target="#modalmodeltype"><span class="glyphicon glyphicon-info-sign"></span></button>

            </div> <!-- model select -->

<!-- special pull-out for elygtl -->
            <div id="zrange" class="input-group mt-0 mb-1" style="display:none;"> 
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

            <div class="input-group input-group-sm custom-control-inline" style="max-width:450px">
                <div class="input-group-prepend">
                    <label class="input-group-text" for="searchType">Select Profile Type</label>
                </div>
                <select id="searchType" class="custom-select custom-select-sm">
                    <option id="searchType-areaClick" value="areaClick" selected>2D Horizontal Slice</option>
                    <option id="searchType-lineClick" value="lineClick">2D Vertical Cross Section</option>
                    <option value="profileClick">1D Vertical Profile</option>
                    <option value="pointClick">0D Point</option>
                </select>&nbsp;<button class="btn cvm-top-small-btn" data-toggle="modal" data-target="#modalstype"><span class="glyphicon glyphicon-info-sign"></span></button>
            </div> <!-- query option -->

            <div class="input-group input-group-sm custom-control-inline" style="max-width:450px">
                <div class="input-group-prepend">
                    <label class="input-group-text" for="modelType">Select Z Mode</label>
                </div>
                <select id="zModeType" class="custom-select custom-select-sm">
                    <option id="zMode-depthClick" value="d">Depth (m)</option>
                    <option id="zMode-elevClick" value="e">Elevation (m)</option>
                </select>&nbsp;<button class="btn cvm-top-small-btn" data-toggle="modal" data-target="#modalzmode"><span class="glyphicon glyphicon-info-sign"></span></button>
            </div> <!-- z select -->

<!-- selection -->
<div id="workspace" style="border:0px solid red">

<!-- filler page ?? -->
	    <div id="ghost-filler" style="background-color:whitesmoke; width:100%;height:80%;bottom:10; position:absolute"></div>

<!-- description page -->
	    <div id="option" class="row" style="max-width:500px;"> 
                <div class="col input-group">
		    <ul class="navigation col-12 pl-2 pb-2 pr-1" style="background:whitesmoke;">
                        <li id='point' class='navigationLi' style="display:none">
                            <div id='pointMenu' class='menu'>
                                <div class="row mt-2">
                                    <div class="col-12">
                                       <p>Pick a point on the map, or enter latitude, longitude and Z value below or upload a file with LatLngs and matching Z values</p>
                                    </div>
                                </div>
                                <div class="row d-flex">
                                    <div class="col-5 pr-0">
                                        <input type="text" 
                                               id="pointFirstLonTxt" 
                                               placeholder="Longitude" 
                                               title="lon"
                                               onfocus="this.value=''" 
                                               onchange="reset_point_presets()"
                                               class="form-control">
                                        <input type="text" 
                                               id="pointZTxt" 
                                               placeholder="Z" 
                                               title="Z"
                                               onfocus="this.value=''" 
                                               class="form-control mt-1">
                                    </div>
                                    <div class="col-5 pr-0">
                                        <input type="text"
                                               id="pointFirstLatTxt"
                                               placeholder="Latitude"
                                               title="lat"
                                               onfocus="this.value=''"
                                               onchange="reset_point_presets()"
                                               class="form-control">
                                        <input type="text"
                                               id="pointUIDTxt" 
                                               placeholder="UID" 
                                               title="Uniqued ID"
                                               onfocus="this.value=''" 
                                               class="form-control mt-1" style="display:none">
                                    </div>
                                </div>
                                <div class="mt-1">
                                     <input class="form-control" id='infileBtn' type='file' onchange='selectLocalFiles(this.files,1)' style='display:none;'></input>
                                     <button id="fileSelectBtn" class="btn cvm-top-btn" style="width:85%" title="open a file to ingest" onclick='javascript:document.getElementById("infileBtn").click();'>
                                     <span class="glyphicon glyphicon-file"></span> Select file to use</button>
<button class="btn cvm-top-small-btn" data-toggle="modal" data-target="#modalfileinfo"><span class="glyphicon glyphicon-info-sign"></span></button>
                                </div>

                                <div class="row d-flex mt-1">
                                    <div class="col-5 pr-0">
                                        <div class="col-12" style="padding:5px 0px 10px 0px">
                                               <button class="btn btn-dark" onclick="CVM.resetAll()" style="width:100%;border-radius:0.25rem">Reset All</button>
                                        </div>
                                    </div>
                                    <div class="col-5 pr-0">
                                        <div class="col-12" style="padding:5px 0px 10px 0px">
                                               <button id="pointBtn" class="btn btn-dark" onclick="CVM.processByLatlonForPoint(0)" style="width:100%;border-radius:0.25rem">Extract Data</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </li>

                        <li id='profile' class='navigationLi' style="display:none">
                            <div id='profileMenu' class='menu'>
                                <div class="row mt-2">
                                    <div class="col-12">
                                        <p>Pick a profile point on the map or enter latitude and longitude below</p>
                                    </div>
                                </div>
                                <div class="row d-flex">
                                    <div class="col-5 pr-0">
                                        <input type="text"
                                               id="profileFirstLonTxt" 
                                               placeholder="Longitude" 
                                               title="lon"
                                               onfocus="this.value=''" 
                                               onchange="reset_profile_presets()"
                                               class="form-control">
                                        <input type="text"
                                               id="profileZStartTxt" 
                                               placeholder="Z Start" 
                                               title="Z start"
                                               onfocus="this.value=''" 
                                               class="form-control mt-1">
                                        <input type="text"
                                               id="profileZStepTxt" 
                                               placeholder="Z Step" 
                                               title="Z start"
                                               onfocus="this.value=''" 
                                               class="form-control mt-1">
                                    </div>
                                    <div class="col-5 pr-0">
                                        <input type="text"
                                               id="profileFirstLatTxt"
                                               placeholder="Latitude"
                                               title="lat"
                                               onfocus="this.value=''"
                                               onchange="reset_profile_presets()"
                                               class="form-control">
                                        <input type="text"
                                               id="profileZEndTxt" 
                                               placeholder="Z End" 
                                               title="Z ends"
                                               onfocus="this.value=''" 
                                               class="form-control mt-1">
                                        <select title="profileDatatype" id="profileDataTypeTxt" class="my-custom-select custom-select mt-1" style="border-radius:0.25rem">
                                               <option value="">Data Type</option>
                                               <option value="vs">Vs</option>
                                               <option value="vp">Vp</option>
                                               <option value="density">Density</option>
                                               <option value="all">Vs,Vp,Density</option>
                                        </select>

                                        <input type="text"
                                               id="profileUIDTxt" 
                                               placeholder="UID" 
                                               title="Uniqued ID"
                                               onfocus="this.value=''" 
                                               class="form-control mt-1" style="display:none">
                                    </div>
                                </div>
                                <div class="mt-1">
                                     <input class="form-control" id='inprofilefileBtn' type='file' onchange='selectLocalFiles(this.files,0)' style='display:none;'></input>
                                     <button id="profilefileSelectBtn" class="btn cvm-top-btn" style="width:85%" title="open a file to ingest" onclick='javascript:document.getElementById("inprofilefileBtn").click();'>
                                     <span class="glyphicon glyphicon-file"></span>Select file to use</button>
<button class="btn cvm-top-small-btn" data-toggle="modal" data-target="#modalprofilefile"><span class="glyphicon glyphicon-info-sign"></span></button>
                                </div>
                                <div class="row d-flex mt-1">
                                    <div class="col-5 pr-0">
                                        <div class="col-12" style="padding:5px 0px 10px 0px">
                                               <button class="btn btn-dark" onclick="CVM.resetAll()" style="width:100%;border-radius:0.25rem">Reset All</button>
                                        </div>
                                    </div>
                                    <div class="col-5 pr-0">
                                        <div class="col-12" style="padding:5px 0px 10px 0px">
                                          <button id="profileBtn" class="btn btn-dark" onclick="CVM.processByLatlonForProfile(0)" style="width:100%;border-radius:0.25rem">Extract Data</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </li>

                        <li id='line' class='navigationLi ' style="display:none">
                            <div id='lineMenu' class='menu'>
                                <div class="row mt-2">
                                    <div class="col-12">
                                        <p>Draw a line on the map or enter latitudes and longitudes below</p>
                                    </div>
                                </div>
                                <div class="row d-flex ">
                                    <div class="col-5 pr-0">
                                        <input type="text"
                                               id="lineFirstLonTxt" 
                                               placeholder='Begin Longitude'
                                               title="first lon"
                                               onfocus="this.value=''" 
                                               onchange="reset_line_presets()"
                                               class="form-control">
                                        <input type="text"
                                               id="lineSecondLonTxt"
                                               title="second lon"
                                               placeholder='End Longitude'
                                               onfocus="this.value=''"
                                               onchange="reset_line_presets()"
                                               class="form-control mt-1">
                                        <input type="text"
                                               id="lineZStartTxt" 
                                               placeholder="Z start" 
                                               title="lineZStartTxt"
                                               onfocus="this.value=''" 
                                               class="form-control mt-1">
                                        <select title="Datatype" id="lineDataTypeTxt" class="my-custom-select custom-select mt-1" style="border-radius:0.25rem">
                                               <option value="">Data Type</option>
                                               <option value="vs">Vs</option>
                                               <option value="vp">Vp</option>
                                               <option value="density">Density</option>
                                        </select>
                                    </div>
                                    <div class="col-5 pr-0">
                                        <input type="text"
                                               placeholder="Begin Latitude"
                                               id="lineFirstLatTxt"
                                               title="first lat"
                                               onfocus="this.value=''"
                                               onchange="reset_line_presets()"
                                               class="form-control">
                                        <input type="text"
                                               id="lineSecondLatTxt"
                                               title="second lat"
                                               placeholder='End Latitude'
                                               onfocus="this.value=''"
                                               onchange="reset_line_presets()"
                                               class="form-control mt-1">
                                        <input type="text"
                                               id="lineZTxt"
                                               placeholder="Z ends"
                                               title="lineZTxt"
                                               onfocus="this.value=''"
                                               class="form-control mt-1">
                                        <input type="text"
                                               id="lineUIDTxt" 
                                               placeholder="UID" 
                                               title="Uniqued ID"
                                               onfocus="this.value=''" 
                                               class="form-control mt-1" style="display:none">
                                    </div>
                                </div>
                                <div class="row d-flex mt-1">
                                    <div class="col-5 pr-0">
                                        <div class="col-12" style="padding:5px 0px 10px 0px">
                                               <button class="btn btn-dark" onclick="CVM.resetAll()" style="width:100%;border-radius:0.25rem">Reset All</button>
                                        </div>
                                    </div>
                                    <div class="col-5 pr-0">
                                        <div class="col-12" style="padding:5px 0px 10px 0px">
                                          <button id="lineBtn" class="btn btn-dark" onclick="CVM.processByLatlonForLine(0)" style="width:100%;border-radius:0.25rem">Extract Data</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li id='area' class='navigationLi ' style="display:none">
                            <div id='areaMenu' class='menu'>
                                <div class="row mt-2">
                                    <div class="col-12">
                                        <p>Draw a rectangle (click and drag) on the map or enter coordinates below</p>
                                    </div>
                                </div>
                                <div class="row d-flex ">
                                    <div class="col-5 pr-0">
                                        <input type="text"
                                               id="areaFirstLonTxt" 
                                               placeholder='Begin Longitude'
                                               title="first lon"
                                               onfocus="this.value=''" 
                                               onchange="reset_area_presets()"
                                               class="form-control">
                                        <input type="text"
                                               id="areaSecondLonTxt"
                                               title="second lon"
                                               placeholder='End Longitude'
                                               onfocus="this.value=''"
                                               onchange="reset_area_presets()"
                                               class="form-control mt-1">
                                        <input type="text"
                                               id="areaZTxt"
                                               placeholder="Depth (m)"
                                               title="areaZTxt"
                                               onfocus="this.value=''"
                                               class="form-control mt-1">
                                    </div>
                                    <div class="col-5 pr-0">
                                        <input type="text"
                                               placeholder="Begin Latitude"
                                               id="areaFirstLatTxt"
                                               title="first lat"
                                               onfocus="this.value=''"
                                               onchange="reset_area_presets()"
                                               class="form-control">
                                        <input type="text"
                                               id="areaSecondLatTxt"
                                               title="second lat"
                                               placeholder='End Latitude'
                                               onfocus="this.value=''"
                                               onchange="reset_area_presets()"
                                               class="form-control mt-1">
                                        <select title="Datatype" id="areaDataTypeTxt" class="my-custom-select custom-select mt-1" style="border-radius:0.25rem" >
                                               <option value="">Data Type</option>
                                               <option value="vs">Vs</option>
                                               <option value="vp">Vp</option>
                                               <option value="density">Density</option>
<!--
                                               <option value="poisson">poisson</option>
                                               <option value="vs30">vs30 etree</option>
-->
                                        </select>

                                        <input type="text"
                                               id="areaUIDTxt" 
                                               placeholder="UID" 
                                               title="Uniqued ID"
                                               onfocus="this.value=''" 
                                               class="form-control" style="display:none">
                                    </div>
                                </div>
                                <div class="row d-flex mt-1">
                                    <div class="col-5 pr-0">
                                        <div class="col-12" style="padding:5px 0px 10px 0px">
					       <button class="btn btn-dark" onclick="CVM.resetAll()" style="width:100%;border-radius:0.25rem">Reset All</button>
                                        </div>
                                    </div>
                                    <div class="col-5 pr-0">
                                        <div class="col-12" style="padding:5px 0px 10px 0px">
                                               <button id="areaBtn" class="btn btn-dark" onclick="CVM.processByLatlonForArea(0)" style="width:100%;border-radius:0.25rem">Extract Data</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </li>
                    </ul> 
                </div>

            </div>

<!-- description page -->
            <div id="cvm-description" class="col-12 pr-5" style="display:;border:solid 0px blue" >
	       <p id="cvm-model-selected" style="margin-bottom:0.5rem"></p>
	       <p id="cvm-model-description" style="margin-bottom:0.5rem;"></p>
	       <p id="cvm-model-reference" style="margin-bottom:0.5rem;"></p>
	       <p style="margin-bottom:0.5rem;">For additional information about UCVM and included models refer to the <a href="https://github.com/SCECcode/ucvm">UCVM Github homepage</a></p>
            </div>
</div> <!-- workspace -->

        </div> <!-- search-container -->

<!-- leaflet 2D map -->
        <div id="map-container" class="col-7 pl-2">
            <div class="w-100 mb-1" id='CVM_plot'
                style="position:relative;border:solid 1px #ced4da; height:576px;">
            </div>

         </div> <!-- map-container -->
    </div> <!-- mapDataBig -->

    <div id="result-container" class="row" style="display:;">
           <div class="col-12 flex-row" align="end">
               <button class="btn cvm-top-small-btn" title="download all the material property in the table" onclick="downloadMPTable()" ><span class="glyphicon glyphicon-download"></span></button>
               <button class="btn cvm-top-small-btn" title="material property  parameters displayed in the table" data-toggle="modal" data-target="#modalparameters"><span class="glyphicon glyphicon-info-sign"></span></button></td>
            </div>
            <div class="col-12 mb-0" id="mp-table">
                <div id="materialPropertyTable-container" style="overflow:auto;max-height:20vh;margin:0px 0px 0px 0px;">
                    <table id="materialPropertyTable">
                        <tr id="placeholder-row">
                            <td colspan="11">Material Property for selected locations will appear here </td>
                        </tr>
                    </table>
                </div>
	    </div> 

            <div class="col-12 flex-row" align="end">
                <button class="btn cvm-top-small-btn dropdown-toggle" data-toggle="dropdown"></button>
                <ul id='processMetaPlotResultTableList' class="dropdown-menu list-inline" role="menu">
                   <li data-id='s' hidden >Save All</li>
                   <li id='mprCollapseLi' data-id='c' hidden>Collapse</li>
		   <li data-id='p'>Click here to plot the comparison plot <br>after select 1 or more vertical profiles <br>from the result table</li>
                </ul>
            </div>
            <div class="col-12  mt-0 mb-4" id="result-table" style="display:">
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

  </div> <!-- cvmMain -->
</div> <!-- container -->

<div id="expand-view-key-container" style="display:none;">
  <div id="expand-view-key" class="row" style="opacity:0.8; height:1.4rem;">
    <button id="bigMapBtn" class="cxm-small-btn" title="Expand into a larger map" style="color:black;background-color:rgb(255,255,255);padding: 0rem 0.3rem 0rem 0.3rem" onclick="toggleBigMap()"><span class="fas fa-expand"></span>
    </button>
  </div>
</div>


<div class="modal" id="modaldescription" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modaldescriptionDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modaldescriptionContent" style="font-size:20px">
      <!--Body-->
      <div class="modal-body" id="modaldescriptionBody">
        <p id="modaldescriptionbody"></p>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn close" data-dismiss="modal">&times;</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: modaldescription-->

<div class="modal" id="modalreference" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalreferenceDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalreferenceContent" style="font-size:20px">
      <!--Body-->
      <div class="modal-body" id="modalreferenceBody">
        <p id="modalreferencebody"></p>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn close" data-dismiss="modal">&times;</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: modalreference-->


<div class="modal" id="modalselected" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalselectedDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalselectedContent" style="font-size:20px">
      <!--Body-->
      <div class="modal-body" id="modalselectedBody">
        <p id="modalselectedbody"></p>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn close" data-dismiss="modal">&times;</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: modalselected-->


<!--Modal: Model (modalwaiton)-->
<div class="modal" id="modalwaiton" tabindex="-1" style="z-index:8999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" style="width:45%" id="modalwaitonDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalwaitonContent">
      <!--Body-->
      <div class="modal-body" id="modalwaitonBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden; font-size:10pt">
           <div class="col-12">
           <p id="modalwaitonLabel" style="text-align:center;font-size:25px">Extracting Model Data</p>
           </div>
           <div class="row mt-2" style="border:0px solid blue">
	     <p id="modalwaitonLabel2" style="text-align:center;font-size:14px; margin-left:3px; margin-right:6px; border:0px solid red">Please wait as this process is complex and may take a few minutes. Many CVMs contain a large amount of data and the data may be interpolated before extracting</p>
           </div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button id="giveUp" class="btn btn-dark" data-dismiss="modal">Reset</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: modalwaiton-->


<!--Modal: (modalplotoption) -->
<div class="modal" id="modalplotoption" tabindex="-1" style="z-index:8999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-full" id="modalplotoptionDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalplotoptionContent">

      <div id="plotoption-header" class="modal-header" style="text-align:left; border:0px solid blue;display:">
	  <div class="col-12" style="border:0px solid orange;padding:10px 0px 0px 0px">
             <div id="options-container">
                 <h4 style="margin-bottom: 17px;">SCEC Community Velocity Model Explorer</h4>

<!-- Map Option -->
             <div class="mb-3" style="border:0px solid green;margin-left:4px;">
                <div id="plotoption-interp-option" class="form-check form-check-inline" style="display:">
                     <label class='form-check-label mini-option'
                            title='Interpolates data using splines in tension (tension=0.2). This has the effect of smoothing the resultant data plot, but may produce undesirable results in some situations, especially for spatially discontinuous models or models with sharp velocity discontinuities. Leave unchecked to plot the raw extracted data'
			    for="plotoption-interp">
                     <input class='form-check-inline mr-2'
                            type="checkbox"
			    id="plotoption-interp"/>Interp mode
                     </label>
                     <button class="btn cvm-top-small-btn" data-toggle="modal" data-target="#modalinfo" data-info='Interpolates data using splines in tension (tension=0.2). This has the effect of smoothing the resultant data plot, but may produce undesirable results in some situations, especially for spatially discontinuous models or models with sharp velocity discontinuities. Leave unchecked to plot the raw extracted data'><span class="glyphicon glyphicon-info-sign"></span></button>
                </div>
                <div id="plotoption-point-option" class="form-check form-check-inline" style="display:">
                     <label class='form-check-label mini-option'
			    title='Plots the source data points, which is useful to better understand the resolution of the plotted data. Note that all points are interpolated'
                            for="plotoption-point">
                     <input class='form-check-inline mr-2'
                            type="checkbox"
                            id="plotoption-point"/>Source Data Points
                     </label>
		     <button class="btn cvm-top-small-btn" data-toggle="modal" data-target="#modalinfo" data-info='Plots the source data points, which is useful to better understand the resolution of the plotted data. Note that all points are interpolated'><span class="glyphicon glyphicon-info-sign"></span></button>
                </div>

                 <div id="plotoption-cfm-option" class="form-check form-check-inline" style="display:">
                     <label class='form-check-label mini-option'
                            title='Show Community Fault Model v7.0 on map'
			    for="plotoption-cfm">
                     <input class='form-check-inline mr-2'
                            type="checkbox"
                            id="plotoption-cfm"/>CFM7.0 faults
                     </label>
		     <button class="btn cvm-top-small-btn" data-toggle="modal" data-target="#modaltinyinfo" data-info='Show Community Fault Model v7.0 on map'><span class="glyphicon glyphicon-info-sign"></span></button>
                </div>

                <div id="plotoption-ca-option" class="form-check form-check-inline" style="display:">
                     <label class='form-check-label mini-option'
                            title='Show Cities on map'
			    for="plotoption-ca">
                     <input class='form-check-inline mr-2'
                            type="checkbox"
			    id="plotoption-ca"/>Plot Cities
                     </label>
		     <button class="btn cvm-top-small-btn" data-toggle="modal" data-target="#modaltinyinfo" data-info='Show Cities on map'><span class="glyphicon glyphicon-info-sign"></span></button>
                 </div>
  
                 <div id="plotoption-map-option" class="form-check form-check-inline mt-1" style="display:">
                     <label class='form-check-label mini-option'
                            title='Show plot only'
			    for="plotoption-map">
                     <input class='form-check-inline mr-2'
                            type="checkbox"
			    id="plotoption-map"/>Plot with Map
                     </label>
		     <button class="btn cvm-top-small-btn" data-toggle="modal" data-target="#modaltinyinfo" data-info='Show plot only'><span class="glyphicon glyphicon-info-sign"></span></button>
                 </div>

                 <div id="plotoption-param-option" class="form-check form-check-inline mt-3" style="display:">
                     <label class="input-group-text" for="plotParamTxt">Select Parameter</label>
                     <select id="plotParamTxt" class="my-custom-select custom-select">
                        <option value=1>Vp</option>
                        <option value=2>Vs</option>
                        <option value=3>Density</option>
                        <option id="plotoption-param-all" value="4">All</option>
                      </select>
                  </div>

                  <div id="plotoption-pad-option" class="form-check form-check-inline mt-3" style="display:">
		     <label class="input-group-text" for="plotPadTxt">Select Map Padding

		     <button class="btn cvm-top-small-btn" data-toggle="modal" data-target="#modalinfo" data-info='This sets how far (in degrees) the map should extend beyond the selected 1D profile location. A map that is too local may not show identifiable geographic features. If so, increase the padding to make the map cover a larger geographic area'><span class="glyphicon glyphicon-info-sign"></span></button>

                     </label>
                     <select id="plotPadTxt" class="my-custom-select custom-select">
                        <option value="0.1">0.1</option>
                        <option value="0.5">0.5</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                     </select>
                  </div>


                 <div id="plotoption-cmap-option" class="form-check form-check-inline mt-3" style="display:">
                     <label class="input-group-text" for="cmapTxt">Select Colormap</label>
                     <select id="cmapTxt" class="my-custom-select custom-select">
                        <option value="1">Seis</option>
                        <option value="2">Rainbow</option>
                        <option value="3">Plasma</option>
                      </select>
                 </div>

                 <div id="plotoption-plotrange-option" class="mt-3" style="display:">
		     <label title='The plot defaults to cover the entire range of the data; however sometimes it is useful to force a color range to compare two plots with different data ranges'
                        style="margin:0px 0px 0px 5px">Set Plot Range
		     </label>

		     <button class="btn cvm-top-small-btn" data-toggle="modal" data-target="#modalinfo" data-info='The plot defaults to cover the entire range of the data; however sometimes it is useful to force a color range to compare two plots with different data ranges'><span class="glyphicon glyphicon-info-sign"></span></button>

                     <div class="form-check form-check-inline ml-2 mt-1">
                           <label title='scale minimum'
                                  style="margin-left:5px;width:100px;"
                                  for="minPlotScaleTxt">Minimum
                           </label>
                           <input type="text"
                                  id="minPlotScaleTxt"
                                  placeholder="min scale"
                                  title="minPlotScale"
                                  style="width:100px;"
                                  onfocus="this.value=''">
                     </div>

                     <div class="form-check form-check-inline ml-2">
                          <label title='scale maximum'
                                 style="margin-left:5px;width:100px;"
                                 for="maxPlotScaleTxt">Maximum
                          </label>
                          <input type="text"
                                 id="maxPlotScaleTxt"
                                 placeholder="max scale"
                                 title="maxPlotScale"
                                 style="width:100px;"
                                 onfocus="this.value=''">
                     </div>

                 </div>

		 <div style="text-align:center">
                     <button id="replotNow" onclick="replotPlots()" class="cvm2-btn btn btn-dark mt-4" style="width:50%;border-radius:0.25rem;"><i class="fa fa-refresh" aria-hidden="true"></i>
 REPLOT</button>
                 </div>

                 <div class="form-check form-check-inline mt-2" style="">
                    <button id="viewPlotSavePNGbtn" class="cvm-btn ml-1" onclick="savePNGPlotview()"><i class="fa fa-picture-o" aria-hidden="true"></i>
 PNG</button>
                    <button id="viewPlotSavePDFbtn" class="cvm-btn ml-2" onclick="savePDFPlotview()"><i class="fa fa-file-pdf-o" aria-hidden="true"></i>
 PDF</button>
                 </div>

                          <div style="border:solid 0px red; margin-left:0px;">
<!-- Window Options -->
                 <div class="form-check form-check-inline mt-2">
                   <button id="viewPlotMovebtn" class="cvm-btn ml-1" onclick="movePlotview()"><i class="fa fa-window-restore" aria-hidden="true"></i>
 Pop Out</button>
                   <button id="viewPlotClosebtn" class="cvm-btn ml-2" data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i>
 Close</button>
                 </div>
             </div>
             </div>

      </div>
     </div>
     </div>

      <!--Body-->
      <div id="plotoption-body" class="modal-body">
        <div id="plotoption-iframe-container" class="col-12" style="overflow:auto;">
          <iframe id="plotOptionIfram" src="" height="0" width="100%" allowfullscreen></iframe>
        </div>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: modalplotoption-->

<!--Modal: (modalkmlselect) -->
<div class="modal" id="modalkmlselect" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-small" id="modalkmlselectDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalkmlselectContent">
      <!--Body-->
      <div class="modal-body" id="modalkmlselectBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">
          <div class="col-12" id="kmlselectTable-container" style="font-size:14pt"></div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn btn-outline-primary btn-md" data-dismiss="modal">Close</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: modalkmlselect-->

<!--Modal: Parameters Table -->
<div class="modal" id="modalparameters" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-xl" id="modalparametersDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalparametersContent">
      <!--Body-->
      <div class="modal-body" id="modalparametersBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">
          <div class="col-12" id="parametersTable-container"></div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn close" data-dismiss="modal">&times;</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: modalparameters-->

<!--Modal: info -->
<div class="modal" id="modalinfo" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalinfoDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalinfoContent" style="font-size:20px">
      <!--Body-->
      <div class="modal-body" id="modalinfoBody">
        <p id="modalinfobody"></p>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn close" data-dismiss="modal">&times;</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: modalinfo-->

<!--Modal: info -->
<div class="modal" id="modaltinyinfo" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-small" id="modaltinyinfoDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modaltinyinfoContent" style="font-size:20px">
      <!--Body-->
      <div class="modal-body" style="text-align:center" id="modaltinyinfoBody">
        <p id="modaltinyinfobody"></p>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn close" data-dismiss="modal">&times;</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: modaltinyinfo-->


<!--Modal: colorrange-->
<div class="modal" id="modalcolorrange" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalcolorrangeDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalcolorrangeContent" style="font-size:20px">
      <!--Body-->
      <div class="modal-body" id="modalcolorrangeBody">
<p>The plot defaults to cover the entire range of the data; however sometimes it is useful to force a color range to compare two plots with different data ranges.</p>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn close" data-dismiss="modal">&times;</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: modalcolorrange-->

<!--Modal: padding-->
<div class="modal" id="modalpadding" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalpaddingDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalpaddingContent" style="font-size:20px">
      <!--Body-->
      <div class="modal-body" id="modalpaddingBody">
<p>This sets how far (in degrees) the map should extend beyond the selected 1D profile location. A map that is too local may not show identifiable geographic features. If so, increase the padding to make the map cover a larger geographic area.</p>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn close" data-dismiss="modal">&times;</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: modalpadding-->


<!--Modal: modeltype -->
<div class="modal" id="modalmodeltype" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalmodeltypeDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalmodeltypeContent" style="font-size:20px">
      <!--Body-->
      <div class="modal-body" id="modalmodeltypeBody">
          <p>The CVM Explorer hosts multiple models. Select the  model you wish to query or visualize in this list. The model bound will be displayed on the map except the 1D background models. </p>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn close" data-dismiss="modal">&times;</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: usage-->

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
        <button type="button" class="btn close" data-dismiss="modal">&times;</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: Name-->

<!--Modal: sType -->
<div class="modal" id="modalstype" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalstypeDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalstypeContent" style="font-size:20px">
      
      <div id="plotoption-header" class="modal-header" style="display:">
         <p> Select the type of visualization and data extraction to perform.</p>
      </div>

      <!--Body-->
      <div class="modal-body" id="modalstypeBody">
        <h4><b>Options:</b></h4>
	<ul class="mb-1" id="info-list">
           <li style="list-style-type:disc">Plot horizontal slice of vs, vp or density with <b>2D&nbsp;Horizontal&nbsp;Slice</b> option </li>
           <li style="list-style-type:disc">Plot cross section for vs, vp or density data type with <b>2D&nbsp;Vertical&nbsp;Cross&nbsp;Section</b> option</li>
           <li style="list-style-type:disc">Plot depth or elevation profile with <b>1D&nbsp;Vertical&nbsp;Profile</b> option</li> 
           <li style="list-style-type:disc">Query for material properties with <b>0D&nbsp;Point</b> option</li> 
        </ul>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn close" data-dismiss="modal">&times;</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: Name-->

<!--Modal: ZMode -->
<div class="modal" id="modalzmode" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalzmodeDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalzmodeContent" style="font-size:20px">
      <div id="zm-header" class="modal-header" style="display:">
         <p>Z-values can be extracted in depth for all proflies, but elevation is only supported in 1D vertical profile and 0D material property retrieval.</p> 
      </div>

      <!--Body-->
      <div class="modal-body" id="modalzmodeBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">
          <h4><b>Zmode:</b></h4>
          <ul class="mb-1" id="info-list">
             <li style="list-style-type:disc">Depth: 0 at surface and positive depth value</li>
             <li style="list-style-type:disc">Elevation: 0 at sealevel and positive value toward the air and negative value toward the center of the earth</li>
          </ul>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn close" data-dismiss="modal"">&times;</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: Name-->

<!--Modal: ModelType -->
<div class="modal" id="modalfileinfo" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalfileinfoDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalfileinfoContent">
      <!--Body-->
      <div class="modal-body" id="modalfileinfoBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">

          <div class="col-12" id="file-container">
<h5>Local input file format is 3 columns of Longitude, Latitude and Z separated by a comma or a space </h5>
<pre>
lon1 lat1 z1             lon1,lat1,z1
lon2 lat2 z2      or     lon2,lat2,z2
</pre>
<h5> Z value should match the Z mode selection from the main explorer, maximum display points is 200</h5>
          </div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn close" data-dismiss="modal">&times;</button>
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
<h5> Z Step value should match the Z mode selection from the main explorer</h5>

          </div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn close" data-dismiss="modal">&times;</button>
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
        <button type="button" class="btn btn-outline-primary btn-md" data-dismiss="modal">Close</button>
      </div> 
<!--
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn close" data-dismiss="modal">&times;</button>
      </div>
--->


    </div> <!--Content-->
   </div>
</div> <!--Modal: Name-->
</body>
</html>
