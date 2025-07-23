import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);
const staticDir = path.join(process.cwd(), "static", "thumbnail");

export async function generateThumbnailFromBuffer(videoBuffer: Buffer, userId: string): Promise<Buffer | null> {
  const userDir = path.join(staticDir, `user_${userId}`);
  const timestamp = Date.now();
  const inputPath = path.join(userDir, `input_${timestamp}.mp4`);
  const outputPath = path.join(userDir, `thumbnail_${timestamp}.png`);

  try {
    // Create directory if it doesn't exist
    await fs.mkdir(userDir, { recursive: true });
    
    // Write video buffer to file
    await fs.writeFile(inputPath, videoBuffer);

    // Generate thumbnail using ffmpeg with software decoding (-c:v libaom-av1)
    const command = `ffmpeg -y -c:v libaom-av1 -i "${inputPath}" -ss 00:00:01.000 -vframes 1 "${outputPath}"`;
    await execAsync(command);

    // Read the thumbnail file
    const data = await fs.readFile(outputPath);
    
    // Clean up files individually with proper error handling
    try {
      // Close any file handles before attempting to delete
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to ensure file handles are released
      
      // Delete files individually instead of removing the entire directory
      await fs.unlink(outputPath).catch(err => console.warn(`Failed to delete thumbnail: ${err.message}`));
      await fs.unlink(inputPath).catch(err => console.warn(`Failed to delete input video: ${err.message}`));
    } catch (cleanupErr) {
      console.warn(`Cleanup warning: ${cleanupErr.message}`);
      // Continue even if cleanup fails - we already have the thumbnail data
    }

    return data;
  } catch (err) {
    console.error("Error generating thumbnail:", err);
    
    // Attempt cleanup on error
    try {
      if (await fs.stat(inputPath).catch(() => false)) {
        await fs.unlink(inputPath).catch(() => {});
      }
      if (await fs.stat(outputPath).catch(() => false)) {
        await fs.unlink(outputPath).catch(() => {});
      }
    } catch (cleanupErr) {
      console.warn(`Error cleanup failed: ${cleanupErr.message}`);
    }
    
    return null;
  }
}