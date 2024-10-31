#!/bin/sh
##
## process-csv.sh
##
## process a simple csv from user supplied csv
## trim off the extended header from the original csv file
##

. ./common.sh

rm -rf ../data
mkdir ../data

for file in $CVMPATH/*csv ; do
    [ -e "$file" ] || continue
    echo "process-csv.sh: " $file

    filename=${file##*/}
## remove _ and -
    nfilename=`echo $filename | sed "s/-//g" | sed "s/_//g"`
    CVMTB=${nfilename%.csv}
    sfilename=$CVMTB".csv_header"

## remove original #-lines
## put in the csv header row 
## csv_vs_header, works for : z2.5(vs), z1.0(vs) and regular vs

    cp ./csv_vs_header ../data/$nfilename
    awk '!/^#/' $file | sed "s/NaN//g" >> ../data/$nfilename
    awk '/^#/' $file | cat >> ../data/$sfilename

done
