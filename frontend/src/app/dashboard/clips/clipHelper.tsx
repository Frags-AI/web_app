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
        { headers: {Authorization: `Bearer ${token}`} }
    )
    return response.data
}

export async function handleSocialMediaUpload(provider: string, link: string, title: string, token: string) {
    if (provider === "youtube") {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/social/youtube`,
            { link, title },
            {headers: {Authorization: `Bearer ${token}`}}
        ).catch((err) => {
            throw new Error("Failed to upload video")
        })

        return "Successfully uploaded video to YouTube"
    }
}