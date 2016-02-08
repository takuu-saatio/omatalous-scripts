#!/bin/bash

if [ -z "$1" ] && [ -z "$2" ]
then
  docker build -t vhalme/omatalous-scripts .
  exit
fi

if [ "$1" == "--no-cache" ]
then
  docker build -t vhalme/omatalous-scripts --no-cache .
  exit
fi

docker build -t vhalme/omatalous-scripts:$1 .
if [ ! -z "$2" ]
then
  if [ "$2" == "--no-cache" ]
  then
    docker build -t vhalme/omatalous-scripts:$1 --no-cache .
    exit
  fi
  docker tag vhalme/omatalous-scripts:$1 vhalme/omatalous-scripts:$2 $3 .
fi
