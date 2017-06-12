#!/usr/bin/env bash

set -e
working_dir="$( cd "$( dirname "${0}" )/.." && pwd )"

echo "Deploying serverless functions..."
docker run -v $(pwd):/opt/app -e AWS_DEFAULT_REGION -e AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY andrewoh531/docker-serverless serverless deploy
