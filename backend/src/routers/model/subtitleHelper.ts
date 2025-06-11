import { prisma } from "@/clients/db"
import { updateVideoData } from "./modelHelper"

export async function updateVideoSubtitles(file: File, taskId: string, state: string) {
    const dbRow = await prisma.video.findFirst({ where: { task_id: taskId } })

    if (!dbRow) throw new Error("Could not find video data")

    const data = await prisma.video.update({
        where: {id: dbRow.id},
        data: {status: state},
        include: {
            project: true,
            user: true
        }
    })

    const s3Key = `${data.user.clerk_user_id}/${data.project.identifier}/clips/${data.name}`
    const buffer = Buffer.from(await file.arrayBuffer())
    const response = await updateVideoData(s3Key, buffer)

}