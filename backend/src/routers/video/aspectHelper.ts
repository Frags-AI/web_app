import { convert16to9Ratio, convert1to1Ratio, convert9to16Ratio } from "@/lib/video/aspect-ratio";
import { promises } from "fs";
import config from "@/utils/config";
import { s3 } from "@/clients/aws";
import { 
    PutObjectCommand,
    PutObjectCommandInput 
} from "@aws-sdk/client-s3";


export async function ratioConverter(ratio: string, userId: string, link: string, name: string = "output") {
    const response = await fetch(link)
    const buffer = Buffer.from(await response.arrayBuffer())

    const userDir = `static/videos/${userId}`
    const inputPath = `${userDir}/${name}.mp4`
    const outputPath = `${userDir}/${name}_converted.mp4`

    await promises.mkdir(userDir, { recursive: true })
    await promises.writeFile(inputPath, buffer)

    let data

    if (ratio === "1:1") {
        data  = await convert1to1Ratio(inputPath, outputPath)
    } else if (ratio === "9:16") {
        data  = await convert9to16Ratio(inputPath, outputPath)
    } else if (ratio === "16:9") {
        data  = await convert16to9Ratio(inputPath, outputPath)
    }

    return data?.videoBuffer
}

export async function updateVideoClip(userId: string, videoBuffer: Buffer, identifier: string, title: string, metadata?: Record<string, string>) {
    const name = title.split(" ").map((word) => word.toLowerCase()).join("_")
    const s3Key = `${userId}/${identifier}/clips/${name}.mp4`
    console.log(s3Key)
    
    const params: PutObjectCommandInput = {
        Bucket: config.S3_BUCKET,
        Key: s3Key,
        Body: new Uint8Array(videoBuffer),
        Metadata: metadata ? metadata : {} 
    }

    const command = new PutObjectCommand(params)
    const response = await s3.send(command)

    return response
}