import { google } from "googleapis";
import config from "@/utils/config";

export const OAuth2Client = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECERET,
    config.GOOGLE_REDIRECT_URI
)

