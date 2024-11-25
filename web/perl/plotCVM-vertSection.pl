#!/usr/bin/perl
#plotCVM-vertSection.pl
#Written 2024-08-29 by Scott T. Marshall
#-----------------------------------------------------------------------------------------------------------------------------#
# 
# This script processes a csv file containing a vertical cross section of data with a range of depths
# csv data must be in columns (lon,lat,depth,value)
# The data is converted to along track distance and is interpolated and plotted using GMT.
# The following plots are made:
#   1) A map showing the cross section location (with a user-specified pad to make the map cover a larger region)
#   2) The cross section projected from lon/lat to meters
#
# Note: The csv file must be in another directory and the path to the file must be included at the command line
# as the path is used to set other filenames and to make a tmp directory for GMT.
#  
#   Usage: ./plotCVM-vertSection.pl path/to/file.csv
# 
#-----------------------------------------------------------------------------------------------------------------------------#
#Use warnings, but skip warnings about uninitialized variables, since this happens every time you read in a blank line.
#use warnings; no warnings "uninitialized";
#get begin time and local time to print to file headers
$beginTime=time();
#loads Tools.pm included in this directory
#use FindBin;
#use lib $FindBin::Bin;
#for moho
use lib "/app/web/perl";
use Tools qw(getLonTick getLatTick getCBarTick getXtick getYtick);
#for parsing a filename from a path
use File::Basename;
#-----------------------------------------------------------------------------------------------------------------------------#
#------- USER-SPECIFIED PARAMETERS -------------------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
#Should I open the .eps file when finished? 0=no, 1=gv, 2=evince, 3=illustrator
$openEPS=0;

#How much should I pad the lon/lat map range by (deg)? This is so the cross section doesn't go all the way to the map edge
$pad=0.50;
#Should I plot the source data points? 1=yes 0=no
$plotPts=0;

#grab the csv filename from the command line args
$csvFile=$ARGV[0];
#parse the path portion of the csv filename so I can create this directory for writing GMT tmp files to
$gmtDir=substr($csvFile,0,-4);
unless(-d $gmtDir){system "mkdir $gmtDir"}
#split $csvFile into a filename and path so I can use $file to make new filenames and $dir for where they should go
($file,$dir)=fileparse($csvFile,".csv");
#remove the trailing slash
if(substr($dir,-1) eq "/"){$dir=substr($dir,0,-1)}
#$file=basename($csvFile,".csv");
#print "GMTDIR: $gmtDir\n";
#print "File: $file\n";
#print "Dir: $dir\n";

#make the various files the same name as the csv file, but ending with different extensions
$plotFile="$dir/$file.eps";
$distFile="$dir/$file.dist";
$meanFile="$dir/$file.mean";
$grdFile="$dir/$file.grd";
$cptFile="$dir/$file.cpt";

#tell GMT to write config/history files to $dir
$ENV{GMT_TMPDIR}="$gmtDir";
#$ENV{GMT_USERDIR}="$dir";
#$ENV{GMT_USER_CONFIG}="$confFile";
#$ENV{GMT_HISTORY_FILE}="$histFile";
#print "$ENV{GMT_USER_CONFIG}\n";
#print "$ENV{GMT_HISTORY_FILE}\n";

#How should I plot vels on the map? 
# 0=don't plot, 1=colored vels
$plotVels=1;
#What color palette should I use? 
$cpt="seis";
#What tension value should I use with surface? 
$t=0.10;
#Should I force the color range? 1=yes 0=no
$forceRange=0;
#What T value should I use for the color range? (only used if $forceRange==1).
$T="-T0.16/0.84/0.002";

#What is the path to the DEM and intensity file? Only used if plotting the DEM on the map
$dem="/home/marshallst/DEM/CA/CA-1arc.grd";
$int="/home/marshallst/DEM/CA/CA-1arc.int";

