import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Runtime, LayerVersion } from "aws-cdk-lib/aws-lambda";
import { PythonLambda } from '../lambda/python-construct';
import { LambdaExecutionRole } from '../iam/lambda-role-construct';
import { ApiGatewayWebhook } from '../api/webhook-construct';
import { PythonLambdaLayer } from '../lambda/python-layer';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

interface ApiStackProps extends cdk.StackProps {
  handler: string;
  codePath: string;
  layerPath: string;
  environment?: { [key: string]: string };
  runtime: Runtime;
  pythonVersion: string;
}

export class ApiStack extends cdk.Stack {

  constructor(scope: cdk.App, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // Create a new instance of the Lambda Layer construct
    const layer = new PythonLambdaLayer(this, `${id}CommonDependenciesLayer`, {
      codePath: props.layerPath,
      runtime: props.runtime,
    });
    // const powerToolsArn = `arn:aws:lambda:${this.region}:017000801446:layer:AWSLambdaPowertoolsPythonV3-${props.pythonVersion}-x86_64:2`;
    const powerToolsArn = 'arn:aws:lambda:ap-southeast-2:017000801446:layer:AWSLambdaPowertoolsPythonV2:78';
    const powerToolsLayer = LayerVersion.fromLayerVersionArn(this, `${id}PowerToolsLayer`, powerToolsArn);

    const paramSecretStoreArn = 'arn:aws:lambda:ap-southeast-2:665172237481:layer:AWS-Parameters-and-Secrets-Lambda-Extension:12'
    const paramSecretStoreLayer = LayerVersion.fromLayerVersionArn(this, `${id}ParamSecretStoreLayer`, paramSecretStoreArn);

    // Create a new instance of the Lambda Execution Role construct
    const lambdaRole = new LambdaExecutionRole(this, `${id}LambdaRole`).role;

    // Define the Lambda function
    const webhookLambda = new PythonLambda(this, `${id}LambdaWebhook`, {
      functionName: `${id}LambdaWebhook`,
      runtime: props.runtime,
      handler: props.handler,
      codePath: props.codePath,
      environment: props.environment,
      role: lambdaRole,
    });
    // Add the layer to the Lambda function
    webhookLambda.lambdaFunction.addLayers(layer.layer);
    webhookLambda.lambdaFunction.addLayers(powerToolsLayer);
    webhookLambda.lambdaFunction.addLayers(paramSecretStoreLayer);

    // Define the API Gateway webhook
    new ApiGatewayWebhook(this, `${id}Webhook`, {
      lambdafunction: webhookLambda.lambdaFunction,
      apiName: 'Up Bank Webhook Service',
      stageName: 'prod',
      version: 'v1',
    });

    // Create a new secret
    const upWebhookSecret = new Secret(this, `${id}UpBankWebhookSecret`, {
      secretName: 'prod/key/upbank/webhook',
      secretStringValue: cdk.SecretValue.unsafePlainText(JSON.stringify({
        'secretKey': 'secrets'
      }))
    });

    const upApiSecret = new Secret(this, `${id}UpBankApiSecret`, {
      secretName: 'prod/key/upbank/api',
      secretStringValue: cdk.SecretValue.unsafePlainText(JSON.stringify({
        'secretKey': 'secrets'
      }))
    });
  }
}