import { getAuth } from "@hono/clerk-auth";
import { addSubtitlesToClip } from "./subtitleHelper";
import { Hono } from "hono";
import { updateVideoClip } from "./projectHelper";

export const subtitleRouter = new Hono()

subtitleRouter.post("", async (c) => {
    const userId = getAuth(c)?.userId

    if (!userId) return c.json({message: "User is not authorized"}, 401)

    const body = await c.req.json()
    const link = body.link
    const title = body.title
    const identifier = body.identifier

    const videoBuffer = await addSubtitlesToClip(link)
    if (!videoBuffer) return c.json({message: "Failed to add subtitles to clip"}, 400)
    const url = await updateVideoClip(userId, videoBuffer, identifier, title)
    return c.json({link: url, title})
})