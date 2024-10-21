#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ApiStack } from '../lib/stacks/api-stack';
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as path from 'path';

const app = new cdk.App();

// Apply tags to the entire CDK app
cdk.Tags.of(app).add('Project', 'PersonalFinance');
cdk.Tags.of(app).add('Process', 'Ingestion');
cdk.Tags.of(app).add('DataSource', 'UpBank');

// Deploy API stack
const apiStack = new ApiStack(app, 'ApiStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  handler: 'index.handler',
  codePath: path.join(__dirname, '..', '..', 'app', 'lambda', 'webhook'),
  layerPath: path.join(__dirname, '..', '..', 'app', 'lambda', 'layer', 'python'),
  environment: {
    'SECRET_UPBANK_API': '/prod/key/upbank/api',
    'SECRET_UPBANK_WEBHOOK': '/prod/key/upbank/webhook',
  },
  runtime: Runtime.PYTHON_3_12,
  pythonVersion: '312',
});