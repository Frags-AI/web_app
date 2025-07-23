import { Hono } from "hono";
import { getAuth } from "@hono/clerk-auth";
import { bodyLimit } from "hono/body-limit";
import axios from "axios";

const aiServicesRouter = new Hono();

// Apply body limit specifically for large file uploads
aiServicesRouter.use(bodyLimit({
  maxSize: 1024 * 1024 * 1024 // 1GB in bytes
}));

// Script generation endpoint
aiServicesRouter.post("/script-generation", async (c) => {
  try {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json({ status: "error", message: "Authentication required" }, 401);
    }

    const body = await c.req.json();
    const { topic, tone = "informative", duration = 60 } = body;

    if (!topic) {
      return c.json({ status: "error", message: "Topic is required" }, 400);
    }

    console.log(`Generating script for topic: "${topic}", tone: "${tone}", duration: ${duration}s`);

    // Get AI service URL from environment or use default
    const aiServiceUrl = process.env.MODEL_SERVER_URL || process.env.HOST_NAME || process.env.PYTHON_AI_SERVICE_URL || "http://localhost:8000";
    console.log(`Using AI service URL: ${aiServiceUrl}`);
    
    try {
      // Call the Python AI service
      const response = await axios.post(
        `${aiServiceUrl}/api/script/generate/`,
        {
          topic: topic.trim(),
          tone,
          duration
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 300000, // 5 minute timeout for longer scripts
        }
      );

      console.log(`Received response from AI service with status ${response.status}`);
      
      return c.json({
        status: "success",
        data: response.data
      });

    } catch (aiServiceError: any) {
      console.error("AI Service Error:", aiServiceError);
      
      if (aiServiceError?.response) {
        const statusCode = aiServiceError.response?.status || 500;
        const errorMessage = aiServiceError.response?.data?.message || aiServiceError.message;
        
        return c.json({
          status: "error",
          message: `AI service error: ${errorMessage}`
        }, statusCode);
      }
      
      throw aiServiceError;
    }

  } catch (error) {
    console.error("Error in script generation endpoint:", error);
    
    return c.json({
      status: "error",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }, 500);
  }
});

// Background generation endpoint
aiServicesRouter.post("/background-generation", async (c) => {
  try {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json({ status: "error", message: "Authentication required" }, 401);
    }

    const body = await c.req.json();
    const { prompt, style = "realistic", aspectRatio = "16:9" } = body;

    if (!prompt) {
      return c.json({ status: "error", message: "Prompt is required" }, 400);
    }

    console.log(`Generating background with prompt: "${prompt}"`);

    // Get AI service URL from environment or use default
    const aiServiceUrl = process.env.MODEL_SERVER_URL || process.env.HOST_NAME || process.env.PYTHON_AI_SERVICE_URL || "http://localhost:8000";
    
    try {
      // Call the Python AI service
      const formData = new URLSearchParams();
      formData.append('prompt', prompt.trim());
      formData.append('width', '1920');
      formData.append('height', '1080');
      formData.append('style', style || 'realistic');
      
      const response = await axios.post(
        `${aiServiceUrl}/api/background/generate/`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 120000, // 2 minute timeout for image generation
        }
      );

      console.log(`Received response from AI service with status ${response.status}`);
      
      return c.json({
        status: "success",
        data: response.data
      });

    } catch (aiServiceError: any) {
      console.error("AI Service Error:", aiServiceError);
      
      if (aiServiceError?.response) {
        const statusCode = aiServiceError.response?.status || 500;
        const errorMessage = aiServiceError.response?.data?.message || aiServiceError.message;
        
        return c.json({
          status: "error",
          message: `AI service error: ${errorMessage}`
        }, statusCode);
      }
      
      throw aiServiceError;
    }

  } catch (error) {
    console.error("Error in background generation endpoint:", error);
    
    return c.json({
      status: "error",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }, 500);
  }
});

// Transcription endpoint with increased body limit for large video files
aiServicesRouter.post("/transcription", 
  bodyLimit({ maxSize: 2 * 1024 * 1024 * 1024 }), // 2GB limit for transcription
  async (c) => {
  try {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json({ status: "error", message: "Authentication required" }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;
    const includeTimestamps = formData.get("include_timestamps") === "true";

    if (!file) {
      return c.json({ status: "error", message: "No file uploaded" }, 400);
    }

    console.log(`Processing transcription for file: ${file.name}`);

    // Get AI service URL from environment or use default
    const aiServiceUrl = process.env.MODEL_SERVER_URL || process.env.HOST_NAME || process.env.PYTHON_AI_SERVICE_URL || "http://localhost:8000";
    
    try {
      // Create form data for the AI service
      const aiFormData = new FormData();
      const buffer = await file.arrayBuffer();
      const blob = new Blob([buffer], { type: file.type });
      aiFormData.append("file", blob, file.name);
      aiFormData.append("include_timestamps", includeTimestamps.toString());

      // Call the Python AI service
      const response = await axios.post(
        `${aiServiceUrl}/api/transcription/transcribe/`,
        aiFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 900000, // 15 minute timeout for large video transcription
        }
      );

      console.log(`Received response from AI service with status ${response.status}`);
      
      return c.json({
        status: "success",
        data: response.data
      });

    } catch (aiServiceError: any) {
      console.error("AI Service Error:", aiServiceError);
      
      if (aiServiceError?.response) {
        const statusCode = aiServiceError.response?.status || 500;
        const errorMessage = aiServiceError.response?.data?.message || aiServiceError.message;
        
        return c.json({
          status: "error",
          message: `AI service error: ${errorMessage}`
        }, statusCode);
      }
      
      throw aiServiceError;
    }

  } catch (error) {
    console.error("Error in transcription endpoint:", error);
    
    return c.json({
      status: "error",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }, 500);
  }
});

// Voiceover generation endpoint
aiServicesRouter.post("/voiceover-generation", async (c) => {
  try {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json({ status: "error", message: "Authentication required" }, 401);
    }

    const body = await c.req.json();
    const { text, voice = "default", speed = 1.0 } = body;

    if (!text) {
      return c.json({ status: "error", message: "Text is required" }, 400);
    }

    console.log(`Generating voiceover for text: "${text.substring(0, 50)}..."`);

    // Get AI service URL from environment or use default
    const aiServiceUrl = process.env.MODEL_SERVER_URL || process.env.HOST_NAME || process.env.PYTHON_AI_SERVICE_URL || "http://localhost:8000";
    
    try {
      // Call the Python AI service
      const formData = new URLSearchParams();
      formData.append('text', text.trim());
      formData.append('voice', voice || 'Jessica');
      
      const response = await axios.post(
        `${aiServiceUrl}/api/voiceover/generate/`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 120000, // 2 minute timeout for voiceover generation
        }
      );

      console.log(`Received response from AI service with status ${response.status}`);
      
      return c.json({
        status: "success",
        data: response.data
      });

    } catch (aiServiceError: any) {
      console.error("AI Service Error:", aiServiceError);
      
      if (aiServiceError?.response) {
        const statusCode = aiServiceError.response?.status || 500;
        const errorMessage = aiServiceError.response?.data?.message || aiServiceError.message;
        
        return c.json({
          status: "error",
          message: `AI service error: ${errorMessage}`
        }, statusCode);
      }
      
      throw aiServiceError;
    }

  } catch (error) {
    console.error("Error in voiceover generation endpoint:", error);
    
    return c.json({
      status: "error",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }, 500);
  }
});

export default aiServicesRouter;
