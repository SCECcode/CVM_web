# CVM_web

## Github dependencies

https://github.com/meihuisu/ucvm_plotly_web
https://github.com/SCECcode/ucvm_metadata_utilities
https://github.com/SCECcode/ucvm_plotting


## Prebuilt requirements

Need to have these directories set before the service can run properly because of 
temporary files being created and access by GMT and also where user's results

chmod og+rw web/php
chmod og+rw web/perl
chmod og+rw web/result
chmod +x web/result
