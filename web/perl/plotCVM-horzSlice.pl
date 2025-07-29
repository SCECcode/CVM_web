#!/usr/bin/perl
#plotCVM-horzSlice.pl
#Written 2024-08-29 by Scott T. Marshall
#-----------------------------------------------------------------------------------------------------------------------------#
# 
# This script processes a csv file containing a horizontal slice of data located at a constant depth
# csv Data must be in columns (lon,lat,value) 
# The data is then interpolated and plotted on a map using GMT.
# This is used by the CVM explorer to plot CVM horizontal slices extracted by users.
#
# Note: The csv file must be in another directory and the path to the file must be included at the command line
# as the path is used to set other filenames and to make a tmp directory for GMT.
#  
#   Usage: ./plotCVM-horzSlice.pl path/to/file.csv plotFaults plotCities plotPts cMap forceRange zMin zMax
#     Parameters are described below:
#     path/to/file.csv : The csv file must be specified with a path (relative or absolute). ./ will not work.
#     plotFaults       : 1=Plots CFM 7.0 fault traces (blind faults dashed). 0=Don't plot faults
#     plotCities       : 1=Plots selected CA/NV cities. 0=Don't plot cities
#     plotPts          : 1=Plots the source data points, so the user can see the resolution of the heatmap. 0=Don't plot points.
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
use Tools qw(getLonTick getLatTick getCBarTick getMapScale);
#for parsing a filename from a path
use File::Basename;
#-----------------------------------------------------------------------------------------------------------------------------#
#------- USER-SPECIFIED PARAMETERS -------------------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
#Should I open the .eps file when finished? 0=no, 1=gv, 2=evince, 3=illustrator
$openEPS=0;
#Should I print useful stats about the data to STDOUT? 1=yes 0=no, but json metadata will be printed for the CVM Explorer
$printStats=0;

#grab the command line arguments
if   (@ARGV==8){($csvFile,$plotFaults,$plotCities,$plotPts,$cMap,$forceRange,$zMin,$zMax)=@ARGV}
elsif(@ARGV==6){
	($csvFile,$plotFaults,$plotCities,$plotPts,$cMap,$forceRange)=@ARGV;
	#in this case, check that $forceRange is zero. If not, print an error.
	if($forceRange!=0){print "\n  Error! If forceRange=1, zMin and zMax must be specified\n\n"; exit}
}
#print usage for incorrect inputs
else {
	print "\n  Usage: ./plotCVM-horzSlice.pl path/to/file.csv plotFaults plotCities plotPts cMap forceRange zMin zMax\n";
	print "    Parameters are described below:\n";
	print "    path/to/file.csv: The csv file must be specified with a path (relative or absolute).\n";
	print "    plotFaults: 1=Plots CFM 7.0 fault traces (blind faults dashed). 0=Don't plot faults\n";
	print "    plotCities: 1=Plots selected CA/NV cities. 0=Don't plot cities\n";
	print "    plotPts: 1=Plots the source data points. 0=Don't plot points.\n";
	print "    cMap: Select the colormap to use. 1=seis, 2=rainbow, 3=plasma.\n";
	print "    forceRange: 1=Use a user-specified parameter range, 0=Use the range of the data.\n";
	print "    Note: zMin and zMax only need to be specified if forceRange=1\n\n";
	exit;
}
#check for files
unless(-e $csvFile){print "\n    Error: $csvFile not found\n\n"; exit}

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
$gmtFile ="$dir/$file.gmt";
$plotFile="$dir/$file.eps.tmp";
$grdFile ="$dir/$file.grd";
$cptFile ="$dir/$file.cpt";
$epsFile ="$dir/$file.eps";
$pdfFile ="$dir/$file.pdf";

#tell GMT to write config/history files to $dir
$ENV{GMT_TMPDIR}="$gmtDir";

#How should I plot vels on the map? 
# 0=don't plot, 1=colored vels, 2=colored vels shaded by DEM
$plotVels=1;

#What tension value should I use with surface?
$t=0.1;

