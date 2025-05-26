import { Stack, StackProps } from 'aws-cdk-lib';
import { CfnConnection } from 'aws-cdk-lib/aws-codestarconnections';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { GITHUB_BRANCH, GITHUB_CDK_REPO, GITHUB_OWNER } from '../config/github';
import { ProdStage } from '../stages/prodStage';

export interface PipelineStackProps extends StackProps {}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const githubConnection = new CfnConnection(this, 'GitHubConnection', {
      connectionName: 'GitHubCDKConnection',
      providerType: 'GitHub',
    });

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'LoganJasinPersonalWebsitePipeline',
      synth: new ShellStep('Synth', {
        // Where the source can be found
        input: CodePipelineSource.connection(`${GITHUB_OWNER}/${GITHUB_CDK_REPO}`, GITHUB_BRANCH, {
          connectionArn: githubConnection.ref,
        }),

        // Install dependencies, build, and run cdk synth
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    pipeline.addStage(
      new ProdStage(this, 'ProdStage', {
        stageName: 'Prod',
        env: props.env,
      })
    );
  }
}
