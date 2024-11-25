# Tools.pm
# Written 2015-10-11 by Scott T. Marshall
# Updated 2024-11-24 Added getMapScale for automatic map scale generation in GMT6.
#------------------------------------------------------------------------------------------------------------------------------#
# This is a perl module for doing some generically-useful data analysis stuff.
# These subroutines can be called by other perl scripts.
#------------------------------------------------------------------------------------------------------------------------------#
package Tools;
#Export each subroutine for use in other perl scripts
require Exporter;
@ISA = qw(Exporter);
@EXPORT_OK = qw(getDecYr getGMTdecYr getXtick getYtick getXtickGrid getYtickGrid getLonTick getLatTick getCBarTick getMapScale);
#make perl be picky about local variables and other stuff.
use strict;

#------------------------------------------------------------------------------------------------------------------------------#
#------- SUBROUTINE FOR CONVERTING YYYYMMDD TO DECIMAL YEAR -------------------------------------------------------------------#
#------------------------------------------------------------------------------------------------------------------------------#
# This subroutine converts a yyyymmdd string to decimal years. 
# The results were verified by testing the same values using SOPAC's decimal year converter.
# http://sopac.ucsd.edu/convertDate.shtml
#------------------------------------------------------------------------------------------------------------------------------#
sub getDecYr {
	#define all local variables used here.
	my ($num,$yr,$mo,$dy,$isLeapYr,$jan,$feb,$mar,$apr,$may,$jun,$jul,$aug,$sep,$oct,$nov,$dec,$totDays,@numDays,@cumDays,@decYr);
	
	#$num=@_;
	#print "Converting $num Dates\n";
	
	for(my $i=0; $i<@_; $i++){
		#make sure the date string is in the correct format
		if(length($_[$i])!=8){
			printf("\nError in TimeSeries.pm --> getGMTdecYr\n");
			printf("Date %d is in incorrect format\n",$i+1);
			printf("%s should be in yyyymmdd format\n",$_[$i]);
			exit;
		}#end unless
		
		#parse the data into yr month day
		$yr=substr($_[$i],0,4);
		$mo=substr($_[$i],4,2);
		$dy=substr($_[$i],6,2);
		
		#print "$yr/$mo/$dy\n";
		
		#make a variable to see if it is a leap year. 1=yes 0=no
		$isLeapYr=0;
		
		#test to see if the year is divisible by 4
		if(($yr % 4)==0){
			#make this a leap year for now.
			$isLeapYr=1;
			
			#now test to see if the year is divisible by 100
			if(($yr % 100)==0){
				#make this not a leap year for now.
				$isLeapYr=0;
				
				#Now test to see if this year is divisible by 400
				if(($yr % 400)==0){
					$isLeapYr=1;
				}#end if
			}#end if
		}#end if
		
		#if($isLeapYr==1){
			#print "$yr: $isLeapYr\n";
		#}
				
		#set the lengths of months
		$jan=31; $mar=31; $apr=30; $may=31; $jun=30; $jul=31; $aug=31; $sep=30; $oct=31; $nov=30; $dec=31;
		if($isLeapYr==1){
			$feb=29;
			$totDays=366;
		}
		else {
			$feb=28;
			$totDays=365;
		}
		
		#set the days in each month to an array. Leave the first entry zero, so the array number will correspond to the month number.
		@numDays=(0,$jan,$feb,$mar,$apr,$may,$jun,$jul,$aug,$sep,$oct,$nov,$dec);
		
		#test to make sure an invalid day is not given
		if($mo>12){
			print "\nError: $_[$i] has an invalid month\n";
			die "Max month is 12\n\n";
		}#end if
		
		#test to make sure an invalid day is not given
		elsif($dy>$numDays[$mo]){
			print "\nError: $_[$i] has an invalid day\n";
			die "Max day for month $mo is $numDays[$mo]\n";
		}#end if
				
		#make an array with the cumulative days before the current month.
		#so for feb (2) the cumulative days should be 31.
		$cumDays[1]=0;
		$cumDays[2]=$jan;
		$cumDays[3]=$jan+$feb;
		$cumDays[4]=$jan+$feb+$mar;
		$cumDays[5]=$jan+$feb+$mar+$apr;
		$cumDays[6]=$jan+$feb+$mar+$apr+$may;
		$cumDays[7]=$jan+$feb+$mar+$apr+$may+$jun;
		$cumDays[8]=$jan+$feb+$mar+$apr+$may+$jun+$jul;
		$cumDays[9]=$jan+$feb+$mar+$apr+$may+$jun+$jul+$aug;
		$cumDays[10]=$jan+$feb+$mar+$apr+$may+$jun+$jul+$aug+$sep;
		$cumDays[11]=$jan+$feb+$mar+$apr+$may+$jun+$jul+$aug+$sep+$oct;
		$cumDays[12]=$jan+$feb+$mar+$apr+$may+$jun+$jul+$aug+$sep+$oct+$nov;
		
		#finally! Calculate the decimal year subtract off 0.5 days so it is effectively noon on the given date.
		$decYr[$i]=$yr+(($cumDays[$mo]+$dy-0.5)/$totDays);
		
	}#end for $i
	
	return @decYr;
	
}#end decYr