#should I plot the fault traces? 1=yes 0=no
$plotFaults=0;
$plotBlindFaults=0;
#what is the path to the file with the fault trace data?
$faultFile     ="/home/marshallst/CFM/7.0/obj/preferred/traces/gmt/CFM7.0_traces.lonLat";
$blindFaultFile="/home/marshallst/CFM/7.0/obj/preferred/traces/gmt/CFM7.0_blind.lonLat";
#what line width should I use for the faults?
$faultLine="1p,white";
$faultLine2="1p,black";
$blindFaultLine="1p,white";
#should I label each fault trace? 1=yes 0=no
$labelFaults=0;

#Should I make pdf and png versions of the EQ plots?
$makePDF=1;
$makePNG=1;

#check for correct usage and make sure the csv file exists
if(@ARGV!=1)       {print "\n    Usage: ./plotCVM-vertSection.pl path/to/file.csv\n\n"; exit}
unless(-e $csvFile){print "\n    Error: $csvFile not found\n\n"; exit}


#-----------------------------------------------------------------------------------------------------------------------------#
#------- READ CSV HEADER AND GRAB USEFUL INFO --------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
print "-----------------------------------------------------------------------------\n";
print "Reading $csvFile\n";
#open csv file for reading and read it line by line
open(CSV,$csvFile);
while(<CSV>){
	chomp;
	#if this is the last line of the header, kill the loop
	if($_=~ "# lon,lat,"){last;}
	#grab useful portions of the header
	elsif($_ =~ "# "){
		#remove the "# " so I can split by colon. Also, remove the space after the colon
		$_=~s/# //;
		$_=~s/: /:/;
		@data=split(":",$_);
		#grab useful portions of the header
		if   ($data[0] eq "Title")          {$title       =$data[1]}
		elsif($data[0] eq "CVM(abbr)")      {$model       =$data[1]}
		elsif($data[0] eq "Data_type")      {$dataType    =$data[1]}
		elsif($data[0] eq "Start_depth(m)") {$startDepth  =$data[1]}
		elsif($data[0] eq "End_depth(m)")   {$endDepth    =$data[1]}
		elsif($data[0] eq "Vert_spacing(m)"){$vertSpacing =$data[1]}
		elsif($data[0] eq "Total_pts")      {$numPts      =$data[1]}
		elsif($data[0] eq "Lat1")           {$begLat      =$data[1]}
		elsif($data[0] eq "Lon1")           {$begLon      =$data[1]}
		elsif($data[0] eq "Lat2")           {$endLat      =$data[1]}
		elsif($data[0] eq "Lon2")           {$endLon      =$data[1]}
	}#end elsif
}#end while

#set the colorbar title based on what parameter is in the csvFile header
if   ($dataType eq "vs")     {$zTitle="Vs (m/s)"}
elsif($dataType eq "vp")     {$zTitle="Vp (m/s)"}
elsif($dataType eq "density"){$zTitle="Density (g/cm\@+3\@+)"}
elsif($dataType eq "poisson"){$zTitle="Poisson's Ratio"}

#calculate the lon/lat ranges and midpts
$lonRange=abs($begLon-$endLon);
$latRange=abs($begLat-$endLat);
$midLon=($begLon+$endLon)/2;
$midLat=($begLat+$endLat)/2;
#figure out which lon/lat is smallest
if($begLon<$endLon){$minLon=$begLon; $maxLon=$endLon}
else               {$minLon=$endLon; $maxLon=$begLon}
if($begLat<$endLat){$minLat=$begLat; $maxLat=$endLat}
else               {$minLat=$endLat; $maxLat=$begLat}
#figure out which range is larger and set the range to cover the larger dimension in both directions. Also, add a little padding so the data doesn't go all the way to the edge
#if lon range is larger (~e/w cross section)
if($lonRange>$latRange){
	$minLon-=$pad;
	$maxLon+=$pad;
	$minLat=$midLat-0.5*$lonRange-$pad;
	$maxLat=$midLat+0.5*$lonRange+$pad;
	#set the offset for labeling the cross section
	$offset="0p/15p";
}
#if lat range is larger (~n/s cross section)
else{
	$minLat-=$pad;
	$maxLat+=$pad;
	$minLon=$midLon-0.5*$latRange-$pad;
	$maxLon=$midLon+0.5*$latRange+$pad;
	#set the offset for labeling the cross section
	$offset="15p/0p";
}

