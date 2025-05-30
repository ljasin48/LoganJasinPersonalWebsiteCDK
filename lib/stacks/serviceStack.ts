import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Distribution, PriceClass, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3StaticWebsiteOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { BuildSpec, LinuxBuildImage, PipelineProject } from 'aws-cdk-lib/aws-codebuild';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { CodeBuildAction, CodeStarConnectionsSourceAction, S3DeployAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { CfnConnection } from 'aws-cdk-lib/aws-codestarconnections';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { ENV } from '../config/environment';
import { GITHUB_BRANCH, GITHUB_OWNER, GITHUB_WEBSITE_REPO } from '../config/github';

export interface ServiceStackProps extends StackProps {}

export class ServiceStack extends Stack {
  constructor(scope: Construct, id: string, props: ServiceStackProps) {
    super(scope, id, props);

    // S3 bucket for static website hosting
    const websiteBucket = new Bucket(this, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS_ONLY,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // CloudFront distribution
    const distribution = new Distribution(this, 'Distribution', {
      domainNames: ['loganjasin.com'],
      certificate: Certificate.fromCertificateArn(
        this,
        'DomainCertificate',
        `arn:aws:acm:${ENV.region}:${ENV.account}:certificate/f0540dd4-d17f-4827-9e0f-8f9ebd9e89a2`
      ),
      defaultBehavior: {
        origin: new S3StaticWebsiteOrigin(websiteBucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
      priceClass: PriceClass.PRICE_CLASS_100,
    });

    // CodeBuild project for building the React app
    const buildProject = new PipelineProject(this, 'BuildProject', {
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            'runtime-versions': {
              nodejs: '18',
            },
            commands: ['npm install'],
          },
          build: {
            commands: ['npm run build'],
          },
        },
        artifacts: {
          'base-directory': 'build',
          files: ['**/*'],
        },
      }),
      environment: {
        buildImage: LinuxBuildImage.STANDARD_7_0,
      },
    });

    const sourceOutput = new Artifact();
    const buildOutput = new Artifact();
    const githubConnection = new CfnConnection(this, 'GitHubConnection', {
      connectionName: 'GitHubConnection',
      providerType: 'GitHub',
    });

    // Pipeline to deploy changes to the website
    new Pipeline(this, 'Pipeline', {
      pipelineName: 'LoganJasinPersonalWebsitePipeline',
      stages: [
        {
          stageName: 'Source',
          actions: [
            new CodeStarConnectionsSourceAction({
              actionName: GITHUB_WEBSITE_REPO,
              owner: GITHUB_OWNER,
              repo: GITHUB_WEBSITE_REPO,
              branch: GITHUB_BRANCH,
              connectionArn: githubConnection.ref,
              output: sourceOutput,
            }),
          ],
        },
        {
          stageName: 'Build',
          actions: [
            new CodeBuildAction({
              actionName: 'Website',
              project: buildProject,
              input: sourceOutput,
              outputs: [buildOutput],
            }),
          ],
        },
        {
          stageName: 'Deploy',
          actions: [
            new S3DeployAction({
              actionName: 'S3',
              input: buildOutput,
              bucket: websiteBucket,
              extract: true,
            }),
          ],
        },
      ],
    });

    // Grant CodeBuild permissions to write to S3
    websiteBucket.grantReadWrite(buildProject);

    // Output the CloudFront URL
    new CfnOutput(this, 'CloudFrontURL', {
      value: distribution.distributionDomainName,
      description: 'CloudFront Distribution URL',
    });
  }
}
