import { Hono } from "hono";
import { getAuth } from "@hono/clerk-auth";
import { getYoutubeVideo, getYoutubeThumbnail, getYoutubeTitle, cleanYouTubeDownload } from "./projectHelper";
import { projectRouter } from "./project";
import { clipRouter } from "./clips";

const videoRouter = new Hono();

videoRouter.post("/youtube", async (c) => {
    const body = await c.req.json();
    const user = getAuth(c)
    const youtubeLink = body["link"] as string;
    let data;

    if (!user) return c.json({ message: "User is not authorized"}, 401)
  
    if (body.type === "video") {
      const res = await getYoutubeVideo(youtubeLink, user.userId as string);
      data = res.file
      c.header("Content-Type", "video/mp4")
    } else if (body.type === "title") {
      const res = await getYoutubeTitle(youtubeLink);
      c.header("Content-Type", "application/json")
      return c.json(res, 200)

    } else {
      const res = await getYoutubeThumbnail(youtubeLink, user.userId as string);
      data = res.file
      c.header("Content-Type", "image/png")
    }
    c.header("Content-Length", data.length.toString())

    return c.body(data, 200)
});

videoRouter.post("/clean", async (c) => {
  const userId = getAuth(c)?.userId as string
  
  await cleanYouTubeDownload(userId)

  return c.json({message: "Cleaned Up Folder"}, 200)
})

videoRouter.route("/project", projectRouter)
videoRouter.route("/clip", clipRouter)

export default videoRouter