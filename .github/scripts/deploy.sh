#!/bin/bash
set -x
 
COMMIT_HASH=$(git rev-parse HEAD)
DEPLOY_ID=$(aws deploy create-deployment --application-name zkgroups --deployment-group-name zkgroups-group --github-location repository=$GITHUB_REPOSITORY,commitId=$COMMIT_HASH --ignore-application-stop-failures --file-exists OVERWRITE --output text)

while true; do
  STATUS=$(aws deploy get-deployment --deployment-id $DEPLOY_ID --query 'deploymentInfo.status' --output text)
  if [ $STATUS != "InProgress" ] && [ $STATUS != "Created" ]; then
    if [ $STATUS = "Succeeded" ]; then
       echo "SUCCESS"
       exit 0
    else
       echo "Failed"
       exit 1
    fi
  else
    echo "Deploying..."
  fi
     sleep 30
done
