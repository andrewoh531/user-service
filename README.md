# User-Service
AWS Lambda based microservice to manage users. This lambda function simply retrieves an existing user by their Facebook Id or creates a new entry in AWS DynamoDB if the user does not exist.

## AWS Resources
The following AWS resources are created as part of the `serverless deploy` command:
* DynamoDB table 
* Lambda function

Note that the default region is set to `ap-southeast-2`.

---
# Credit - Serverless ES7 async/await

This repository was generated via `https://github.com/AnomalyInnovations/serverless-es7` which provides the skeleton for a serverless configuration that supports ES7. Please reference the repository linked above for further information on setting up your own ES7 async/await generated framework.
