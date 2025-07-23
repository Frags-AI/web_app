import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { authenticateUser } from '../../lib/auth/auth';

const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'media', 'uploads');
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueFilename);
    }
  }),
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP4, MOV, AVI, and MKV files are allowed.'));
    }
  }
});

// Ensure clips directory exists
const clipsDir = path.join(process.cwd(), 'media', 'uploads', 'clips');
if (!fs.existsSync(clipsDir)) {
  fs.mkdirSync(clipsDir, { recursive: true });
}

// Route for clip anything feature
router.post('/clip_video', authenticateUser, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No video file uploaded' });
    }

    const textPrompt = req.body.text_prompt;
    if (!textPrompt) {
      return res.status(400).json({ status: 'error', message: 'No text prompt provided' });
    }

    const maxClips = parseInt(req.body.max_clips) || 10;
    const videoPath = req.file.path;

    // Call the Python AI service
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    
    // Create FormData to send to Python service
    const formData = new FormData();
    formData.append('file', fs.createReadStream(videoPath));
    formData.append('text_prompt', textPrompt);
    formData.append('max_clips', maxClips.toString());

    // Call the Python service
    const response = await axios.post(`${aiServiceUrl}/api/clip_anything/clip_video/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Return the response from the Python service
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error in clip anything:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
});

export default router;
