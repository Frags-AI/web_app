import axios from "axios"

export async function getAllClips(token: string, identifier: string) {
    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/video/clip`, 
        {identifier},
        {headers: {Authorization: `Bearer ${token}`}, }
    )

    const data = response.data
    return data
}

export async function changeAspectRatio(token: string, identifier: string, ratio: string, link: string, title: string) {
    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/video/aspect`,
        { identifier, ratio, link, title },
        {headers: {Authorization: `Bearer ${token}`}}
    )
    return response.data
}