import * as cdk from 'aws-cdk-lib';
import { Runtime, Function, Code } from "aws-cdk-lib/aws-lambda";
import { PythonLambda } from '../lambda/python-construct';
import { LambdaExecutionRole } from '../iam/lambda-role-construct';

interface ApiStackProps extends cdk.StackProps {
  handler: string;
  codePath: string;
  environment?: { [key: string]: string };
}

export class ApiStack extends cdk.Stack {
  public readonly lambdaFunction: Function;
  
  constructor(scope: cdk.App, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const lambdaRole = new LambdaExecutionRole(this, `${id}LambdaRole`).role;
    const lambdaWebhook = new PythonLambda(this, 'LambdaWebhook', {
      runtime: Runtime.PYTHON_3_12,
      handler: props.handler,
      codePath: props.codePath,
      environment: props.environment,
      role: lambdaRole,
    });
    
  }
}