import { prisma } from "@/clients/db";
import { s3 } from "@/clients/aws";
import { 
    GetObjectCommand, 
    GetObjectRequest, 
    ListObjectsV2Command, 
    ListObjectsV2Request,
    HeadObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "@/utils/config"

export const getClips = async (userId: string, identifier: string) => {

    const baseKey = `${userId}/${identifier}/clips`
    const clips = (await prisma.project.findFirst({
        where: { identifier },
        include: { videos: true}
    }))?.videos

    const getClip = async (videoKey: string, videoTitle: string, id: string) => {
        const params: GetObjectRequest = {
            Bucket: config.S3_BUCKET,
            Key: videoKey
        }

        const videoName = videoTitle.split("_").map((word) => {
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
            aspectRatio,
            id
        }

        return object
    }

    if (!clips) return []

    const promiseArray = await Promise.all(clips?.map((clip) => getClip(`${baseKey}/${clip.name}/main.mp4`, clip.name, clip.id)))
    
    return promiseArray
}