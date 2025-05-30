import { Hono } from "hono";
import { generateYoutubeAuthURL } from "./youtubeHelper";
import { getAuth } from "@hono/clerk-auth";

export const youtubeRouter = new Hono()

youtubeRouter.get("", async (c) => {
    const userId = getAuth(c)?.userId

    if (!userId) return c.json({message: "User is not authorized"})
    const clientURL = c.req.query("clientURL") as string

    const url = await generateYoutubeAuthURL(userId, clientURL)
    return c.json({url}, 200)
})