#What is the path to the DEM and intensity files? Only used if shading by DEM or plotting a DEM on the map
$dem="/home/marshallst/DEM/CA/CA-1arc.dem";
$int="/home/marshallst/DEM/CA/CA-1arc.int";

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
	print "-----------------------------------------------------------------------------\n";
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
		#remove the #  so I can split by colon. Also, remove the space after the colon
		$_=~s/# //;
		$_=~s/: /:/;
		@data=split(":",$_);
		#grab useful portions of the header
		if   ($data[0] eq "Title")          {$title   =$data[1]}
		elsif($data[0] eq "CVM(abbr)")      {$model   =$data[1]}
		elsif($data[0] eq "Data_type")      {$dataType=$data[1]}
		elsif($data[0] eq "Depth(m)")       {$depth   =$data[1]/1000}
		elsif($data[0] eq "Spacing(degree)"){$spacing =$data[1]}
		elsif($data[0] eq "Lat1")           {$begLat  =$data[1]}
		elsif($data[0] eq "Lon1")           {$begLon  =$data[1]}
		elsif($data[0] eq "Lat2")           {$endLat  =$data[1]}
		elsif($data[0] eq "Lon2")           {$endLon  =$data[1]}
	}#end if
	#deal with data lines
	else {
		@data=split(",",$_);
		if(@data!=3){
			print "Error: Three columns of data should have been found. I found the line below\n";
			print "$_\n";
			exit;
		}#end if
		#write a simple header if this is the first data line
		if($count==0){
			if   ($dataType eq "vs")     {print GMT "#lon,lat,vs(km/s)\n"}
			elsif($dataType eq "vp")     {print GMT "#lon,lat,vp(km/s)\n"}
			elsif($dataType eq "density"){print GMT "#lon,lat,density(g/cm^3)\n"}
			elsif($dataType eq "poisson"){print GMT "#lon,lat,poisson\n"}
		}#end if
		
		#convert the parameter to more useful units
		if($dataType eq "vs" || $dataType eq "vp" || $dataType eq "density"){
			#the conversion is the same for m/s to km/s and kg/m^3 to g/cm^3. Cool!
			$data[2]/=1000;
		}#end if
		#print the line to the new GMT file (still a csv file, format-wise)
		print GMT "$data[0],$data[1],$data[2]\n";
		
		#increment the line counter
		$count++;
	}#end else
}#end while
close(CSV);
close(GMT);

#set the colorbar title based on what parameter is in the csvFile header
if   ($dataType eq "vs")     {$zTitle="Vs (km/s)"; $epsTitle="Vs (km/s)"}
elsif($dataType eq "vp")     {$zTitle="Vp (km/s)"; $epsTitle="Vp (km/s)"}
elsif($dataType eq "density"){$zTitle="Density (g/cm\@+3\@+)"; $epsTitle="Density (g/cm^3)"}
elsif($dataType eq "poisson"){$zTitle="Poisson's Ratio"; $zTitle="Poisson's Ratio"}

#get the data range
$tmp=`gmt info $gmtFile`;
chomp($tmp);
@tmp=split(" ",$tmp);
$numPts=$tmp[3];
#get the z-range to figure out if I should use GMT's surface or triangulate
#remove unneeded characters
$tmp[6]=~ s/<//;
$tmp[6]=~ s/>//;
@csvZ=split("/",$tmp[6]);
#print "@csvZ\n";
#if the range is zero set a flag, so I know which gmt method to use later
$csvZRange=$csvZ[1]-$csvZ[0];
if($csvZRange==0){$iMethod=0}
else             {$iMethod=1}

