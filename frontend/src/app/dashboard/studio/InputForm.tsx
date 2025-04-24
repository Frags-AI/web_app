import React, { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, Gem, Info } from "lucide-react";
import { LucideIcon, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ModelProps {
  name: string;
  icon: LucideIcon | null;
  color: string | null;
  description: string;
}

interface VideoUploadFormProps {
  file?: File | null
  model?: "Basic" | "Advanced" | "Pro";
  fileName?: string | null;
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

export default function VideoUploadForm({file, model, fileName}: VideoUploadFormProps) {
  const [uploadName, setUploadName] = useState(fileName);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedModel, setSelectedModel] = useState<"Basic" | "Advanced" | "Pro">(model || "Basic");
  const [hoveredModel, setHoveredModel] = useState<"Basic" | "Advanced" | "Pro" | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File>(null);
  const [hoveredButton, setHoveredButton] = useState<SourceName | null>(null);
  const placeholders = ["YouTube", "Twitch", "Rumble", "Zoom"];
  const navigate = useNavigate()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadName(file.name);
      setUploadedFile(file);
    }
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
    setUploadName(files[0].name);
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

  const handleUploadClick = async () => {
    if (uploadedFile) {
      navigate("/dashboard/workflow", {
        state: { file: uploadedFile, model: selectedModel, fileName: uploadName },
      });
    } else {
      toast.error("Please upload a video first", {
        duration: 5000,
      });
    }
  }

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
        <div className="flex justify-center mt-15">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-around gap-2 text-sm  mb-4">
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

            <div className="rounded-xl p-6 shadow-md w-[600px] h-[20rem] border" {...getRootProps()} >
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
                        value={uploadName}
                        onChange={(e) => setUploadName(e.target.value)}
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
                                if (driveLink?.startsWith("http")) setUploadName(driveLink);
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
                    <Button 
                      className="font-bold py-3 rounded-md text-center"
                      onClick={handleUploadClick}
                    >
                      Get clips in 1 click
                    </Button>
                    <Link
                      to="/dashboard/workflow"
                      className="text-sm  underline text-center"
                    >
                      Click here to try a sample project
                    </Link>
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