#!/bin/sh
##
## create-sql.sh
##
## create db specific sql files
##

. ./common.sh

## if datafiles is not here, then grab them from carc

rm -rf ../sql
mkdir ../sql

## add meta_table
cp sql_template/setup_meta_schema.sql ../sql/setup_meta_schema.sql

for file in ../data/*csv ; do

    filename=${file##*/}
    CVMTB=${filename%.csv}
    cvmtb=`echo $CVMTB | awk '{ print tolower($1) }'`

    cat sql_template/linkup_traces.sql | sed "s/%%CVMTB%/${CVMTB}/g" | sed "s/%%cvmtb%/${cvmtb}/g" >> ../sql/linkup_traces.sql
    cat sql_template/setup_model_schema.sql | sed "s/%%CVMTB%/${CVMTB}/g" | sed "s/%%cvmtb%/${cvmtb}/g" >> ../sql/setup_model_schema.sql
    cat sql_template/setup_model_tb.sql | sed "s/%%CVMTB%/${CVMTB}/g" | sed "s/%%cvmtb%/${cvmtb}/g" >> ../sql/setup_model_tb.sql

## process the metadata
    jmetafile="../data/"${CVMTB}"_meta.json"
    jmeta=$(<${jmetafile})

    cat sql_template/setup_meta_tb.sql | sed "s/%%CVMTB%/${CVMTB}/g" | sed "s/%%cvmtb%/${cvmtb}/g" | sed "s/%%jblob%/${jmeta}/g" >> ../sql/setup_meta_tb.sql

done
