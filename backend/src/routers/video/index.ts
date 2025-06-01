import { Hono } from "hono";
import { getAuth } from "@hono/clerk-auth";
import { cleanMediaDownloads } from "./projectHelper";
import { projectRouter } from "./projectRouter";
import { clipRouter } from "./clipRouter";
import { youtubeRouter } from "./youtubeRouter";
import { aspectRouter } from "./aspectRouter";
import { subtitleRouter } from "./subtitleRouter";

const videoRouter = new Hono();

videoRouter.post("/clean", async (c) => {
  const userId = getAuth(c)?.userId as string
  
  await cleanMediaDownloads(userId)

  return c.json({message: "Cleaned Up Folder"}, 200)
})

videoRouter.route("/project", projectRouter)
videoRouter.route("/youtube", youtubeRouter)
videoRouter.route("/clip", clipRouter)
videoRouter.route("/aspect", aspectRouter)
videoRouter.route("/subtitle", subtitleRouter)

export default videoRouter