# User-Service
AWS Lambda based microservice to manage users. This lambda function simply retrieves an existing user by their Facebook Id or creates a new entry in AWS DynamoDB if the user does not exist.

## Prerequisites
When running locally the function expects the `AWS_REGION` environment variable to be set.

## Usage
To execute the function locally run: `serverless webpack invoke --function getOrCreateUser --path src/tests/sample-payload.json`

To deploy the lambda function run: `serverless deploy`.

To execute the deployed function run: `serverless invoke --function getOrCreateUser --path src/tests/sample-payload.json --stage dev --region ap-southeast-2`

## AWS Resources
The following AWS resources are created as part of the `serverless deploy` command:
* DynamoDB table 
* Lambda function

---
## Credit - Serverless ES7 async/await

This repository was generated via `https://github.com/AnomalyInnovations/serverless-es7` which provides the skeleton for a serverless configuration that supports ES7. Please reference the repository linked above for further information on setting up your own ES7 async/await generated framework.
