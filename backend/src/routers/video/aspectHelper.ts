import config from "@/utils/config";
import FormData from "form-data";
import axios from "axios"
import { prisma } from "@/clients/db";

export async function ratioConverter(ratio: string, link: string, id: string) {

    const videoResponse = await fetch(link)
    const responseBuffer = Buffer.from(await videoResponse.arrayBuffer())

    const form = new FormData()
    form.append("file", responseBuffer, {
        filename: "video.mp4",
        contentType: "video/mp4"
    })
    form.append("ratio", ratio)

    const response = await axios.post<{task_id: string, s3_url: string}>(
        `${config.MODEL_SERVER_URL}/api/aspect_ratio`,
        form,
        {headers: form.getHeaders()},
    )

    const taskId = response.data.task_id
    const video = await prisma.video.update({
        where: { id },
        data: { task_id: taskId }
    })
    return video
    
}
