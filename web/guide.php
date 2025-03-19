<?php
require_once("php/navigation.php");
$header = getHeader("User Guide");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link href="css/vendor/font-awesome.min.css" rel="stylesheet">

    <link rel="stylesheet" href="css/vendor/bootstrap.min.css">
    <link rel="stylesheet" href="css/vendor/bootstrap-grid.min.css">
    <link rel="stylesheet" href="css/vendor/jquery-ui.css">
    <link rel="stylesheet" href="css/vendor/glyphicons.css">
    <link rel="stylesheet" href="css/cxm-ui.css">
    <link rel="stylesheet" href="css/cvm-ui.css">
    <link rel="stylesheet" href="css/sidebar.css">

    <script type='text/javascript' src='js/vendor/popper.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery.min.js'></script>
    <script type='text/javascript' src='js/vendor/bootstrap.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery-ui.js'></script>
    <title>SCEC Community Velocity Model Explorer: User Guide</title>
</head>
<body>
<?php echo $header; ?>

<div class="container info-page-container scec-main-container guide">

    <h1>User Guide</h1>

    <div class="row">
        <div class="col-12">
            <figure class="ucvm-interface figure float-lg-right">
                <img src="img/ucvm-explorer.png" class="figure-img img-fluid" alt="Screen capture of CVM Explorer interface">
                <figcaption class="figure-caption">Screen capture of CVM Explorer interface</figcaption>
            </figure>
            <h3>SCEC Community Velocity Model Explorer Overview</h3>
	      <p>The CVM Explorer provides a user-friendly map-based interface to 
<a href="https://www.scec.org/research/ucvm">UCVM version 25.4</a> release. It allows users to extract and visualize velocities of P and S waves and densities from different Community Velocity Models. The CVM Explorer currently has the functionality to produce various visualizations of the models including: 2D horizontal slices, 2D vertical cross sections, 1D vertical profiles, and individual 0D points from the extracted data.</p>
              <p>The pages on this site are the <a href="<?php echo $host_site_actual_path; ?>">CVM explorer page</a>, this user guide, <a href="disclaimer">a disclaimer</a>, and a <a href="contact">contact information</a> page.</p>
<p>The main interface is on the <a href="<?php echo $host_site_actual_path; ?>">CVM Explorer Page</a>. The interactive map on the right displays the geographic extent of the selected CVM. On top of the map, there are selection buttons to overlay fault traces from the <a href="https://www.scec.org/research/cfm">SCEC Community Fault Model (CFM)</a>, geological regions from <a href="https://www.scec.org/research/gfm">Geological Framework Model (GFM)</a> from the <a href="https://www.scec.org/research/crm">Community Rheology Model (CRM)</a> , and/or heat flow regions from the <a href="https://www.scec.org/research/ctm">Community Thermal Model (CTM)</a>. In the top right corner of the interactive map, there is a pull-down menu that allows the base map to be changed. By default, the map shown is <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ESRI Topographic</a>, but several other base map options are provided.</p>
               <p>The map interface has a small default size, but the map interface can be resized by clicking on the black dashed square icon located in the bottom right corner of the interface. Three size options are available, small (default), medium, and full-screen. The medium and full-screen sizes hide some of the tools, so these options are provided for visualization purposes and are not intended to be used when querying the model for download/visualization.</p>
<p> XXXXXX </p>
            <h3>Model Selection</h3>
             <p>A subset of UCVM models are deployed and selectable in the explorer. The boundary of the selected model is displayed on the map. For model details please refer to the UCVM documentation--here.</p>
            <h3>Z Mode Selection</h3>
             <p>There are two query modes to select from: by elevation or by depth. Query by elevation is for Z in meters above or below the sea level. An elevation of -100 meter is 100 meter below the sea level and elevation of 200 meter is 200 meter above the sea level.  Query by depth is for Z in meters at or below the surface.  A depth of 0 is at the surface and a depth of 1000 meter is 1000 meter below the surface.</p>
            <h3>Material Property Search</h3>
              <p> When performing material property search, there are two location selection methods. The first method is to
                enter the latitude/longitude values of the location into the text boxes, then clicking 
                the search icon <span style="white-space: nowrap;">(<span
                            style="color:#990000;font-size:20px" class="glyphicon glyphicon-search"></span>).</span>
                The second method is to pick a point on the map with a mouse click. The text boxes will be populated with values from the selection. Next, initiate the search by clicking the search icon <span style="white-space: nowrap;">(<span style="color:#990000;font-size:20px" class="glyphicon glyphicon-search"></span>).</span>
                User can also select a local file to upload composed of latlongs and Z values. Remember to select the right Z mode for the Z values in the file.</p>

            <h3>1D Vertical Profile</h3>
              <p>
              Plotting of the depth or elevation vertical profile also uses the same location selection methods used by the material property search. The Z step is the vertical step in meters. 
              </p>
            <h3>2D Vertical Cross Section</h3>
              <p>
              Plotting of a vertical cross section requires drawing a line on the map by either entering into the text boxes or by clicking a starting and an ending locations on the map. Default starting Z, ending Z and data type can be adjusted to different values.  
              </p>
            <h3>2D Horizontal Slice</h3>
              <p>
              Plotting of a horizontal slice requires drawing a rectangle on th map by either entering into the text boxes or drag and draw a rectangle on the map. Default Z and data type can be adjusted to different values.
              </p>

            <p>To return to the initial view with no selection, click the "RESET" button.</p>

            <h4>Browser Requirements</h4>
            <p>This site supports the latest versions of <a href="https://www.mozilla.org/en-US/firefox/">Firefox</a>, <a href="https://www.google.com/chrome/">Chrome</a>, <a href="https://www.apple.com/safari/">Safari</a>, and <a href="https://www.microsoft.com/en-us/windows/microsoft-edge">Microsoft Edge</a>.</p>

            <h4>About the SCEC Unified Community Velocity Model (UCVM) </h4>

            <p>More information about the UCVM can be found at: <a
               href="https://www.scec.org/research/ucvm">https://www.scec.org/research/ucvm</a></p>

</div>
</body>
</html>
