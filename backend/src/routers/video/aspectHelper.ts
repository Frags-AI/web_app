import config from "@/utils/config";
import { s3 } from "@/clients/aws";
import { 
    GetObjectCommand,
    GetObjectCommandInput,
    PutObjectCommand,
    PutObjectCommandInput 
} from "@aws-sdk/client-s3";
import FormData from "form-data";
import axios from "axios"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


export async function ratioConverter(ratio: string, link: string) {
    const videoResponse = await fetch(link)
    const buffer = Buffer.from(await videoResponse.arrayBuffer())

    const form = new FormData()
    form.append("file", buffer, {
        filename: "video.mp4",
        contentType: "video/mp4"
    })
    form.append("ratio", ratio)

    const response = await axios.post(
        `${config.MODEL_SERVER_URL}/api/aspect_ratio`,
        form,
        {headers: form.getHeaders(), responseType: "arraybuffer"},
    )

    return Buffer.isBuffer(response.data) ? response.data : null
}

export async function updateVideoClip(userId: string, videoBuffer: Buffer, identifier: string, title: string, metadata?: Record<string, string>) {
    const name = title.split(" ").map((word) => word.toLowerCase()).join("_")
    const s3Key = `${userId}/${identifier}/clips/${name}.mp4`
    console.log(s3Key)
    
    const putParams: PutObjectCommandInput = {
        Bucket: config.S3_BUCKET,
        Key: s3Key,
        Body: new Uint8Array(videoBuffer),
        Metadata: metadata ? metadata : {} 
    }
    const putCommand = new PutObjectCommand(putParams)
    const putResponse = await s3.send(putCommand)

    const getParams: GetObjectCommandInput = {
        Bucket: config.S3_BUCKET,
        Key: s3Key
    }
    const getCommand = new GetObjectCommand(getParams)
    const url = await getSignedUrl(s3, getCommand)

    return url
}