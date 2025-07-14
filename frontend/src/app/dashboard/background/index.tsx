import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { BackgroundService } from "./backgroundService";

const STYLE_OPTIONS = [
  { value: "realistic", label: "Realistic" },
  { value: "anime", label: "Anime" },
  { value: "digital_art", label: "Digital Art" },
  { value: "3d_render", label: "3D Render" },
  { value: "painting", label: "Painting" },
  { value: "sketch", label: "Sketch" },
];

export default function BackgroundPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt for the background image",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await BackgroundService.generateBackground(prompt, style);
      if (result.status === "success") {
        toast({
          title: "Success",
          description: "Background image generated successfully",
        });
        setImageId(result.image_id);
        
        // Create URL for the image
        const imageUrl = BackgroundService.getImageUrl(result.image_id);
        setGeneratedImage(imageUrl);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate background image",
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

  const handleDownload = () => {
    if (imageId) {
      const downloadUrl = BackgroundService.getDownloadUrl(imageId);
      window.open(downloadUrl, "_blank");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">AI Background Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Background</CardTitle>
            <CardDescription>
              Create custom background images for your videos using AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the background image you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div>
                <Label>Style</Label>
                <RadioGroup 
                  value={style} 
                  onValueChange={setStyle}
                  className="grid grid-cols-2 gap-2 mt-2"
                >
                  {STYLE_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt}
              className="w-full"
            >
              {isGenerating ? "Generating..." : "Generate Background"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Background</CardTitle>
            <CardDescription>
              Preview your AI-generated background image
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
            {generatedImage ? (
              <div className="w-full">
                <img 
                  src={generatedImage} 
                  alt="Generated background" 
                  className="w-full h-auto rounded-md object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Generated image will appear here
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={!imageId}
              onClick={handleDownload}
            >
              Download Image
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