#------------------------------------------------------------------------------------------------------------------------------#
#------- SUBROUTINE FOR CONVERTING YYYYMMDDTHH:MM TO DECIMAL YEAR -------------------------------------------------------------------#
#------------------------------------------------------------------------------------------------------------------------------#
# Converts GMT-style date/time strings into decimal years.
# Date strings must be formatted exactly yyyymmddThh:mm and in 24hr time format.
# The results were verified by testing the same values using SOPAC's decimal year converter using a 12 noon time.
# http://sopac.ucsd.edu/convertDate.shtml
#------------------------------------------------------------------------------------------------------------------------------#
sub getGMTdecYr {
	#define all local variables used here.
	my ($num,$yr,$mo,$dy,$hr,$min,$isLeapYr,$jan,$feb,$mar,$apr,$may,$jun,$jul,$aug,$sep,$oct,$nov,$dec,$totDays,@numDays,@cumDays,@decYr);
	
	#$num=@_;
	#print "Converting $num Dates\n";
	
	for(my $i=0; $i<@_; $i++){
		#make sure the date string is in the correct format
		if(length($_[$i])!=14){
			printf("\nError in TimeSeries.pm --> getGMTdecYr\n");
			printf("Date/Time %d is in incorrect format\n",$i+1);
			printf("%s should be in yyyymmddThh:mm format\n",$_[$i]);
			exit;
		}#end unless
		
		#parse the data into yr month day
		$yr=substr($_[$i],0,4);
		$mo=substr($_[$i],4,2);
		$dy=substr($_[$i],6,2);
		$hr=substr($_[$i],9,2);
		$min=substr($_[$i],12,2);
		
		#print "$yr/$mo/$dy $hr:$min\n";
		
		#make a variable to see if it is a leap year. 1=yes 0=no
		$isLeapYr=0;
		
		#test to see if the year is divisible by 4
		if(($yr % 4)==0){
			#make this a leap year for now.
			$isLeapYr=1;
			
			#now test to see if the year is divisible by 100
			if(($yr % 100)==0){
				#make this not a leap year for now.
				$isLeapYr=0;
				
				#Now test to see if this year is divisible by 400
				if(($yr % 400)==0){
					$isLeapYr=1;
				}#end if
			}#end if
		}#end if
		
		#if($isLeapYr==1){
			#print "$yr: $isLeapYr\n";
		#}
		
		
		#set the lengths of months
		$jan=31; $mar=31; $apr=30; $may=31; $jun=30; $jul=31; $aug=31; $sep=30; $oct=31; $nov=30; $dec=31;
		if($isLeapYr==1){
			$feb=29;
			$totDays=366;
		}
		else {
			$feb=28;
			$totDays=365;
		}
		
		#set the days in each month to an array. Leave the first entry zero, so the array number will correspond to the month number.
		@numDays=(0,$jan,$feb,$mar,$apr,$may,$jun,$jul,$aug,$sep,$oct,$nov,$dec);
		
		#test to make sure an invalid day is not given
		if($mo>12){
			print "\nError: $_[$i] has an invalid month\n";
			die "Max month is 12\n\n";
		}#end if
		
		#test to make sure an invalid day is not given
		elsif($dy>$numDays[$mo]){
			print "\nError: $_[$i] has an invalid day\n";
			die "Max day for month $mo is $numDays[$mo]\n";
		}#end if
				
		#make an array with the cumulative days before the current month.
		#so for feb (2) the cumulative days should be 31.
		$cumDays[1]=0;
		$cumDays[2]=$jan;
		$cumDays[3]=$jan+$feb;
		$cumDays[4]=$jan+$feb+$mar;
		$cumDays[5]=$jan+$feb+$mar+$apr;
		$cumDays[6]=$jan+$feb+$mar+$apr+$may;
		$cumDays[7]=$jan+$feb+$mar+$apr+$may+$jun;
		$cumDays[8]=$jan+$feb+$mar+$apr+$may+$jun+$jul;
		$cumDays[9]=$jan+$feb+$mar+$apr+$may+$jun+$jul+$aug;
		$cumDays[10]=$jan+$feb+$mar+$apr+$may+$jun+$jul+$aug+$sep;
		$cumDays[11]=$jan+$feb+$mar+$apr+$may+$jun+$jul+$aug+$sep+$oct;
		$cumDays[12]=$jan+$feb+$mar+$apr+$may+$jun+$jul+$aug+$sep+$oct+$nov;
		
		#finally! Calculate the decimal year subtract off 1 day so it is effectively at the begining of the given date instead of the end.
		$decYr[$i]=$yr+((($cumDays[$mo]+$dy-1)+($hr/24)+($min/(60*24)))/$totDays);
		
	}#end for $i
	
	return @decYr;
	
}#end getGMTdecYr


