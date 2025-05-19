import { PrismaClient } from "@/clients/prisma"
import { 
    S3Client, 
    GetObjectCommand, 
    GetObjectRequest, 
    ListObjectsV2Command, 
    ListObjectsV2Request,
    HeadObjectCommand,
    HeadObjectCommandInput 
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "@/utils/config"

const prisma = new PrismaClient();

const s3 = new S3Client({
  region: config.S3_REGION,
  credentials: {
    accessKeyId: config.S3_ACCESS,
    secretAccessKey: config.S3_SECRET
  }
});

export const getClips = async (userId: string, identifier: string) => {
    const s3Key = `${userId}/${identifier}/clips`

    const params: ListObjectsV2Request  = {
        Bucket: config.S3_BUCKET,
        Prefix: s3Key
    }

    const command = new ListObjectsV2Command(params)
    const objects = (await s3.send(command)).Contents

    const getClip = async (videoKey: string) => {
        const params: GetObjectRequest = {
            Bucket: config.S3_BUCKET,
            Key: videoKey
        }

        const videoName = videoKey.substring(videoKey.lastIndexOf("/") + 1).replace(".mp4", "").split("_").map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        }).join(" ")

        const signedCommand = new GetObjectCommand(params)
        const URL = await getSignedUrl(s3, signedCommand, {expiresIn: 3600})

        const headCommand = new HeadObjectCommand(params)
        const headResponse = await s3.send(headCommand)
        const aspectRatio = headResponse?.Metadata?.["aspect_ratio"]


        const object = {
            title: videoName,
            link: URL,
            aspectRatio
        }

        return object
    }

    if (!objects) return []

    const promiseArray = await Promise.all(objects?.map((object) => getClip(object.Key as string)))
    
    return promiseArray
}