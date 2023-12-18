#!/bin/bash
set -ex

env=""

[ "$1" = "prod" ] || env="-$1"
 
tasks="bandada-client$env bandada-api$env bandada-dashboard$env"
for task in $tasks; do
  bandada_revision=$(aws ecs describe-task-definition --task-definition $task --query "taskDefinition.revision")
  aws ecs update-service --cluster bandada$env --service $task --force-new-deployment --task-definition $task:$bandada_revision
done

for loop in {1..3}; do
  [ "$loop" -eq 3 ] && exit 1
  aws ecs wait services-stable --cluster bandada$env --services $tasks && break || continue
done
