#!/usr/bin/perl
#plotCVM-1Dvert.pl
#Written 2024-11-13 by Scott T. Marshall
#-----------------------------------------------------------------------------------------------------------------------------#
# 
# This script processes a csv file containing a 1D vertical profile of data at a range of depths
# csv data must be in columns (lon,lat,depth,value)
# Data is plotted using GMT and plots:
#   1) A map showing the 1D vertical profile location
#   2) The 1D vertical profile
#
# Note: The csv file must be in another directory and the path to the file must be included at the command line
# as the path is used to set other filenames and to make a tmp directory for GMT.
#  
#   Usage: ./plotCVM-1Dvert.pl path/to/file.csv plotParam plotFaults plotCities pad forceRange zMin zMax
#     plotParam must equal 1-4  1=plot Vp; 2=plot Vs; 3=plot density; 4=plot all;
#     Note: zMin and zMax only need to be specified if forceRange=1.
# 
#-----------------------------------------------------------------------------------------------------------------------------#
#Use warnings, but skip warnings about uninitialized variables, since this happens every time you read in a blank line.
#use warnings; no warnings "uninitialized";
#get begin time and local time to print to file headers
$beginTime=time();
#loads Tools.pm included in this directory
use FindBin;
use lib $FindBin::Bin;
#for moho
use lib "/app/web/perl";
use Tools qw(getLonTick getLatTick getXtickGrid getYtickGrid getMapScale);
#for parsing a filename from a path
use File::Basename;
#-----------------------------------------------------------------------------------------------------------------------------#
#------- USER-SPECIFIED PARAMETERS -------------------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
#Should I open the .eps file when finished? 0=no, 1=gv, 2=evince, 3=illustrator
$openEPS=0;

#check for correct usage and make sure the csv file exists
if   (@ARGV==8){($csvFile,$plotPar,$plotFaults,$plotCities,$pad,$forceRange,$zMin,$zMax)=@ARGV}
elsif(@ARGV==6){
	($csvFile,$plotPar,$plotFaults,$plotCities,$pad,$forceRange)=@ARGV;
	if($forceRange!=0){print "\n  Error! If forceRange=1, zMin and zMax must be specified\n\n"; exit}
}
#print usage for incorrect inputs
else {
	print "\n  Usage: ./plotCVM-1Dvert.pl path/to/file.csv plotParam plotFaults plotCities pad forceRange zMin zMax\n";
	print "    plotParam must equal 1-4  1=plot Vp; 2=plot Vs; 3=plot density; 4=plot all\n";
	print "    Note: zMin and zMax only need to be specified if forceRange=1\n\n";
	exit;
}
unless(-e $csvFile){print "\n  Error: $csvFile not found\n\n"; exit}

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
$gmtFile="$dir/$file.gmt";
$plotFile="$dir/$file.eps";

#tell GMT to write config/history files to $dir
$ENV{GMT_TMPDIR}="$gmtDir";

#What is the path to the DEM and intensity file? Only used if plotting the DEM on the map
$dem="/home/marshallst/DEM/CA/CA-1arc.grd";
$int="/home/marshallst/DEM/CA/CA-1arc.int";

#should I plot the fault traces? 1=yes 0=no
#$plotFaults=0;
#what is the path to the file with the fault trace data?
$faultFile     ="/app/web/perl/CFM7.0_traces.lonLat";
$blindFaultFile="/app/web/perl/CFM7.0_blind.lonLat";
#what line width should I use for the faults?
$faultLine=     "0.5p,black";
$blindFaultLine="0.5p,black,2.0p_0.75p";
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
print "-----------------------------------------------------------------------------\n";
print "Reading $csvFile\n";
print "-----------------------------------------------------------------------------\n";
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
		if   ($data[0] eq "Title")          {$title       =$data[1]}
		elsif($data[0] eq "CVM(abbr)")      {$model       =$data[1]}
		elsif($data[0] eq "Lat")            {$lat         =$data[1]}
		elsif($data[0] eq "Lon")            {$lon         =$data[1]}
		elsif($data[0] eq "Start_depth(m)") {$startDepth  =$data[1]/1000}
		elsif($data[0] eq "End_depth(m)")   {$endDepth    =$data[1]/1000}
		elsif($data[0] eq "Vert_spacing(m)"){$vertSpacing =$data[1]/1000}
		#elsif($data[0] eq "Total_pts")      {$numPts      =$data[1]}
		elsif($data[0] eq "Comment")        {$comment     =$data[1]}
	}#end if
	#deal with data lines
	else {
		@data=split(",",$_);
		if(@data!=4){
			print "Error: Four columns of data should have been found. I found the line below\n";
			print "$_\n";
			exit;
		}#end if
		#write a simple header if this is the first data line
		if($count==0){
			print GMT "#depth(km),Vp(km/s),Vs(km/s),Density(g/cm^3)\n";
		}#end if
		
		#convert the parameters to more useful units
		$data[0]/=1000; #depth m-->km
		$data[1]/=1000; #Vp m/s-->km/s
		$data[2]/=1000; #Vs m/s-->km/s
		$data[3]/=1000; #density kg/m^3-->g/cm^3
				
		#print the line to the new GMT file (still a csv file, format-wise)
		print GMT "$data[0],$data[1],$data[2],$data[3]\n";
		
		#increment the line counter
		$count++;
	}#end else
}#end while
close(CSV);
close(GMT);

