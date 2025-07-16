import { Hono } from "hono"
import { getAuth } from "@hono/clerk-auth"
import { ratioConverter } from "./aspectHelper"

export const aspectRouter = new Hono()

aspectRouter.post("", async (c) => {
  const userId = getAuth(c)?.userId

  if (!userId) return c.json({message: "User is not authorized"})

  const body = await c.req.json()
  const ratio = body.ratio as string
  const link = body.link as string
  const id = body.id
  
  const video = await ratioConverter(ratio, link, id)

  return c.json({})
})