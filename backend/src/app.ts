import { Hono } from "hono";
import { cors } from "hono/cors";
import { clerkMiddleware } from "@hono/clerk-auth";
import { bodyLimit } from "hono/body-limit"
import { logger } from "hono/logger";
import serverRouter from "@/routers/server-status";
import config from "./utils/config";
import videoRouter from "@/routers/video";
import stripeRouter from "@/routers/stripe";
import clerkRouter from "@/routers/clerk";
import { OAuthRouter } from "@/routers/oauth";
import { callbackRouter } from "./routers/callback";
import { socialMediaRouter } from "./routers/social-media";
import { modelRouter } from "./routers/model";
import clipAnythingRouter from "./routers/clip-anything";
import aiServicesRouter from "./routers/ai-services";

const app = new Hono()

// app.use(cors({
//   origin: config.ALLOWED_ORIGINS,
//   credentials: true
// }))

app.use(cors())

// Increase body limit for large video uploads (1GB)
app.use(bodyLimit({
  maxSize: 1024 * 1024 * 1024 // 1GB in bytes
}))

app.use(clerkMiddleware())
app.use(logger())

app.route("/api/clerk", clerkRouter)
app.route("/api/video", videoRouter)
app.route("/api/stripe", stripeRouter)
app.route("/api/oauth", OAuthRouter)
app.route("/api/callback", callbackRouter)
app.route("/api/social", socialMediaRouter)
app.route("/api/model", modelRouter)
app.route("/api/clip_anything", clipAnythingRouter)
app.route("/api/ai", aiServicesRouter)

// Proxy route for thumbnails from Python backend
app.get("/thumbnails/*", async (c) => {
  const path = c.req.path.replace("/thumbnails/", "");
  const aiServiceUrl = process.env.MODEL_SERVER_URL || process.env.HOST_NAME || process.env.PYTHON_AI_SERVICE_URL || "http://localhost:8000";
  const thumbnailUrl = `${aiServiceUrl}/thumbnails/${path}`;
  
  try {
    const response = await fetch(thumbnailUrl);
    if (!response.ok) {
      return c.json({ error: "Thumbnail not found" }, 404);
    }
    
    const imageBuffer = await response.arrayBuffer();
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Thumbnail proxy error:', error);
    return c.json({ error: "Failed to fetch thumbnail" }, 500);
  }
});

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
