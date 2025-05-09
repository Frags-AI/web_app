import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand 
} from "@aws-sdk/client-s3";
import { PrismaClient } from '@prisma/client';
import config from '@/utils/config.js';
import path = require("path");
import { youtubeThumbnail, youtubeVideo } from "@/lib/video/youtube";

const outputFolder = path.join(__dirname, "../../../static", "videos")

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
      throw new Error(`User not found for clerk_user_id: ${clerkUserId}`);
    }
    return localUser;
}

export const uploadVideo = async (userId: string, videoFile: File) => {

    const localUser = await getLocalUser(userId);
  
    const fileName = videoFile.name.replace(/ /g, "_");
    const s3Key = `${localUser.clerk_user_id}/uploads/${fileName}`;

    const buffer = await videoFile.arrayBuffer();
    const arrayBuffer = new Uint8Array(buffer);
  
    const params = {
      Bucket: config.S3_BUCKET,
      Key: s3Key,
      Body: arrayBuffer,
      ContentType: videoFile.type,
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

export const getAllVideos = async (userId: string) => {
 
    const localUser = await getLocalUser(userId);
  
    const videos = await prisma.video.findMany({
      where: { userId: localUser.id },
    });
  
    return videos;
  };
  
  export const getVideo = async (userId: string, videoName: string) => {
    if (userId) {
      throw new Error('User not authenticated');
    }
  
    const localUser = await getLocalUser(userId);
  
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
      Key: `${userId}/uploads/${videoName}`
    };
  
    const command = new GetObjectCommand(params);
    const s3Res = await s3.send(command);
    return s3Res;
  };
  
  export const deleteVideo = async (userId: string, videoName: string) => {

    const localUser = await getLocalUser(userId);
  
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
      Key: `${userId}/uploads/${videoName}`
    }
  
    const command = new DeleteObjectCommand(params);
    await s3.send(command)
  
    await prisma.video.delete({
      where: { id: video.id }
    })
    return { message: "Video deleted successfully" }
}

export const getYoutubeVideo = async (link: string) => {
  const data = await youtubeVideo(link, outputFolder)
  return data
}

export const getYoutubeThumbnail = async (link: string) => {
  const data = await youtubeThumbnail(link, outputFolder)
  return data
}
