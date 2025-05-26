import { Stack, StackProps } from 'aws-cdk-lib';
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import { Construct } from 'constructs';

export class ServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // new Repository(this, 'WebsiteRepository', {
    //   repositoryName: 'LoganJasinWebsite',
    //   description: 'Repository for LoganJasinWebsite',
    // });

    // new Repository(this, 'WebsiteCDKRepository', {
    //   repositoryName: 'LoganJasinWebsiteCDK',
    //   description: 'Repository for LoganJasinWebsiteCDK',
    // });
  }
}
