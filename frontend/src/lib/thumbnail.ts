export const generateVideoThumbnail = (file: File, maxWidth = 800, maxHeight = 600) => {
  return new Promise<string>((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      const video = document.createElement("video");

      // Set video properties
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true; // Better mobile support
      
      // Create object URL
      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;

      // Handle errors
      video.onerror = (e) => {
        // Clean up resources
        URL.revokeObjectURL(objectUrl);
        reject(new Error(`Video error: ${e}`));
      };

      // Set a timeout in case the video never loads
      const timeout = setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Video loading timed out"));
      }, 30000); // 30 second timeout

      // Generate thumbnail when metadata is loaded
      video.onloadedmetadata = () => {
        // Seek to a point in the video for the thumbnail
        video.currentTime = Math.min(5.0, video.duration / 3);
      };

      // Generate thumbnail when the video is seeked to the desired time
      video.onseeked = () => {
        try {
          // Clear the timeout since video loaded successfully
          clearTimeout(timeout);

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Could not get canvas context"));
            return;
          }

          // Calculate dimensions while maintaining aspect ratio
          const aspectRatio = video.videoWidth / video.videoHeight;
          let width = video.videoWidth;
          let height = video.videoHeight;

          if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }

          if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw the video frame to the canvas
          ctx.drawImage(video, 0, 0, width, height);
          
          // Pause the video
          video.pause();
          
          // Clean up resources
          URL.revokeObjectURL(objectUrl);
          
          // Convert canvas to data URL
          const dataUrl = canvas.toDataURL("image/png");
          resolve(dataUrl);
        } catch (error) {
          URL.revokeObjectURL(objectUrl);
          reject(error);
        }
      };

      // Handle video loading errors
      video.onabort = () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Video loading aborted"));
      };
    } catch (error) {
      reject(error);
    }
  });
};