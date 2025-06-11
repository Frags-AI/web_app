import { Hono } from "hono"
import { getAuth } from "@hono/clerk-auth"
import { ratioConverter } from "./aspectHelper"
import { updateVideoClip } from "./projectHelper"

export const aspectRouter = new Hono()

aspectRouter.post("", async (c) => {
  const userId = getAuth(c)?.userId

  if (!userId) return c.json({message: "User is not authorized"})

  const body = await c.req.json()
  const ratio = body.ratio as string
  const identifier = body.identifier as string
  const title = body.title as string
  const link = body.link as string
  const metadata = {"aspect_ratio": ratio}
  
  const videoBuffer = await ratioConverter(ratio, link)

  if (!videoBuffer) return c.json({"message": "Failed to convert video"}, 400)
    
  // const url = await updateVideoClip(userId, videoBuffer, identifier, title, metadata)
  // const data = {link: url, aspectRatio: ratio}

  // return c.json(data)
  return c.json({"message": "Success"})
})