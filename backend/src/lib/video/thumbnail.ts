import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);
const staticDir = path.join(process.cwd(), "static", "thumbnail");

export async function generateThumbnailFromBuffer(videoBuffer: Buffer, userId: string): Promise<Buffer | null> {
  const userDir = path.join(staticDir, userId)
  await fs.mkdir(userDir, { recursive: true })
  const inputPath = path.join(userDir, "input.mp4");
  const outputPath = path.join(userDir, "thumbnail.png");

  try {
    await fs.writeFile(inputPath, videoBuffer);

    const command = `ffmpeg -y -i "${inputPath}" -ss 00:00:01.000 -vframes 1 "${outputPath}"`;
    await execAsync(command);

    const data = await fs.readFile(outputPath);
    await fs.rm(userDir, { force: true, recursive: true })
    return data;
  } catch (err) {
    console.error("Error generating thumbnail:", err);
    return null;
  }
}