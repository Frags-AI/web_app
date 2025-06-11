import { s3 } from "@/clients/aws";
import { PutObjectCommandInput, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "@/utils/config";

export async function updateVideoData(s3Key: string, buffer: Buffer) {

    const params: PutObjectCommandInput = {
        Key: s3Key,
        Body: new Uint8Array(buffer),
        Bucket: config.S3_BUCKET
    }

    const command = new PutObjectCommand(params)
    const response = await s3.send(command)
    return response
}