import { Hono } from "hono";
import { getAuth } from "@hono/clerk-auth";
import { uploadVideo, getVideo, getAllVideos, deleteVideo, getYoutubeVideo, getYoutubeThumbnail } from "./videoHelper";
import { modelRouter } from "./model";

const videoRouter = new Hono();

videoRouter.post("/", async (c) => {
    const userId = getAuth(c)?.userId;

    if (!userId) {
        return c.json({ message: "User is not authorized" }, 401);
    }   

    const body = await c.req.parseBody();
    const file = body["file"] as File;

    if (!file) {
        return c.json({ error: "No video file provided." }, 400);
    }

    const videoUrl = await uploadVideo(userId, file);
    return c.json({ message: `Uploaded video to ${videoUrl}` }, 200);
})

videoRouter.get("/", async (c) => {
    const userId = getAuth(c)?.userId;

    if (!userId) {
        return c.json({ message: "User is not authorized" }, 401);
    } 

    const videoUrl = await getAllVideos(userId);
    return c.json({ message: `Uploaded video to ${videoUrl}` }, 200);
})

videoRouter.get("/:name", async (c) => {
    const userId = getAuth(c)?.userId;

    if (!userId) {
        return c.json({ message: "User is not authorized" }, 401);
    } 

    const videoUrl = await getVideo(userId, c.req.param("name"));
    return c.json({ message: `Uploaded video to ${videoUrl}` }, 200);
})

videoRouter.get("/:name", async (c) => {
    const userId = getAuth(c)?.userId;

    if (!userId) {
        return c.json({ message: "User is not authorized" }, 401);
    } 

    await deleteVideo(userId, c.req.param("name"));
    return c.json({ message: "Video deleted successfully" }, 200);
})

videoRouter.post("/youtube", async (c) => {
    const body = await c.req.json();
    const youtubeLink = body["link"] as string;
    let data;
  
    if (body.type === "video") {
      const res = await getYoutubeVideo(youtubeLink);
      data = res.file
      c.header("Content-Type", "video/mp4")
    } else {
      const res = await getYoutubeThumbnail(youtubeLink);
      data = res.file
      c.header("Content-Type", "image/png")
    }
    c.header("Content-Length", data.length.toString())

    return c.body(data, 200)
});

videoRouter.route("/model", modelRouter)

export default videoRouter