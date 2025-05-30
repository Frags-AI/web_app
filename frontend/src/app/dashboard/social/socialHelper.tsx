import axios from "axios"

export async function getPlatforms (token: string) {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/social`, {headers: {Authorization: `Bearer ${token}`}})
    return response.data
}

export async function addPlatformProvider (token: string, provider: string) {
    if (provider === "YouTube") {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/oauth/youtube`, 
            {
                headers: {Authorization: `Bearer ${token}`},
                params: {
                    clientURL: window.location.href
                }
            }
        )
        return response.data
    }
}