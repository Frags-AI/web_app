import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand 
} from "@aws-sdk/client-s3";
import { PrismaClient } from '@prisma/client';
import { AuthObject } from '@clerk/express';
import config from '../../utils/config.js';

const prisma = new PrismaClient();

const s3 = new S3Client({
  region: config.S3_REGION,
  credentials: {
    accessKeyId: config.S3_ACCESS,
    secretAccessKey: config.S3_SECRET
  }
});

async function getLocalUser(clerkUserId: string) {
  const localUser = await prisma.user.findUnique({
    where: { clerk_user_id: clerkUserId },
  });
  if (!localUser) {
    throw new Error(`Local user not found for clerk_user_id: ${clerkUserId}`);
  }
  return localUser;
}

export const uploadVideo = async (auth: AuthObject, videoFile: Express.Multer.File) => {
  if (!auth.userId) {
    throw new Error('User not authenticated');
  }

  if (!videoFile) {
    throw new Error("No video file provided.");
  }

  const localUser = await getLocalUser(auth.userId);

  const fileName = videoFile.originalname.replace(/ /g, "_");
  const s3Key = `${localUser.clerk_user_id}/uploads/${fileName}`;

  const params = {
    Bucket: config.S3_BUCKET,
    Key: s3Key,
    Body: videoFile.buffer,
    ContentType: videoFile.mimetype,
    CacheControl: "3600"
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  await prisma.video.create({
    data: {
      name: fileName,
      userId: localUser.id,
    }
  });

  const videoUrl = `https://${config.S3_BUCKET}.s3.${config.S3_REGION}.amazonaws.com/${s3Key}`;
  return videoUrl;
};

export const getAllVideos = async (auth: AuthObject) => {
  if (!auth.userId) {
    throw new Error('User not authenticated');
  }
  
  const localUser = await getLocalUser(auth.userId);

  const videos = await prisma.video.findMany({
    where: { userId: localUser.id },
  });

  return videos;
};

export const getVideo = async (auth: AuthObject, videoName: string) => {
  if (!auth.userId) {
    throw new Error('User not authenticated');
  }

  const localUser = await getLocalUser(auth.userId);

  const video = await prisma.video.findFirst({
    where: {
      userId: localUser.id,
      name: videoName
    }
  });
  if (!video) {
    throw new Error("Video not found in database");
  }

  const params = {
    Bucket: config.S3_BUCKET,
    Key: `${localUser.id}/uploads/${videoName}`
  };

  const command = new GetObjectCommand(params);
  const s3Res = await s3.send(command);
  return s3Res;
};

export const deleteVideo = async (auth: AuthObject, videoName: string) => {
  if (!auth.userId) {
    throw new Error('User not authenticated');
  }
  
  const localUser = await getLocalUser(auth.userId);

  const video = await prisma.video.findFirst({
    where: {
      userId: localUser.id,
      name: videoName
    }
  });
  if (!video) {
    throw new Error("Video not found in database");
  }

  const params = {
    Bucket: config.S3_BUCKET,
    Key: `${localUser.id}/uploads/${videoName}`
  };

  const command = new DeleteObjectCommand(params);
  await s3.send(command);

  await prisma.video.delete({
    where: { id: video.id }
  });
  return { message: "Video deleted successfully" };
};
