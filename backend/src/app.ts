import { Hono } from "hono";
import { cors } from "hono/cors";
import { clerkMiddleware } from "@hono/clerk-auth";
import { logger } from "hono/logger";
import serverRouter from "@/routers/server-status";
import videoRouter from "@/routers/video";
import stripeRouter from "@/routers/stripe";
import clerkRouter from "@/routers/clerk";

const app = new Hono()

app.use("/api/*", cors())
app.use(clerkMiddleware())
app.use(logger())

app.route("/api/clerk", clerkRouter)
app.route("/api/video", videoRouter)
app.route("/api/stripe", stripeRouter)
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
