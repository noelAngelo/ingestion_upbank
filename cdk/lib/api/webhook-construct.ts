import { Construct } from "constructs";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export interface ApiGatewayWebhookProps {
    readonly lambdafunction: IFunction;
    readonly apiName?: string;
    readonly stageName?: string;
    readonly version: string;
}

export class ApiGatewayWebhook extends Construct {
  public readonly api: apigateway.LambdaRestApi;

  constructor(scope: Construct, id: string, props: ApiGatewayWebhookProps) {
    super(scope, id);

    this.api = new apigateway.LambdaRestApi(this, `${id}WebhookApi`, {
        handler: props.lambdafunction,
        proxy: false,
    });

    const webhook = this.api.root.addResource("webhook");
    webhook.addMethod("POST");
  } 
}
