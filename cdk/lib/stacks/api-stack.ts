import * as cdk from 'aws-cdk-lib';
import { Runtime, Function, Code } from "aws-cdk-lib/aws-lambda";
import { PythonLambda } from '../lambda/python-construct';
import { LambdaExecutionRole } from '../iam/lambda-role-construct';

export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaRole = new LambdaExecutionRole(this, 'LambdaRole').role;
  }
}