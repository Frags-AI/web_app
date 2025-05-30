import * as fs from "fs"
import { promises as fsPromises } from "fs"
import { OAuth2Client } from "@/clients/google-clients"
import { google } from "googleapis"
import { prisma } from "@/clients/db";
import { getOrRefreshGoogleAccessToken } from "@/utils/tokens"


async function getDbUser(userId: string) {
  return prisma.user.findFirst({
    where: { clerk_user_id: userId },
    include: {
      platforms: {
        include: { token: true },
      },
    },
  })
}

export async function createDownloadPath(title: string, link: string) {
  const response = await fetch(link)
  if (!response.ok) throw new Error("Failed to download video")

  const buffer = Buffer.from(await response.arrayBuffer())
  const name = title.replace(/\s+/g, "_").replace(/[^\w\-]/g, "")
  const videoPath = `static/videos/${name}.mp4`

  await fsPromises.writeFile(videoPath, buffer)

  return videoPath
}

export async function uploadToYouTube(userId: string, title: string, filePath: string, platformId: string) {
  const user = await getDbUser(userId)
  if (!user) throw new Error("User not found")

  const platform = await prisma.platform.findUnique({where: { id: platformId }})

  if (!platform) throw new Error("Failed to get platform")
  
  const token = await getOrRefreshGoogleAccessToken(platform.id)

  OAuth2Client.setCredentials({
    access_token: token
  })

  const youtube = google.youtube({
    auth: OAuth2Client,
    version: "v3"
  })

  const res = await youtube.videos.insert({
    auth: OAuth2Client,
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title,
        description: "Uploaded via the YouTube API",
        tags: ["gaming", "FPS"],
        categoryId: "22",
      },
      status: {
        privacyStatus: "public",
        madeForKids: false
      },
    },
    media: {
      body: fs.createReadStream(filePath),
    },
  })

  return res.data
}