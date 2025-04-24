export const generateVideoThumbnail = (file: File) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const video = document.createElement("video");
  
      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);
  
      video.onloadeddata = () => {
        let ctx = canvas.getContext("2d");
  
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
  
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        video.pause();
        return resolve(canvas.toDataURL("image/png"));
      };
    });
}