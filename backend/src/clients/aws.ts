import config from "@/utils/config";
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: config.S3_REGION,
  credentials: {
    accessKeyId: config.S3_ACCESS,
    secretAccessKey: config.S3_SECRET
  }
});