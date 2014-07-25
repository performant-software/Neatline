#! /usr/bin/env bash

REPO_DIR=`pwd`

if [ -z $OMEKA_DIR ]; then
    OMEKA_DIR=$REPO_DIR/../omeka
fi

if [ -z $NL_DIR ]; then
    NL_DIR=$OMEKA_DIR/plugins/Neatline
fi

if [ -z $PLUGIN_DIR ]; then
    PLUGIN_DIR=$NL_DIR
fi

export OMEKA_DIR
export NL_DIR
export PLUGIN_DIR

grunt
ec1=$?

grunt jasmine
ec2=$?

[[ "$ec1" -eq "0" && "$ec2" -eq "0" ]]

