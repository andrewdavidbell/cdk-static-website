import cdk = require('@aws-cdk/core');
import s3 = require('@aws-cdk/aws-s3')
// import { RemovalPolicy } from '@aws-cdk/core';
import { CloudFrontWebDistribution, PriceClass } from '@aws-cdk/aws-cloudfront'

export class StaticWebsiteStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const contentBucket = new s3.Bucket(this, 'ContentBucket', {
      bucketName: 'static.andrewdavidbell.com',
      websiteIndexDocument: 'index.html',
      publicReadAccess: true
    });

    // const redirectBucket = new s3.Bucket(this, 'RedirectBucket', {
    //   bucketName: 'www.static.andrewdavidbell.com',
    //   websiteRedirect: {
    //     hostName: contentBucket.bucketName
    //   },
    //   removalPolicy: RemovalPolicy.DESTROY
    // });

    const arn = "arn:aws:acm:us-east-1:915070617609:certificate/68189f78-e61d-460b-a050-dd4e6fb39d82";

    const distribution = new CloudFrontWebDistribution(this, 'Distribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: contentBucket
          },
          behaviors: [{ isDefaultBehavior: true }],
        }
      ],
      aliasConfiguration: {
        acmCertRef: arn,
        names: [
          "static.andrewdavidbell.com",
          "www.static.andrewdavidbell.com"
        ]
      },
      priceClass: PriceClass.PRICE_CLASS_ALL
    });
  }
}
