import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

export default function BackgroundGenerationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [ratio, setRatio] = useState("16:9");
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [creativity, setCreativity] = useState(50);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your background");
      return;
    }

    setIsLoading(true);
    setImages([]);
    
    try {
      const response = await fetch('/api/ai/background-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
          aspectRatio: ratio
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        // For now, show success message as the Python backend generates files
        toast.success("Background generated successfully!");
        
        // Demo images for display (replace with actual generated image when available)
        const demoImages = [
          "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070",
          "https://images.unsplash.com/photo-1557682250-48beb9a0e4a2?q=80&w=2029",
          "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1887",
        ];
        
        setImages(demoImages);
        setSelectedImage(demoImages[0]);
      } else {
        throw new Error(result.message || 'Failed to generate background');
      }
    } catch (error) {
      console.error("Error generating background:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate background. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (selectedImage) {
      const link = document.createElement('a');
      link.href = selectedImage;
      link.download = `background-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Background image downloaded successfully");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold">AI Background Generator</h1>
        <p className="text-muted-foreground">Create stunning backgrounds for your videos</p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Background</CardTitle>
            <CardDescription>
              Describe the background you want to create
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Description</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the background you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger id="style">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="abstract">Abstract</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                      <SelectItem value="futuristic">Futuristic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ratio">Aspect Ratio</Label>
                  <Select value={ratio} onValueChange={setRatio}>
                    <SelectTrigger id="ratio">
                      <SelectValue placeholder="Select ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                      <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                      <SelectItem value="1:1">1:1 (Square)</SelectItem>
                      <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="creativity">
                  Creativity: {creativity}%
                </Label>
                <Slider
                  id="creativity"
                  min={0}
                  max={100}
                  step={10}
                  value={[creativity]}
                  onValueChange={(values) => setCreativity(values[0])}
                />
              </div>
              
              <Button 
                onClick={handleGenerate} 
                disabled={isLoading} 
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Backgrounds"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Backgrounds</CardTitle>
              <CardDescription>
                Select your preferred background
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div 
                    key={index}
                    className={`relative aspect-video rounded-md overflow-hidden cursor-pointer border-2 ${
                      selectedImage === image ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img 
                      src={image} 
                      alt={`Generated background ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              
              {selectedImage && (
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
