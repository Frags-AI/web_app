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