#!/bin/bash
# setup_cvm_web.sh

export CVM_WEB_TOP_DIR=/app/web
export PLOTTING_TOP_DIR=/usr/local/share/plotting
export ANACONDA3_TOP_DIR=/usr/local/share/anaconda3
export UCVM_TOP_DIR=/usr/local/share/ucvm

export CVM_VOLUME=/usr/local/share/cvm_volume
export CVM_LARGEDATA_DIR=/usr/local/share/cvm-largedata-dir
export CVM_IN_DOCKER='#'

export UCVM_SRC_PATH=$UCVM_TOP_DIR/src
export UCVM_INSTALL_PATH=$UCVM_TOP_DIR/install

if [ -f $UCVM_INSTALL_PATH/conf/ucvm_env.sh ]; then
  source $UCVM_INSTALL_PATH/conf/ucvm_env.sh
fi


