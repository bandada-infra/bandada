#!/bin/bash

egrep build.*true .killswitch || exit 0

aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 490752553772.dkr.ecr.eu-central-1.amazonaws.com

docker build -t bandada-api:latest -f apps/api/Dockerfile .
docker tag bandada-api:latest 490752553772.dkr.ecr.eu-central-1.amazonaws.com/bandada-api:latest
docker push 490752553772.dkr.ecr.eu-central-1.amazonaws.com/bandada-api:latest

docker build -t bandada-client:latest -f apps/client/Dockerfile .
docker tag bandada-client:latest 490752553772.dkr.ecr.eu-central-1.amazonaws.com/bandada-client:latest
docker push 490752553772.dkr.ecr.eu-central-1.amazonaws.com/bandada-client:latest

docker build -t bandada-dashboard:latest -f apps/dashboard/Dockerfile .
docker tag bandada-dashboard:latest 490752553772.dkr.ecr.eu-central-1.amazonaws.com/bandada-dashboard:latest
docker push 490752553772.dkr.ecr.eu-central-1.amazonaws.com/bandada-dashboard:latest

exit 0
