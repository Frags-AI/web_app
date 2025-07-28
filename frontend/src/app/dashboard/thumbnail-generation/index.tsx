"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Upload, Image as ImageIcon, Download, Loader2, Play, FileVideo } from "lucide-react";
import { toast } from "sonner";

interface GeneratedThumbnail {
  url: string;
  style: string;
  timestamp: number;
}

export default function ThumbnailGeneration() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [timestamp, setTimestamp] = useState([30]); // Default to 30 seconds
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedThumbnails, setGeneratedThumbnails] = useState<GeneratedThumbnail[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    },
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB limit
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        if (selectedFile.size > 2 * 1024 * 1024 * 1024) {
          toast.error("File size must be less than 2GB");
          return;
        }
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        toast.success("Video uploaded successfully!");
      }
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        toast.error("File size must be less than 2GB");
      } else if (error?.code === 'file-invalid-type') {
        toast.error("Please upload a valid video file");
      } else {
        toast.error("Failed to upload file");
      }
    }
  });

  const handleGenerate = async () => {
    if (!file) {
      toast.error("Please upload a video file first");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a thumbnail description");
      return;
    }

    setIsGenerating(true);
    
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('prompt', prompt);
      formData.append('style', style);
      formData.append('timestamp', timestamp[0].toString());

      const response = await fetch('/api/ai/thumbnail-generation', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Thumbnail generation response:', data);
      
      if (data.thumbnails && data.thumbnails.length > 0) {
        console.log('Generated thumbnails:', data.thumbnails);
        setGeneratedThumbnails(data.thumbnails);
        toast.success(`Generated ${data.thumbnails.length} thumbnail(s)!`);
      } else {
        console.log('No thumbnails in response:', data);
        toast.error("No thumbnails were generated");
      }
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to generate thumbnails");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadThumbnail = (thumbnailUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = thumbnailUrl;
    link.download = `thumbnail_${index + 1}_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Thumbnail downloaded!");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <ImageIcon className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Thumbnail Generation</h1>
      </div>
      
      <p className="text-muted-foreground">
        Upload a video and describe the thumbnail you want to generate. Our AI will create eye-catching thumbnails at your specified timestamp.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload and Settings */}
        <div className="space-y-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Video</span>
              </CardTitle>
              <CardDescription>
                Upload your video file (up to 2GB). Supports MP4, MOV, AVI, MKV, WebM formats.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-blue-400 bg-blue-50"
                    : file
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="space-y-2">
                    <FileVideo className="h-12 w-12 text-green-600 mx-auto" />
                    <p className="text-sm font-medium text-green-700">{file.name}</p>
                    <p className="text-xs text-green-600">
                      {(file.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">
                      {isDragActive ? "Drop the video here..." : "Drag & drop your video, or click to select"}
                    </p>
                    <p className="text-xs text-gray-500">Maximum file size: 2GB</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Thumbnail Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Thumbnail Settings</CardTitle>
              <CardDescription>
                Customize your thumbnail generation parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Thumbnail Description</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the thumbnail you want (e.g., 'Action-packed scene with explosions', 'Close-up of main character looking determined', 'Colorful gaming thumbnail with neon effects')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select thumbnail style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cinematic">Cinematic</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="vlog">Vlog</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="dramatic">Dramatic</SelectItem>
                    <SelectItem value="colorful">Colorful</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="retro">Retro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timestamp: {formatTime(timestamp[0])}</Label>
                <Slider
                  value={timestamp}
                  onValueChange={setTimestamp}
                  max={300}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Select the timestamp (0-5 minutes) where you want to extract the thumbnail
                </p>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={!file || !prompt.trim() || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Thumbnails...
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Generate Thumbnails
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview and Results */}
        <div className="space-y-6">
          {/* Video Preview */}
          {previewUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>Video Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <video
                  src={previewUrl}
                  controls
                  className="w-full rounded-lg"
                  style={{ maxHeight: '300px' }}
                >
                  Your browser does not support the video tag.
                </video>
              </CardContent>
            </Card>
          )}

          {/* Generated Thumbnails */}
          {generatedThumbnails.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ImageIcon className="h-5 w-5" />
                  <span>Generated Thumbnails</span>
                </CardTitle>
                <CardDescription>
                  {generatedThumbnails.length} thumbnail(s) generated successfully
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {generatedThumbnails.map((thumbnail, index) => (
                    <div key={index} className="space-y-2">
                      <img
                        src={thumbnail.url}
                        alt={`Generated thumbnail ${index + 1}`}
                        className="w-full rounded-lg border shadow-sm"
                      />
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Style:</span> {thumbnail.style} | 
                          <span className="font-medium"> Time:</span> {formatTime(thumbnail.timestamp)}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadThumbnail(thumbnail.url, index)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Results Message */}
          {!previewUrl && generatedThumbnails.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center">
                  Upload a video and generate thumbnails to see results here
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
