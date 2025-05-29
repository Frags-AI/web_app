export const generateVideoThumbnail = (file: File, maxWidth = 800, maxHeight = 600) => {
  return new Promise<string>((resolve) => {
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    video.autoplay = true;
    video.muted = true;
    video.currentTime = 5.0;
    video.src = URL.createObjectURL(file);

    video.onloadeddata = () => {
      let ctx = canvas.getContext("2d");

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

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(video, 0, 0, width, height);
      video.pause();
      
      // Clean up the object URL
      URL.revokeObjectURL(video.src);
      
      return resolve(canvas.toDataURL("image/png"));
    };
  });
};