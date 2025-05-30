import * as fs from "fs"
import { promises as fsPromises } from "fs"
import { OAuth2Client } from "@/clients/google-clients"
import { google } from "googleapis"
import { PrismaClient } from "../../clients/prisma"
import { getOrRefreshGoogleAccessToken } from "@/utils/tokens"

const prisma = new PrismaClient()

const youtube = google.youtube("v3")

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

export async function getYouTubeChannels(platformId: string) {

  const token = await getOrRefreshGoogleAccessToken(platformId)
  OAuth2Client.setCredentials({ access_token: token })

  const youtube = google.youtube({
    auth: OAuth2Client,
    version: "v3"
  })

  const channelResponse = (await youtube.channels.list({
    part: ["snippet"],
    mine: true
  })).data

  const channels = channelResponse?.items?.map((channel) => {
    return {
      title: channel.snippet?.title,
      description: channel.snippet?.title,
      id: channel.id
    }
  })
  return channels
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

export async function uploadToYouTube(userId: string, title: string, filePath: string) {
  const user = await getDbUser(userId)
  if (!user) throw new Error("User not found")

  const youtubePlatform = user.platforms.find(p => p.provider === "youtube")
  if (!youtubePlatform || !youtubePlatform.token) {
    throw new Error("YouTube platform or token not found for this user")
  }

  const { access_token, refresh_token, expiry_date, token_type } = youtubePlatform.token

  OAuth2Client.setCredentials({
    access_token,
    refresh_token,
    expiry_date: expiry_date?.getTime(),
    token_type
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