#------------------------------------------------------------------------------------------------------------------------------#
#------- SUBROUTINE FOR SETTING AN GMT X-AXIS TICKMARK STRING WITH GRIDLINES --------------------------------------------------#
#------------------------------------------------------------------------------------------------------------------------------#
# This subroutine takes a -RminX/maxX/minY/maxY string from GMT's minmax and figures out a reasonable
# axis labeling string to use for the plot's x-axis. This does not work for data in date/time format (e.g. yyyymmddThh:mm).
#------------------------------------------------------------------------------------------------------------------------------#
sub getXtickGrid {
	#check to be sure the input string is in the correct format.
	if(substr($_[0],0,2) ne "-R"){
		print "\n\nError in getXtickGrid. User must pass a GMT-style -R string\n";
		print "Received: @_\n";
		exit;
	}#end if
	
	#split the user inputted -R value into min/max x values
	my @R=split("/",$_[0]);
	my $xMin=$R[0];
	#remove the -R
	$xMin=~s/-R//;
	my $xMax=$R[1];
	my $range=$xMax-$xMin;
	
	#define the local variable $xTick
	my $xTick="";
	
	#You may have to edit this in the future if you are plotting extreme values, but these should work for most plots.
	#set xTicks based on total x-range
	if   ($range < 0.001){$xTick="f0.00005a0.0001g0.0001"}
	elsif($range < 0.002){$xTick="f0.0001a0.0002g0.0002"}
	elsif($range < 0.005){$xTick="f0.00025a0.0005g0.0005"}
	elsif($range < 0.01){$xTick="f0.0005a0.001g0.001"}
	elsif($range < 0.02){$xTick="f0.001a0.002g0.002"}
	elsif($range < 0.05){$xTick="f0.0025a0.005g0.005"}
	elsif($range < 0.1){$xTick="f0.005a0.01g0.01"}
	elsif($range < 0.2){$xTick="f0.01a0.02g0.02"}
	elsif($range < 0.5){$xTick="f0.025a0.05g0.05"}
	elsif($range < 1){$xTick="f0.05a0.1g0.1"}
	elsif($range < 2){$xTick="f0.1a0.2g0.2"}
	elsif($range < 5){$xTick="f0.25a0.5g0.5"}
	elsif($range < 10){$xTick="f0.5a1g1"}
	elsif($range < 20){$xTick="f1a2g2"}
	elsif($range < 50){$xTick="f2.5a5g5"}
	elsif($range < 100){$xTick="f5a10g10"}
	elsif($range < 200){$xTick="f10a20g20"}
	elsif($range < 500){$xTick="f25a50g50"}
	elsif($range < 1000){$xTick="f50a100g100"}
	elsif($range < 2000){$xTick="f100a200g200"}
	elsif($range < 5000){$xTick="f250a500g500"}
	elsif($range < 10000){$xTick="f500a1000g1000"}
	elsif($range < 20000){$xTick="f1000a2000g2000"}
	elsif($range < 50000){$xTick="f2500a5000g5000"}
	elsif($range < 100000){$xTick="f5000a10000g10000"}
	elsif($range < 200000){$xTick="f10000a20000g20000"}
	elsif($range < 500000){$xTick="f25000a50000g50000"}
	elsif($range < 1000000){$xTick="f50000a100000g100000"}
	elsif($range < 2000000){$xTick="f100000a200000g200000"}
	elsif($range < 5000000){$xTick="f250000a500000g500000"}
	else{$xTick="f500000a1000000g1000000"}
	
	#print "Xmin/Ymax: $xMax/$xMin\n";
	#print "X-Range: $range\n";
	#print "Setting: $xTick\n\n";	
	
	#return the x-axis tick labeling string
	return($xTick);
	
}#end sub getxTickGrid()


