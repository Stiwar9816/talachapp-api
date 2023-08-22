import * as AWS from 'aws-sdk';

const s3Client = new AWS.S3({
  endpoint: process.env.BUCKET_ENDPOINT,
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
  },
});

export { s3Client };
