import { Hono } from "hono";
import { cors } from "hono/cors";
import { clerkMiddleware } from "@hono/clerk-auth";
import { logger } from "hono/logger";
import serverRouter from "@/routers/server-status";
import config from "./utils/config";
import videoRouter from "@/routers/video";
import stripeRouter from "@/routers/stripe";
import clerkRouter from "@/routers/clerk";
import { OAuthRouter } from "@/routers/oauth";
import { callbackRouter } from "./routers/callback";
import { socialMediaRouter } from "./routers/social-media";

const app = new Hono()

app.use("*",cors({
    origin: config.ALLOWED_ORIGINS,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true
  })
)
app.use(clerkMiddleware())
app.use(logger())

app.route("/api/clerk", clerkRouter)
app.route("/api/video", videoRouter)
app.route("/api/stripe", stripeRouter)
app.route("/api/oauth", OAuthRouter)
app.route("/api/callback", callbackRouter)
app.route("/api/social", socialMediaRouter)
app.route("/api", serverRouter)

app.notFound((c) => {
    console.error("Unknown endpoint, please check your URL and try again.")
    return c.json({ error: "Unknown endpoint, please enter a valid URL" }, 404)
})

app.onError((err, c) => {
    console.error(err)
    return c.json({ error: "Internal Server Error", message: err.message, name: err.name}, 500)
})

export default app
