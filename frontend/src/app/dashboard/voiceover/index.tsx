import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { VoiceoverService } from "./voiceoverService";

export default function VoiceoverPage() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("Jessica");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text) {
      toast({
        title: "Error",
        description: "Please enter text for the voiceover",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await VoiceoverService.generateVoiceover(text, voice);
      if (result.status === "success") {
        toast({
          title: "Success",
          description: "Voiceover generated successfully",
        });
        setAudioUrl(result.file_path);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate voiceover",
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
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">AI Voiceover Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Voiceover</CardTitle>
            <CardDescription>
              Convert text to speech using AI voices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="voice">Select Voice</Label>
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jessica">Jessica (Female)</SelectItem>
                    <SelectItem value="Adam">Adam (Male)</SelectItem>
                    <SelectItem value="Rachel">Rachel (Female)</SelectItem>
                    <SelectItem value="John">John (Male)</SelectItem>
                    <SelectItem value="Emily">Emily (Female)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="text">Text</Label>
                <Textarea
                  id="text"
                  placeholder="Enter the text you want to convert to speech..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !text}
              className="w-full"
            >
              {isGenerating ? "Generating..." : "Generate Voiceover"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              Listen to your generated voiceover
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
            {audioUrl ? (
              <div className="w-full">
                <audio controls className="w-full mb-4">
                  <source src={audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(audioUrl, "_blank")}
                >
                  Download Audio
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                Generated audio will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
