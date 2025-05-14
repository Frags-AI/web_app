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
    async function fetchYoutube(type: "video" | "image" | "title") {

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/video/youtube`,
          { link, type },
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: type === "title" ? "json" : "arraybuffer",
          }
        )
        const data = response.data
        if (type === "title") {
          return data.title
        }
        const blob = new Blob([data])
        return blob

      } catch (error: any) {
        console.error(error)
        throw new Error(`Failed to fetch ${type}`)
      }
    }
    const [video, thumbnail, title] = await Promise.all([
        fetchYoutube("video") as Promise<Blob>,
        fetchYoutube("image") as Promise<Blob>,
        fetchYoutube("title") as Promise<string>,
    ])
    axios.post(`${import.meta.env.VITE_API_URL}/api/video/clean`, {data: null}, {headers: {Authorization: `Bearer ${token}`}})
    
    return { video, thumbnail, title }
}