#------------------------------------------------------------------------------------------------------------------------------#
#------- SUBROUTINE FOR SETTING AN GMT X-AXIS TICKMARK STRING WITH NO GRIDLINES -----------------------------------------------#
#------------------------------------------------------------------------------------------------------------------------------#
# This subroutine takes a -RminX/maxX/minY/maxY string from GMT's minmax and figures out a reasonable
# axis labeling string to use for the plot's x-axis. This does not work for data in date/time format (e.g. yyyymmddThh:mm).
#------------------------------------------------------------------------------------------------------------------------------#
sub getXtick {
	#check to be sure the input string is in the correct format.
	if(substr($_[0],0,2) ne "-R"){
		print "\n\nError in getXtick. User must pass a GMT-style -R string\n";
		print "Received: @_\n";
		exit;
	}#end if
	
	#split the user inputted -R value into min/max x values
	my @R=split("/",$_[0]);
	my $xMin=$R[0];
	#remove the -R
	$xMin=~s/-R//;
	my $xMax=$R[1];
	my $range=$xMax-$xMin;
	
	#define the local variable $xTick
	my $xTick="";
	
	#You may have to edit this in the future if you are plotting extreme values, but these should work for most plots.
	#set xTicks based on total x-range
	if   ($range < 0.001){$xTick="f0.00005a0.0001"}
	elsif($range < 0.002){$xTick="f0.0001a0.0002"}
	elsif($range < 0.005){$xTick="f0.00025a0.0005"}
	elsif($range < 0.01){$xTick="f0.0005a0.001"}
	elsif($range < 0.02){$xTick="f0.001a0.002"}
	elsif($range < 0.05){$xTick="f0.0025a0.005"}
	elsif($range < 0.1){$xTick="f0.005a0.01"}
	elsif($range < 0.2){$xTick="f0.01a0.02"}
	elsif($range < 0.5){$xTick="f0.025a0.05"}
	elsif($range < 1){$xTick="f0.05a0.1"}
	elsif($range < 2){$xTick="f0.1a0.2"}
	elsif($range < 5){$xTick="f0.25a0.5"}
	elsif($range < 10){$xTick="f0.5a1"}
	elsif($range < 20){$xTick="f1a2"}
	elsif($range < 50){$xTick="f2.5a5"}
	elsif($range < 100){$xTick="f5a10"}
	elsif($range < 200){$xTick="f10a20"}
	elsif($range < 500){$xTick="f25a50"}
	elsif($range < 1000){$xTick="f50a100"}
	elsif($range < 2000){$xTick="f100a200"}
	elsif($range < 5000){$xTick="f250a500"}
	elsif($range < 10000){$xTick="f500a1000"}
	elsif($range < 20000){$xTick="f1000a2000"}
	elsif($range < 50000){$xTick="f2500a5000"}
	elsif($range < 100000){$xTick="f5000a10000"}
	elsif($range < 200000){$xTick="f10000a20000"}
	elsif($range < 500000){$xTick="f25000a50000"}
	elsif($range < 1000000){$xTick="f50000a100000"}
	elsif($range < 2000000){$xTick="f100000a200000"}
	elsif($range < 5000000){$xTick="f250000a500000"}
	else{$xTick="f500000a1000000"}
	
	#print "Xmin/Ymax: $xMax/$xMin\n";
	#print "X-Range: $range\n";
	#print "Setting: $xTick\n\n";	
	
	#return the x-axis tick labeling string
	return($xTick);
	
}#end sub getxTick()


