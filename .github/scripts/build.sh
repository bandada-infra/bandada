#!/bin/bash

egrep build.*true .killswitch || exit 0

aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 490752553772.dkr.ecr.eu-central-1.amazonaws.com

docker build -t zk-groups-api:latest -f apps/api/Dockerfile .
docker tag zk-groups-api:latest 490752553772.dkr.ecr.eu-central-1.amazonaws.com/zk-groups-api:latest
docker push 490752553772.dkr.ecr.eu-central-1.amazonaws.com/zk-groups-api:latest

docker build -t zk-groups-client:latest -f apps/client/Dockerfile .
docker tag zk-groups-client:latest 490752553772.dkr.ecr.eu-central-1.amazonaws.com/zk-groups-client:latest
docker push 490752553772.dkr.ecr.eu-central-1.amazonaws.com/zk-groups-client:latest

docker build -t zk-groups-dashboard:latest -f apps/dashboard/Dockerfile .
docker tag zk-groups-dashboard:latest 490752553772.dkr.ecr.eu-central-1.amazonaws.com/zk-groups-dashboard:latest
docker push 490752553772.dkr.ecr.eu-central-1.amazonaws.com/zk-groups-dashboard:latest

exit 0
