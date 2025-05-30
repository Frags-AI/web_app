import { getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { createDownloadPath, uploadToYouTube } from "./youtubeHelper";

export const youtubeRouter = new Hono()

// Upload to Channel
youtubeRouter.post("/upload", async (c) => {
  const userId = getAuth(c)?.userId

  if (!userId) return c.json({message: "User is not authorized"}, 401)

  const body = await c.req.json()

  const link = body.link as string
  const title = body.title as string
  const platformId = body.platformId as string

  const path = await createDownloadPath(title, link)
  const data = await uploadToYouTube(userId, title, path, platformId)

  return c.json({message: "Successfully uploaded to YouTube"})
})