import { Hono } from "hono";
import { youtubeRouter } from "./youtubeRouter";

export const OAuthRouter = new Hono()

OAuthRouter.route("/youtube", youtubeRouter)