#------------------------------------------------------------------------------------------------------------------------------#
#------- SUBROUTINE FOR SETTING AN GMT Y-AXIS TICKMARK STRING WITH GRIDLINES --------------------------------------------------#
#------------------------------------------------------------------------------------------------------------------------------#
# This subroutine takes a -RminX/maxX/minY/maxY string from GMT's minmax and figures out a reasonable
# axis labeling string to use for the plot's y-axis. 
#------------------------------------------------------------------------------------------------------------------------------#
sub getYtickGrid {
	#check to be sure the input string is in the correct format.
	if(substr($_[0],0,2) ne "-R"){
		print "\n\nError in getYtickGrid. User must pass a GMT-style -R string\n";
		print "Received: @_\n";
		exit;
	}#end if
	
	#split the user inputted -R value into min/max y values
	my @R=split("/",$_[0]);
	my $yMin=$R[2];
	my $yMax=$R[3];
	my $range=$yMax-$yMin;
	
	#define the local variable $yTick
	my $yTick="";
	
	#You may have to edit this in the future if you are plotting extreme values, but these should work for most plots.
	#set yticks based on total y-range
	if   ($range < 0.001){$yTick="f0.00005a0.0001g0.0001"}
	elsif($range < 0.002){$yTick="f0.0001a0.0002g0.0002"}
	elsif($range < 0.005){$yTick="f0.00025a0.0005g0.0005"}
	elsif($range < 0.01){$yTick="f0.0005a0.001g0.001"}
	elsif($range < 0.02){$yTick="f0.001a0.002g0.002"}
	elsif($range < 0.05){$yTick="f0.0025a0.005g0.005"}
	elsif($range < 0.1){$yTick="f0.005a0.01g0.01"}
	elsif($range < 0.2){$yTick="f0.01a0.02g0.02"}
	elsif($range < 0.5){$yTick="f0.025a0.05g0.05"}
	elsif($range < 1){$yTick="f0.05a0.1g0.1"}
	elsif($range < 2){$yTick="f0.1a0.2g0.2"}
	elsif($range < 5){$yTick="f0.25a0.5g0.5"}
	elsif($range < 10){$yTick="f0.5a1g1"}
	elsif($range < 20){$yTick="f1a2g2"}
	elsif($range < 50){$yTick="f2.5a5g5"}
	elsif($range < 100){$yTick="f5a10g10"}
	elsif($range < 200){$yTick="f10a20g20"}
	elsif($range < 500){$yTick="f25a50g50"}
	elsif($range < 1000){$yTick="f50a100g100"}
	elsif($range < 2000){$yTick="f100a200g200"}
	elsif($range < 5000){$yTick="f250a500g500"}
	elsif($range < 10000){$yTick="f500a1000g1000"}
	elsif($range < 20000){$yTick="f1000a2000g2000"}
	elsif($range < 50000){$yTick="f2500a5000g5000"}
	elsif($range < 100000){$yTick="f5000a10000g10000"}
	elsif($range < 200000){$yTick="f10000a20000g20000"}
	elsif($range < 500000){$yTick="f25000a50000g50000"}
	elsif($range < 1000000){$yTick="f50000a100000g100000"}
	elsif($range < 2000000){$yTick="f100000a200000g200000"}
	elsif($range < 5000000){$yTick="f250000a500000g500000"}
	else{$yTick="f500000a1000000g1000000"}
	
	#print "Ymin/max: $yMax/$yMin\n";
	#print "Y-Range: $range\n";
	#print "Setting: $yTick\n\n";	
	
	#return the y-axis tick labeling string
	return($yTick);
	
}#end sub getYtickGrid()


#------------------------------------------------------------------------------------------------------------------------------#
#------- SUBROUTINE FOR SETTING AN GMT Y-AXIS TICKMARK STRING WITH NO GRIDLINES -----------------------------------------------#
#------------------------------------------------------------------------------------------------------------------------------#
# This subroutine takes a -RminX/maxX/minY/maxY string from GMT's minmax and figures out a reasonable
# axis labeling string to use for the plot's y-axis. 
#------------------------------------------------------------------------------------------------------------------------------#
sub getYtick {
	#check to be sure the input string is in the correct format.
	if(substr($_[0],0,2) ne "-R"){
		print "\n\nError in getYtick. User must pass a GMT-style -R string\n";
		print "Received: @_\n";
		exit;
	}#end if
	
	#split the user inputted -R value into min/max y values
	my @R=split("/",$_[0]);
	my $yMin=$R[2];
	my $yMax=$R[3];
	my $range=$yMax-$yMin;
	
	#define the local variable $yTick
	my $yTick="";
	
	#You may have to edit this in the future if you are plotting extreme values, but these should work for most plots.
	#set yticks based on total y-range
	if   ($range < 0.001){$yTick="f0.00005a0.0001"}
	elsif($range < 0.002){$yTick="f0.0001a0.0002"}
	elsif($range < 0.005){$yTick="f0.00025a0.0005"}
	elsif($range < 0.01){$yTick="f0.0005a0.001"}
	elsif($range < 0.02){$yTick="f0.001a0.002"}
	elsif($range < 0.05){$yTick="f0.0025a0.005"}
	elsif($range < 0.1){$yTick="f0.005a0.01"}
	elsif($range < 0.2){$yTick="f0.01a0.02"}
	elsif($range < 0.5){$yTick="f0.025a0.05"}
	elsif($range < 1){$yTick="f0.05a0.1"}
	elsif($range < 2){$yTick="f0.1a0.2"}
	elsif($range < 5){$yTick="f0.25a0.5"}
	elsif($range < 10){$yTick="f0.5a1"}
	elsif($range < 20){$yTick="f1a2"}
	elsif($range < 50){$yTick="f2.5a5"}
	elsif($range < 100){$yTick="f5a10"}
	elsif($range < 200){$yTick="f10a20"}
	elsif($range < 500){$yTick="f25a50"}
	elsif($range < 1000){$yTick="f50a100"}
	elsif($range < 2000){$yTick="f100a200"}
	elsif($range < 5000){$yTick="f250a500"}
	elsif($range < 10000){$yTick="f500a1000"}
	elsif($range < 20000){$yTick="f1000a2000"}
	elsif($range < 50000){$yTick="f2500a5000"}
	elsif($range < 100000){$yTick="f5000a10000"}
	elsif($range < 200000){$yTick="f10000a20000"}
	elsif($range < 500000){$yTick="f25000a50000"}
	elsif($range < 1000000){$yTick="f50000a100000"}
	elsif($range < 2000000){$yTick="f100000a200000"}
	elsif($range < 5000000){$yTick="f250000a500000"}
	else{$yTick="f500000a1000000"}
	
	#print "Ymin/max: $yMax/$yMin\n";
	#print "Y-Range: $range\n";
	#print "Setting: $yTick\n\n";	
	
	#return the y-axis tick labeling string
	return($yTick);
	
}#end sub getYtick()


