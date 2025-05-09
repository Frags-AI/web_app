import { Hono } from "hono";

export const modelRouter = new Hono()

modelRouter.post("",  async (c) => {
    const body = await c.req.parseBody({ all: true })
    console.log(body)

    return c.json({ message: "Video has been successfully processed" })
})