#!/bin/bash
set -ex

build=$1
env=""

[ $build = "enable" ] || exit 0
[ "$2" = "prod" ] || { env="-$2"; sed -i 's/production/staging/' apps/client/package.json apps/dashboard/package.json; }

aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 490752553772.dkr.ecr.eu-central-1.amazonaws.com

docker build -t bandada-api$env:latest -f apps/api/Dockerfile .
docker tag bandada-api$env:latest 490752553772.dkr.ecr.eu-central-1.amazonaws.com/bandada-api$env:latest
docker push 490752553772.dkr.ecr.eu-central-1.amazonaws.com/bandada-api$env:latest

docker build -t bandada-client$env:latest -f apps/client/Dockerfile .
docker tag bandada-client$env:latest 490752553772.dkr.ecr.eu-central-1.amazonaws.com/bandada-client$env:latest
docker push 490752553772.dkr.ecr.eu-central-1.amazonaws.com/bandada-client$env:latest

docker build -t bandada-dashboard$env:latest -f apps/dashboard/Dockerfile .
docker tag bandada-dashboard$env:latest 490752553772.dkr.ecr.eu-central-1.amazonaws.com/bandada-dashboard$env:latest
docker push 490752553772.dkr.ecr.eu-central-1.amazonaws.com/bandada-dashboard$env:latest

exit 0
