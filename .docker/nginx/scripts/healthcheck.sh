#!/bin/bash

url=$1
expected=$2

# disable ssl check in development environment
if  [ "${DEPLOY_ENV}" == "development" ] 2> /dev/null; then
  url="-k ${url}"
fi

if curl -s ${url} | grep -q "${expected}";
    then
        exit 0
    else
        exit 1
fi;