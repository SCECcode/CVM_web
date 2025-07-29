#!/usr/bin/perl
#plotCVM-vertSection2.pl
#Written 2024-12/12 by Scott T. Marshall
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
#   Usage: ./plotCVM-vertSection.pl path/to/file.csv plotParam interp plotPts plotMap plotFaults plotCities pad cMap forceRange zMin zMax
#     Parameters are described below:
#     path/to/file.csv : The csv file must be specified with a path (relative or absolute). ./ will not work.
#     plotParam        : Select what is plotted 1=Vp; 2=Vs; 3=Density
#     interp           : 1=Interpolates using splines in tension (GMT surface command) 0=Plots data with no interpolation 
#     plotPts          : 1=Plots the source data points, so the user can see the resolution of the heatmap. 0=Don't plot points.
#     plotMap          : 1=Plots a simple location map showing the profile section. 0=Don't plot a map. Just plot the vertical profile data.
#     plotFaults       : 1=Plots CFM 7.0 fault traces (blind faults dashed). 0=Don't plot faults
#     plotCities       : 1=Plots selected CA/NV cities. 0=Don't plot cities
#     pad              : Supply any value in degrees. This will be added to the map spatial range in all directions.
#     cMap             : Select the colormap to use. 1=seis, 2=rainbow, 3=plasma.
#     forceRange       : Use a user-specified parameter range instead of the default which uses the range of the data.
#                        Note: zMin and zMax only need to be specified if forceRange=1.
# 
#-----------------------------------------------------------------------------------------------------------------------------#
#Use warnings, but skip warnings about uninitialized variables, since this happens every time you read in a blank line.
#use warnings; no warnings "uninitialized";
#get begin time and local time to print to file headers
$beginTime=time();
#loads Tools.pm included in this directory
#use FindBin;
#use lib $FindBin::Bin;
#for Moho, put Tools.pm in /app/web/perl/
use lib "/app/web/perl";
use Tools qw(getLonTick getLatTick getCBarTick getXtick getYtick getMapScale);
#for parsing a filename from a path
use File::Basename;
#-----------------------------------------------------------------------------------------------------------------------------#
#------- USER-SPECIFIED PARAMETERS -------------------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
#Should I open the .eps file when finished? 0=no, 1=gv, 2=evince, 3=illustrator
$openEPS=0;
#Should I print useful stats about the data to STDOUT? 1=yes 0=no, but json metadata will be printed for the CVM Explorer
$printStats=0;

#check for correct usage and make sure the csv file exists
if   (@ARGV==12){($csvFile,$plotParam,$interp,$plotPts,$plotMap,$plotFaults,$plotCities,$pad,$cMap,$forceRange,$zMin,$zMax)=@ARGV}
elsif(@ARGV==10){
	($csvFile,$plotParam,$interp,$plotPts,$plotMap,$plotFaults,$plotCities,$pad,$cMap,$forceRange)=@ARGV;
	if($forceRange!=0){print "\n  Error! If forceRange=1, zMin and zMax must be specified\n\n"; exit}
}
#print usage for incorrect inputs
else {
	print "\n  Usage: ./plotCVM-vertSection.pl path/to/file.csv plotParam interp plotPts plotMap plotFaults plotCities pad cMap forceRange zMin zMax\n";
	print "    Parameters are described below:\n";
	print "    path/to/file.csv: The csv file must be specified with a path (relative or absolute).\n";
	print "    plotParam: Select what is plotted 1=Vp; 2=Vs; 3=Density\n";
	print "    interp: 1=interpolates using splines in tension; 0=No interpolation\n";
	print "    plotPts: 1=Plots the source data points. 0=Don't plot points.\n";
	print "    plotMap: 1=Plots a simple location map 0=Don't plot a map. Just plot the vertical profile data.\n";
	print "    plotFaults: 1=Plots CFM 7.0 fault traces (blind faults dashed). 0=Don't plot faults\n";
	print "    plotCities: 1=Plots selected CA/NV cities. 0=Don't plot cities\n";
	print "    pad: Supply any value in degrees. This will be added to the map spatial range in all directions.\n";
	print "    cMap: Select the colormap to use. 1=seis, 2=rainbow, 3=plasma.\n";
	print "    forceRange: 1=Use a user-specified parameter range, 0=Use the range of the data.\n";
	print "    Note: zMin and zMax only need to be specified if forceRange=1\n\n";
	exit;
}
unless(-e $csvFile){print "\n  Error: $csvFile not found\n\n"; exit}

