import { OAuth2Client } from "@/clients/google-clients";
import { Hono } from "hono";
import { storeYoutubeToken } from "./youtubeHelper";

export const youtubeRouter = new Hono()

youtubeRouter.get("", async (c) => {
    
    const { code, state } = c.req.query()
    const { userId, clientURL } = JSON.parse(state as string)

    if (!code) return c.text("Missing code", 400)
    const { tokens } = await OAuth2Client.getToken(code)

    const response = await storeYoutubeToken(userId as string, tokens)
    return c.redirect(clientURL)
})
