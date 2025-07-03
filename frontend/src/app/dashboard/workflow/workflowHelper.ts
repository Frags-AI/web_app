import axios from "axios"

export async function createProject(token: string,  file: File, thumbnail: File, title: string, type: string, prompt: string) {
    const formData = new FormData()

    formData.append("file", file),
    thumbnail ? formData.append("thumbnail", thumbnail) : null
    formData.append("title", title)
    formData.append("type", type)
    prompt ? formData.append("prompt", prompt) : null

    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/video/project/create`,
        formData,
        {headers: {Authorization: `Bearer ${token}`}}
    )

    return response.data
}