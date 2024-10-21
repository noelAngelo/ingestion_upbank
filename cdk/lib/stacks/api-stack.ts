import * as cdk from 'aws-cdk-lib';
import { Runtime, Function, Code } from "aws-cdk-lib/aws-lambda";
import { PythonLambda } from '../lambda/python-construct';
import { LambdaExecutionRole } from '../iam/lambda-role-construct';
import { ApiGatewayWebhook } from '../api/webhook-construct';
import { PythonLambdaLayer } from '../lambda/python-layer';

interface ApiStackProps extends cdk.StackProps {
  handler: string;
  codePath: string;
  layerPath: string;
  environment?: { [key: string]: string };
}

export class ApiStack extends cdk.Stack {

  constructor(scope: cdk.App, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // Create a new instance of the Lambda Layer construct
    const layer = new PythonLambdaLayer(this, `${id}CommonDependenciesLayer`, {
      codePath: props.layerPath,
      runtime: Runtime.PYTHON_3_12,
    }
    );

    // Create a new instance of the Lambda Execution Role construct
    const lambdaRole = new LambdaExecutionRole(this, `${id}LambdaRole`).role;

    // Define the Lambda function
    const webhookLambda = new PythonLambda(this, `${id}LambdaWebhook`, {
      functionName: `${id}LambdaWebhook`,
      runtime: Runtime.PYTHON_3_12,
      handler: props.handler,
      codePath: props.codePath,
      environment: props.environment,
      role: lambdaRole,
    });
    // Add the layer to the Lambda function
    webhookLambda.lambdaFunction.addLayers(layer.layer);

    // Define the API Gateway webhook
    new ApiGatewayWebhook(this, `${id}Webhook`, {
      lambdafunction: webhookLambda.lambdaFunction,
      apiName: 'Up Bank Webhook Service',
      stageName: 'prod',
      version: 'v1',
    });
  }
}