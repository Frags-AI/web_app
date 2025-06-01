import axios from "axios";


export async function addVideoSubtitles(token: string, link: string, title: string) {
    const response = await axios.post<{link: string, title: string}>(
        `${import.meta.env.VITE_API_URL}/api/video/subtitle`,
        {link, title},
        {headers: {Authorization: `Bearer ${token}`}}
    )

    return response.data
}