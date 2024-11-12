#!/usr/bin/perl
#plotCVM.pl
#Written 2024-08-29 by Scott T. Marshall
#-----------------------------------------------------------------------------------------------------------------------------#
# 
# This script processes a csv file with data in columns (lon,lat,value) and plots the results on a map using GMT.
# This is used by the CVM explorer to plot CVM data.
#  
#   Usage: ./plotCVM-horzSlice.pl
# 
#-----------------------------------------------------------------------------------------------------------------------------#
#Use warnings, but skip warnings about uninitialized variables, since this happens every time you read in a blank line.
#use warnings; no warnings "uninitialized";
#get begin time and local time to print to file headers
$beginTime=time();
#loads Tools.pm included in this directory
use FindBin;
use lib $FindBin::Bin;
use Tools qw(getLonTick getLatTick getCBarTick);
#-----------------------------------------------------------------------------------------------------------------------------#
#------- USER-SPECIFIED PARAMETERS -------------------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
#Should I open the .eps file when finished? 0=no, 1=gv, 2=evince, 3=illustrator
$openEPS=2;

#grab the csv filename from the command line args
$csvFile=$ARGV[0];
#make the plot file the same name as the csv file, but ending in .eps.
$plotFile=substr($csvFile,0,-4).".eps";
$meanFile=substr($csvFile,0,-4).".mean";

#How should I plot vels on the map? 
# 0=don't plot, 1=colored vels, 2=colored vels shaded by DEM
$plotVels=1;
#What color palette should I use?
$cpt="seis";
#What velocity increment (in km/s) should I round the color range to
#Note: The vlocity increment is now figured out later based on the vel range
#$inc=0.1;
#What tension value should I use with surface?
$t=0.1;
#Should I force the color range? 1=yes 0=no
$forceRange=0;
#What T value should I use for the color range? (only used if $forceRange==1).
$T="-T0.16/0.84/0.002";

#What is the path to the DEM intensity file? Only used if shading by DEM
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

#Should I plot the source data points? 1=yes 0=no
$plotPts=0;

#Should I make pdf and png versions of the EQ plots?
$makePDF=1;
$makePNG=1;

#check for correct usage and make sure the csv file exists
if(@ARGV!=1)       {print "\n    Usage: ./plotCVM-horzSlice.pl file.csv\n\n"; exit}
unless(-e $csvFile){print "\n    Error: $csvFile not found\n\n"; exit}


#-----------------------------------------------------------------------------------------------------------------------------#
#------- READ CSV HEADER AND GRAB USEFUL INFO --------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
print "-----------------------------------------------------------------------------\n";
print "Reading $csvFile\n";
print "-----------------------------------------------------------------------------\n";
#open csv file for reading and read it line by line
open(CSV,$csvFile);
while(<CSV>){
	chomp;
	#if this is the last line of the header, kill the loop
	if($_=~ "# lon,lat,"){last;}
	#remove the #  so I can split by colon. Also, remove the space after the colon
	$_=~s/# //;
	$_=~s/: /:/;
	@data=split(":",$_);
	#grab useful portions of the header
	if   ($data[0] eq "Title")          {$title   =$data[1]}
	elsif($data[0] eq "CVM(abbr)")      {$model   =$data[1]}
	elsif($data[0] eq "Data_type")      {$dataType=$data[1]}
	elsif($data[0] eq "Depth(m)")       {$depth   =$data[1]}
	elsif($data[0] eq "Spacing(degree)"){$spacing =$data[1]}
}#end while

#set the colorbar title based on what parameter is in the csvFile header
if   ($dataType eq "vs")     {$zTitle="Vs (m/s)"}
elsif($dataType eq "vp")     {$zTitle="Vp (m/s)"}
elsif($dataType eq "density"){$zTitle="Density (g/cm\@+3\@+)"}
elsif($dataType eq "poisson"){$zTitle="Poisson's Ratio"}

#get the data range
$tmp=`gmt info $csvFile`;
chomp($tmp);
@tmp=split(" ",$tmp);
$numPts=$tmp[3];

