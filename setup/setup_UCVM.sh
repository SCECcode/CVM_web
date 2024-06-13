#!/bin/bash


## base models are dir_name, model_label, tarball, model_name 
##                cvmh1511/cvmh/cvmh-15.1.1.tar.gz/CVM-Hv15.1.1 
##                cvms426/cvmsi/cvms426.tar.gz/CVM-S4.26.M01
##                cvms/cvms/cvms4.tar.gz/CVM-S4
##                cvms5/cvms5/cvms5.tar.gz/CVM-S4.26
##                cencal/cencal/cencal080.tar.gz/CCenCalVM
##                cca/cca/cca.tar.gz/CCA

export TOP_UCVM_DIR=`pwd`

export UCVM_SRC_PATH=$TOP_UCVM_DIR/model/UCVM
export UCVM_INSTALL_PATH=$TOP_UCVM_DIR/web/model/UCVM_TARGET