#get the lon/lat range
$R=`gmt info $gmtFile -I-`;
chomp($R);
#use Tools.pm to set the axis labeling/tickmarks and map scale
$xAxis=getLonTick($R);
$yAxis=getLatTick($R);
$mapScale=getMapScale($R);
#parse out the min/max xy values
$tmp=$R;
$tmp=~s/-R//;
@tmp=split("/",$tmp);
$minX=$tmp[0]; $maxX=$tmp[1];
$minY=$tmp[2]; $maxY=$tmp[3];
$xRange=$maxX-$minX;
$yRange=$maxY-$minY;
#middle of the plot, to be used later with printing the title's second line
$midX=($minX+$maxX)/2;
#figure out which range is larger
if($xRange>$yRange){$maxRange=$xRange}
else               {$maxRange=$yRange}
#now set a reasonable amount to round of the plot range
if   ($maxRange<=0.0005){$round=0.00001}
elsif($maxRange<=0.001) {$round=0.00002}
elsif($maxRange<=0.05)  {$round=0.001}
elsif($maxRange<=0.1)   {$round=0.002}
elsif($maxRange<=0.5)   {$round=0.01}
elsif($maxRange<=1)     {$round=0.02}
elsif($maxRange<=5)     {$round=0.10}
elsif($maxRange<=10)    {$round=0.20}
else                    {$round=1.0}
#make the interpolated resolution 10x this rounding, so it always works out to be an integer multiple of the range
$res=$round/10;

#round of the range to avoid surface grid increment errors
$Rext=`gmt info $gmtFile -I$round`;
chomp($Rext);
#round of the range even farther, just for testing
#$Rext2=`gmt info $gmtFile -I0.5`;
#chomp($Rext2);

#print useful metadata to stdout
if($printStats==1){
	print "Title             : $title\n";
	print "Model             : $model\n";
	print "Data Type         : $dataType\n";
	print "Depth (km)        : $depth\n";
	print "Spacing (deg)     : $spacing\n";
	print "Num Points        : $numPts\n";
	print "Data Range        : $R\n";
	print "XY-Range          : $xRange/$yRange\n";
	print "Range Round       : $round\n";
	print "Extended Range    : $Rext\n";
	print "Interpolation Res : $res\n";
	print "-----------------------------------------------------------------------------\n";
}


#-----------------------------------------------------------------------------------------------------------------------------#
#------- INTERPOLATE THE VELS AND MAKE A COLORMAP ----------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
if($plotVels>0){
	if($printStats==1){print "Interpolating data using GMT's surface\n"}
	if   ($iMethod==1){system "gmt surface $gmtFile $Rext -G$grdFile -I$res -T$t -M7c -rg"}
	elsif($iMethod==0){system "gmt triangulate $gmtFile $R -I$res -G$grdFile"; print "Z-Values are constant. Using gmt triangulate\n"}
}

#resample the dem intensity file, if necessary
if($plotVels==2){
	if($printStats==1){print "Resampling DEM to $res to match vel data\n"}
	system "gmt grdsample $int $R -G$intFile -I$res -rg";
}

if($forceRange==0){
	$T=`gmt grdinfo $grdFile -T/2`;
	chomp($T);
	#print "Z Range: $T\n";
	#print "$cAxis\n";
	#get the min/max vels
	$tmp=$T;
	$tmp=~s/-T//;
	@z=split("/",$tmp);
	$zRange=$z[1]-$z[0];
	#save to same variables as the command line args, so I can print the json string at the end no matter whether forceRange is used or not
	$zMin=$z[0];
	$zMax=$z[1];
	if($printStats==1){print "  Z-Range=$zRange;  MinZ=$zMin;  MaxZ=$zMax\n"}
	#if zMin=zMax, set the min and max one unit apart
	if($zMin==$zMax){
		$zMin-=1;
		$zMax+=1;
		#remake the -T parameter with the new range
		$T="-T$zMin/$zMax";
	}
}
#if the user forced the zRange, make the -T string
else {
	$T="-T$zMin/$zMax";
	if($printStats==1){print "Using forced Z-Range: MinZ=$zMin;  MaxZ=$zMax\n"}
}