#get the lon/lat range
$R=`gmt info $csvFile -I-`;
chomp($R);
#use Tools.pm to set the axis labeling and tickmarks
$xAxis=getLonTick($R);
$yAxis=getLatTick($R);
#parse out the min/max xy values
$tmp=$R;
$tmp=~s/-R//;
@tmp=split("/",$tmp);
$minX=$tmp[0]; $maxX=$tmp[1];
$minY=$tmp[2]; $maxY=$tmp[3];
$xRange=$maxX-$minX;
$yRange=$maxY-$minY;
#figure out which range is larger
if($xRange>$yRange){$maxRange=$xRange}
else               {$maxRange=$yRange}
#now set a reasonable resolution to interpolate the data given this range
if   ($maxRange<=0.0005){$round=0.00001}
elsif($maxRange<=0.001){$round=0.00002}
elsif($maxRange<=0.05){$round=0.001}
elsif($maxRange<=0.1){$round=0.002}
elsif($maxRange<=0.5){$round=0.01}
elsif($maxRange<=1.0){$round=0.02}
elsif($maxRange<=1.5){$round=0.03}
elsif($maxRange<=2.0){$round=0.04}
elsif($maxRange<=2.5){$round=0.05}
elsif($maxRange<=3.0){$round=0.06}
elsif($maxRange<=3.5){$round=0.07}
elsif($maxRange<=4.0){$round=0.08}
elsif($maxRange<=4.5){$round=0.09}
elsif($maxRange<=5.0){$round=0.10}
elsif($maxRange<=5.5){$round=0.11}
elsif($maxRange<=6.0){$round=0.12}
elsif($maxRange<=6.5){$round=0.13}
elsif($maxRange<=7.0){$round=0.14}
elsif($maxRange<=7.5){$round=0.15}
elsif($maxRange<=8.0){$round=0.16}
elsif($maxRange<=8.5){$round=0.17}
elsif($maxRange<=9.0){$round=0.18}
elsif($maxRange<=9.5){$round=0.19}
elsif($maxRange<=10.0){$round=0.20}
elsif($maxRange<=10.5){$round=0.21}
elsif($maxRange<=11.0){$round=0.22}
elsif($maxRange<=11.5){$round=0.23}
elsif($maxRange<=12.0){$round=0.24}
elsif($maxRange<=12.5){$round=0.25}
elsif($maxRange<=13.0){$round=0.26}
elsif($maxRange<=13.5){$round=0.27}
elsif($maxRange<=14.0){$round=0.28}
elsif($maxRange<=14.5){$round=0.29}
elsif($maxRange<=15.0){$round=0.30}
elsif($maxRange<=15.5){$round=0.31}
else                  {$round=0.50}
#make the interpolated resolution 10x this rounding, so it always works out to be an integer multiple of the range
$res=$round/10;

#round of the range to avoid surface grid increment errors
$Rext=`gmt info $csvFile -I$round`;
chomp($Rext);
#round of the range even farther, just for testing
#$Rext2=`gmt info $csvFile -I0.5`;
#chomp($Rext2);

#print useful metadata to stdout
print "Title             : $title\n";
print "Model             : $model\n";
print "Data Type         : $dataType\n";
print "Depth (m)         : $depth\n";
print "Spacing (deg)     : $spacing\n";
print "Num Points        : $numPts\n";
print "Data Range        : $R\n";
print "XY-Range          : $xRange/$yRange\n";
print "Range Round       : $round\n";
print "Extended Range    : $Rext\n";
print "Interpolation Res : $res\n";
print "-----------------------------------------------------------------------------\n";


#-----------------------------------------------------------------------------------------------------------------------------#
#------- INTERPOLATE THE VELS AND MAKE A COLORMAP ----------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
if($plotVels>0){
	print "Interpolating data using GMT's surface\n";
	#system "gmt surface $meanFile $R -Gz.grd -I$res -T$t -M$spacing -rg";
	system "gmt surface $csvFile $Rext -Gz.grd -I$res -T$t -M7c -rg";
}

