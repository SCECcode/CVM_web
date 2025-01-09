#!/bin/bash
# setup_cvm_web.sh


export CVM_WEB_TOP_DIR=/app/web
export CVM_VOLUME_TOP_DIR=/usr/local/share/cvm_volume
export CVM_LARGE_DATASET_TOP_DIR=/usr/local/share/ucvm/cvm-large-dataset
export PLOTTING_TOP_DIR=/usr/local/share/plotting
export ANACONDA3_TOP_DIR=/usr/local/share/anaconda3
export UCVM_TOP_DIR=/usr/local/share/ucvm

export UCVM_SRC_PATH=$UCVM_TOP_DIR/src
export UCVM_INSTALL_PATH=$UCVM_TOP_DIR/install

if [ -f $UCVM_INSTALL_PATH/conf/ucvm_env.sh ]; then
  source $UCVM_INSTALL_PATH/conf/ucvm_env.sh
fi


