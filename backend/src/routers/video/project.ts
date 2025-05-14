import { Hono } from "hono";
import { createProject, uploadToProject, getAllProjects, updateProjectStatus } from "./projectHelper";
import { getAuth } from "@hono/clerk-auth";
import clerkClient from "@/clients/clerk";
import config from "@/utils/config";
import { ClipsReadyNotification } from "@/lib/resend";

export const projectRouter = new Hono()

projectRouter.get("", async (c) => {
    const userId = getAuth(c)?.userId

    if (!userId) return c.json({ message: "User is not authorized" }, 401)

    const data = await getAllProjects(userId)

    return c.json(data, 200)
})

projectRouter.post("/create", async(c) => {
    const userId = getAuth(c)?.userId
    if (!userId) return c.json({ message: "User is not authorized" }, 401)

    const body = await c.req.parseBody()
    const jobId = body.jobId as string
    const file = body.file as File
    const thumbnail = body.thumbnail as File
    const title = body.title as string
    
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
    ClipsReadyNotification(user.primaryEmailAddress?.emailAddress as string, data.url)

    
    return c.json({ message: "Video clips has been successfully uploaded" }, 200)
})