#parse the path portion of the csv filename so I can create this directory for writing GMT tmp files to
$gmtDir=substr($csvFile,0,-4);
unless(-d $gmtDir){system "mkdir $gmtDir"}
#split $csvFile into a filename and path so I can use $file to make new filenames and $dir for where they should go
($file,$dir)=fileparse($csvFile,".csv");
#remove the trailing slash, if present
if(substr($dir,-1) eq "/"){$dir=substr($dir,0,-1)}
#$file=basename($csvFile,".csv");
#print "GMTDIR: $gmtDir\n";
#print "File: $file\n";
#print "Dir: $dir\n";

#make the various files the same name as the csv file, but ending with different extensions
$gmtFile="$dir/$file.gmt";
$plotFile="$dir/$file.eps.tmp";
$distFile="$dir/$file.dist";
$meanFile="$dir/$file.mean";
$grdFile="$dir/$file.grd";
$cptFile="$dir/$file.cpt";
$epsFile="$dir/$file.eps";
$pdfFile="$dir/$file.pdf";

#tell GMT to write config/history files to $dir
$ENV{GMT_TMPDIR}="$gmtDir";

#How should I plot vels on the map? 
# 0=don't plot, 1=colored vels
$plotVels=1;
#What tension value should I use with surface? 
$t=0.2;
#What should the dimensions of the data plot be (in inches)?
$width=7.6;
$height=5.5;
#set the map dimensions
$widthMap="7.65i"; #for the map


#Should I plot a DEM on the location map?
$plotDEM=0;
#What is the path to the DEM, intensity, and cpt files? Only used if plotting the DEM on the map
$dem="/home/marshallst/DEM/CA/CA-1arc.grd";
$int="/home/marshallst/DEM/CA/CA-1arc.int";
$demCPT="/home/marshallst/GMT/allGray.cpt";

#should I plot the fault traces? 1=yes 0=no
#$plotFaults=0;
#what is the path to the file with the fault trace data?
$faultFile     ="/app/web/perl/CFM7.0_traces.lonLat";
$blindFaultFile="/app/web/perl/CFM7.0_blind.lonLat";
#what line width should I use for the faults?
$faultLine=     "0.75p,black";
$blindFaultLine="0.75p,black,3.0p_1.5p";
#should I label each fault trace? 1=yes 0=no
$labelFaults=0;

#should I plot cities? 1=yes 0=no
#$plotCities=1;
$cityFile="/app/web/perl/CA_Cities.txt";

#Should I make pdf and png versions of the plots?
$makePDF=1;
$makePNG=1;


