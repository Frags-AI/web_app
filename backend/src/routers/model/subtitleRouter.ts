import { Hono } from "hono";
import { updateVideoSubtitles } from "./subtitleHelper";

export const subtitleRouter = new Hono()

subtitleRouter.post("", async (c) => {
    const body = await c.req.parseBody({ all: true })

    const taskId = body.task_id as string
    const files = body.files as (string | File)[]
    const state = body.state as string

    const response = await updateVideoSubtitles(files[0] as File, taskId, state)
    
    return c.json({message: "Successfully processed video"}, 200)
})