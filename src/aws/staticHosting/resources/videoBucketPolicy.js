import ref from 'root/src/aws/util/ref'
import {
	VIDEO_BUCKET_POLICY, VIDEO_BUCKET,
} from 'root/src/aws/staticHosting/resourceIds'

export default {
	[VIDEO_BUCKET_POLICY]: {
		Type: 'AWS::S3::BucketPolicy',
		Properties: {
			PolicyDocument: {
				Id: 'SiteBucketPolicy',
				Version: '2012-10-17',
				Statement: [
					{
						Sid: 'PublicReadForGetBucketObjects',
						Effect: 'Allow',
						Principal: '*',
						Action: 's3:GetObject',
						Resource: {
							'Fn::Join': [
								'',
								[
									'arn:aws:s3:::',
									ref(VIDEO_BUCKET),
									'/*',
								],
							],
						},
					},
				],
			},
			Bucket: ref(VIDEO_BUCKET),
		},
	},
}
