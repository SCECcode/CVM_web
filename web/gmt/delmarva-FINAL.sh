#!/bin/bash
# delmarva.sh
# Written 2019-02-21 by Scott T. Marshall 
# Updated 2022-12-23 for GMT6
#-------------------------------------------------------------------------------------------------------------------------------
# Plots a simple map of the Delmarva Peninsula, USA (DE, MD, and VA)
#
#-------------------------------------------------------------------------------------------------------------------------------

#-------------------------------------------------------------------------------------------------------------------------------
#----- USER-SPECIFIED PARAMETERS -----------------------------------------------------------------------------------------------
#-------------------------------------------------------------------------------------------------------------------------------
#name of the plot file
plotFile=delmarva.eps

#lon/lat range of map
range=-77.5/-74.5/37.0/40.0
#width of plot
width=6.5i
#color used for water-filled areas
waterBlue=175/195/221


#-------------------------------------------------------------------------------------------------------------------------------
#----- SET GMT DEFAULTS --------------------------------------------------------------------------------------------------------
#-------------------------------------------------------------------------------------------------------------------------------
#set paper size
gmt set PS_MEDIA=8.5ix10.5i
#make GMT plot in decimal degrees with negative longitudes
gmt set FORMAT_GEO_MAP=-D.x
#Controls font size for axis numbering and titles, respectively
gmt set FONT_ANNOT_PRIMARY=12p
gmt set FONT_LABEL=12p
#Controls plot title and offset
gmt set FONT_TITLE=14p
gmt set MAP_TITLE_OFFSET=2p

#Set other map text parameters
#gmt set MAP_ANNOT_OFFSET_PRIMARY 5p
#gmt set MAP_HEADING_OFFSET 18p
#gmt set MAP_LABEL_OFFSET 8p
#set header font size
#gmt set HEADER_FONT_SIZE 16p
#set header offset amount
#gmt set HEADER_OFFSET -0.1i


#-------------------------------------------------------------------------------------------------------------------------------
#----- START PLOTTING WITH GMT -------------------------------------------------------------------------------------------------
#-------------------------------------------------------------------------------------------------------------------------------
#plot the map axes
gmt psbasemap -R$range -JM$width -Bxf0.5a0.5 -Byf0.5a0.5 -BWSen+gwhite+t"Delmarva Peninsula, USA (Mercator Projection)" -P -K > $plotFile

#plot a coastline and other cool stuff
gmt pscoast -R -JM -Df -W0.5p -S$waterBlue -Na -Ia/2.0p,$waterBlue -Lfx5.5i/0.4i/38.5/50k+u -Tx6.0i/1.0i/0.75i -O -K >> $plotFile

#Plot Washington DC as a star and label it
gmt psxy -R -JM -Sa20p -Ggold -W1.0p -O -K <<END>> $plotFile
-77.036532 38.907247
END
gmt pstext -R -JM -D0i/0.2i -O -K <<END>> $plotFile
-77.036532 38.907247 12 0 1 BC Washington DC
END

#Plot Dover, DE as a red circle and label it
gmt psxy -R -JM -Sc10p -Gred -W1.0p -O -K <<END>> $plotFile
-75.524408 39.158109
END
gmt pstext -R -JM -D0i/0.12i -F+f+a+j -O <<END>> $plotFile
-75.524408 39.158109 20p,Helvetica-Bold,black,=0.5p,red 0 1 BC Dover
END


#-------------------------------------------------------------------------------------------------------------------------------
#----- DISPLAY THE MAP ---------------------------------------------------------------------------------------------------------
#-------------------------------------------------------------------------------------------------------------------------------

#Display the map
#evince $plotFile &

gmt psconvert $plotFile -Tf
gmt psconvert $plotFile -TG
