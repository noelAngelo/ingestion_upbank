import { Construct } from "constructs";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { HttpApi, HttpMethod, ThrottleSettings } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";

export interface ApiGatewayWebhookProps {
    readonly lambdafunction: IFunction;
    readonly apiName?: string;
    readonly stageName?: string;
    readonly version: string;
}

export class ApiGatewayWebhook extends Construct {
  public readonly api: HttpApi;

  constructor(scope: Construct, id: string, props: ApiGatewayWebhookProps) {
    super(scope, id);

    // Create the API Gateway v2 (HTTP API)
    this.api = new HttpApi(this, `${id}WebhookApi`, {
        apiName: props.apiName || 'Webhook Service',
        description: 'This service serves as a webhook endpoint',
    });

    // Create a Lambda integration
    const integration = new HttpLambdaIntegration('LambdaIntegration', props.lambdafunction);

    // const throttleSettings: ThrottleSettings ={
    //     rateLimit: 10,
    //     burstLimit: 2,
    // };

    // Define a stage for the API Gateway
    // this.api.addStage(`${id}WebhookStage`, {
    //     stageName: props.stageName || 'prod',
    //     autoDeploy: true,
    //     throttle: throttleSettings
    // });

    // Define a route for POST requests
    this.api.addRoutes({
        path: `/${props.version}/webhook`,
        methods: [HttpMethod.POST],
        integration: integration,
    });
  }
}