#get the axis labeling and tickmark string using Tools.pm
$cAxis=getCBarTick($T);
#set the color palette based on the user specified value
if($printStats==1){print "Making color palette file\n"}
if($cMap==1){
	$cpt="seis";
	system "gmt makecpt -C$cpt $T -D --COLOR_NAN=white > $cptFile";
}
elsif($cMap==2){
	$cpt="rainbow";
	system "gmt makecpt -C$cpt $T -D -I --COLOR_NAN=white > $cptFile";
}
elsif($cMap==3){
	$cpt="plasma";
	system "gmt makecpt -C$cpt $T -D -I --COLOR_NAN=white > $cptFile";
}
else {print "\n\n  Error: cMap must be 1-3. You entered $cMap\n\n"}


#-----------------------------------------------------------------------------------------------------------------------------#
#------- SETUP GMT VARIABLES -------------------------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
#set the map dimensions
$width="7.5i"; #for the map
#split the data range, so I can grab the min/max values
@range=split("/",$R);
#print "@range\n";
#calculate plot height using lat max and the second lon as the first lon has -R in it. All I need is the y-coordinate anyway.
$tmp=`echo $range[1] $range[3] | gmt mapproject $R -JM$width`;
chomp($tmp);
@tmp=split(" ",$tmp);
#grab the height in cm and convert to inches. Add on 1.85in for the title above and colorbar below.
$height=$tmp[1]/2.54+1.90;

#set paper size
system "gmt set PS_MEDIA=8.5ix${height}i";
system "gmt set MAP_FRAME_TYPE=plain";
#degrees with negative longitudes
system "gmt set FORMAT_GEO_MAP=-D.x";
#Controls font size for axis numbering and titles, respectively
system "gmt set FONT_ANNOT_PRIMARY=10p";
system "gmt set FONT_LABEL=10p";
#Controls plot title and offset
system "gmt set FONT_TITLE=14p";
system "gmt set MAP_TITLE_OFFSET=0.16i";
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
#------- PLOT THE HORIZONTAL SLICE WITH GMT ----------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
if($printStats==1){
	print "-----------------------------------------------------------------------------\n";
	print "Plotting Data with GMT\n";
	print "-----------------------------------------------------------------------------\n";
	printf ("Plot will be %s x %.1fi\n",$width,$height);
}
#plot the coastline and color the water
#no colored data
if($plotVels==0){
	system "gmt pscoast -X0.75i -Y1.35i $R -JM$width -W0.5p -S$waterBlue -Gwhite -Df -P -K > $plotFile";
}
#plot the colored data
elsif($plotVels==1){
	if($printStats==1){print "Plotting interpolated data with grdimage\n"}
	system "gmt pscoast -X0.75i -Y1.30i $R -JM$width -N1/1.0p -N2/0.5p -Df -Gwhite -S$waterBlue -A20 -P -K > $plotFile";
	system "gmt grdimage $grdFile -R -JM -C$cptFile -Q -O -K >> $plotFile";
	system "gmt pscoast -R -JM -N1/1.0p -N2/0.5p -W0.5p -Df -A20 -O -K >> $plotFile";
}
#plot with DEM shading (only looks good at high resolution)
elsif($plotVels==2){
	if($printStats==1){print "Plotting interpolated data with grdimage\n"}
	system "gmt grdimage $grdFile -X0.5i -Y1.45i $R -JM$width -C$cptFile -Iz.int -P -K > $plotFile";
	system "gmt pscoast -R -JM -N1/1.0p -N2/0.5p -W1.0p -Df -O -K >> $plotFile";
}

#plot the source data points, if specified
if($plotPts==1){
	if($printStats==1){print "Plotting source data points as black circles\n"}
	system "gmt psxy $gmtFile -R -JM -Sc2.0p -Gblack -O -K >> $plotFile"
}

