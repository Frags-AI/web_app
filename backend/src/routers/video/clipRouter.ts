import { Hono } from "hono"
import { getAuth } from "@hono/clerk-auth"
import { getClips } from "./clipHelper"

export const clipRouter = new Hono()

clipRouter.post("", async (c) => {
    const auth = getAuth(c)

    if (!auth?.userId) return c.json({ message: "User is not authorized"}, 401)

    const body = await c.req.json()
    const identifier = body.identifier as string
    const userId = auth.userId as string

    const data = await getClips(userId, identifier)

    return c.json(data, 200)
})
