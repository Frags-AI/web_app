import { getAuth } from "@hono/clerk-auth"
import { Hono } from "hono"
import { getAllMediaPlatforms } from "./socialMediaHelper"
import { youtubeRouter } from "./youtubeRouter"

export const socialMediaRouter = new Hono()

socialMediaRouter.get("", async (c) => {
  const userId = getAuth(c)?.userId

  if (!userId) return c.json({message: "User is unauthorized"}, 401)

  const data = await getAllMediaPlatforms(userId)
  
  return c.json(data, 200)
})

socialMediaRouter.route("/youtube", youtubeRouter)
