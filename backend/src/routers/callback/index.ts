import { Hono } from "hono";
import { youtubeRouter } from "./youtubeRouter";

export const callbackRouter = new Hono()

callbackRouter.route("/youtube", youtubeRouter)