#plot fault traces, if specified
if($plotFaults==1){
	if($labelFaults==1){
		if($printStats==1){print "Plotting and labeling fault traces\n"}
		#plot all non-blind faults with solid lines, blind with dashed lines
		system "gmt psxy $faultFile -R -JM -Sqn1:+Lh+n0i/0.1i+kblack+s8 -W$faultLine -m -O -K >> $plotFile";
		system "gmt psxy $blindFaultFile - -JM -Sqn1:+Lh+n0i/0.1i+kblack+s8 -W$blindFaultLine -m -O -K >> $plotFile";
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
	system "gmt psxy $cityFile -R -JM -Sc5p -Gwhite -W0.5p -O -K >> $plotFile";
	system "gmt pstext $cityFile -R -JM -Dj3p -F+a0+jBL+f8p,Helvetica-Bold,white,-=1p,white -O -K >> $plotFile";
	system "gmt pstext $cityFile -R -JM -Dj3p -F+a0+jBL+f8p,Helvetica-Bold           -O -K >> $plotFile";
}

#plot a colorbar below the plot
system "gmt psscale -R -JM -C$cptFile -B$cAxis+l\"$zTitle\" -Dx0/-0.65i+w7.5i/0.25i+jBL+h -O -K >> $plotFile";

#plot the second line of the title
system "gmt pstext -R -JM -F+a0+f14p,Helvetica+jBC -D0i/0.14i -N -O -K <<END>> $plotFile
$midX $maxY Bounding Box Corners: ($begLon, $begLat) ($endLon, $endLat)
END";

#plot the basemap axes. Use this to plot a map scale -Lx0.35i/0.35i+jBL+w200k+u+f
system "gmt psbasemap -R -JM -Bx$xAxis -By$yAxis -BWeSn+t\"Model: $model | Depth: $depth (km) | Query Points=$numPts\" $mapScale -O >> $plotFile";


#---------------------------------------------------------------------------------------------------------------------------#
#------- WRITE A NEW EPS FILE JUST TO CHANGE THE TITLE ---------------------------------------------------------------------#
#---------------------------------------------------------------------------------------------------------------------------#
open(TMP,$plotFile);
open(NEW,">$epsFile");
while(<TMP>){
	chomp;
	#check and replace header lines. Otherwise print line as-is
	if($_=~ "\%\%Title:"){print NEW "\%\%Title: SCEC CVM Explorer | Model: $model | Plot: $epsTitle | Bounding Box Corners: ($begLon, $begLat) to ($endLon, $endLat)\n"}
	elsif($_=~ "\%\%Creator:"){print NEW "\%\%Creator: SCEC CVM Explorer\n"}
	else {print NEW "$_\n";}
}#end while (reading $plotFile)
close(TMP);
close(NEW);


#---------------------------------------------------------------------------------------------------------------------------#
#------- VIEW THE MAP, CONVERT TO PDF/PNG AND PRINT TOTAL CPU TIME ---------------------------------------------------------#
#---------------------------------------------------------------------------------------------------------------------------#
#open the eps file with a user-specified program
if   ($openEPS==1){system "gv $epsFile -geometry +0+0 -scale=2.49 &"}
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
system "rm -r $gmtDir $gmtFile $cptFile $grdFile $plotFile";
if($openEPS==0){system "rm $epsFile"}

#print the time spent on running this script using the difference in time from the beginning to end of this script.
$endTime=time();
$totTime=$endTime-$beginTime;
#print in seconds/mins/hours depending on how much time has passed
if($printStats==1){
	print "-----------------------------------------------------------------------------\n";
	if($totTime>=3600) {printf("Script took %.2f hours\n",$totTime/3600)}
	elsif($totTime>=60){printf("Script took %.2f minutes\n",$totTime/60)}
	else               {printf("Script took %.2f seconds\n",$totTime)}
	#print a final message
	print "Finished!\n\n";
}

#print a json string to tell the CVM Explorer the status of each plot parameter
if($printStats==0){
	print "{\"type\": \"horizontal\", \"file\": \"$pdfFile\", \"faults\": $plotFaults, \"cities\": $plotCities, \"points\": $plotPts, \"cMap\": $cMap, \"forceRange\": $forceRange, \"range\": { \"min\": $zMin, \"max\": $zMax } }\n";
}
exit;