#get the XY range of the data file...this depends on what is requested to be plotted 
#if plotting Vp, Vs, Density, or all
if   ($plotPar==1){$Rxy=`gmt info $gmtFile -I- -i1,0`; chomp($Rxy)}
elsif($plotPar==2){$Rxy=`gmt info $gmtFile -I- -i2,0`; chomp($Rxy)}
elsif($plotPar==3){$Rxy=`gmt info $gmtFile -I- -i3,0`; chomp($Rxy)}
elsif($plotPar==4){
	#get the ranges of each column and split them into arrays
	$R1=`gmt info $gmtFile -I- -i1,0`;
	$R2=`gmt info $gmtFile -I- -i2,0`;
	$R3=`gmt info $gmtFile -I- -i3,0`;
	chomp($R1,$R2,$R3);
	$R1=~ s/-R//;
	$R2=~ s/-R//;
	$R3=~ s/-R//;
	@R1=split("/",$R1);
	@R2=split("/",$R2);
	@R3=split("/",$R3);
	#put all min/max values into arrays and sort them to get the min/max
	@list=sort{$a<=>$b}($R1[0],$R1[1],$R2[0],$R2[1],$R3[0],$R3[1]);
	#make a new range string that covers all three columns of data
	$Rxy="-R$list[0]/$list[-1]/$R1[2]/$R1[3]";
}
else {print "\n\n  Error: plotPar must be 1-4. You entered $plotPar\n\n"; exit}
#print $Rxy before the padding, just for testing
#print "$Rxy\n";
#because the curves are often vertical, they can plot at the right or left axes. This can be fixed by adding some padding to xMin/xMax
@R=split("/",$Rxy);
$R[0]=~s/-R//;
#add some padding based on the X-Range
$xRange=$R[1]-$R[0];
#no need to pad xMin if it is zero. Negative values are not possible.
if($R[0]!=0){$R[0]-=$xRange*0.03} #This is not needed for Vp Vs, but is useful for Density, so I will leave it in.
$R[1]+=$xRange*0.03;
$Rxy="-R$R[0]/$R[1]/$R[2]/$R[3]";
#print $Rxy after padding, just for testing
#print "$Rxy\n";
#if specified, apply the user inputted zMin zMax (which are actually xvalues on the plot)
if($forceRange==1){$Rxy="-R$zMin/$zMax/$R[2]/$R[3]"}

#get the XY axis labeling string using Tools.pm
$xAxis=getXtickGrid($Rxy);
$yAxis=getYtickGrid($Rxy);
print "$xAxis | $yAxis\n";

#add on the pad to get a lon/lat range for the location map. by Default, I add 0.1 to pad to the location. Otherwise we would not have a map!
$minLon=$lon-0.1-$pad; $maxLon=$lon+0.1+$pad;
$minLat=$lat-0.1-$pad; $maxLat=$lat+0.1+$pad;
$R="-R$minLon/$maxLon/$minLat/$maxLat";
#get the map axis labeling string using Tools.pm
$lonAxis=getLonTick($R);
$latAxis=getLatTick($R);
$mapScale=getMapScale($R);

#print useful metadata to stdout
print "Title               : $title\n";
print "Model               : $model\n";
#print "Data Type           : $dataType\n";
print "Lon/Lat Location    : $lon/$lat\n";
print "StartDepth (km)     : $startDepth\n";
print "EndDepth (km)       : $endDepth\n";
print "VertSpacing (km)    : $vertSpacing\n";
#print "Num Points          : $numPts\n";
print "Map Range           : $R\n";
print "1D Profile Range    : $Rxy\n";


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
$plotHeight=$tmp[1]/2.54;
$legendHeight=$plotHeight-0.05;

#set paper size
system "gmt set PS_MEDIA=13.5ix${height}i";
system "gmt set MAP_FRAME_TYPE=plain";
#degrees with negative longitudes
system "gmt set FORMAT_GEO_MAP=-D.x";
#Controls font size for axis numbering and titles, respectively
system "gmt set FONT_ANNOT_PRIMARY=10p";
system "gmt set FONT_LABEL=10p";
#Controls plot title and offset
system "gmt set FONT_TITLE=14p";
system "gmt set MAP_TITLE_OFFSET=0.0i";
#Make the grids dashed and gray
system "gmt set MAP_GRID_PEN=0.5p,gray50,0.5_2.5p";
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