#------------------------------------------------------------------------------------------------------------------------------#
#------- SUBROUTINE FOR SETTING A GMT LONGITUDE-AXIS TICKMARK STRING (NO GRIDLINES) -------------------------------------------#
#------------------------------------------------------------------------------------------------------------------------------#
# This subroutine takes a -RminX/maxX/minY/maxY string from GMT's minmax and figures out a reasonable
# axis labeling string to use for the map's longitude axis (x-axis). Does not make and gridlines.
# This does not work for data in date/time format (e.g. yyyymmddThh:mm).
#------------------------------------------------------------------------------------------------------------------------------#
sub getLonTick {
	#check to be sure the input string is in the correct format.
	if(substr($_[0],0,2) ne "-R"){
		print "\n\nError in getLonTick. User must pass a GMT-style -R string\n";
		print "Received: @_\n";
		exit;
	}#end if
	
	#split the user inputted -R value into min/max x values
	my @R=split("/",$_[0]);
	my $xMin=$R[0];
	#remove the -R
	$xMin=~s/-R//;
	my $xMax=$R[1];
	my $range=$xMax-$xMin;
	
	#define the local variable $lonTick
	my $lonTick="";
	
	#You may have to edit this in the future if you are plotting extreme values, but these should work for most plots.
	#set xTicks based on total y-range
	if   ($range < 0.001){$lonTick="f0.00005a0.0001"}
	elsif($range < 0.002){$lonTick="f0.0001a0.0002"}
	elsif($range < 0.005){$lonTick="f0.00025a0.0005"}
	elsif($range < 0.01){$lonTick="f0.0005a0.001"}
	elsif($range < 0.02){$lonTick="f0.001a0.002"}
	elsif($range < 0.05){$lonTick="f0.0025a0.005"}
	elsif($range < 0.1){$lonTick="f0.005a0.01"}
	elsif($range < 0.2){$lonTick="f0.01a0.02"}
	elsif($range < 0.5){$lonTick="f0.025a0.05"}
	elsif($range < 1){$lonTick="f0.05a0.1"}
	elsif($range < 2){$lonTick="f0.1a0.2"}
	elsif($range < 5){$lonTick="f0.25a0.5"}
	elsif($range < 10){$lonTick="f0.5a1"}
	elsif($range < 20){$lonTick="f1a2"}
	elsif($range < 50){$lonTick="f2.5a5"}
	elsif($range < 100){$lonTick="f5a10"}
	elsif($range < 200){$lonTick="f10a20"}
	elsif($range < 500){$lonTick="f25a50"}
	elsif($range < 1000){$lonTick="f50a100"}
	elsif($range < 2000){$lonTick="f100a200"}
	elsif($range < 5000){$lonTick="f250a500"}
	else{$lonTick="f500a1000"}
	
	#print "Xmin/Ymax: $xMax/$xMin\n";
	#print "X-Range: $range\n";
	#print "Setting: $lonTick\n\n";	
	
	#return the lon-axis tick labeling string
	return($lonTick);
	
}#end sub getLonTick()


