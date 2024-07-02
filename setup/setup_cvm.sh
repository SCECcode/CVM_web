#!/bin/bash

export TOP_CVM_WEB_DIR=/app/web

export UCVM_TOP_DIR=/usr/local/share/model
export UCVM_SRC_PATH=$UCVM_TOP_DIR/ucvm
export UCVM_INSTALL_PATH=$UCVM_TOP_DIR/ucvm_install

if [ -f $UCVM_INSTALL_PATH/conf/ucvm_env.sh ]; then
  source $UCVM_INSTALL_PATH/conf/ucvm_env.sh
fi


