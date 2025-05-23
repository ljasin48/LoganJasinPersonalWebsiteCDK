#!/opt/homebrew/opt/node/bin/node
import { App } from 'aws-cdk-lib';
import { ServiceStack } from './stacks/serviceStack';

const app = new App();

new ServiceStack(app, 'ServiceStack', {
  stackName: 'ServiceStack',
  description: 'Service stack for Logan Jasin\'s personal website',
});