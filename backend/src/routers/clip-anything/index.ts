import { Hono } from "hono";
import { getAuth } from "@hono/clerk-auth";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import axios from "axios";

// Create clip anything router
const clipAnythingRouter = new Hono();

// Ensure upload directories exist
const ensureDirectoriesExist = () => {
  const uploadDir = path.join(process.cwd(), "media", "uploads");
  const clipsDir = path.join(process.cwd(), "media", "uploads", "clips");
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  if (!fs.existsSync(clipsDir)) {
    fs.mkdirSync(clipsDir, { recursive: true });
  }
};

ensureDirectoriesExist();

// Route for clip anything feature
clipAnythingRouter.post("/clip_video", async (c) => {
  try {
    // Check authentication
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json({ status: "error", message: "Authentication required" }, 401);
    }
    
    const userId = auth.userId;

    // Handle file upload manually
    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;
    const textPrompt = formData.get("text_prompt") as string;
    const maxClipsStr = formData.get("max_clips") as string;
    
    if (!file) {
      return c.json({ status: "error", message: "No video file uploaded" }, 400);
    }
    
    if (!textPrompt) {
      return c.json({ status: "error", message: "No text prompt provided" }, 400);
    }
    
    const maxClips = parseInt(maxClipsStr) || 10;
    
    // Save the file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "media", "uploads", fileName);
    
    fs.writeFileSync(filePath, buffer);
    
    // Create form data for AI service
    const aiFormData = new FormData();
    aiFormData.append("file", fs.createReadStream(filePath));
    aiFormData.append("text_prompt", textPrompt);
    aiFormData.append("max_clips", maxClips.toString());
    
    // Get AI service URL from environment or use default
    const aiServiceUrl = process.env.MODEL_SERVER_URL || "http://localhost:8000";
    
    console.log(`Sending request to AI service at ${aiServiceUrl}/api/clip_anything/clip_video/`);
    
    // Call the AI service using axios directly
    const response = await axios.post(
      `${aiServiceUrl}/api/clip_anything/clip_video/`,
      aiFormData,
      {
        headers: {
          ...aiFormData.getHeaders(),
        },
      }
    );
    
    console.log(`Received response from AI service with status ${response.status}`);
    
    // Return the response from the AI service
    return c.json(response.data);
    
  } catch (error) {
    console.error("Error in clip anything:", error);
    
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;
      
      console.error(`Axios error: ${statusCode} - ${errorMessage}`);
      
      return c.json({ 
        status: "error", 
        message: errorMessage 
      }, statusCode);
    }
    
    return c.json({ 
      status: "error", 
      message: error instanceof Error ? error.message : "An unknown error occurred" 
    }, 500);
  }
});

export default clipAnythingRouter;
