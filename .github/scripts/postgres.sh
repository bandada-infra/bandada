#!/bin/bash
set -ex

env=$1
branch=$2

subnet_prod="subnet-098f960c81c00d738"
subnet_stg="subnet-0212f46e85d6b42b0"
sgroup_prod="sg-00a2562fc4f27ed13"
sgroup_stg="sg-04fa5a3c00608591a"

check_error() {
  if grep -qi "error" output; then
      echo "Error found"
      cat output
      exit 1
  fi
}

if [ $env = "prod" ]; then
  aws lambda update-function-configuration --function-name bandada-postgres --vpc-config SubnetIds=$subnet_prod,SecurityGroupIds=$sgroup_prod > /dev/null 2>&1
  while true; do
    update_status=$(aws lambda get-function-configuration --function-name bandada-postgres --query "LastUpdateStatus" --output text)
    if [ $update_status = "Successful" ]; then
      break
    fi
    sleep 10
  done
  aws lambda invoke --function-name bandada-postgres --cli-binary-format raw-in-base64-out --payload '{"branch": "'"$branch"'", "env": "'"$env"'"}' output
  sleep 5
  check_error
  aws lambda update-function-configuration --function-name bandada-postgres --vpc-config SubnetIds=$subnet_stg,SecurityGroupIds=$sgroup_stg > /dev/null 2>&1
else
  aws lambda invoke --function-name bandada-postgres --cli-binary-format raw-in-base64-out --payload '{"branch": "'"$branch"'", "env": "'"$env"'"}' output
  sleep 5
  check_error
fi
