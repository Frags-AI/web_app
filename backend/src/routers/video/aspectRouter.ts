import { Hono } from "hono"
import { getAuth } from "@hono/clerk-auth"
import { ratioConverter, updateVideoClip } from "./aspectHelper"

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

  console.log(body)
  
  const videoBuffer = await ratioConverter(ratio, userId, link)

  if (!videoBuffer) return c.json({"message": "Failed to convert video"}, 400)

  const response = await updateVideoClip(userId, videoBuffer, identifier, title, metadata)
  console.log(response)

  if (!videoBuffer) {
    return c.json({message: "Invalid aspect ratio"}, 400)
  }

  return c.json({"message": "Converted video's aspect ratio"})
})