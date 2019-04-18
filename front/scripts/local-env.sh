#!/bin/bash

export REACT_APP_API_ENDPOINT=http://localhost:4000
export REACT_APP_CONFIG=local

function get_local_config {
  ENV_VAR_NAME=$1
  SSM_VALUE=`aws ssm get-parameters --names "/sp-app-back/config/local/$ENV_VAR_NAME" --query 'Parameters[*].Value' --output text`
  echo "$SSM_VALUE"
}

export REACT_APP_FIREBASE_API_KEY=$(get_local_config FIREBASE_API_KEY)
export REACT_APP_FIREBASE_AUTH_DOMAIN=$(get_local_config FIREBASE_AUTH_DOMAIN)
export REACT_APP_FIREBASE_DATABASE_URL=$(get_local_config FIREBASE_DATABASE_URL)
export REACT_APP_FIREBASE_PROJECT_ID=$(get_local_config FIREBASE_PROJECT_ID)
export REACT_APP_LOGROCKET_APP_ID=$(get_local_config LOGROCKET_APP_ID)