#------------------------------------------------------------------------------------------------------------------------------#
#------- SUBROUTINE FOR SETTING A GMT LATITUDE-AXIS TICKMARK STRING (NO GRIDLINES) --------------------------------------------#
#------------------------------------------------------------------------------------------------------------------------------#
# This subroutine takes a -RminX/maxX/minY/maxY string from GMT's minmax and figures out a reasonable
# axis labeling string to use for the map's latitude axis (y-axis). Does not make and gridlines.
# This does not work for data in date/time format (e.g. yyyymmddThh:mm).
#------------------------------------------------------------------------------------------------------------------------------#
sub getLatTick {
	#check to be sure the input string is in the correct format.
	if(substr($_[0],0,2) ne "-R"){
		print "\n\nError in getLatTick. User must pass a GMT-style -R string\n";
		print "Received: @_\n";
		exit;
	}#end if
	
	#split the user inputted -R value into min/max y values
	my @R=split("/",$_[0]);
	my $yMin=$R[2];
	my $yMax=$R[3];
	my $range=$yMax-$yMin;
	
	#define the local variable $latTick
	my $latTick="";
	
	#You may have to edit this in the future if you are plotting extreme values, but these should work for most plots.
	#set yticks based on total y-range
	if   ($range < 0.001){$latTick="f0.00005a0.0001"}
	elsif($range < 0.002){$latTick="f0.0001a0.0002"}
	elsif($range < 0.005){$latTick="f0.00025a0.0005"}
	elsif($range < 0.01){$latTick="f0.0005a0.001"}
	elsif($range < 0.02){$latTick="f0.001a0.002"}
	elsif($range < 0.05){$latTick="f0.0025a0.005"}
	elsif($range < 0.1){$latTick="f0.005a0.01"}
	elsif($range < 0.2){$latTick="f0.01a0.02"}
	elsif($range < 0.5){$latTick="f0.025a0.05"}
	elsif($range < 1){$latTick="f0.05a0.1"}
	elsif($range < 2){$latTick="f0.1a0.2"}
	elsif($range < 5){$latTick="f0.25a0.5"}
	elsif($range < 10){$latTick="f0.5a1"}
	elsif($range < 20){$latTick="f1a2"}
	elsif($range < 50){$latTick="f2.5a5"}
	elsif($range < 100){$latTick="f5a10"}
	elsif($range < 200){$latTick="f10a20"}
	elsif($range < 500){$latTick="f25a50"}
	elsif($range < 1000){$latTick="f50a100"}
	elsif($range < 2000){$latTick="f100a200"}
	elsif($range < 5000){$latTick="f250a500"}
	else{$latTick="f500a1000"}
	
	#print "Ymin/max: $yMax/$yMin\n";
	#print "Lat-Range: $range\n";
	#print "Setting: $latTick\n\n";	
	
	#return the Lat-axis tick labeling string
	return($latTick);
	
}#end sub getLatTick()



#------------------------------------------------------------------------------------------------------------------------------#
#------- SUBROUTINE FOR SETTING A GMT COLORBAR-AXIS TICKMARK STRING WITH GRIDLINES --------------------------------------------#
#------------------------------------------------------------------------------------------------------------------------------#
# This subroutine takes a -Tmin/max/inc string from GMT's minmax of grdinfo and figures out a reasonable
# axis labeling string to use for a colorbar made with psscale. 
# This does not work for data in date/time format (e.g. yyyymmddThh:mm).
#------------------------------------------------------------------------------------------------------------------------------#
sub getCBarTick {
	#check to be sure the input string is in the correct format.
	if(substr($_[0],0,2) ne "-T"){
		print "\n\nError in getCBarTick. User must pass a GMT-style -T string\n";
		print "Received: @_\n";
		exit;
	}#end if
	
	#split the user inputted -R value into min/max x values
	my @T=split("/",$_[0]);
	my $zMin=$T[0];
	#remove the -T
	$zMin=~s/-T//;
	my $zMax=$T[1];
	my $range=$zMax-$zMin;
	
	#define the local variable $cTick
	my $cTick="";
	
	#You may have to edit this in the future if you are plotting extreme values, but these should work for most plots.
	#set xTicks based on total x-range
	if   ($range < 0.001){$cTick="f0.00005a0.0001g0.00005"}
	elsif($range < 0.002){$cTick="f0.0001a0.0002g0.0001"}
	elsif($range < 0.005){$cTick="f0.00025a0.0005g0.00025"}
	elsif($range < 0.01){$cTick="f0.0005a0.001g0.0005"}
	elsif($range < 0.02){$cTick="f0.001a0.002g0.001"}
	elsif($range < 0.05){$cTick="f0.0025a0.005g0.0025"}
	elsif($range < 0.1){$cTick="f0.005a0.01g0.005"}
	elsif($range < 0.2){$cTick="f0.01a0.02g0.01"}
	elsif($range < 0.5){$cTick="f0.025a0.05g0.025"}
	elsif($range < 1){$cTick="f0.05a0.1g0.05"}
	elsif($range < 2){$cTick="f0.1a0.2g0.1"}
	elsif($range < 5){$cTick="f0.25a0.5g0.25"}
	elsif($range < 10){$cTick="f0.5a1g0.5"}
	elsif($range < 20){$cTick="f1a2g1"}
	elsif($range < 50){$cTick="f2.5a5g2.5"}
	elsif($range < 100){$cTick="f5a10g5"}
	elsif($range < 200){$cTick="f10a20g10"}
	elsif($range < 500){$cTick="f25a50g25"}
	elsif($range < 1000){$cTick="f50a100g50"}
	elsif($range < 2000){$cTick="f100a200g100"}
	elsif($range < 5000){$cTick="f250a500g250"}
	elsif($range < 10000){$cTick="f500a1000g500"}
	elsif($range < 20000){$cTick="f1000a2000g1000"}
	elsif($range < 50000){$cTick="f2500a5000g2500"}
	elsif($range < 100000){$cTick="f5000a10000g5000"}
	elsif($range < 200000){$cTick="f10000a20000g10000"}
	elsif($range < 500000){$cTick="f25000a50000g25000"}
	elsif($range < 1000000){$cTick="f50000a100000g50000"}
	elsif($range < 2000000){$cTick="f100000a200000g100000"}
	elsif($range < 5000000){$cTick="f250000a500000g250000"}
	else{$cTick="f500000a1000000g500000"}
	
	#print "Zmin/Zmax: $zMax/$zMin\n";
	#print "Z-Range: $range\n";
	#print "Setting: $cTick\n\n";	
	
	#return the colorbar-axis tick labeling string
	return($cTick);
	
}#end sub getCBarTick()



