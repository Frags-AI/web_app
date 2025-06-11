import config from "@/utils/config";
import FormData from "form-data";
import axios from "axios"
import { convert16to9Ratio, convert9to16Ratio, convert1to1Ratio } from "@/lib/video/aspect-ratio";
import { promises } from "fs";
import path from "path";

const staticDir = path.join("static", "videos")

export async function ratioConverter(ratio: string, link: string, userId: string = "someusersdafasdfsfd") {

    const videoResponse = await fetch(link)
    const responseBuffer = Buffer.from(await videoResponse.arrayBuffer())

    // const form = new FormData()
    // form.append("file", buffer, {
    //     filename: "video.mp4",
    //     contentType: "video/mp4"
    // })
    // form.append("ratio", ratio)

    // const response = await axios.post(
    //     `${config.MODEL_SERVER_URL}/api/aspect_ratio`,
    //     form,
    //     {headers: form.getHeaders(), responseType: "arraybuffer"},
    // )
    // const buffer = Buffer.isBuffer(response.data) ? response.data : null

    const userDir = path.join(staticDir, userId)
    await promises.mkdir(userDir, {recursive: true})
    const inputPath = path.join(userDir, "video.mp4")
    const outputPath = path.join(userDir, "processed_video.mp4")
    await promises.writeFile(inputPath, responseBuffer)

    let buffer: Buffer | null = null

    if (ratio === "16:9") {
        buffer = await convert16to9Ratio(inputPath, outputPath)
    } else if (ratio === "9:16") {
        buffer = await convert9to16Ratio(inputPath, outputPath)
    } else if (ratio === "1:1") {
        buffer = await convert1to1Ratio(inputPath, outputPath)
    }
    return buffer
}
