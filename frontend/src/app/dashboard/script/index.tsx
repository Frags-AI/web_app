import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { ScriptService } from "./scriptService";

export default function ScriptPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState("");
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [activeTab, setActiveTab] = useState("basic");

  const handleGenerateBasic = async () => {
    if (!prompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt for the script",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await ScriptService.generateScript(prompt);
      if (result.status === "success") {
        toast({
          title: "Success",
          description: "Script generated successfully",
        });
        setGeneratedScript(result.script);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate script",
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

  const handleGenerateStream = async () => {
    if (!prompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt for the script",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await ScriptService.generateStreamScript(prompt);
      if (result.status === "success") {
        toast({
          title: "Success",
          description: "Stream script generated successfully",
        });
        setGeneratedTitle(result.title);
        setGeneratedScript(result.script);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate script",
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

  const handleCopyToClipboard = () => {
    const textToCopy = activeTab === "stream" && generatedTitle 
      ? `${generatedTitle}\n\n${generatedScript}` 
      : generatedScript;
    
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied",
      description: "Script copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">AI Script Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Script</CardTitle>
            <CardDescription>
              Create professional scripts for your videos using AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="basic">Basic Script</TabsTrigger>
                <TabsTrigger value="stream">Stream Script</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prompt">Prompt</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Enter a prompt for your script..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>
                  <Button 
                    onClick={handleGenerateBasic} 
                    disabled={isGenerating || !prompt}
                    className="w-full"
                  >
                    {isGenerating ? "Generating..." : "Generate Basic Script"}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="stream">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="stream-prompt">Prompt</Label>
                    <Textarea
                      id="stream-prompt"
                      placeholder="Enter a topic for your streaming video..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>
                  <Button 
                    onClick={handleGenerateStream} 
                    disabled={isGenerating || !prompt}
                    className="w-full"
                  >
                    {isGenerating ? "Generating..." : "Generate Stream Script"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Script</CardTitle>
            <CardDescription>
              {activeTab === "stream" ? "Title and script for your stream" : "Your generated script"}
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px] max-h-[500px] overflow-y-auto">
            {activeTab === "stream" && generatedTitle && (
              <div className="mb-4">
                <Label className="text-sm text-muted-foreground">Title</Label>
                <div className="p-3 bg-muted rounded-md font-medium">{generatedTitle}</div>
              </div>
            )}
            
            {generatedScript ? (
              <div>
                <Label className="text-sm text-muted-foreground">Script</Label>
                <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">
                  {generatedScript}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Generated script will appear here
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={!generatedScript}
              onClick={handleCopyToClipboard}
            >
              Copy to Clipboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
