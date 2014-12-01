#!/bin/bash

cd `dirname $0`

if [ -d results/create_verify_delete ]
then
  rm -rf results/create_verify_delete
fi

../bin/duplicity.js full-backup fixtures --url file://results/create_verify_delete
../bin/duplicity.js verify fixtures --url file://results/create_verify_delete
../bin/duplicity.js files --url file://results/create_verify_delete
../bin/duplicity.js status --url file://results/create_verify_delete

