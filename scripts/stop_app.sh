#!/bin/bash

aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 490752553772.dkr.ecr.eu-central-1.amazonaws.com
docker pull 490752553772.dkr.ecr.eu-central-1.amazonaws.com/zkgroups:latest

sleep 1

cd ~/zk-groups
docker compose down

exit 0