#set the -R range
$R="-R$minLon/$maxLon/$minLat/$maxLat";
#$R=`gmt info $csvFile -I- -i1,2`;
#chomp($R);
#get the map axis labeling string using Tools.pm
$lonAxis=getLonTick($R);
$latAxis=getLatTick($R);

print "Calculating along track distances using GMT\n";
print "-----------------------------------------------------------------------------\n";
#convert the locations to along track distances using GMT
system "gmt mapproject $csvFile -G$begLon/$begLat > $distFile";

#get the exact xy range for plotting
$Rxy=`gmt info $distFile -I- -i4,2`;
chomp($Rxy);
#parse out the min/max xy values
$tmp=$Rxy;
$tmp=~s/-R//;
@tmp=split("/",$tmp);
$minX=$tmp[0]; $maxX=$tmp[1];
$minY=$tmp[2]; $maxY=$tmp[3];
$xRange=$maxX-$minX;
$yRange=$maxY-$minY;
#calculate the vertical exaggeration and round to one decimal (assumes the XY plot is 7.0i/5.0i) 
$vertEx=sprintf("%.1f",$xRange/$yRange*(5/7));

#now set a reasonable amount to round of the plot range in the x-direction
if   ($xRange<=50)     {$xRound=1}
elsif($xRange<=100)    {$xRound=2}
elsif($xRange<=500)    {$xRound=10}
elsif($xRange<=1000)   {$xRound=20}
elsif($xRange<=5000)   {$xRound=100}
elsif($xRange<=10000)  {$xRound=200}
elsif($xRange<=50000)  {$xRound=1000}
elsif($xRange<=100000) {$xRound=2000}
elsif($xRange<=500000) {$xRound=10000}
elsif($xRange<=1000000){$xRound=20000}
else                   {$xRound=100000}
#now set a reasonable amount to round of the plot range in the y-direction
if   ($yRange<=50)     {$yRound=1}
elsif($yRange<=100)    {$yRound=2}
elsif($yRange<=500)    {$yRound=10}
elsif($yRange<=1000)   {$yRound=20}
elsif($yRange<=5000)   {$yRound=100}
elsif($yRange<=10000)  {$yRound=200}
elsif($yRange<=50000)  {$yRound=1000}
elsif($yRange<=100000) {$yRound=2000}
elsif($yRange<=500000) {$yRound=10000}
elsif($yRange<=1000000){$yRound=20000}
else                   {$yRound=100000}
#make the interpolated resolution 10x this rounding, so it always works out to be an integer multiple of the range
$xRes=$xRound/10;
$yRes=$yRound/10;

#get the extended xy range rounded to the nearest km for use with surface (to avoid grid spacing issues)
$Rext=`gmt info $distFile -I$xRound/$yRound -i4,2`;
chomp($Rext);
print "Extended Cross Section Range: $Rext\n";

#print useful metadata to stdout
print "Title               : $title\n";
print "Model               : $model\n";
print "Data Type           : $dataType\n";
print "StartDepth (m)      : $startDepth\n";
print "EndDepth (m)        : $endDepth\n";
print "VertSpacing (m)     : $vertSpacing\n";
print "Num Points          : $numPts\n";
print "Map Range           : $R\n";
print "Cross Section Range : $Rxy\n";
print "XY-Range            : $xRange/$yRange\n";
print "Range Round         : $xRound/$yRound\n";
print "Extended Range      : $Rext\n";
print "Interpolation Res   : $xRes/$yRes\n";
print "-----------------------------------------------------------------------------\n";


