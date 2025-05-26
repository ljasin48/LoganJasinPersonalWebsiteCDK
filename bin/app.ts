#!/opt/homebrew/opt/node/bin/node
import { App, Environment } from 'aws-cdk-lib';
import { PipelineStack } from '../lib/stacks/pipelineStack';

export const ENV: Environment = {
  account: '727218227335',
  region: 'us-east-1',
};

const app = new App();

new PipelineStack(app, 'PipelineStack', {
  stackName: 'LoganJasinPersonalWebsiteCDK-PipelineStack',
  description: 'Pipeline stack for LoganJasinPersonalWebsiteCDK GitHub repo',
  env: ENV,
});

app.synth();
