import { Hono } from "hono";
import config from "@/utils/config";
import { subtitleRouter } from "./subtitleRouter";
import { projectRouter } from "./projectRouter";

export const modelRouter = new Hono()

modelRouter.use(async (c, next) => {
    const signingSecret =  c.req.header("model_signing_secret")

    if (!signingSecret) return c.json({error: "Missing model_signing_secret header"}, 401)

    if (signingSecret !== config.MODEL_SIGNING_SECRET) return c.json({error: "Invalid signing secret"}, 403)

    return await next()
})

modelRouter.route("/subtitles", subtitleRouter)
modelRouter.route("/project", projectRouter)