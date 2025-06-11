import { prisma } from "@/clients/db"
import config from "@/utils/config"
import { s3 } from "@/clients/aws"
import { 
  PutObjectCommand,
  PutObjectCommandInput 
} from "@aws-sdk/client-s3"

async function getDbProject(taskId: string) {
  const project = await prisma.project.findFirst({
    where: { task_id: taskId }
  })

  if (!project) throw new Error (`Project not found with Task ID: ${taskId}`)

  return project
}

export async function updateProjectStatus(taskId: string, status: string) {
  const projectData = await prisma.project.findFirst({ where:  { task_id: taskId }})
  if (!projectData) throw new Error("Could not find project")

  const data = await prisma.project.update({
    where: { 
      id: projectData.id 
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