#plot fault traces, if specified
if($plotFaults==1){
	if($labelFaults==1){
		print "Plotting and labeling fault traces\n";
		#plot all non-blind faults with solid lines, blind with dashed lines
		system "gmt psxy $faultFile -R -JM -Sqn1:+Lh+n0i/0.1i+kblack+s8 -W$faultLine -m -O -K >> $plotFile";
		system "gmt psxy $blindFaultFile -R -JM -Sqn1:+Lh+n0i/0.1i+kblack+s8 -W$blindFaultLine -m -O -K >> $plotFile";
	}#end if
	else {
		print "Plotting fault traces\n";
		#plot all non-blind faults with solid lines, blind with dashed lines
		system "gmt psxy $faultFile -R -JM -W$faultLine -m -O -K >> $plotFile";
		system "gmt psxy $blindFaultFile -R -JM -W$blindFaultLine -m -O -K >> $plotFile";
	}#end else
}#end if

#plot cities, if specified
if($plotCities==1){
	print "Plotting city locations\n";
	system "gmt psxy $cityFile -R -JM -Sc5p -Ggold -W0.5p -O -K >> $plotFile";
	system "gmt pstext $cityFile -R -JM -Dj3p -F+a0+jBL+f8p,Helvetica-Bold,white,-=1p,white -O -K >> $plotFile";
	system "gmt pstext $cityFile -R -JM -Dj3p -F+a0+jBL+f8p,Helvetica-Bold           -O -K >> $plotFile";
}

#plot the source data points
system "gmt psxy -R -JM -Sa15p -W0.5p -Ggold -O -K <<-END>> $plotFile
$lon $lat
END";
#label the endpoints
#system "gmt pstext -R -JM -D0p/17p -F+a0+jCM+f14p,Helvetica -O -K <<-END>> $plotFile
#$lon $lat 1D Profile Location
#END";

#plot the basemap axes. For a map scale, add -Lx0.3i/0.3i+jBL+w50k+c+f+u 
system "gmt psbasemap -R -JM -Bx$lonAxis -By$latAxis -BWeSn+t\"Model: $model | 1D Vertical Profile Location\" $mapScale -O -K >> $plotFile";


#-----------------------------------------------------------------------------------------------------------------------------#
#------- PLOT THE VERTICAL CROSS SECTION DATA WITH GMT -----------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------------------------------------------#
#plot the 1D profile data
#plot Vp
if($plotPar==1){
	system "gmt psbasemap -X8.5i $Rxy -JX4.0i/-${plotHeight}i -Gwhite -Bx$xAxis+l\"Vp (km/s)\" -By$yAxis+l\"Depth (km)\" -BWeSn+t\"Model: $model\" -O -K --MAP_TITLE_OFFSET=0.233i >> $plotFile";
	system "gmt psxy $gmtFile -R -JX -W1.5p,$blue -i1,0 -O >> $plotFile";
}
#plot Vs
elsif($plotPar==2){
	system "gmt psbasemap -X8.5i $Rxy -JX4.0i/-${plotHeight}i -Gwhite -Bx$xAxis+l\"Vs (km/s)\" -By$yAxis+l\"Depth (km)\" -BWeSn+t\"Model: $model\" -O -K --MAP_TITLE_OFFSET=0.233i >> $plotFile";
	system "gmt psxy $gmtFile -R -JX -W1.5p,$red -i2,0 -O >> $plotFile";
}
#plot density
elsif($plotPar==3){
	system "gmt psbasemap -X8.5i $Rxy -JX4.0i/-${plotHeight}i -Gwhite -Bx$xAxis+l\"Density (g/cm\@+3\@+)\" -By$yAxis+l\"Depth (km)\" -BWeSn+t\"Model: $model\" -O -K --MAP_TITLE_OFFSET=0.233i >> $plotFile";
	system "gmt psxy $gmtFile -R -JX -W1.5p,$green -i3,0 -O >> $plotFile";
}
#plot All
if($plotPar==4){
	system "gmt psbasemap -X8.5i $Rxy -JX4.0i/-${plotHeight}i -Gwhite -Bx$xAxis+l\"Parameter Value (see legend for units)\" -By$yAxis+l\"Depth (km)\" -BWeSn+t\"Model: $model\" -O -K --MAP_TITLE_OFFSET=0.233i >> $plotFile";
	system "gmt psxy $gmtFile -R -JX -W1.5p,$blue -i1,0 -O -K >> $plotFile";
	system "gmt psxy $gmtFile -R -JX -W1.5p,$red -i2,0 -O -K >> $plotFile";
	system "gmt psxy $gmtFile -R -JX -W1.5p,$green -i3,0 -O -K >> $plotFile";
	
	#plot a legend with the curves labeled
	system "gmt pslegend -R -JX -Dx3.95i/${legendHeight}i+w1.3i/0.75i+jTR -F+gwhite+p0.5p,black+r4p -O <<-END>> $plotFile
	G 0.05i
	S 7p - 10p - 1.5p,$blue  17p Vp (km/s)
	G 0.05i
	S 7p - 10p - 1.5p,$red   17p Vs (km/s)
	G 0.05i
	S 7p - 10p - 1.5p,$green 17p Density (g/cm\@+3\@+)
	END";
}


#---------------------------------------------------------------------------------------------------------------------------#
#------- VIEW THE MAP, CONVERT TO PDF AND PRINT TOTAL CPU TIME -------------------------------------------------------------#
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
system "rm -r $gmtDir";


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



