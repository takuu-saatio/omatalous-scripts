#!/bin/bash

container="$(docker ps -a | grep omatalous-scripts | awk '{ print $7 }')"
if [ -z "$container" ]
then
  echo "omatalous-sripts already removed"
  exit
fi

docker stop omatalous-scripts
docker rm omatalous-scripts
