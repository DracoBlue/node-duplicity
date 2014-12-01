#!/bin/bash

cd `dirname $0`

if [ -d results/create_verify_delete ]
then
  rm -rf results/create_verify_delete
fi

../bin/duplicity.js full-backup fixtures file://results/create_verify_delete
../bin/duplicity.js verify fixtures file://results/create_verify_delete
../bin/duplicity.js files file://results/create_verify_delete
../bin/duplicity.js status file://results/create_verify_delete

