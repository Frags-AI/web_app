import config from "@/utils/config";
import FormData from "form-data";
import axios from "axios"


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
