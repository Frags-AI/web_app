import { Hono } from "hono";
import { uploadToProject, updateProjectStatus } from "./projectHelper";
import clerkClient from "@/clients/clerk";
import { clipsReadyNotification } from "@/lib/resend";

export const projectRouter = new Hono()


projectRouter.post("", async (c) => {
    const body = await c.req.parseBody({ all: true })
    console.log(body)

    const clips = body["files"] as File[]
    const taskId = body["task_id"] as string
    const status = body["status"] as string

    await uploadToProject(clips, taskId)
    const data = await updateProjectStatus(taskId, status)
    const user = await clerkClient.users.getUser(data.clerk_id)
    await clipsReadyNotification(user.primaryEmailAddress?.emailAddress as string, data.url)
    
    return c.json({ message: "Video clips has been successfully uploaded" }, 200)
})