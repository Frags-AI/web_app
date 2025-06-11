import { getAuth } from "@hono/clerk-auth";
import { addSubtitlesToClip } from "./subtitleHelper";
import { Hono } from "hono";

export const subtitleRouter = new Hono()

subtitleRouter.post("", async (c) => {
    const userId = getAuth(c)?.userId

    if (!userId) return c.json({message: "User is not authorized"}, 401)

    const body = await c.req.json()
    const link = body.link

    const data = await addSubtitlesToClip(link)

    return c.json(data)
})