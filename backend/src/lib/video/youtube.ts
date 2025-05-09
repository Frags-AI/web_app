import { spawn } from "child_process";
import { promises } from "fs";

/**
 * Converts a YouTube video to MP4 and returns it as a Blob.
 * @param link The YouTube video link to download.
 * @param outputFolder The folder where the video will be temporarily saved.
 * @param videoName (Optional) The output video file name. Defaults to "output".
 * @returns A Promise that resolves to an object containing the video Blob.
 */
export async function youtubeVideo(
  link: string,
  outputFolder: string,
  name = "output"
): Promise<Record<string, Buffer<ArrayBufferLike>>> {

  if (link.includes("&list")) {
    link = link.substring(0, link.indexOf("&list"));
  } if (name.includes(".")) {
    name = name.substring(0, name.indexOf("."))
  }

  const outputPath = "static/videos/" + name + ".%(ext)s"

  const process = spawn("yt-dlp", [
    // "--cookies-from-browser", "chrome",
    "-f", "bestvideo+bestaudio",
    "--merge-output-format", "mp4",
    "-o", outputPath, link
  ]);

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
          const videoPath = outputFolder + "/" + name + ".mp4"
          const fileBuffer = await promises.readFile(videoPath);
          const video = fileBuffer
          await promises.unlink(videoPath)
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
 * Converts a YouTube video to JPG (thumbnail) and returns it as a Blob.
 * @param link The YouTube video link to download.
 * @param outputFolder The folder where the video will be temporarily saved.
 * @param videoName (Optional) The output video file name. Defaults to "output".
 * @returns A Promise that resolves to an object containing the thumbnail Blob.
 */
export async function youtubeThumbnail(
  link: string,
  outputFolder: string,
  name = "output"
): Promise<Record<string, Buffer<ArrayBufferLike>>> {

  if (link.includes("&list")) {
    link = link.substring(0, link.indexOf("&list"));
  } if (name.includes(".")) {
    name = name.substring(0, name.indexOf("."))
  }

  const outputPath = "static/videos/" + name + ".%(ext)s"

  const process = spawn("yt-dlp", [
    // "--cookies-from-browser", "chrome", 
    "--skip-download",
    "--write-thumbnail", "--convert-thumbnails",
    "jpg", "-o", outputPath, link
  ]);

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
          const thumbnailPath = outputFolder + "/" + name + ".jpg"
          const fileBuffer = await promises.readFile(thumbnailPath);
          const thumbnail = fileBuffer
          await promises.unlink(thumbnailPath)
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
 * Converts a YouTube video to JPG (thumbnail) and returns it as a Blob.
 * @param link The YouTube video link to download.
 * @param outputFolder The folder where the video will be temporarily saved.
 * @param videoName (Optional) The output video file name. Defaults to "output".
 * @returns A Promise that resolves to an object containing the thumbnail Blob.
 */
export async function youtubeTitle(
  link: string,
  outputFolder: string,
  name = "output"
): Promise<Record<string, Buffer<ArrayBufferLike>>> {

  if (link.includes("&list")) {
    link = link.substring(0, link.indexOf("&list"));
  } if (name.includes(".")) {
    name = name.substring(0, name.indexOf("."))
  }

  const outputPath = "static/videos/" + name + ".%(ext)s"

  const process = spawn("yt-dlp", [
    // "--cookies-from-browser", "chrome", 
    "--skip-download",
    "--write-thumbnail", "--convert-thumbnails",
    "jpg", "-o", outputPath, link
  ]);

  return new Promise((resolve, reject) => {
    process.on("error", (err) => {
      reject(new Error(`Process error: ${err.message}`));
    });

    process.stderr.on("data", (data) => {
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
          const thumbnailPath = outputFolder + "/" + name + ".jpg"
          const fileBuffer = await promises.readFile(thumbnailPath);
          const thumbnail = fileBuffer
          await promises.unlink(thumbnailPath)
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