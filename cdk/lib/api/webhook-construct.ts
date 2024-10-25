import { Construct } from "constructs";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export interface ApiGatewayWebhookProps {
    readonly lambdafunction: IFunction;
    readonly apiName?: string;
}

export class ApiGatewayWebhook extends Construct {
  public readonly api: apigateway.LambdaRestApi;

  constructor(scope: Construct, id: string, props: ApiGatewayWebhookProps) {
    super(scope, id);

    this.api = new apigateway.LambdaRestApi(this, id, {
        handler: props.lambdafunction,
        proxy: false,
        restApiName: props.apiName,
    });

    const webhook = this.api.root.addResource("webhook");
    webhook.addMethod("POST");
  } 
}
