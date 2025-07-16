import { Hono } from "hono";
import { createProject, getAllProjects, deleteProject, createPromptedProject, getProjectStatus } from "./projectHelper";
import { getAuth } from "@hono/clerk-auth";
import clerkClient from "@/clients/clerk";
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
    const file = body.file as File
    let thumbnail = body.thumbnail as File | null
    const title = body.title as string
    const type = body.type as string
    const prompt = body.prompt as string

    if (!thumbnail) {
        const thumbnailBlob = await generateThumbnailFromBuffer(Buffer.from(await file.arrayBuffer()), userId)
        if (!thumbnailBlob) return c.json({message: "Could not create thumbnail"}, 400)
        thumbnail = new File([thumbnailBlob], "project_thumbnail.png", {type: "image/png"})
    }

    let response;

    if (type === "Normal") response = await createProject(userId, file, thumbnail, title, type)
    else if (type === "Prompted") response = await createPromptedProject(userId, file, thumbnail, title, prompt, type) 
    
    return c.json(response, 200)
})

projectRouter.post("/delete", async (c) => {
    const userId = getAuth(c)?.userId

    if (!userId) return c.json({message: "User is not authorzied"}, 401)

    const body = await c.req.json()
    const identifer = body.identifier as string

    await deleteProject(userId, identifer)
    
    return c.json({message: "Project has been successfully deleted"}, 200)
})

projectRouter.post("/status", async (c) => {
    const userId = getAuth(c)?.userId

    if (!userId) return c.json({message: "User is not authorized"}, 401)

    const body = await c.req.json()
    const taskId = body.taskId

    const status = await getProjectStatus(taskId)

    return c.json({status}, 200)
})

projectRouter.post("/testing", async (c) => {
    const auth = getAuth(c)
    const user = await clerkClient.users.getUser(auth?.userId as string)
    clipsReadyNotification(user.primaryEmailAddress?.emailAddress as string, "https://www.youtube.com/watch?v=X9hZt1IRxe8")
    return c.json({success: 'asdfasfdf'}, 200)
})