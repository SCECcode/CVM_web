#!/usr/bin/env python
##
## collect-meta.py
##
## collect meta data for each dataset from the csv
## 

import sys
from os import walk
import csv
import json 
import math
from pathlib import Path
import numpy as np
import pdb

## extract meta data info from the csv file
##
file_list = []
for (dirpath, dirnames, filenames) in walk("../data"):
    file_list.extend(filenames)
    break

#file_list = ['FlatMaxwell.csv']

for f in file_list:
  ff = Path(f)
  f_wo_ext = str(ff.with_suffix(''))
  sfx=ff.suffix
  if(sfx != ".csv") :
    continue

  print("collect-meta file:",f) 

#  {
#      "meta": {
#          "dataCount": 974704,
#          }
#  }

## process .csv file
  Overall_data_total=0
  with open('../data/'+f, encoding="utf8") as f:
    csv_reader = csv.reader(f)
    for line_no, line in enumerate(csv_reader, 1):
      Overall_data_total=Overall_data_total+1

## process matching .csv_header file
# Input Data files: sfcvm_0_01_data.bin sfcvm_0_01_meta.json
# Title: horizontal vs sfcvm
# CVM(abbr): sfcvm
# Data_type: vs
# Depth(m): 0
# Spacing(degree): 0.01
# Lon_pts: 762
# Lat_pts: 649
# data_points: 494538
# min_v: 0.0
# max_v: 3502.5
# mean_v: 386.0216979980469
# lat1: 35.02
# lon1: -126.4
# lat2: 41.50
# lon2: -118.8
# lon,lat,vs
  with open('../data/'+f_wo_ext+'.csv_header', encoding="utf8") as hf:
     for line in hf:
        nline=line.replace("\n","")
        x=nline.split(':')
        if(x[0] == "# CVM(abbr)") :
            meta_cvm=x[1].strip()
        if(x[0] == "# Data_type") :
            meta_datatype=x[1].split()
        if(x[0] == "# data_points") :
            meta_total_dataspots=x[1].strip()

        if(x[0] == "# Lon_pts") :
            meta_lon_pts=x[1].strip()
        if(x[0] == "# Lat_pts") :
            meta_lat_pts=x[1].strip()
        if(x[0] == "# min_v") :
            meta_min_v=x[1].strip()
        if(x[0] == "# max_v") :
            meta_max_v=x[1].strip()
        if(x[0] == "# mean_v") :
            meta_mean_v=x[1].strip()
        if(x[0] == "# lat1") :
            meta_lat1_v=x[1].strip()
        if(x[0] == "# lon1") :
            meta_lon1_v=x[1].strip()
        if(x[0] == "# lat2") :
            meta_lat2_v=x[1].strip()
        if(x[0] == "# lon2") :
            meta_lon2_v=x[1].strip()

  f = open('../data/'+f_wo_ext+'_meta.json', 'w')
  jblob=json.loads('{ "model":"'+f_wo_ext+'", "meta": { "dataCount": '+str(Overall_data_total)+' } }')
  jblob['meta']['cvm']=meta_cvm
  jblob['meta']['dataType']=meta_datatype
  jblob['meta']['lat1']=meta_lat1_v
  jblob['meta']['lat2']=meta_lat2_v
  jblob['meta']['lon1']=meta_lon1_v
  jblob['meta']['lon2']=meta_lon2_v
  jblob['meta']['max']=meta_max_v
  jblob['meta']['min']=meta_min_v
  jblob['meta']['mean']=meta_mean_v

#  jstr=json.dumps(jblob, indent=2)
  jstr=json.dumps(jblob)
  f.write(jstr)
  f.close()
