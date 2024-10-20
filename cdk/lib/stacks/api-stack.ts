import * as cdk from 'aws-cdk-lib';
import { Runtime, Function, Code } from "aws-cdk-lib/aws-lambda";
import { PythonLambda } from '../lambda/python-construct';
import { LambdaExecutionRole } from '../iam/lambda-role-construct';
import { ApiGatewayWebhook } from '../api/webhook-construct';

interface ApiStackProps extends cdk.StackProps {
  handler: string;
  codePath: string;
  environment?: { [key: string]: string };
}

export class ApiStack extends cdk.Stack {
  
  constructor(scope: cdk.App, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // Define the Lambda function
    const lambdaRole = new LambdaExecutionRole(this, `${id}LambdaRole`).role;
    const webhookLambda = new PythonLambda(this, `${id}LambdaWebhook`, {
      functionName: `${id}LambdaWebhook`,
      runtime: Runtime.PYTHON_3_12,
      handler: props.handler,
      codePath: props.codePath,
      environment: props.environment,
      role: lambdaRole,
    });

    // Define the API Gateway webhook
    new ApiGatewayWebhook(this, `${id}Webhook`, {
      lambdafunction: webhookLambda.lambdaFunction,
      apiName: 'Up Bank Webhook Service',
      stageName: 'prod',
      path: 'webhook',
    });
  }
}