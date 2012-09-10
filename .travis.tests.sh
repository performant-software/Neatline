#! /usr/bin/env bash

if [ -z $PLUGIN_DIR ]; then
  PLUGIN_DIR=`pwd`
fi

if [ -z $OMEKA_DIR ]; then
  export OMEKA_DIR=`pwd`/omeka
fi

echo "Plugin Directory: $PLUGIN_DIR"
echo "Omeka Directory: $OMEKA_DIR"

cd tests && phpunit
cd $PLUGIN_DIR && rake jasmine:ci
