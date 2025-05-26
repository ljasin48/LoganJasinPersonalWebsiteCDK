#!/opt/homebrew/opt/node/bin/node
import { App } from 'aws-cdk-lib';
import { PipelineStack } from '../lib/stacks/pipelineStack';

const ACCOUNT = '727218227335';
const REGION = 'us-east-1';

const app = new App();

new PipelineStack(app, 'PipelineStack', {
  stackName: 'LoganJasinPersonalWebsiteCDK-PipelineStack',
  description: 'Pipeline stack for LoganJasinPersonalWebsiteCDK GitHub repo',
  env: { account: ACCOUNT, region: REGION }
});

app.synth();
