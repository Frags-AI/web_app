import { spawn } from "child_process";
import { promises } from "fs";

/**
 * Converts a YouTube video to MP4 and returns it as a Blob.
 * @param inputPath The path to the video that's getting converted.
 * @param outputPath The path to the video that's been converted
 * @returns A Promise that resolves to an object containing the video Blob.
 */
export async function convert1to1Ratio(inputPath: string, outputPath: string) {
  const commands = [ "-y", "-i", inputPath, "-vf", "crop='if(gt(a,1),ih,iw)':'if(gt(a,1),ih,iw)',scale=720:720,setsar=1",
    "-c:a", "copy", outputPath
  ];
  
  const process = spawn("ffmpeg", commands)

  return new Promise<Record<string, Buffer>>((resolve, reject) => {
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
          const videoBuffer = await promises.readFile(outputPath)
          resolve({ videoBuffer });
        } catch (err) {
          reject(new Error(`File handling error: ${(err as Error).message}`));
        }
      } else {
        reject(new Error(`Process exited with code ${code}`))
      }
    });
  })
}

/**
 * Converts a YouTube video to MP4 and returns it as a Blob.
 * @param inputPath The path to the video that's getting converted.
 * @param outputPath The path to the video that's been converted
 * @returns A Promise that resolves to an object containing the video Blob.
 */
export async function convert9to16Ratio(inputPath: string, outputPath: string) {

  const commands = [ "-y", "-i", inputPath, "-vf", "scale=w='if(gt(a,9/16),720,-1)':h='if(gt(a,9/16),-1,1280)',pad=720:1280:(ow-iw)/2:(oh-ih)/2,setsar=1", 
    "-c:a", "copy", outputPath
  ];
  const process = spawn("ffmpeg", commands)

  return new Promise<Record<string, Buffer>>((resolve, reject) => {
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
          const videoBuffer = await promises.readFile(outputPath)
          resolve({ videoBuffer });
        } catch (err) {
          reject(new Error(`File handling error: ${(err as Error).message}`));
        }
      } else {
        reject(new Error(`Process exited with code ${code}`))
      }
    });
  })
}

/**
 * Converts a YouTube video to MP4 and returns it as a Blob.
 * @param inputPath The path to the video that's getting converted.
 * @param outputPath The path to the video that's been converted
 * @returns A Promise that resolves to an object containing the video Blob.
 */
export async function convert16to9Ratio(inputPath: string, outputPath: string) {

  const paddingCommands = [ "-y", "-i", inputPath, "-vf", "scale=w='if(gt(a,16/9),1280,-1)':h='if(gt(a,16/9),-1,720)',pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1", 
    "-c:a", "copy", outputPath
  ];

  const croppingCommands = [ "-y", "-i", inputPath, "-vf", "crop='if(gt(a,16/9),ih*16/9,iw)':'if(gt(a,16/9),ih,iw*9/16)',scale=1280:720,setsar=1",
    "-c:a", "copy", outputPath
  ];
  
  const process = spawn("ffmpeg", croppingCommands)

  return new Promise<Record<string, Buffer>>((resolve, reject) => {
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
          const videoBuffer = await promises.readFile(outputPath)
          resolve({ videoBuffer });
        } catch (err) {
          reject(new Error(`File handling error: ${(err as Error).message}`));
        }
      } else {
        reject(new Error(`Process exited with code ${code}`))
      }
    });
  })
}