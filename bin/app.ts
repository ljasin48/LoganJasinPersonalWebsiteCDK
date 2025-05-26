#!/opt/homebrew/opt/node/bin/node
import { App } from 'aws-cdk-lib';
import { ENV } from '../lib/config/environment';
import { PipelineStack } from '../lib/stacks/pipelineStack';

const app = new App();

new PipelineStack(app, 'PipelineStack', {
  stackName: 'LoganJasinPersonalWebsiteCDK-PipelineStack',
  description: 'Pipeline stack for LoganJasinPersonalWebsiteCDK GitHub repo',
  env: ENV,
});

app.synth();
