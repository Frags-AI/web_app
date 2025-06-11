import { 
  PutObjectCommand, 
  GetObjectCommand, 
  GetObjectCommandInput,
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  PutObjectCommandInput,
  ListObjectsV2Command
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PrismaClient, Project } from "../../clients/prisma";
import config from '@/utils/config.js';
import { existsSync, promises } from "fs";
import { identifierGenerator } from "@/lib/idGenerator";
import { s3 } from "@/clients/aws";
import FormData from "form-data";
import axios from "axios";

const prisma = new PrismaClient();

async function getDbUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { clerk_user_id: userId },
    });
    if (!user) {
      throw new Error(`User not found with User ID: ${userId}`);
    }
    return user;
}

export async function createProject(userId: string, file: File, thumbnail: File, title: string) {

  const fileBuffer =  Buffer.from(await file.arrayBuffer());
  const fileName = title.toLowerCase().replaceAll(" ", "_") + ".mp4"

  const form = new FormData()
  form.append("video", fileBuffer, {
    filename: fileName,
    contentType: "video/mp4"
  })

  const response = await axios.post(
    `${config.MODEL_SERVER_URL}/api/video/upload/`,
    form,
    {headers: form.getHeaders()}
  )

  if (response.status >= 400) {
    throw new Error(response.data.detail)
  }

  const responseData: {task_id: string, video_name: string, url: string} = response.data

  const user = await prisma.user.findFirst({
    where: {clerk_user_id: userId}
  })

  if (!user) throw new Error("User does not exist")
  const projectIdentifier = identifierGenerator()

  const data = await prisma.project.create({
    data: { 
      user_id: user.id,
      task_id: responseData.task_id,
      status: "PROCESSING",
      identifier: projectIdentifier,
      title: title
    }
  })

  const s3Key = `${userId}/${data.identifier}/${thumbnail.name}`
  const params = {
    Bucket: config.S3_BUCKET,
    Key: s3Key,
    Body: new Uint8Array(await thumbnail.arrayBuffer()),
    ContentType: thumbnail.type,
    CacheControl: "3600"
  };
  const command = new PutObjectCommand(params)
  await s3.send(command)

  return data
}

export async function getAllProjects(userId: string) {
  const user = await getDbUser(userId)

  const response = await prisma.project.findMany({
    where: { user_id: user.id }
  })

  const getProjectData = async (project: Project) => {
    const s3Key = `${userId}/${project.identifier}/project_thumbnail.png`
    const params = {
      Bucket: config.S3_BUCKET,
      Key: s3Key,
    };
    const command = new GetObjectCommand(params)
    const url = await getSignedUrl(s3, command, {expiresIn: 3600})
    return {
      identifier: project.identifier,
      taskId: project.task_id,
      status: project.status,
      thumbnail: url,
      title: project.title,
      createdAt: project.created_at

    }
  }

  const data = await Promise.all(response.map((res) => getProjectData(res)))
  return data
}

export async function deleteProject(userId: string , identifier: string) {
  const s3Key = `${userId}/${identifier}`;
  console.log(s3Key)

  const listCommand = new ListObjectsV2Command({
    Bucket: config.S3_BUCKET,
    Prefix: s3Key
  })

  const objects = await s3.send(listCommand)

  if (!objects.Contents || objects.Contents.length === 0) {
    console.log("No files to delete")
    return
  }

  const params: DeleteObjectsCommandInput = {
    Bucket: config.S3_BUCKET,
    Delete: {
      Objects: objects.Contents.map(obj => ({Key: obj.Key})),
      Quiet: true
    }
  }

  const deleteCommand = new DeleteObjectsCommand(params)
  const response = await s3.send(deleteCommand)

  const data = await prisma.project.findFirst({
    where: {
      identifier: identifier
    }
  })

  if (!data) throw new Error("Could not find project to delete")

  await prisma.project.delete({
    where: {
      id: data?.id
    }
  })

  return response
}

export const cleanMediaDownloads = async (userId: string) => {
  if (existsSync(`static/videos/${userId}`)) {
    await promises.rm(`static/videos/${userId}`, {recursive: true, force: true})
  }
}

export async function updateVideoClip(userId: string, videoBuffer: Buffer, identifier: string, title: string, metadata?: Record<string, string>) {
    const name = title.split(" ").map((word) => word.toLowerCase()).join("_")
    const s3Key = `${userId}/${identifier}/clips/${name}.mp4`
    
    const putParams: PutObjectCommandInput = {
        Bucket: config.S3_BUCKET,
        Key: s3Key,
        Body: new Uint8Array(videoBuffer),
        Metadata: metadata ? metadata : {} 
    }
    const putCommand = new PutObjectCommand(putParams)
    await s3.send(putCommand)

    const getParams: GetObjectCommandInput = {
        Bucket: config.S3_BUCKET,
        Key: s3Key
    }
    const getCommand = new GetObjectCommand(getParams)
    const url = await getSignedUrl(s3, getCommand)

    return url
}