#!/bin/bash
set -ex
 
tasks="bandada-client bandada-api bandada-dashboard"
for task in $tasks; do
  bandada_revision=$(aws ecs describe-task-definition --task-definition $task --query "taskDefinition.revision")
  aws ecs update-service --cluster bandada --service $task --force-new-deployment --task-definition $task:$bandada_revision
done

aws ecs wait services-stable --cluster bandada --services $tasks
