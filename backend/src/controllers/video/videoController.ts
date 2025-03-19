import express, { Request, Response } from 'express';
import multer from 'multer';
import { clerkClient, requireAuth } from '@clerk/express';
import { uploadVideo, getVideo, deleteVideo, getAllVideos } from './videoHelper.js';
import logger from '../../utils/logger.js';

const videoRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

videoRouter.use(requireAuth());

interface AuthRequest extends Request {
  auth: {
    userId: string,
  },
  file?: Express.Multer.File
}

videoRouter.post('/', upload.single('file'), async (req: Request, res: Response) => {

  const request = req as AuthRequest;
  const response = res as Response;

  try {
    if (!request.file) {
      logger.error("Video file is missing in the request"); 
      response.status(400).json({ error: "No video file provided." });
      return
    }

    const user = await clerkClient.users.getUser(request.auth.userId);
    const videoUrl = await uploadVideo(user, request.file as Express.Multer.File);
    logger.info("Video uploaded:", videoUrl);
    response.status(200).json({ message: `Uploaded video to ${videoUrl}` });
    return
  } catch (error: any) {
    logger.error("Error in video upload:", error.message);
    response.status(500).json({ error: error.message });
    return
  }
});

videoRouter.get("/", async (req: Request, res: Response) => {

  const request = req as AuthRequest;
  const response = res as Response;

  try {
    const user = await clerkClient.users.getUser(request.auth.userId);
    const videos = await getAllVideos(user);
    response.status(200).json({ videos });
  } catch (error: any) {
    logger.error("Error fetching videos:", error.message);
    response.status(500).json({ error: error.message });
  }
});

videoRouter.get("/:name", async (req: Request, res: Response) => {

  const request = req as AuthRequest;
  const response = res as Response;

  try {
    const user = await clerkClient.users.getUser(request.auth.userId);
    const video = await getVideo(user, request.params.name);
    if (!video) {
      response.status(404).json({ error: "Video not found" });
    }
    response.status(200).json({ video });
  } catch (error: any) {
    logger.error("Error fetching video:", error.message);
    response.status(500).json({ error: error.message });
  }
});

videoRouter.delete("/:name", async (req: Request, res: Response) => {

  const request = req as AuthRequest;
  const response = res as Response;

  try {
    const user = await clerkClient.users.getUser(request.auth.userId);
    await deleteVideo(user, request.params.name);
    response.status(200).json({ message: "Video deleted successfully" });
  } catch (error: any) {
    logger.error("Error deleting video:", error.message);
    response.status(500).json({ error: error.message });
  }
});

export default videoRouter;
