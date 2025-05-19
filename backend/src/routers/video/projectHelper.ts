import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  PutObjectCommandInput,
  ListObjectsV2Command
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PrismaClient, Project } from '@/clients/prisma';
import config from '@/utils/config.js';
import { existsSync, promises } from "fs";
import { identifierGenerator } from "@/lib/idGenerator";

const prisma = new PrismaClient();

const s3 = new S3Client({
  region: config.S3_REGION,
  credentials: {
    accessKeyId: config.S3_ACCESS,
    secretAccessKey: config.S3_SECRET
  }
});

async function getDbUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { clerk_user_id: userId },
    });
    if (!user) {
      throw new Error(`User not found with User ID: ${userId}`);
    }
    return user;
}

async function getDbProject(jobId: string) {
  const project = await prisma.project.findUnique({
    where: { job_id: jobId }
  })

  if (!project) throw new Error (`Project not found with Job ID: ${jobId}`)

  return project
}

export async function createProject(userId: string, jobId: string, file: File, thumbnail: File, title: string) {

  const blob = new Blob([await file.arrayBuffer()], { type: "video/mp4" });
  const newFile = new File([blob], file.name, { type: "video/mp4" });
  const newFileName = (newFile.name.endsWith(".mp4")) ? newFile.name : newFile.name.split(".")[0] + ".mp4"

  const form = new FormData()
  form.append("video", newFile)
  form.append("video_name", newFileName)
  form.append("job_id", jobId)

  const response = await fetch(`${config.MODEL_SERVER_URL}/api/video/upload/`, {
      method: "POST",
      body: form
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail)
  }

  const user = await prisma.user.findFirst({
    where: {clerk_user_id: userId}
  })

  if (!user) throw new Error("User does not exist")
  const projectIdentifier = identifierGenerator()

  const data = await prisma.project.create({
    data: { 
      user_id: user.id,
      job_id: jobId,
      status: "processing",
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
  const info = await s3.send(command)

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
      CacheControl: "3600"
    };
    const command = new GetObjectCommand(params)
    const url = await getSignedUrl(s3, command, {expiresIn: 3600})
    return {
      identifier: project.identifier,
      jobId: project.job_id,
      status: project.status,
      thumbnail: url,
      title: project.title,

    }
  }

  const data = await Promise.all(response.map((res) => getProjectData(res)))
  return data
}

export async function updateProjectStatus(jobId: string, status: string) {
  const data = await prisma.project.update({
    where: { 
      job_id: jobId 
    },
    data: {
      status
    }
  })
  const url = `${config.FRONTEND_SERVER_URL}/dashboard/clips/${data.identifier}` as string
  const user = await prisma.user.findUnique({ where: {id: data.user_id}})
  return { url, clerk_id: user?.clerk_user_id as string  }
}

export async function uploadToProject(files: File[], jobId: string) {
  const project = await getDbProject(jobId)
  const user = await prisma.user.findUnique({ where: { id: project.user_id }})

  if (!user) throw new Error("User not found")

  async function addFile(file: File) {
    const fileName = file.name.replace(/ /g, "_");
    const s3Key = `${user!.clerk_user_id}/${project.identifier}/clips/${fileName}`;

    const buffer = await file.arrayBuffer();
    const arrayBuffer = new Uint8Array(buffer);
  
    const params: PutObjectCommandInput = {
      Bucket: config.S3_BUCKET,
      Key: s3Key,
      Body: arrayBuffer,
      ContentType: file.type,
      CacheControl: "3600",
      Metadata: {
        "aspect_ratio": "16:9"
      }
    };
  
    const command = new PutObjectCommand(params);
    await s3.send(command);
  
    await prisma.video.create({
      data: {
        name: fileName,
        user_id: user!.id,
        project_id: project.id
      }
    });

    const videoUrl = `https://${config.S3_BUCKET}.s3.${config.S3_REGION}.amazonaws.com/${s3Key}`;
    return videoUrl
  }

  const results = await Promise.all(files.map((file) => addFile(file)))
  return results
}

export async function deleteProject(userId: string , identifier: string) {
  const s3Key = `${userId}/${identifier}/`;
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