#-----------------------------------------------------------------------------------------------------------------------------#
#------- READ CSV HEADER AND GRAB USEFUL INFO --------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
if($printStats==1){
	print "-----------------------------------------------------------------------------\n";
	print "Reading $csvFile\n";
}
#open csv file for reading and read it line by line
open(CSV,$csvFile);
#write a new file that is the same as the csv file, but with units converted.
open(GMT,">$gmtFile");
$count=0;
while(<CSV>){
	chomp;
	#grab useful portions of the header
	if($_ =~ "# "){
		#remove the "# " so I can split by colon. Also, remove the space after the colon
		$_=~s/# //;
		$_=~s/: /:/;
		@data=split(":",$_);
		#grab useful portions of the header
		if   ($data[0] eq "Title")          {$title      =$data[1]}
		elsif($data[0] eq "CVM(abbr)")      {$model      =$data[1]}
		elsif($data[0] eq "Start_depth(m)") {$startDepth =$data[1]}
		elsif($data[0] eq "End_depth(m)")   {$endDepth   =$data[1]}
		elsif($data[0] eq "Vert_spacing(m)"){$vertSpacing=$data[1]}
		elsif($data[0] eq "Depth_pts")      {$depthPts   =$data[1]; $depthPts =~ s/\s//g} #removes trailing spaces
		elsif($data[0] eq "Horizontal_pts") {$horzPts    =$data[1]; $horzPts  =~ s/\s//g}
		elsif($data[0] eq "Total_pts")      {$numPts     =$data[1]}
		elsif($data[0] eq "Lat1")           {$begLat     =$data[1]}
		elsif($data[0] eq "Lon1")           {$begLon     =$data[1]}
		elsif($data[0] eq "Lat2")           {$endLat     =$data[1]}
		elsif($data[0] eq "Lon2")           {$endLon     =$data[1]}
	}#end if
	#deal with data lines
	else {
		@data=split(",",$_);
		if(@data!=6){
			print "Error: Six columns of data should have been found. I found the line below\n";
			print "$_\n";
			exit;
		}#end if
		#write a simple header if this is the first data line
		if($count==0){
			if   ($plotParam==1){print GMT "#lon,lat,depth(km),vp(km/s)\n"}
			elsif($plotParam==2){print GMT "#lon,lat,depth(km),vs(km/s)\n"}
			elsif($plotParam==3){print GMT "#lon,lat,depth(km),density(g/cm^3)\n"}
		}#end if
		
		#print Vp data to $gmtFile
		if($plotParam==1){
			#convert depth from m to km and Vp from m/s to km/s
			$data[2]/=1000;
			$data[3]/=1000;
			#set the colorbar and eps file titles
			$zTitle="Vp (km/s)";
			$epsTitle="Vp (km/s)";
			#print the line to the new GMT file (still a csv file, format-wise)
			print GMT "$data[0] $data[1] $data[2] $data[3]\n";
		}#end if
		#print Vs data to $gmtFile
		if($plotParam==2){
			#convert depth from m to km and Vp from m/s to km/s
			$data[2]/=1000;
			$data[4]/=1000;
			#set the colorbar and eps file titles
			$zTitle="Vs (km/s)";
			$epsTitle="Vs (km/s)";
			#print the line to the new GMT file (still a csv file, format-wise)
			print GMT "$data[0],$data[1],$data[2],$data[4]\n";
		}#end if
		#print density data to $gmtFile
		if($plotParam==3){
			#convert depth from m to km and Vp from m/s to km/s
			$data[2]/=1000;
			$data[5]/=1000;
			#set the colorbar and eps file titles
			$zTitle="Density (g/cm\@+3\@+)";
			$epsTitle="Density (g/cm^3)";
			#print the line to the new GMT file (still a csv file, format-wise)
			print GMT "$data[0],$data[1],$data[2],$data[5]\n";
		}#end if
		
		#increment the line counter
		$count++;
	}#end else
}#end while
close(CSV);
close(GMT);

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
	#add the pad and an extra small % of the map width to make sure the profile letters are not cut off.
	$minLon=$minLon-$pad-(0.04*$lonRange);
	$maxLon=$maxLon+$pad+(0.04*$lonRange);
	$minLat=$midLat-0.5*$lonRange-$pad;
	$maxLat=$midLat+0.5*$lonRange+$pad;
	#set the offset for labeling the cross section
	$offset="0p/15p";
	#set a flag to let me know if I should plot lon or lat on non-interpolated cross sections. 0=use lon, 1=use lat
	$llFlag=0;
}
#if lat range is larger (~n/s cross section)
else{
	#add the pad and an extra small % of the map width to make sure the profile letters are not cut off.
	$minLat=$minLat-$pad-(0.03*$latRange);
	$maxLat=$maxLat+$pad+(0.03*$latRange);
	$minLon=$midLon-0.5*$latRange-$pad;
	$maxLon=$midLon+0.5*$latRange+$pad;
	#set the offset for labeling the cross section
	$offset="15p/0p";
	#set a flag to let me know if I should plot lon or lat on non-interpolated cross sections. 0=use lon, 1=use lat
	$llFlag=1;
}

#set the -R range
$R="-R$minLon/$maxLon/$minLat/$maxLat";
#$R=`gmt info $gmtFile -I- -i1,2`;
#chomp($R);
#get the map axis labeling string using Tools.pm
$lonAxis=getLonTick($R);
$latAxis=getLatTick($R);
$mapScale=getMapScale($R);


#-----------------------------------------------------------------------------------------------------------------------------#
#------- PROJECT THE DATA TO ALONG TRACK DISTANCE (KM) -----------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
if($printStats==1){
	print "Calculating along profile distances using GMT\n";
	print "-----------------------------------------------------------------------------\n";
}
#convert the locations to along track distances using GMT
system "gmt mapproject $gmtFile -G$begLon/$begLat+uk > $distFile";

#get the exact xy range for plotting
$Rxy=`gmt info $distFile -I- -i4,2`;
chomp($Rxy);
#get the axis labeling string using Tools.pm
$xAxis=getXtick($Rxy);
$yAxis=getYtick($Rxy);
#parse out the min/max xy values
$tmp=$Rxy;
$tmp=~s/-R//;
@tmp=split("/",$tmp);
$minX=$tmp[0]; $maxX=$tmp[1];
$minY=$tmp[2]; $maxY=$tmp[3];
$xRange=$maxX-$minX;
$yRange=$maxY-$minY;
$xSpacing=$maxX/($horzPts-1);
#calculate the vertical exaggeration and round to one decimal (assumes the XY plot is 7.0i/5.0i) 
$vertEx=sprintf("%.1f",$xRange/$yRange*($height/$width));

#now set a reasonable amount to round of the plot range in the x-direction (in km)
if   ($xRange<=0.01) {$xRound=0.0002}
elsif($xRange<=0.05) {$xRound=0.001}
elsif($xRange<=0.1)  {$xRound=0.002}
elsif($xRange<=0.5)  {$xRound=0.01}
elsif($xRange<=1)    {$xRound=0.02}
elsif($xRange<=5)    {$xRound=0.1}
elsif($xRange<=10)   {$xRound=0.2}
elsif($xRange<=50)   {$xRound=1}
elsif($xRange<=100)  {$xRound=2}
elsif($xRange<=500)  {$xRound=10}
elsif($xRange<=1000) {$xRound=20}
elsif($xRange<=5000) {$xRound=100}
elsif($xRange<=10000){$xRound=200}
else                 {$xRound=500}
#now set a reasonable amount to round of the plot range in the y-direction (in km)
if   ($yRange<=0.01) {$yRound=0.0002}
elsif($yRange<=0.05) {$yRound=0.001}
elsif($yRange<=0.1)  {$yRound=0.002}
elsif($yRange<=0.5)  {$yRound=0.01}
elsif($yRange<=1)    {$yRound=0.02}
elsif($yRange<=5)    {$yRound=0.1}
elsif($yRange<=10)   {$yRound=0.2}
elsif($yRange<=50)   {$yRound=1}
elsif($yRange<=100)  {$yRound=2}
elsif($yRange<=500)  {$yRound=10}
elsif($yRange<=1000) {$yRound=20}
elsif($yRange<=5000) {$yRound=100}
elsif($yRange<=10000){$yRound=200}
else                 {$yRound=500}

#make the interpolated resolution 10x this rounding, so it always works out to be an integer multiple of the range
$xRes=$xRound/10;
$yRes=$yRound/10;

#get the extended xy range rounded to the nearest km for use with surface (to avoid grid spacing issues)
$Rext=`gmt info $distFile -I$xRound/$yRound -i4,2`;
chomp($Rext);

if($printStats==1){
	print "Extended Cross Section Range: $Rext\n";
	#print useful metadata to stdout
	print "Title               : $title\n";
	print "Model               : $model\n";
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
}
	
#-----------------------------------------------------------------------------------------------------------------------------#
#------- INTERPOLATE THE DATA, IF SPECIFIED ----------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
#calculate ranges and project to along track distances, only if interpolation is on
if($interp==1 && $plotVels>0){
	#Need to run blockmean first because the cross section spacing is not even because it was converted from lon/lat to distance in meters\n";
	if($printStats==1){print "Running blockmean to prevent aliasing\n"}
	system "gmt blockmean $distFile $Rext -I$xRes/$yRes -i4,2,3 > $meanFile";
	if($printStats==1){print "Interpolating data using GMT's surface\n"}
	system "gmt surface $meanFile $Rext -G$grdFile -I$xRes/$yRes -T$t -M7c -Ll0 -rg";
}#end if $interp==1

#if interpolation is OFF
if($interp==0 && $plotVels>0){
	#grid the data so it is on an exactly uniform grid
	if($printStats==1){print "Running blockmean to prevent aliasing\n"}
	system "gmt blockmean $distFile $Rxy -I${horzPts}+n/${depthPts}+n -i4,2,3 -G$grdFile";
	#system "gmt grdinfo $grdFile";
}#end interp==0


#-----------------------------------------------------------------------------------------------------------------------------#
#------- FIGURE OUT Z-RANGE AND MAKE A COLOR PALLETE FILE --------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
#figure out the z-range
if($forceRange==0){
	$T=`gmt grdinfo $grdFile -T/2`;
	chomp($T);
	#print "Z Range: $T\n";
	#get the min/max vels
	$tmp=$T;
	$tmp=~s/-T//;
	@z=split("/",$tmp);
	#save to same variables as the command line args, so I can print the json string at the end no matter whether forceRange is used or not
	$zMin=$z[0];
	$zMax=$z[1];
	$zRange=$zMax-$zMin;
	if($printStats==1){print "  Z-Range=$zRange;  MinZ=$zMin;  MaxZ=$zMax\n"}
	#if zMin=zMax, set the min and max one unit apart
	if($zMin==$zMax){
		$zMin-=1;
		$zMax+=1;
		#remake the -T parameter with the new range
		$T="-T$zMin/$zMax";
	}#end if
}#end if($forceRange==0)
#if the user forced the zRange, make the -T string
else {
	$T="-T$zMin/$zMax";
	if($printStats==1){print "Using forced Z-Range: MinZ=$zMin;  MaxZ=$zMax\n"}
}

#get the colorbar axis labeling string from Tools.pm
$cAxis=getCBarTick($T);

#set the color palette based on the user specified value
if($printStats==1){print "Making color palette file\n"}
if   ($cMap==1){$cpt="seis";    system "gmt makecpt -C$cpt $T -D --COLOR_NAN=white > $cptFile"}
elsif($cMap==2){$cpt="rainbow";	system "gmt makecpt -C$cpt $T -D -I --COLOR_NAN=white > $cptFile"}
elsif($cMap==3){$cpt="plasma";  system "gmt makecpt -C$cpt $T -D -I --COLOR_NAN=white > $cptFile"}
else {print "\n\n  Error: cMap must be 1-3. You entered $cMap\n\n"; exit}


#-----------------------------------------------------------------------------------------------------------------------------#
#------- SETUP GMT VARIABLES -------------------------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
#split the data range, so I can grab the min/max values
@range=split("/",$R);
#print "@range\n";
#calculate plot height using lat max and the second lon as the first lon has -R in it. All I need is the y-coordinate anyway.
$tmp=`echo $range[1] $range[3] | gmt mapproject $R -JM$widthMap`;
chomp($tmp);
@tmp=split(" ",$tmp);
#grab the height in cm and convert to inches. Add on 0.95in for the title above
$heightMap=$tmp[1]/2.54+0.85;

#set paper size
if($plotMap==1){system "gmt set PS_MEDIA=17ix${heightMap}i"}
else           {system "gmt set PS_MEDIA=8.5ix7.57i"}
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
#------- PLOT THE VERTICAL CROSS SECTION DATA WITH GMT -----------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
if($printStats==1){
	print "-----------------------------------------------------------------------------\n";
	print "Plotting Data with GMT\n";
	print "-----------------------------------------------------------------------------\n";
}

#plot the interpolated data
if($interp==1){
	#plot the interpolated data
	system "gmt grdimage $grdFile -X0.57i -Y1.45i $Rxy -JX${width}i/-${height}i -C$cptFile -P -K > $plotFile";
	#system "gmt grdview $grdFile -X0.57i -Y1.45i $Rxy -JX${width}i/-${height}i -C$cptFile -T+s -P -K > $plotFile";
	#plot the source data points, if specified
	if($plotPts==1){system "gmt psxy $distFile -R -JX -Sc1.5p -Gblack -i4,2 -O -K >> $plotFile"}
}#end if $interp==1
#plot the data not interpolated
else {
	#plot the interpolated data
	system "gmt grdview $grdFile -X0.57i -Y1.45i $Rxy -JX${width}i/-${height}i -C$cptFile -T+s -P -K > $plotFile";
	#plot the source data points, if specified
	if($plotPts==1){system "gmt psxy $distFile -R -JX -Sc1.5p -Gblack -i4,2 -O -K >> $plotFile"}
}

#plot A and A' above the plot and the lon,lat locations of each
system "gmt pstext -R -JX -F+a0+f18p,Helvetica-Bold+jBC -D0i/0.1i -N -O -K <<END>> $plotFile
$minX $minY A
$maxX $minY A'
END";
system "gmt pstext -R -JX -F+a0+f12p,Helvetica-Bold+jBL -D0.18i/0.14i -N -O -K <<END>> $plotFile
$minX $minY ($begLon, $begLat)
END";
system "gmt pstext -R -JX -F+a0+f12p,Helvetica-Bold+jBR -D-0.18i/0.14i -N -O -K <<END>> $plotFile
$maxX $minY ($endLon, $endLat)
END";

#plot a colorbar below the plot
system "gmt psscale -R -JX -C$cptFile -B$cAxis+l\"$zTitle\" -Dx0/-0.85i+w${width}i/0.25i+jBL+h -O -K >> $plotFile";

#plot the axes last
if($plotMap==0){
	#system "gmt psbasemap -R -JX -Bx$xAxis+l\"Distance (km)\" -By$yAxis+l\"Depth (km)\" -BWeSn+t\"Model: $model | Vertical Exaggeration: ${vertEx}x | Query Points=$numPts\" -O --MAP_TITLE_OFFSET=0.32i >> $plotFile";
	system "gmt psbasemap -R -JX -Bx$xAxis+l\"Distance (km)\" -By$yAxis+l\"Depth (km)\" -BWeSn+t\"Model: $model | Query Points=$numPts\" -O --MAP_TITLE_OFFSET=0.32i >> $plotFile";
}
else {
	#system "gmt psbasemap -R -JX -Bx$xAxis+l\"Distance (km)\" -By$yAxis+l\"Depth (km)\" -BWeSn+t\"Model: $model | Vertical Exaggeration: ${vertEx}x | Query Points=$numPts\" -O -K --MAP_TITLE_OFFSET=0.32i >> $plotFile";
	system "gmt psbasemap -R -JX -Bx$xAxis+l\"Distance (km)\" -By$yAxis+l\"Depth (km)\" -BWeSn+t\"Model: $model | Query Points=$numPts\" -O -K --MAP_TITLE_OFFSET=0.32i >> $plotFile";
}


#-----------------------------------------------------------------------------------------------------------------------------#
#------- PLOT THE LOCATION MAP WITH GMT --------------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
if($plotMap==1){
	if($printStats==1 ){printf ("Location Map will be %s x %.1fi\n",$widthMap,$heightMap)}
	#plot a DEM, if specified
	if($plotDEM==1){
		if($printStats==1){print "Plotting DEM\n"}
		system "gmt grdimage $dem -X8.5i -Y-1.12i $R -JM$widthMap -I$int -C$demCPT -O -K >> $plotFile";
		#plot the coastline and color the water
		system "gmt pscoast -R -JM -W0.5p -S$waterBlue -Df -N1/1.0p -N2/0.5p -O -K >> $plotFile";
	}
	#just plot the coastline and color the water
	else {system "gmt pscoast -X8.5i -Y-1.12i $R -JM$widthMap -W0.5p -S$waterBlue -Gwhite -Df -N1/1.0p -N2/0.5p -O -K >> $plotFile"}
	
	#plot fault traces, if specified
	if($plotFaults==1){
		if($labelFaults==1){
			if($printStats==1){print "Plotting and labeling fault traces\n"}
			#plot all non-blind faults with solid lines, blind with dashed lines
			system "gmt psxy $faultFile -R -JM -Sqn1:+Lh+n0i/0.1i+kblack+s8 -W$faultLine -m -O -K >> $plotFile";
			system "gmt psxy $blindFaultFile -R -JM -Sqn1:+Lh+n0i/0.1i+kblack+s8 -W$blindFaultLine -m -O -K >> $plotFile";
		}#end if
		else {
			if($printStats==1){print "Plotting fault traces\n"}
			#plot all non-blind faults with solid lines, blind with dashed lines
			system "gmt psxy $faultFile -R -JM -W$faultLine -m -O -K >> $plotFile";
			system "gmt psxy $blindFaultFile -R -JM -W$blindFaultLine -m -O -K >> $plotFile";
		}#end else
	}#end if
	
	#plot cities, if specified
	if($plotCities==1){
		if($printStats==1){print "Plotting city locations\n"}
		system "gmt psxy $cityFile -R -JM -Sc5p -Ggold -W0.5p -O -K >> $plotFile";
		system "gmt pstext $cityFile -R -JM -Dj3p -F+a0+jBL+f8p,Helvetica-Bold,white,-=1p,white -O -K >> $plotFile";
		system "gmt pstext $cityFile -R -JM -Dj3p -F+a0+jBL+f8p,Helvetica-Bold           -O -K >> $plotFile";
	}
	
	#plot the profile end points
	#system "gmt psxy $gmtFile -R -JM -Sc5.0p -Gblack -i1,2 -O -K >> $plotFile";
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
	
	#plot the basemap axes. For a map scale, add -Lx0.3i/0.3i+jBL+w50k+c+f+u 
	system "gmt psbasemap -R -JM -Bx$lonAxis -By$latAxis -BWeSn+t\"Model: $model | Vertical Profile Location ($begLon, $begLat) to ($endLon, $endLat)\" $mapScale -O >> $plotFile";
	
}#end if (plotting location map)	


#---------------------------------------------------------------------------------------------------------------------------#
#------- WRITE A NEW EPS FILE JUST TO CHANGE THE TITLE ---------------------------------------------------------------------#
#---------------------------------------------------------------------------------------------------------------------------#
open(TMP,$plotFile);
open(NEW,">$epsFile");
while(<TMP>){
	chomp;
	#check and replace header lines. Otherwise print line as-is
	if($_=~ "\%\%Title:"){print NEW "\%\%Title: SCEC CVM Explorer | Model: $model | Plot: $epsTitle | Vertical Profile Location: ($begLon, $begLat) to ($endLon, $endLat)\n"}
	elsif($_=~ "\%\%Creator:"){print NEW "\%\%Creator: SCEC CVM Explorer\n"}
	else {print NEW "$_\n";}
}#end while (reading $plotFile)
close(TMP);
close(NEW);


#---------------------------------------------------------------------------------------------------------------------------#
#------- VIEW THE MAP, CONVERT TO PDF/PNG AND PRINT TOTAL CPU TIME ---------------------------------------------------------#
#---------------------------------------------------------------------------------------------------------------------------#
#open the eps file with a user-specified program
if   ($openEPS==1){system "gv $epsFile -geometry +0+0 -scale=1.49 --watch &"}
elsif($openEPS==2){system "evince $epsFile &"} 
elsif($openEPS==3){system "illustrator $epsFile &"}

#convert to pdf/png
if($makePDF==1){
	if($printStats==1){print "Converting to pdf..."}
	system "gmt psconvert $epsFile -Tf";
	if($printStats==1){print "Finished!\n"}
}#end if
if($makePNG==1){
	if($printStats==1){print "Converting to png..."}
	system "gmt psconvert $epsFile -TG -E400";
	if($printStats==1){print "Finished!\n"}
}#end if

#remove unneeded files
if($printStats==1){print "Removing unneeded files\n"}
system "rm -r $gmtDir $gmtFile $distFile $meanFile $grdFile $cptFile $plotFile";
if($openEPS==0){system "rm $epsFile"}

#print the time spent on running this script using the difference in time from the beginning to end of this script.
$endTime=time();
$totTime=$endTime-$beginTime;
if($printStats==1){
	print "-----------------------------------------------------------------------------\n";
	#print in seconds/mins/hours depending on how much time has passed
	if($totTime>=3600) {printf("Script took %.2f hours\n",$totTime/3600)}
	elsif($totTime>=60){printf("Script took %.2f minutes\n",$totTime/60)}
	else               {printf("Script took %.2f seconds\n",$totTime)}
	
	#print a final message
	print "Finished!\n\n";
}
#print a json string to tell the CVM Explorer the status of each plot parameter
if($printStats==0){
	print "{\"type\": \"cross\", \"file\": \"$pdfFile\", \"plotParam\": $plotParam, \"interp\": $interp, \"points\": $plotPts, \"plotMap\": $plotMap, \"faults\": $plotFaults, \"cities\": $plotCities, \"pad\": $pad, \"cMap\": $cMap, \"forceRange\": $forceRange, \"range\": { \"min\": $zMin, \"max\": $zMax } }\n";
}
exit;
