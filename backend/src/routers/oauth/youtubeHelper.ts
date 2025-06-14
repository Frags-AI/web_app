import { OAuth2Client } from "@/clients/google-clients";

export const generateYoutubeAuthURL = async (userId: string, clientURL: string) => {
    const url = OAuth2Client.generateAuthUrl({
        access_type: "offline",
          scope: [
            "https://www.googleapis.com/auth/youtube",
            "https://www.googleapis.com/auth/youtube.readonly",
            "https://www.googleapis.com/auth/youtube.upload",
            "openid",
            "email",
            "profile"
          ],
        prompt: "consent",
        state: JSON.stringify({ userId, clientURL  })
    })
    return url
}