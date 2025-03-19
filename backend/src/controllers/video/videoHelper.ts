import { S3Client, 
  PutObjectCommand, 
  ListObjectsV2Command,
  GetObjectCommand, 
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import logger from '../../utils/logger.js';
import config from '../../utils/config.js';
import { User } from "@clerk/express";

const s3 = new S3Client({
  region: config.S3_REGION,
  credentials: {
    accessKeyId: config.S3_ACCESS,
    secretAccessKey: config.S3_SECRET
  }
})

export const uploadVideo = async (user: User, videoFile: Express.Multer.File) => {
  if (!videoFile) {
    logger.error("Video file is missing in the request");
    throw new Error("No video file provided.");
  }
  const baseKey = `${user.id}/uploads/${videoFile.originalname.replace(/ /g, "_")}`

  const params = {
    Bucket: config.S3_BUCKET,
    Key: baseKey,
    Body: videoFile.buffer,
    ContentType: videoFile.mimetype,
    CacheControl: "3600"
  }

  const command = new PutObjectCommand(params)

  await s3.send(command)

  const videoUrl = `https://${config.S3_BUCKET}.s3.${config.S3_REGION}.amazonaws.com/${baseKey}`;
  return videoUrl

};

export const getAllVideos = async (user: User) => {
  
  const params = {
    Bucket: config.S3_BUCKET,
    Key: `${user.id}/uploads/`,
  }

  const command = new ListObjectsV2Command(params)

  const { Contents: videos } = await s3.send(command)

  return videos;
};

export const getVideo = async (user: User, videoName: string) => {
  const params = {
    Bucket: config.S3_BUCKET,
    Key: `${user.id}/uploads/${videoName}`
  };

  const command = new GetObjectCommand(params);
  const {Body, ContentType} = await s3.send(command);
  return { Body, ContentType };
};

export const deleteVideo = async (user: User, videoName: string) => {
  const key = `${user.id}/uploads/${videoName}`;
  const params = {
    Bucket: config.S3_BUCKET,
    Key: key
  };

  const command = new DeleteObjectCommand(params);
  await s3.send(command);
};
