import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";

export default function TranscriptionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [progress, setProgress] = useState(0);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast.error("Please upload an audio or video file");
      return;
    }
    
    const file = acceptedFiles[0];
    
    // Check file size
    if (file.size > 2 * 1024 * 1024 * 1024) { // 2GB
      toast.error("File size exceeds the 2GB limit");
      return;
    }
    
    // Check file type
    const validExtensions = ['.mp3', '.wav', '.mp4', '.avi', '.mov', '.m4a', '.flac', '.ogg'];
    const validTypes = ['audio/*', 'video/*'];
    
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const hasValidExtension = validExtensions.includes(fileExtension);
    const hasValidType = validTypes.some(type => file.type.startsWith(type.replace('*', '')));
    
    if (!hasValidExtension && !hasValidType) {
      toast.error("Please upload a valid audio or video file");
      return;
    }
    
    setFile(file);
    setProgress(0);
    setTranscription(null);
    toast.success("File uploaded", { description: "Your file is ready for transcription" });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': [],
      'video/*': []
    },
    maxFiles: 1
  });

  const handleTranscribe = async () => {
    if (!file) {
      toast.error("Please upload a file first");
      return;
    }

    setIsLoading(true);
    setProgress(0);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('include_timestamps', includeTimestamps.toString());
      
      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5;
        });
      }, 1000);
      
      const response = await fetch('/api/ai/transcription', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        toast.success("Transcription completed successfully!");
        
        // Use the actual transcription text from the backend
        const transcriptionText = result.transcription_text || "No transcription text available";
        setTranscription(transcriptionText);
      } else {
        throw new Error(result.message || 'Failed to transcribe file');
      }
    } catch (error) {
      console.error("Error transcribing file:", error);
      toast.error(error instanceof Error ? error.message : "Failed to transcribe file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setProgress(0);
    setTranscription(null);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold">AI Transcription</h1>
        <p className="text-muted-foreground">Convert audio and video to text with AI</p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Media</CardTitle>
            <CardDescription>
              Upload an audio or video file to transcribe
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!file ? (
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer h-40 ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-center text-muted-foreground">
                  {isDragActive
                    ? "Drop the file here"
                    : "Drag and drop an audio or video file here, or click to select"}
                </p>
                <p className="text-xs text-center text-muted-foreground mt-1">
                  Supports MP3, WAV, MP4, and other audio/video formats (max 2GB)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleClearFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="timestamps" 
                      checked={includeTimestamps}
                      onCheckedChange={setIncludeTimestamps}
                    />
                    <Label htmlFor="timestamps">Include timestamps</Label>
                  </div>
                  
                  <Button 
                    onClick={handleTranscribe}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Transcribing...
                      </>
                    ) : (
                      "Transcribe"
                    )}
                  </Button>
                </div>
                
                {isLoading && (
                  <div className="space-y-1">
                    <Progress value={progress} />
                    <p className="text-xs text-right text-muted-foreground">
                      {progress}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {transcription && (
          <Card>
            <CardHeader>
              <CardTitle>Transcription</CardTitle>
              <CardDescription>
                Text transcription of your media file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="p-4 rounded-md bg-muted whitespace-pre-wrap text-sm">
                  {transcription}
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    navigator.clipboard.writeText(transcription);
                    toast.success("Copied!", { description: "Transcription copied to clipboard" });
                  }}
                >
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
