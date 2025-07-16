import axios from "axios";
import { toast } from "sonner";

const baseSocketURL = `${import.meta.env.VITE_SOCKET_URL}/ws`

export async function getProjects(token: string) {

    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/video/project`,
        {headers: { Authorization: `Bearer ${token}` }}
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

type SetProgressProps = (currentProgress: number) => void;
type DisplayAlertProps = (state: string) => void;
interface WebsocketProgressProps {
    state: string
    progress: number
    stage: string
}

export async function checkStatus(token: string, taskId: string): Promise<"SUCCESS" | "FAILED" | "PROCESSING"> {
    const response = await axios.post<{status: "SUCCESS" | "FAILED" | "PROCESSING"}> (
        `${import.meta.env.VITE_API_URL}/api/video/project/status`,
        { taskId },
        {headers: {Authorization: `Bearer ${token}`}}
    )
    return response.data.status
}

export async function trackProgress(onProgress: SetProgressProps, taskId: string, displayAlert: DisplayAlertProps) {
    const connectionURL = `${baseSocketURL}/status/${taskId}`;
    const socket = new WebSocket(connectionURL);

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data) as WebsocketProgressProps;

        if (data.state === "PROGRESS") {
            onProgress(data.progress);
            displayAlert(data.stage)
        } else if (data.state === "SUCCESS") {
            onProgress(data.progress)
            toast.success(data.stage);
        } else if (data.state === "FAILURE") {
            onProgress(data.progress)
            toast.error(data.stage);
        }
    };

    socket.onerror = (event) => {
        toast.error(`WebSocket connection error`);
        socket.close()
    };

    socket.onclose = () => {
        console.log("WebSocket closed");
    };
}