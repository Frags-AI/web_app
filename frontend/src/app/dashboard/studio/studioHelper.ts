import axios from "axios";
import { io } from "socket.io-client";


export const uploadVideo = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/video`, 
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const data = response.data;
    return data;
}

export const uploadYoutube = async(link: string, token: string, onProgress?: (progress: { video: number; thumbnail: number }) => void) => {
    async function fetchYoutube(type: "video" | "image") {

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/video/youtube`,
          { link, type },
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "arraybuffer",
          }
        )
        const data = response.data
        const blob = new Blob([data])
        return blob

      } catch (error: any) {
        console.error(error)
        throw new Error("One or both downloads have failed")
      }
    }
    const [video, thumbnail] = await Promise.all([
        fetchYoutube("video"),
        fetchYoutube("image")
    ])
    
    return { video, thumbnail }
}