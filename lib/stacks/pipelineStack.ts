import { Stack, StackProps } from "aws-cdk-lib";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";

export interface PipelineStackProps extends StackProps {

};

export class PipelineStack extends Stack {
    constructor(scope: Construct, id: string, props: PipelineStackProps) {
        super(scope, id, props);

        new CodePipeline(this, 'Pipeline', {
            pipelineName: 'LoganJasinPersonalWebsitePipeline',
            synth: new ShellStep('Synth', {
                // Where the source can be found
                input: CodePipelineSource.gitHub('ljasin48/LoganJasinPersonalWebsiteCDK', 'main'),

                // Install dependencies, build, and run cdk synth
                commands: [
                  'npm ci',
                  'npm run build',
                  'npx cdk synth'
                ],
              }),
        })
    }
}