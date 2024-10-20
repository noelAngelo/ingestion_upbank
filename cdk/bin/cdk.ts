#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ApiStack } from '../lib/stacks/api-stack';

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
});