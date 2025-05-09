import React, { useState, useRef, useEffect, useCallback } from "react";
import { uploadYoutube } from "./studioHelper";
import { Sparkles, Gem, Info } from "lucide-react";
import { LucideIcon, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { generateVideoThumbnail } from "@/lib/thumbnail";

interface ModelProps {
  name: string;
  icon: LucideIcon | null;
  color: string | null;
  description: string;
}

const sources = [
    {
      name: "upload",
      label: "Upload",
      icon: "/assets/cloud-computing.png", 
      description: "Video to 10GB, maximum duration of 10 hours (mp4, mov, webm)"
    }, 
    {
      name: "drive", 
      label: "Google Drive", 
      icon: "/assets/google-drive.png", 
      description: "Choose a video from Google Drive"

    }
]
type SourceName = (typeof sources)[number]["name"];

const models: ModelProps[] = [
    { name: "Basic", icon: null, color: null, description: "Basic model for quick tasks" },
    { name: "Advanced", icon: Sparkles, color: "#bdc936", description: "Advanced model for detailed tasks" },
    { name: "Pro", icon: Gem, color: "#45bde6", description: "Pro model for professional tasks" },
]

export default function VideoUploadForm() {
  const [uploadLink, setUploadLink] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedModel, setSelectedModel] = useState<"Basic" | "Advanced" | "Pro">("Basic");
  const [hoveredModel, setHoveredModel] = useState<"Basic" | "Advanced" | "Pro" | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File>(null);
  const [hoveredButton, setHoveredButton] = useState<SourceName | null>(null);
  const [videoProgress, setVideoProgress] = useState(0)
  const [thumbnailProgress, setThumbnailProgress] = useState(0)
  const placeholders = ["YouTube", "Twitch", "Rumble", "Zoom"];
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState<boolean>(false)

  useQuery({
    queryKey: ["uploadValidation"],
    queryFn: async function() {
      setProcessing(true)
      if (!uploadLink.startsWith("https://youtu.be/") && !uploadLink.startsWith("https://www.youtube.com/watch")) {
        setUploadLink("")
        toast.error("Invalid Youtube Link")
        setProcessing(false)
        return ""
      } else {
        try {
          const token = await getToken()
          const data = await uploadYoutube(uploadLink, token, (progress: { video: number, thumbnail: number}) => {
            if (progress.video !== 0) setVideoProgress(progress.video)
            if (progress.thumbnail !== 0) setThumbnailProgress(progress.thumbnail)
          })        
          toast.success("Video has been successfully uploaded")
          navigate("/dashboard/workflow", {
            state: { file: data.video, thumbnail: URL.createObjectURL(data.thumbnail as Blob), model: selectedModel },
          });
          return uploadLink
        } catch (err) {
          toast.error(err.message)
          setUploadLink("")
          return ""
        } finally {
          setProcessing(false)
        }
      }
    },
    enabled: uploadLink !== "",
    retry: false,
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file)
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const files = acceptedFiles;

    if (files.length === 0) {
      toast.error("Please upload a .mp4, .webm, or .mov file", {
        duration: 5000,
      });
      return;
    }

    setUploadedFile(files[0]);
  }, []);

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".webm"],
    },
    onError: (err) => {
      toast.error(err.message)
    }
  });

  const handleModelSelect = (name: string) => {
    setSelectedModel(name as "Basic" | "Advanced" | "Pro");
  }

  const handleModelHover = (name: string | null) => {
    if (name) {
      setHoveredModel(name as "Basic" | "Advanced" | "Pro");
    } else setHoveredModel(null);
  }

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setProcessing(true)
    if (uploadedFile) {
      toast.success("File Successfully Uploaded")
      const generateThumbnail = async () => {
        const thumbnailDataUrl = await generateVideoThumbnail(uploadedFile) as string;
        setProcessing(false)
        return thumbnailDataUrl
      }
      const thumbnail = generateThumbnail()
      navigate("/dashboard/workflow", {
        state: { file: uploadedFile, model: selectedModel, thumbnail: thumbnail },
      });
    }
    setProcessing(false)
  }, [uploadedFile])

  useQuery({
    queryKey: ["progressStatus"],
    queryFn: () => {
      return { video: videoProgress, thumbnail: thumbnailProgress }
    },

  })

  return (
    <>
      <div className="flex justify-center mt-15">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-around gap-2 text-sm mb-4">
            {models.map((model, index) => (
              <div key={`model-${index}`} className="flex flex-col items-center gap-2 relative">
              <AnimatePresence>
                {hoveredModel === model.name && (
                  <motion.div 
                    className="absolute -top-8 z-10 whitespace-nowrap bg-primary text-primary-foreground px-2 py-1 text-xs rounded-lg font-bold"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{ duration: 0.3 }}
                    exit={{opacity: 0, y: -10}}
                  >
                      {model.description}
                  </motion.div>
                )}
              </AnimatePresence>
              <Button
                  className={`font-semibold flex items-center gap-1 px-2 py-2 rounded-md hover:bg-primary/20 transition ${model.name === selectedModel ? "bg-primary/20" : ""}`}
                  variant="ghost"
                  onClick={() => handleModelSelect(model.name)}
                  onMouseOver={() => handleModelHover(model.name)}
                  onMouseLeave={() => handleModelHover(null)}
              > 
                { model.icon && 
                  <model.icon 
                    color={model.color} 
                    fill={model.color}  
                  />
                }
                <div>{model.name}</div>
                <Info className="text-muted-foreground" />
              </Button>
              </div>
            ))}
          </div>

          <div className={`rounded-xl p-6 shadow-md w-[37.5rem] h-[20rem] border ${processing ? "bg-muted pointer-events-none opacity-80" : ""}`} {...getRootProps()} >
            {isDragActive 
              ? (
                <div className="h-full">
                  <div className="flex flex-col items-center justify-center h-full">
                    <Video className="text-muted-foreground" size={40} />
                    <p className="text-sm text-muted-foreground">Drag and Drop any vidoe file (.mp4, .mov, .webm )</p>
                  </div>
                </div>
              )
              : (
                <div className="flex flex-col justify-center gap-4 h-full">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder={`Paste a ${placeholders[placeholderIndex]} URL`}
                      value={uploadLink}
                      onChange={(e) => setUploadLink(e.target.value)}
                      className="bg-background text-foreground p-3 pl-8 rounded-md outline-hidden placeholder:text-muted-foreground w-full"
                    />
                  </div>
                  <div className="flex gap-6 items-center text-sm text-muted-foreground mt-2 px-1">
                    {sources.map((source) => (
                      <div
                        key={source.name}
                        className="relative flex flex-col items-center"
                      >
                        <AnimatePresence>
                          {hoveredButton === source.name && (
                            <motion.div 
                              className="absolute -top-10 z-10 whitespace-nowrap bg-primary text-primary-foreground px-2 py-1 text-xs rounded-lg font-bold"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              {source.description}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <Button
                          className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/5 hover:bg-primary/15 text-foreground"
                          onClick={() => {
                            if (source.name === "upload") {
                              fileInputRef.current?.click();
                              setHoveredButton(null);
                            } else {
                              const driveLink = prompt("Paste your Google Drive link:");
                              if (driveLink?.startsWith("http")) setUploadLink(driveLink);
                            }
                          }}
                          onMouseEnter={() => setHoveredButton(source.name)}
                          onMouseLeave={() => setHoveredButton(null)}
                        >
                          <img
                            src={source.icon}
                            alt={`${source.label} Icon`}
                            className="w-4 h-4"
                          />
                          <span>{source.label}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button className="font-bold py-3 rounded-md text-center">View a Demonstration</Button>
                  {processing && (
                    <div className="flex flex-col text-highlight font-bold">
                      <div>Video Progress: {videoProgress}</div>
                      <div>Thumbnail Progress: {thumbnailProgress}</div>
                    </div>
                  )}
                  <div className="text-sm text-center text-muted-foreground">We recommend uploading the highest resolution of your video to ensure the best quality for clips</div>
                </div>
              )
            }
          </div>
        </div>
      </div>
      <input
          type="file"
          accept="video/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
      />
    </>
  );
}