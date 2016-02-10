#!/bin/bash
cd /takuu-saatio/omatalous-scripts
if [ ! -z "$GIT_UPDATE" ]
then
  git pull
  npm install
fi
npm run update
