import { useLocation, useNavigate } from "react-router-dom";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { generateVideoThumbnail } from "@/lib/thumbnail";

export default function Workflow() {
  const location = useLocation()
  const navigate = useNavigate()
  const [genre, setGenre] = useState<string | null>("Auto");
  const [clipLength, setClipLength] = useState<string | null>("Auto");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const fileName = location.state?.fileName || null;
  const model = location.state?.model || null;
  const file = location.state?.file || null;

  useEffect(() => {
    if (!fileName || !file) {
      navigate("/dashboard/studio", { state: { toastMessage: "Invalid File Format" } });
    } else {
      const generateThumbnail = async () => {
        const thumbnailDataUrl = await generateVideoThumbnail(file) as string;
        setThumbnail(thumbnailDataUrl);
      }
      generateThumbnail()
    }
  }, [])

  const handleDefaultClick = () => {
    setClipLength("Auto")
    setGenre("Auto")
    toast.success("Reset to default settings")
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="font-bold text-4xl mb-4">Workflow</div>
      <div className="flex flex-col items-center justify-center gap-4 mb-4">
        <img src={thumbnail} alt="thumbnail" className="w-[300px] h-[300px] object-cover rounded-lg" />
        <div className="text-center text-lg font-semibold">{fileName}</div>
        <div className="text-center text-sm text-muted-foreground font-semibold max-w-[400px]">
        All rights to the images, music, clips, and other materials used belong to their respective owners. 
        We do not claim ownership over any third-party content used. Fair Use Notice: This video may contain 
        copyrighted material, the use of which has not always been specifically authorized by the copyright owner.
        </div>
      </div>
      <div className="font-bold text-2xl mt-8 mb-4">Features</div>
      <Tabs defaultValue="AI Clipping" className="flex flex-col w-[32rem]" orientation="horizontal">
        <TabsList>
          <TabsTrigger value="AI Clipping" className="font-semibold">AI Clipping</TabsTrigger>
          <TabsTrigger value="Edit Captions" className="font-semibold">Edit Captions</TabsTrigger>
          <TabsTrigger value="Adjust Clips" className="font-semibold">Adjust Clips</TabsTrigger>
        </TabsList>
        <TabsContent value="AI Clipping" className="">
          <Card>
            <CardHeader>
              <CardTitle className="text-center mb-4">AI Clipping</CardTitle>
              <CardDescription className="text-center">AI find hooks, highlights, and turns your video into viral shorts.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="font-bold">Genre: </div>
                  <Select value={genre} onValueChange={(value) => setGenre(value)}> 
                    <SelectTrigger className="w-[120px]">
                      <SelectValue className="text-center" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Auto">Auto</SelectItem>
                        <SelectItem value="FPS">FPS</SelectItem>
                        <SelectItem value="RPG">RPG</SelectItem>
                        <SelectItem value="MMORPG">MMORPG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-bold">Clip Length: </div>
                  <Select value={clipLength} onValueChange={(value) => setClipLength(value)}> 
                    <SelectTrigger className="w-[150px]">
                      <SelectValue className="text-center" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Auto">Auto (0 - 3m)</SelectItem>
                      <SelectItem value="Short">&lt;30s</SelectItem>
                      <SelectItem value="Medium">30s~59s</SelectItem>
                      <SelectItem value="Long">60s-89s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-bold">Language: </div>
                  <Select value={clipLength} onValueChange={(value) => setClipLength(value)}> 
                    <SelectTrigger className="w-[150px]">
                      <SelectValue className="text-center" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Auto">Auto (0 - 3m)</SelectItem>
                      <SelectItem value="Short">&lt;30s</SelectItem>
                      <SelectItem value="Medium">30s~59s</SelectItem>
                      <SelectItem value="Long">60s-89s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button onClick={handleDefaultClick}>Reset to default</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      <Button className="mt-16 max-w-[20rem] w-full font-bold text-lg">Convert Video to Clips</Button>
    </div>
  )
}