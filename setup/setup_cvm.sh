#!/bin/bash

export TOP_CVM_WEB_DIR=`pwd`
export UCVM_SRC_PATH=$TOP_CVM_WEB_DIR/web/model/ucvm
export UCVM_INSTALL_PATH=$TOP_CVM_WEB_DIR/web/model/ucvm_install

if [ -f $UCVM_INSTALL_PATH/conf/ucvm_env.sh ]; then
  source $UCVM_INSTALL_PATH/conf/ucvm_env.sh
fi