#------------------------------------------------------------------------------------------------------------------------------#
#------- SUBROUTINE FOR AUTOMATED MAP SCALE GENERATION IN GMT6 ----------------------------------------------------------------#
#------------------------------------------------------------------------------------------------------------------------------#
# This subroutine takes a GMT -RminLon/maxLon/minLat/maxLat string and figures out a reasonable map scale length for a GMT map.
# A GMT-style -L string is returned that plots the map scale at the bottom left corner of the plot.
#------------------------------------------------------------------------------------------------------------------------------#
sub getMapScale {
	#check to be sure the input string is in the correct format.
	if(substr($_[0],0,2) ne "-R"){
		print "\n\nError in getMapScale. User must pass a GMT-style -R string\n";
		print "Received: @_\n";
		exit;
	}#end if
	
	#split the user inputted -R value into min/max lon/lat values
	my @R=split("/",$_[0]);
	my $lonMin=$R[0];
	my $lonMax=$R[1];
	my $latMin=$R[2];
	my $latMax=$R[3];
	#calculate the latitude of the middle of the map
	my $latMid=($latMin+$latMax)/2;
	#remove the -R
	$lonMin=~s/-R//;
		
	#figure out the width (in km) of the map region centered on the user specified point 
	my $txt=`gmt mapproject -G$lonMin/$latMid+uk <<-END
	$lonMax $latMid
	END`;
	chomp($txt);
	my @txt=split(" ",$txt);
	my $dist=$txt[2];
	#divide by 4 because a map scale should probably not take up more than 1/4 of the plot width
	my $distScale=$dist/4;
	my $mapScale;
	
	#figure out what distance scale to apply
	if($distScale<0.2){
		print "\n\n  Error: getMapScale was not designed for maps this small\n";
		print "  Your map is only $dist km wide!\n\n";
		exit;
	}#end if
	elsif($distScale<0.3) {$mapScale=0.25}
	elsif($distScale<0.5) {$mapScale=0.5}
	elsif($distScale<1)   {$mapScale=1}
	elsif($distScale<4)   {$mapScale=2}
	elsif($distScale<7)   {$mapScale=5}
	elsif($distScale<13)  {$mapScale=10}
	elsif($distScale<17)  {$mapScale=15}
	elsif($distScale<23)  {$mapScale=20}
	elsif($distScale<27)  {$mapScale=25}
	elsif($distScale<50)  {$mapScale=40}
	elsif($distScale<100) {$mapScale=50}
	elsif($distScale<150) {$mapScale=100}
	elsif($distScale<250) {$mapScale=200}
	elsif($distScale<500) {$mapScale=400}
	elsif($distScale<750) {$mapScale=500}
	elsif($distScale<1000){$mapScale=750}
	elsif($distScale<1300){$mapScale=1000}
	elsif($distScale<1750){$mapScale=1500}
	elsif($distScale<2000){$mapScale=2000}
	else {
		print "\n\n  Error: getMapScale was not designed for maps this large\n";
		print "  Your map is $dist km wide!\n\n";
		exit;
	}#end else
	
	
	#printf ("Map is %.2f km wide\n",$dist);
	#printf ("1/4 is %.2f km\n",$distScale);
	#print "Scale will be $mapScale km\n";
	#printf ("%.2f --> %.2f km\n",$distScale,$mapScale);
	
	#make the GMT6 -L string for placing at the bottom left of the plot
	#this should work nicely for plots that are on 8.5in wide paper
	my $mapScaleString="-Lx0.3i/0.3i+jBL+w${mapScale}k+c+f+u";
	#return the string to the user
	return($mapScaleString);

}#end sub getMapScale()



#------------------------------------------------------------------------------------------------------------------------------#
#all perl modules should end in a 1;
1;
