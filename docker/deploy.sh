#!/bin/bash

tag=""
if [ ! -z "$1" ]
then
  tag=":$1"
fi

./shutdown.sh
docker run -d -p 8080:5000 \
  -e DB_USER=devuser \
  -e DB_PASSWORD=devpasswd \
  -e APP_HOSTNAME=local.omatalous.fi \
  -e SENDGRID_USER=bsquared \
  -e SENDGRID_PASSWORD=XXIIdiada \
  -e ADMIN_USER=vhalme@gmail.com \
  -e GOOGLE_CLIENT_ID=129466263199-5bhusetgecvjgcp980k1prfc0vbqjc04.apps.googleusercontent.com \
  -e GOOGLE_CLIENT_SECRET=Z-YezEQ8AnHzcKAM055tnHDV \
  -e FB_CLIENT_ID=1053035831402707 \
  -e FB_CLIENT_SECRET=e58adca988aee4b0a7dafd24de4d55d8 \
  -e GIT_UPDATE=$2 \
  --name omatalous-app --link omatalous-pg:pg vhalme/omatalous-app$tag
