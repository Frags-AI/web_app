import { youtubeThumbnail, youtubeVideo, youtubeTitle } from "@/lib/video/youtube";
import path = require("path");

const outputFolder = path.join(__dirname, "../../../static", "videos")

export const getYoutubeVideo = async (link: string, userId: string) => {
  const data = await youtubeVideo(link, userId)
  return data
}

export const getYoutubeThumbnail = async (link: string, userId: string) => {
  const data = await youtubeThumbnail(link, userId)
  return data
}

export const getYoutubeTitle = async (link: string) => {
  const data = await youtubeTitle(link)
  return data
}