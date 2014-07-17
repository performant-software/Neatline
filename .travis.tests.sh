#! /usr/bin/env bash

if [ -z $PLUGIN_DIR ]; then
  PLUGIN_DIR=`pwd`
fi

if [ -z $NL_DIR ]; then
    NL_DIR=`pwd`
fi

if [ -z $OMEKA_DIR ]; then
  OMEKA_DIR=`pwd`/omeka
fi

export PLUGIN_DIR
export NL_DIR
export OMEKA_DIR

grunt
ec1=$?

grunt jasmine
ec2=$?

[[ "$ec1" -eq "0" && "$ec2" -eq "0" ]]

