import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { TranscriptionService } from "./transcriptionService";

export default function TranscriptionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionId, setTranscriptionId] = useState<string | null>(null);
  const [transcriptionText, setTranscriptionText] = useState<string>("");
  const [silenceThreshold, setSilenceThreshold] = useState(-50);
  const [minSilenceLength, setMinSilenceLength] = useState(500);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleTranscribe = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a video file to transcribe",
        variant: "destructive",
      });
      return;
    }

    setIsTranscribing(true);
    try {
      const result = await TranscriptionService.transcribeVideo(file, silenceThreshold, minSilenceLength);
      if (result.status === "success") {
        toast({
          title: "Success",
          description: "Video transcribed successfully",
        });
        setTranscriptionId(result.transcription_id);
        
        // Fetch the transcription text
        const transcription = await TranscriptionService.getTranscription(result.transcription_id);
        setTranscriptionText(transcription);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to transcribe video",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleDownload = () => {
    if (transcriptionId) {
      const downloadUrl = TranscriptionService.getDownloadUrl(transcriptionId);
      window.open(downloadUrl, "_blank");
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(transcriptionText);
    toast({
      title: "Copied",
      description: "Transcription copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Video Transcription</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Video</CardTitle>
            <CardDescription>
              Upload a video file to transcribe its audio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="video-file">Video File</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="video-file"
                    type="file"
                    accept="video/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    Clear
                  </Button>
                </div>
                {file && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="silence-threshold">Silence Threshold (dB)</Label>
                    <span className="text-sm text-muted-foreground">{silenceThreshold}</span>
                  </div>
                  <Slider
                    id="silence-threshold"
                    min={-80}
                    max={-20}
                    step={1}
                    value={[silenceThreshold]}
                    onValueChange={(value) => setSilenceThreshold(value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower values detect quieter silences (more sensitive)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="min-silence">Minimum Silence Length (ms)</Label>
                    <span className="text-sm text-muted-foreground">{minSilenceLength}</span>
                  </div>
                  <Slider
                    id="min-silence"
                    min={100}
                    max={2000}
                    step={50}
                    value={[minSilenceLength]}
                    onValueChange={(value) => setMinSilenceLength(value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum duration of silence to be considered a break
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleTranscribe} 
              disabled={isTranscribing || !file}
              className="w-full"
            >
              {isTranscribing ? "Transcribing..." : "Transcribe Video"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transcription</CardTitle>
            <CardDescription>
              The transcribed text from your video
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px] max-h-[500px] overflow-y-auto">
            {transcriptionText ? (
              <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">
                {transcriptionText}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Transcription will appear here
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              className="w-full"
              disabled={!transcriptionText}
              onClick={handleCopyToClipboard}
            >
              Copy to Clipboard
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={!transcriptionId}
              onClick={handleDownload}
            >
              Download Transcription
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
