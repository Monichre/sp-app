#!/bin/bash

# TARGET=test source ./scripts/ssm-env

function get_param {
  ENV_VAR_NAME=$1
  SSM_VALUE=`aws ssm get-parameters --names "/sp-app-back/target/$TARGET/public/$ENV_VAR_NAME" --query 'Parameters[*].Value' --output text`
  echo "$SSM_VALUE"
}

[ -z "$TARGET" ] && echo "Need to set TARGET" && return
echo "Getting env variables for config [$TARGET]"

export REACT_APP_API_ENDPOINT=$(get_param API_ENDPOINT)
export REACT_APP_CONFIG=$(get_param CONFIG)

export REACT_APP_FIREBASE_API_KEY=$(get_param FIREBASE_API_KEY)
export REACT_APP_FIREBASE_AUTH_DOMAIN=$(get_param FIREBASE_AUTH_DOMAIN)
export REACT_APP_FIREBASE_DATABASE_URL=$(get_param FIREBASE_DATABASE_URL)
export REACT_APP_FIREBASE_PROJECT_ID=$(get_param FIREBASE_PROJECT_ID)
export REACT_APP_LOGROCKET_APP_ID=$(get_param LOGROCKET_APP_ID)
