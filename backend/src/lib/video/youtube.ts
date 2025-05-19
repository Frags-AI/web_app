import { spawn, exec } from "child_process";
import { promises } from "fs";

// Consult and use exec to cut down on logging if not using web sockets for progress

/**
 * Converts a YouTube video to MP4 and returns it as a buffer.
 * @param link The YouTube video link to download.
 * @param id The Clerk ID of the user that sent the request. 
 * @param name (Optional) The output video file name. Defaults to "output".
 * @returns A Promise that resolves to an object containing the video buffer.
 */
export async function youtubeVideo(
  link: string,
  id: string,
  name = "output"
): Promise<Record<string, Buffer<ArrayBufferLike>>> {

  if (link.includes("&list")) {
    link = link.substring(0, link.indexOf("&list"));
  } if (name.includes(".")) {
    name = name.substring(0, name.indexOf("."))
  }

  const outputPath = `static/videos/${id}/` + name + ".%(ext)s"
  const command = ["--cookies-from-browser", "firefox", "-f", "bestvideo[height<=1080]+bestaudio", "--merge-output-format", "mp4", "-o", outputPath, link]

  const process = spawn("yt-dlp", command);

  return new Promise((resolve, reject) => {
    process.on("error", (err) => {
      reject(new Error(`Process error: ${err.message}`));
    });

    process.stderr.on("data", (data) => {
      const dataStr = data.toString()
      console.error(`stderr: ${data}`);
    });

    process.stdout.on("data", (data) => {
      const dataStr = data.toString();
      console.log(`stdout: ${dataStr}`);

      if (dataStr.includes("[download]") && dataStr.includes("%")) {
        try {
          const percentMatch = dataStr.match(/(\d+\.\d+)%/);
          if (percentMatch && percentMatch[1]) {
            const percent = parseFloat(percentMatch[1]);
          }
        } catch (err) {
          console.error("Error parsing progress:", err);
        }
      }
    });

    process.on("close", async (code) => {
      if (code === 0) {
        try {
          const videoPath = `static/videos/${id}/` + name + ".mp4"
          const fileBuffer = await promises.readFile(videoPath);
          const video = fileBuffer
          resolve({ file: video });
        } catch (err) {
          reject(new Error(`File handling error: ${(err as Error).message}`));
        }
      } else {
        reject(new Error(`Process exited with code ${code}`))
      }
    });
  });
}

/**
 * Converts a YouTube video to JPG (thumbnail) and returns it as a buffer.
 * @param link The YouTube video link to download.
 * @param id The Clerk ID of the user that sent the request.
 * @param name (Optional) The output video file name. Defaults to "output".
 * @returns A Promise that resolves to an object containing the thumbnail buffer.
 */
export async function youtubeThumbnail(
  link: string,
  id: string,
  name = "output"
): Promise<Record<string, Buffer<ArrayBufferLike>>> {

  if (link.includes("&list")) {
    link = link.substring(0, link.indexOf("&list"));
  } if (name.includes(".")) {
    name = name.substring(0, name.indexOf("."))
  }

  const outputPath = `static/videos/${id}/` + name + ".%(ext)s"
  const commands = ["--cookies-from-browser", "firefox", "--skip-download", "--write-thumbnail", "--convert-thumbnails", "jpg", "-o", outputPath, link]

  const process = spawn("yt-dlp", commands);

  return new Promise((resolve, reject) => {
    process.on("error", (err) => {
      reject(new Error(`Process error: ${err.message}`));
    });

    process.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    process.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    process.on("close", async (code) => {
      if (code === 0) {
        try {
          const thumbnailPath = `static/videos/${id}/` + name + ".jpg"
          const fileBuffer = await promises.readFile(thumbnailPath);
          const thumbnail = fileBuffer
          resolve({ file: thumbnail });
        } catch (err) {
          reject(new Error(`File handling error: ${(err as Error).message}`));
        }
      } else {
        reject(new Error(`Process exited with code ${code}`))
      }
    });
  });
}

/**
 * Grabs the video title of a YouTube link.
 * @param link The YouTube video link to download.
 * @returns A Promise that resolves to a string containing the video name.
 */
export function youtubeTitle(link: string): Promise<Record<string, string>> {
  
  if (link.includes("&list")) {
    link = link.substring(0, link.indexOf("&list"));
  }

  return new Promise((resolve, reject) => {
    exec(`yt-dlp --cookies-from-browser firefox --get-title "${link}"`, (error, stdout, stderr) => {
      if (error) return reject(stderr || error.message);
      resolve({ title: stdout.trim() });
    });
  });
  
}