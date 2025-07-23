import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function ScriptGenerationPage() {
  const [topic, setTopic] = React.useState("");
  const [tone, setTone] = React.useState("informative");
  const [duration, setDuration] = React.useState(60); // seconds
  const [isLoading, setIsLoading] = React.useState(false);
  const [generatedScript, setGeneratedScript] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      toast.error("Please enter a topic for your script");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/script-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          tone,
          duration
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        setGeneratedScript(result.data.script);
        toast.success("Script generated successfully!");
      } else {
        throw new Error(result.message || 'Failed to generate script');
      }
    } catch (error) {
      console.error("Error generating script:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate script. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  };

  return (
    <div>
      <div 
        heading="AI Script Generator" 
        text="Generate engaging video scripts tailored to your needs" 
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generate Script</CardTitle>
            <CardDescription>
              Enter your topic and preferences to generate a custom script
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or Title</Label>
                <Input
                  id="topic"
                  placeholder="Enter the main topic for your video..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="informative">Informative</SelectItem>
                    <SelectItem value="entertaining">Entertaining</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">
                  Target Duration: {formatDuration(duration)}
                </Label>
                <Slider
                  id="duration"
                  min={30}
                  max={3600}
                  step={30}
                  value={[duration]}
                  onValueChange={(values) => setDuration(values[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>30s</span>
                  <span>5m</span>
                  <span>15m</span>
                  <span>30m</span>
                  <span>1h</span>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Script"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Script</CardTitle>
            <CardDescription>
              Your custom script will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedScript ? (
              <div className="relative">
                <Textarea
                  value={generatedScript}
                  readOnly
                  className="min-h-[300px] font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedScript);
                    toast.success("Copied!");
                  }}
                >
                  Copy
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] border rounded-md border-dashed text-muted-foreground">
                Generated script will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
