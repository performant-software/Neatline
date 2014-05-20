#! /usr/bin/env bash

if [ -z $PLUGIN_DIR ]; then
  PLUGIN_DIR=`pwd`
fi

if [ -z $OMEKA_DIR ]; then
  export OMEKA_DIR=`pwd`/omeka
fi

grunt
ec1=$?

grunt jasmine
ec2=$?

[[ "$ec1" -eq "0" && "$ec2" -eq "0" ]]