#-----------------------------------------------------------------------------------------------------------------------------#
#------- INTERPOLATE THE DATA AND MAKE A COLORMAP ----------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
if($plotVels>0){
	#Need to run blockmean first because the cross section spacing is not even because it was converted from lon/lat to distance in meters\n";
	print "Running blockmean to prevent aliasing\n";
	system "gmt blockmean $distFile $Rext -I$xRes/$yRes -i4,2,3 > $meanFile";
	print "Interpolating data using GMT's surface\n";
	system "gmt surface $meanFile $Rext -G$grdFile -I$xRes/$yRes -T$t -M7c -Ll0 -rg";
}
#figure out the z-range
if($forceRange==0){
	$T=`gmt grdinfo $grdFile -T/2`;
	chomp($T);
	#print "Z Range: $T\n";
	#get the min/max vels
	$tmp=$T;
	$tmp=~s/-T//;
	@z=split("/",$tmp);
	$zRange=$z[1]-$z[0];
	print "  Z-Range=$zRange;  MinZ=$z[0];  MaxZ=$z[1]\n";
}
print "Making color palette file\n";
system "gmt makecpt -C$cpt $T -D --COLOR_NAN=white > $cptFile";
#get the colorbar axis labeling string from Tools.pm
$cAxis=getCBarTick($T);

#-----------------------------------------------------------------------------------------------------------------------------#
#------- SETUP GMT VARIABLES -------------------------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
#set the map dimensions
$width="7.0i"; #for the map
#split the data range, so I can grab the min/max values
@range=split("/",$R);
#print "@range\n";
#calculate plot height using lat max and the second lon as the first lon has -R in it. All I need is the y-coordinate anyway.
$tmp=`echo $range[1] $range[3] | gmt mapproject $R -JM$width`;
chomp($tmp);
@tmp=split(" ",$tmp);
#grab the height in cm and convert to inches. Add on 0.95in for the title above
$height=$tmp[1]/2.54+1.20;

#set paper size
system "gmt set PS_MEDIA=17ix${height}i";
system "gmt set MAP_FRAME_TYPE=plain";
#degrees with negative longitudes
system "gmt set FORMAT_GEO_MAP=-D.x";
#Controls font size for axis numbering and titles, respectively
system "gmt set FONT_ANNOT_PRIMARY=10p";
system "gmt set FONT_LABEL=10p";
#Controls plot title and offset
system "gmt set FONT_TITLE=14p";
system "gmt set MAP_TITLE_OFFSET=0.0i";
#Set other map text parameters
#system "gmt set MAP_ANNOT_OFFSET_PRIMARY 5p";
#system "gmt set MAP_LABEL_OFFSET 8p";

#set some useful colors
$red="235/30/35";
$gray="209/211/212";
$blue="0/113/188";
$yellow="255/255/0";
$green="50/115/55";
#$waterBlue="102/153/204";
#$waterBlue="165/200/255"; #similar to Google Maps
$waterBlue="170/197/231"; #a slighly grayer version of the Google Maps color. Looks better with DEM's
#$waterBlue="227/237/245"; #the water color Tran wants


#-----------------------------------------------------------------------------------------------------------------------------#
#------- PLOT THE LOCATION MAP WITH GMT --------------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
print "-----------------------------------------------------------------------------\n";
print "Plotting Data with GMT\n";
print "-----------------------------------------------------------------------------\n";
printf ("Location Map will be %s x %.1fi\n",$width,$height);

#plot the coastline and color the water
system "gmt pscoast -X0.75i -Y0.65i $R -JM$width -W0.5p -S$waterBlue -Gwhite -Df -P -K > $plotFile";

#plot the source data points
#system "gmt psxy $csvFile -R -JM -Sc5.0p -Gblack -i1,2 -O -K >> $plotFile";
system "gmt psxy -R -JM -W4.0p,black -A -O -K <<-END>> $plotFile
$begLon $begLat
$endLon $endLat
END";
system "gmt psxy -R -JM -W2.0p,$red -A -O -K <<-END>> $plotFile
$begLon $begLat
$endLon $endLat
END";
#label the endpoints
system "gmt pstext -R -JM -D$offset -F+a0+jCM+f18p,Helvetica-Bold -O -K <<-END>> $plotFile
$begLon $begLat A
$endLon $endLat A'
END";

