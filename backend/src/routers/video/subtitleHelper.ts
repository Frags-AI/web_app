import axios from "axios"
import FormData from "form-data"
import config from "@/utils/config"
import { prisma } from "@/clients/db"

export const addSubtitlesToClip = async (link: string) => {
    const linkResponse = await axios.get(link, {responseType: "arraybuffer"})
    const linkBuffer = Buffer.from(linkResponse.data as ArrayBuffer)
    
    const form = new FormData()
    form.append("file", linkBuffer, {
        filename: "video.mp4",
        contentType:"video/mp4"
    })

    const response = await axios.post(
        `${config.MODEL_SERVER_URL}/api/subtitles/clip`,
        form,
        {headers: form.getHeaders()}
    )

    const taskId = response.data.task_id

    const data = await prisma.video.updateMany({
        where: {task_id: taskId},
        data: { status: "PROGRESS"}
    })

    return data
}