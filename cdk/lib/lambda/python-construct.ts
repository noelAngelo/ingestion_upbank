import { Duration } from "aws-cdk-lib";
import { IRole } from "aws-cdk-lib/aws-iam";
import { Runtime, Function, Code } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { resolve } from "path";

export interface PythonLambdaProps {
  readonly handler: string;
  readonly codePath: string;
  readonly runtime: Runtime;
  readonly environment: { [key: string]: string };
  readonly timeout?: Duration;
  readonly memorySize?: number;
  readonly role: IRole;
}

export class PythonLambda extends Construct {
  public readonly lambdaFunction: Function;

  constructor(scope: Construct, id: string, props: PythonLambdaProps) {
    super(scope, id);

    this.lambdaFunction = new Function(this, `${id}Lambda`, {
      runtime: props.runtime,
      handler: props.handler,
      code: Code.fromAsset(resolve(props.codePath)),
      environment: props.environment,
      timeout: props.timeout || Duration.seconds(30),
      memorySize: props.memorySize || 128,
      role: props.role,
    });
  }
}
