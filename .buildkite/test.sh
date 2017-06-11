#!/usr/bin/env bash

set -e
working_dir="$( cd "$( dirname "${0}" )/.." && pwd )"

echo "BUILD_KITE_AWS_ACCESS_KEY_ID=${BUILD_KITE_AWS_ACCESS_KEY_ID}"

echo "Building user-service:test image"
docker build --tag user-service:test --file .buildkite/node-dockerfile .

echo "Executing tests..."
docker run --rm -e AWS_DEFAULT_REGION -e AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY user-service:test yarn test
