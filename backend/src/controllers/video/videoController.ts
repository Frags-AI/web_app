import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { requireAuth, AuthObject } from '@clerk/express';
import { uploadVideo, getVideo, deleteVideo, getAllVideos } from './videoHelper.js';

const videoRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

videoRouter.use(requireAuth());

interface AuthRequest extends Request {
  auth: AuthObject,
  file?: Express.Multer.File
}

videoRouter.post('/', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
    const request = req as AuthRequest;
    try {
      if (!request.file) {
        res.status(400).json({ error: "No video file provided." });
        return;
      }
      const videoUrl = await uploadVideo(request.auth, request.file as Express.Multer.File);
      res.status(200).json({ message: `Uploaded video to ${videoUrl}` });
    } catch (error: any) {
      next(error);
    }
  }
);

videoRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const request = req as AuthRequest;
    try {
      const videos = await getAllVideos(request.auth);
      res.status(200).json({ videos });
    } catch (error: any) {
      next(error);
    }
  }
);

videoRouter.get("/:name", async (req: Request, res: Response, next: NextFunction) => {
    const request = req as AuthRequest;
    try {
      const video = await getVideo(request.auth, request.params.name);
      if (!video) {
        res.status(404).json({ error: "Video not found" });
        return;
      }
      res.status(200).json({ video });
    } catch (error: any) {
      next(error);
    }
  }
);

videoRouter.delete("/:name", async (req: Request, res: Response, next: NextFunction) => {
    const request = req as AuthRequest;
    try {
      await deleteVideo(request.auth, request.params.name);
      res.status(200).json({ message: "Video deleted successfully" });
    } catch (error: any) {
      next(error);
    }
  }
);

export default videoRouter;
