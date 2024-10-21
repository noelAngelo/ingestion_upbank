import { Duration } from "aws-cdk-lib";
import { IRole } from "aws-cdk-lib/aws-iam";
import { Runtime, Function, Code, Tracing } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { resolve } from "path";

export interface PythonLambdaProps {
  readonly handler: string;
  readonly codePath: string;
  readonly runtime: Runtime;
  readonly environment?: { [key: string]: string };
  readonly timeout?: Duration;
  readonly memorySize?: number;
  readonly functionName?: string;
  readonly role: IRole;
}

export class PythonLambda extends Construct {
  public readonly lambdaFunction: Function;

  constructor(scope: Construct, id: string, props: PythonLambdaProps) {
    super(scope, id);

    const code = Code.fromAsset(resolve(__dirname, props.codePath));
    this.lambdaFunction = new Function(this, `${id}Lambda`, {
      functionName: props.functionName,
      runtime: props.runtime,
      handler: props.handler,
      code: code,
      environment: props.environment,
      timeout: props.timeout || Duration.seconds(30),
      memorySize: props.memorySize || 128,
      role: props.role,
      tracing: Tracing.ACTIVE,
    });
  }
}
