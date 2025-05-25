import { Hono } from "hono";
import { getAuth } from "@hono/clerk-auth";
import { getYoutubeVideo, getYoutubeThumbnail, getYoutubeTitle } from "./youtubeHelper";


export const youtubeRouter = new Hono()

youtubeRouter.post("/download", async (c) => {
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