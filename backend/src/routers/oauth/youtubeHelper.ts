import { OAuth2Client } from "@/clients/google-clients";

export const generateYoutubeAuthURL = async (userId: string, clientURL: string) => {
    const url = OAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/youtube"],
        prompt: "consent",
        state: JSON.stringify({ userId, clientURL  })
    })
    return url
}