#plot fault traces, if specified
if($plotFaults==1){
	if($labelFaults==1){
		print "Plotting and labeling fault traces\n";
		#plot all non-blind faults with solid lines
		system "gmt psxy $faultFile -R -JM -Sqn1:+Lh+n0i/0.1i+kblack+s8 -W$faultLine -m -O -K >> $plotFile";
		#plot all blind faults with dashed lines, if specified
		if($plotBlindFaults==1){system "gmt psxy $blindFaultFile -R -JM -Sqn1:+Lh+n0i/0.1i+kblack+s8 -W$blindFaultLine -m -O -K >> $plotFile"}
	}#end if
	else {
		print "Plotting fault traces\n";
		#plot all non-blind faults with solid lines
		system "gmt psxy $faultFile -R -JM -W$faultLine -m -O -K >> $plotFile";
		#plot all blind faults with dashed lines, if specified
		if($plotBlindFaults==1){system "gmt psxy $blindFaultFile -R -JM -W$blindFaultLine -m -O -K >> $plotFile"}
	}#end else
}#end if

#plot the basemap axes. For a map scale, add -Lx0.3i/0.3i+jBL+w50k+c+f+u 
system "gmt psbasemap -R -JM -Bx$lonAxis -By$latAxis -BWeSn+t\"Model: $model | Vertical Profile Location\" -O -K >> $plotFile";


#-----------------------------------------------------------------------------------------------------------------------------#
#------- PLOT THE VERTICAL CROSS SECTION DATA WITH GMT -----------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
#plot the interpolated data
system "gmt grdimage $grdFile -X8.5i -Y0.85i $Rxy -JX7.0i/-5.0i -C$cptFile -O -K >> $plotFile";

#plot the source data points, if specified
if($plotPts==1){system "gmt psxy $distFile -R -JX -Sc1.5p -Gblack -i4,2 -O -K >> $plotFile"}

#plot A and A' above the plot
system "gmt pstext -R -JX -F+a0+f16p,Helvetica-Bold+jBC -D0i/0.1i -N -O -K <<END>> $plotFile
$minX $minY A
$maxX $minY A'
END";

#plot a colorbar below the plot
system "gmt psscale -R -JX -C$cptFile -B$cAxis+l\"$zTitle\" -Dx0/-0.85i+w7.0i/0.25i+jBL+h -O -K >> $plotFile";

#plot the axes last
system "gmt psbasemap -R -JX -Bxa+l\"Distance (m)\" -Bya+l\"Depth (m)\" -BWeSn+t\"Model: $model | Vertical Exaggeration: ${vertEx}x | n=$numPts\" -O --MAP_TITLE_OFFSET=0.15i >> $plotFile";

#---------------------------------------------------------------------------------------------------------------------------#
#------- VIEW THE MAP, CONVERT TO PDF/PNG AND PRINT TOTAL CPU TIME ---------------------------------------------------------#
#---------------------------------------------------------------------------------------------------------------------------#
#open the eps file with a user-specified program
if   ($openEPS==1){system "gv $plotFile -geometry +0+0 -scale=2.49 &"}
elsif($openEPS==2){system "evince $plotFile &"} 
elsif($openEPS==3){system "illustrator $plotFile &"}

#convert to pdf/png
if($makePDF==1){
	print "Converting to pdf...";
	system "gmt psconvert $plotFile -Tf";
	print "Finished!\n";
}#end if
if($makePNG==1){
	print "Converting to png...";
	system "gmt psconvert $plotFile -TG -E400";
	print "Finished!\n";
}#end if

#remove unneeded files
print "Removing unneeded files\n";
system "rm -r $gmtDir $distFile $meanFile $grdFile $cptFile";


#print the time spent on running this script using the difference in time from the beginning to end of this script.
$endTime=time();
$totTime=$endTime-$beginTime;
print "-----------------------------------------------------------------------------\n";
#print in seconds/mins/hours depending on how much time has passed
if($totTime>=3600) {printf("Script took %.2f hours\n",$totTime/3600)}
elsif($totTime>=60){printf("Script took %.2f minutes\n",$totTime/60)}
else               {printf("Script took %.2f seconds\n",$totTime)}

#print a final message
print "Finished!\n\n";
exit;



