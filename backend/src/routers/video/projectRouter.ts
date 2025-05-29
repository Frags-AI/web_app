import { Hono } from "hono";
import { createProject, uploadToProject, getAllProjects, updateProjectStatus, deleteProject } from "./projectHelper";
import { getAuth } from "@hono/clerk-auth";
import clerkClient from "@/clients/clerk";
import config from "@/utils/config";
import { clipsReadyNotification } from "@/lib/resend";
import { generateThumbnailFromBuffer } from "@/lib/video/thumbnail";

export const projectRouter = new Hono()

projectRouter.get("", async (c) => {
    const userId = getAuth(c)?.userId

    if (!userId) return c.json({ message: "User is not authorized" }, 401)

    const data = await getAllProjects(userId)

    return c.json(data, 200)
})

projectRouter.post("/create", async (c) => {
    const userId = getAuth(c)?.userId
    if (!userId) return c.json({ message: "User is not authorized" }, 401)

    const body = await c.req.parseBody()
    const jobId = body.jobId as string
    const file = body.file as File
    let thumbnail = body.thumbnail as File | null
    const title = body.title as string

    if (!thumbnail) {
        const thumbnailBlob = await generateThumbnailFromBuffer(Buffer.from(await file.arrayBuffer()), userId)
        if (!thumbnailBlob) return c.json({message: "Could not create thumbnail"}, 400)
        thumbnail = new File([thumbnailBlob], "project_thumbnail.png", {type: "image/png"})
    }

    const response = await createProject(userId, jobId, file, thumbnail, title)
    
    return c.json(response, 200)
})

projectRouter.post("/upload", async (c) => {
    const body = await c.req.parseBody({ all: true })
    const headers = c.req.header()
    
    if (headers["model_signing_secret"] !== config.MODEL_SIGNING_SECRET) return c.json({ message: "Request is not authorized"}, 401)

    const clips = body["files"] as File[]
    const jobId = body["job_id"] as string
    const status = body["status"] as string

    await uploadToProject(clips, jobId)
    const data = await updateProjectStatus(jobId, status)
    const user = await clerkClient.users.getUser(data.clerk_id)
    await clipsReadyNotification(user.primaryEmailAddress?.emailAddress as string, data.url)
    
    return c.json({ message: "Video clips has been successfully uploaded" }, 200)
})

projectRouter.post("/delete", async (c) => {
    const userId = getAuth(c)?.userId

    if (!userId) return c.json({message: "User is not authorzied"}, 401)

    const body = await c.req.json()
    const identifer = body.identifier as string

    await deleteProject(userId, identifer)
    
    return c.json({message: "Project has been successfully deleted"}, 200)
})

projectRouter.post("/testing", async (c) => {
    const auth = getAuth(c)
    const user = await clerkClient.users.getUser(auth?.userId as string)
    clipsReadyNotification(user.primaryEmailAddress?.emailAddress as string, "https://www.youtube.com/watch?v=X9hZt1IRxe8")
    return c.json({success: 'asdfasfdf'}, 200)
})