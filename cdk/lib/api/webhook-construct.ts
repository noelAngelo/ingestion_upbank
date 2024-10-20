import { Construct } from "constructs";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

export interface ApiGatewayWebhookProps {
    readonly lambdafunction: IFunction;
    readonly apiName?: string;
    readonly stageName?: string;
    readonly path: string;
}

export class ApiGatewayWebhook extends Construct {
public readonly api: RestApi;

  constructor(scope: Construct, id: string, props: ApiGatewayWebhookProps) {
    super(scope, id);

    // Create the API gateway
    this.api = new RestApi(this, `${id}WebhookApi`, {
        restApiName: props.apiName || 'Webhook Service',
        description: 'This service serves as a webhook endpoint',
        deployOptions: {
            stageName: props.stageName || 'prod',
        },
    });

    // Create a resource path and integrate with Lambda
    const resource = this.api.root.addResource(props.path);
    resource.addMethod('POST', new LambdaIntegration(props.lambdafunction));
  }
}