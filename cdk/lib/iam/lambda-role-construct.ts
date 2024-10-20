import {Role, ServicePrincipal, ManagedPolicy} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class LambdaExecutionRole extends Construct {
  public readonly role: Role;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.role = new Role(this, `${id}Role`, {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'),
      ],
    });
  }
}