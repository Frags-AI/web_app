import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function VoiceoverPage() {
  const [text, setText] = React.useState("");
  const [voice, setVoice] = React.useState("neutral");
  const [isLoading, setIsLoading] = React.useState(false);
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast.error("Please enter some text for the voiceover");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/voiceover-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          voice,
          speed: 1.0
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        toast.success("Voiceover generated successfully!");
        
        // For demo purposes - replace with actual audio file URL when available
        setAudioUrl("https://example.com/demo-audio.mp3");
      } else {
        throw new Error(result.message || 'Failed to generate voiceover');
      }
    } catch (error) {
      console.error("Error generating voiceover:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate voiceover. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>AI Voiceover Generator</h1>
      <p>Generate natural-sounding voiceovers for your videos</p>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Voiceover</CardTitle>
            <CardDescription>
              Enter the text you want to convert to speech and select a voice style
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">Text to convert</Label>
                <Textarea
                  id="text"
                  placeholder="Enter the text for your voiceover here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="voice">Voice Style</Label>
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger id="voice">
                    <SelectValue placeholder="Select a voice style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="serious">Serious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Voiceover"
                )}
              </Button>
            </form>
          </CardContent>
          {audioUrl && (
            <CardFooter className="flex flex-col items-start">
              <Label className="mb-2">Preview</Label>
              <audio controls src={audioUrl} className="w-full" />
              <Button variant="outline" className="mt-2" onClick={() => window.open(audioUrl!)}>
                Download Audio
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
