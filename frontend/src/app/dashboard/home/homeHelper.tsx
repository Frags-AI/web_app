import axios, { AxiosRequestConfig } from "axios";
import { toast } from "sonner";

const baseSocketURL = `${import.meta.env.VITE_SOCKET_URL}/ws/status/`

export async function getProjects(token: string) {

    const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/video/project`,
        config
    )
    const data = response.data

    return data
}

export async function deleteProject(token: string, identifier: string) {
    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/video/project/delete`,
        { identifier },
        {headers: {Authorization: `Bearer ${token}`}}
    )

    const data = response.data
    return data
}

type SetProgressProps = (motionProgress: number, clippingProgress: number) => void

export async function trackProgress(onProgress: SetProgressProps, jobId: string) {
    const connectionURL = baseSocketURL + jobId
    const socket = new WebSocket(connectionURL)

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        
        if (data.type === "progress") {
            const clippingProgress = data.clip_progress as number
            const motionProgress = data.motion_progress as number
            onProgress(motionProgress, clippingProgress)
        } else if (data.type === "connection") {
            data.ok ? toast.success(data.message) : toast.error(data.message)
        }
    }
}