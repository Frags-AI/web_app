import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, Video, Scissors, Download } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function ClipAnythingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clipUrl, setClipUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setClipUrl(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 500 // 500MB
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please upload a video file");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    setProgress(0);
    
    const formData = new FormData();
    formData.append("file", file); 
    formData.append("text_prompt", prompt); 

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 1000);

      const response = await axios.post("/api/clip_anything/clip_video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted > 95 ? 95 : percentCompleted);
          }
        }
      });

      clearInterval(progressInterval);
      setProgress(100);
      
      if (response.data && response.data.clipUrl) {
        setClipUrl(response.data.clipUrl);
        toast.success("Video clipped successfully!");
      } else {
        toast.error("Failed to process video");
      }
    } catch (error) {
      console.error("Error processing video:", error);
      toast.error("Error processing video. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Clip Anything</h1>
      <p className="text-gray-500 mb-8">
        Upload a video and enter a prompt to automatically extract relevant clips based on your description.
        Our AI will analyze your video and extract segments that match your prompt.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Video</CardTitle>
            <CardDescription>
              Upload your video file (MP4, MOV, AVI, MKV) up to 500MB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-4">
                {file ? (
                  <>
                    <Video className="h-12 w-12 text-primary" />
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400" />
                    <p className="font-medium">
                      {isDragActive
                        ? "Drop the video file here"
                        : "Drag & drop your video file here"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Or click to browse files
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch space-y-4">
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium mb-1">
                  Prompt
                </label>
                <Textarea
                  id="prompt"
                  placeholder="Describe what you want to clip from the video (e.g., 'person walking with a dog', 'sunset over mountains')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !file}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing ({progress}%)
                  </>
                ) : (
                  <>
                    <Scissors className="mr-2 h-4 w-4" />
                    Clip Video
                  </>
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              Your clipped video will appear here
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[300px] bg-gray-100 rounded-md">
            {clipUrl ? (
              <video
                src={clipUrl}
                controls
                className="w-full h-full max-h-[400px] rounded"
              />
            ) : (
              <div className="text-center text-gray-500">
                <Video className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>No clip generated yet</p>
                <p className="text-sm mt-2">Upload a video and enter a prompt to get started</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {clipUrl && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = clipUrl;
                  a.download = "clipped-video.mp4";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Clip
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
