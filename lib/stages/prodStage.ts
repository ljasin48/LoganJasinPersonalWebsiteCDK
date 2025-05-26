import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ServiceStack } from '../stacks/serviceStack';

export interface ProdStageProps extends StageProps {
  readonly githubConnectionArn: string;
}

export class ProdStage extends Stage {
  constructor(scope: Construct, id: string, props: ProdStageProps) {
    super(scope, id, props);

    new ServiceStack(this, 'ServiceStack', {
      stackName: 'LoganJasinPersonalWebsite-ServiceStack',
      description: "Service stack for Logan Jasin's personal website",
      githubConnectionArn: props.githubConnectionArn,
    });
  }
}
