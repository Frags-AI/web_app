import { google } from "googleapis";
import config from "@/utils/config";

const OAuth2Client = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECERET,
    config.GOOGLE_REDIRECT_URI
)

export const googleYoutubeClient = google.youtube({
    version: "v3",
    auth: OAuth2Client
})

export const googleDriveClient = google.drive({
    version: "v2",
    auth: OAuth2Client
})