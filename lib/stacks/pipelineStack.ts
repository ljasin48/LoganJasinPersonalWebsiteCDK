import { Stack, StackProps } from 'aws-cdk-lib';
import { CfnConnection } from 'aws-cdk-lib/aws-codestarconnections';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';

export interface PipelineStackProps extends StackProps {}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const githubConnection = new CfnConnection(this, 'GitHubConnection', {
      connectionName: 'GitHubCDKConnection',
      providerType: 'GitHub',
    });

    new CodePipeline(this, 'Pipeline', {
      pipelineName: 'LoganJasinPersonalWebsitePipeline',
      synth: new ShellStep('Synth', {
        // Where the source can be found
        input: CodePipelineSource.connection('ljasin48/LoganJasinPersonalWebsiteCDK', 'main', {
          connectionArn: githubConnection.ref,
        }),

        // Install dependencies, build, and run cdk synth
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });
  }
}
