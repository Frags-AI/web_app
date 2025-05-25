import axios from "axios"

export async function createProject(token: string, jobId: string, file: File, thumbnail: File, title: string) {
    const formData = new FormData()
    formData.append("jobId", jobId),
    formData.append("file", file),
    formData.append("thumbnail", thumbnail)
    formData.append("title", title)

    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/video/project/create`,
        formData,
        {headers: {Authorization: `Bearer ${token}`}}
    )

    return response
}