#resample the dem intensity file, if necessary
if($plotVels==2){
	print "Resampling DEM to $res to match vel data\n";
	system "gmt grdsample $int $R -Gz.int -I$res -rg";
}

if($forceRange==0){
	$T=`gmt grdinfo z.grd -T/2`;
	chomp($T);
	#print "Z Range: $T\n";
	#get the axis labeling and tickmark string using Tools.pm
	$cAxis=getCBarTick($T);
	#print "$cAxis\n";
	#get the min/max vels
	$tmp=$T;
	$tmp=~s/-T//;
	@z=split("/",$tmp);
	$zRange=$z[1]-$z[0];
	print "  MinZ=$z[0];  MaxZ=$z[1]\n";
}

print "Making color palette file\n";
system "gmt makecpt -C$cpt $T -D --COLOR_NAN=white > z.cpt";


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
$height=$tmp[1]/2.54+1.70;

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
system "gmt set MAP_TITLE_OFFSET=-0.08i";
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
print "-----------------------------------------------------------------------------\n";
print "Plotting Data with GMT\n";
print "-----------------------------------------------------------------------------\n";
printf ("Plot will be %s x %.1fi\n",$width,$height);

#plot the coastline and color the water
#no colored data
if($plotVels==0){
	system "gmt pscoast -X0.75i -Y1.35i $R -JM$width -W0.5p -S$waterBlue -Gwhite -Df -P -K > $plotFile";
}
#plot the colored data
elsif($plotVels==1){
	print "Plotting z.grd with grdimage\n";
	system "gmt pscoast -X0.75i -Y1.30i $R -JM$width -N1/1.0p -N2/0.5p -Df -Gwhite -S$waterBlue -A20 -P -K > $plotFile";
	system "gmt grdimage z.grd -R -JM -Cz.cpt -Q -O -K >> $plotFile";
	system "gmt pscoast -R -JM -N1/1.0p -N2/0.5p -W0.5p -Df -A20 -O -K >> $plotFile";
}
#plot with DEM shading (only looks good at high resolution)
elsif($plotVels==2){
	print "Plotting z.grd with grdimage\n";
	system "gmt grdimage z.grd -X0.5i -Y1.45i $R -JM$width -Cz.cpt -Iz.int -P -K > $plotFile";
	system "gmt pscoast -R -JM -N1/1.0p -N2/0.5p -W0.5p -Df -O -K >> $plotFile";
}

#plot the source data points, if specified
if($plotPts==1){system "gmt psxy $csvFile -R -JM -Sc2.0p -Gblack -O -K >> $plotFile"}

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

#plot a colorbar below the plot
system "gmt psscale -R -JM -Cz.cpt -B$cAxis+l\"$zTitle\" -Dx0/-0.65i+w7.5i/0.25i+jBL+h -O -K >> $plotFile";

#plot the basemap axes. Use this to plot a map scale -Lx0.35i/0.35i+jBL+w200k+u+f
system "gmt psbasemap -R -JM -Bx$xAxis -By$yAxis -BWeSn+t\"Model: $model | Depth: $depth (m) | n=$numPts\" -O >> $plotFile";


#---------------------------------------------------------------------------------------------------------------------------#
#------- VIEW THE MAP, CONVERT TO PDF AND PRINT TOTAL CPU TIME -------------------------------------------------------------#
#---------------------------------------------------------------------------------------------------------------------------#
#open the eps file with a user-specified program
if   ($openEPS==1){system "gv $plotFile -geometry +0+0 -scale=2.49 &"}
elsif($openEPS==2){system "evince $plotFile &"} 
elsif($openEPS==3){system "illustrator $plotFile &"}

#remove unneeded files
system "rm z.grd z.cpt";

#convert to pdf/png
if($makePDF==1){
	print "Converting to pdf\n";
	system "gmt psconvert $plotFile -Tf";
}#end if
if($makePNG==1){
	print "Converting to png\n";
	system "gmt psconvert $plotFile -TG -E400";
}#end if


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