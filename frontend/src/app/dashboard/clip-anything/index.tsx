import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, Video, Scissors, Download, Star, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface ClipData {
  clipUrl: string;
  viralityScore: number;
  startTime: number;
  endTime: number;
  duration: number;
}

export default function ClipAnythingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clips, setClips] = useState<ClipData[]>([]);
  const [selectedClip, setSelectedClip] = useState<ClipData | null>(null);
  const [progress, setProgress] = useState(0);
  const [maxClips, setMaxClips] = useState(10);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast.error("Please upload a .mp4, .mov, .avi, or .mkv file", {
        duration: 5000,
      });
      return;
    }
    
    const file = acceptedFiles[0];
    
    // Check file size
    if (file.size > 2 * 1024 * 1024 * 1024) { // 2GB
      toast.error("File size exceeds the 2GB limit", {
        duration: 5000,
      });
      return;
    }
    
    // Check file type - more permissive check
    const validExtensions = ['.mp4', '.mov', '.avi', '.mkv'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    // Also check MIME type but as a fallback
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/*'];
    const hasValidType = validTypes.includes(file.type);
    
    if (!hasValidExtension && !hasValidType) {
      toast.error("Please upload a valid video file (.mp4, .mov, .avi, .mkv)", {
        duration: 5000,
      });
      return;
    }
    
    setFile(file);
    setClips([]);
    setSelectedClip(null);
    toast.success("Video file uploaded successfully!");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024 * 1024 // 2GB
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
    setClips([]);
    setSelectedClip(null);
    
    const formData = new FormData();
    formData.append("file", file); 
    formData.append("text_prompt", prompt);
    formData.append("max_clips", maxClips.toString());

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
      
      if (response.data && response.data.clips && response.data.clips.length > 0) {
        setClips(response.data.clips);
        setSelectedClip(response.data.clips[0]); // Select the first clip by default
        toast.success(`${response.data.clips.length} clips generated successfully!`);
      } else {
        toast.error("No clips were generated. Try a different prompt.");
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
        Our AI will analyze your video and extract segments that match your prompt, ranked by virality.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Video</CardTitle>
            <CardDescription>
              Upload your video file (MP4, MOV, AVI, MKV) up to 2GB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
              }`}
              style={{ position: 'relative' }}
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                    >
                      Change Video
                    </Button>
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
                    <p className="text-xs text-gray-400">
                      Supports MP4, MOV, AVI, MKV up to 2GB
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
              <div>
                <label htmlFor="max-clips" className="block text-sm font-medium mb-1">
                  Maximum Number of Clips: {maxClips}
                </label>
                <Slider
                  id="max-clips"
                  min={1}
                  max={20}
                  step={1}
                  value={[maxClips]}
                  onValueChange={(value) => setMaxClips(value[0])}
                  disabled={isLoading}
                  className="mb-2"
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
                    Generate Clips
                  </>
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                {selectedClip 
                  ? `Clip with virality score: ${selectedClip.viralityScore.toFixed(1)}/100` 
                  : "Your clipped videos will appear here"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[300px] bg-gray-100 rounded-md">
              {selectedClip ? (
                <video
                  src={selectedClip.clipUrl}
                  controls
                  className="w-full h-full max-h-[400px] rounded"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p>No clips generated yet</p>
                  <p className="text-sm mt-2">Upload a video and enter a prompt to get started</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {selectedClip && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = selectedClip.clipUrl;
                    a.download = `clip_${selectedClip.viralityScore.toFixed(1)}.mp4`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Selected Clip
                </Button>
              )}
            </CardFooter>
          </Card>

          {clips.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Clips</CardTitle>
                <CardDescription>
                  {clips.length} clips ranked by virality score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {clips.map((clip, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${
                        selectedClip === clip ? "bg-gray-100 border border-primary" : ""
                      }`}
                      onClick={() => setSelectedClip(clip)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-500">#{index + 1}</span>
                        <div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{clip.viralityScore.toFixed(1)}</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Duration: {clip.duration.toFixed(1)}s
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {selectedClip === clip ? "Playing" : "Select"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
