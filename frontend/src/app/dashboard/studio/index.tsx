import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Gem, Info } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
import { uploadVideo } from "./studioHelper";


interface AssetLibraryProps {
  icon: string;
  label: string;
  description: string;
}

interface ModelProps {
  name: string;
  icon: LucideIcon | null;
  color: string | null;
  description: string;
}

export default function CreatorStudio() {
  const [uploadName, setUploadName] = useState(""); // Zoom link or filename
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedModel, setSelectedModel] = useState< "Basic" | "Advanced" | "Pro" >("Basic");
  const [hoveredModel, setHoveredModel] = useState<"Basic" | "Advanced" | "Pro" | null>(null);
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File>(null);
  const [hoveredButton, setHoveredButton] = useState<SourceName | null>(null);
  const placeholders = ["YouTube", "Twitch", "Rumble", "Zoom"];
  const { getToken } = useAuth();

  const assetLibrary: AssetLibraryProps[] = [
      { icon: "/assets/star.png", label: "Long to shorts", description:"AI find hooks, highlights, and turns your video into viral shorts." },
      { icon: "/assets/cc.png", label: "AI Captions",description:"Add stylish captions or translate your content with one click." },
      { icon: "/assets/film-strip.png", label: "AI B-Roll",description:"Let AI automatically reframe your content to ft any social platform. Save time on manual reframing." },
      { icon: "/assets/crop.png", label: "AI Reframe" ,description:"Add AI generated B-Roll to your video in 1 click."},
      { icon: "/assets/speaking.png", label: "AI hook",description:"Create a sound hook with the AI voice-over." },
  ]

  //hoverbButton Props: 
  const sources = [
    {
      name: "upload",
      lable: "upload",
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadName(file.name);
      setUploadedFile(file);
    }
  };
  
  const handleModelSelect = (name: string) => {
    setSelectedModel(name as "Basic" | "Advanced" | "Pro");
  }

  const handleModelHover = (name: string | null) => {
    if (name) {
      setHoveredModel(name as "Basic" | "Advanced" | "Pro");
    } else setHoveredModel(null);
  }
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.dataTransfer.getData("text/plain");
    if (text.startsWith("http")) {
      setUploadName(text);
    }
  };

  const handleUploadClick = async () => {
    if (uploadedFile) {
      const token = await getToken()
      const response = await uploadVideo(uploadedFile, token);
      console.log("Upload response: ", response);
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
      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Creator Studio</h1>
          <p>Welcome to your creator dashboard.</p>
        </div>

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

            <div className="relative rounded-xl p-6 shadow-md w-[550px] border">
              <div className="absolute -bottom-[1px] left-1/2 transform -translate-x-1/2 w-[550px] h-[19px] z-10" />
              <div className="flex flex-col gap-4">
                <div className="relative">
                    <span className="absolute left-2 top-1/3 transform -translate-y-1/2 text-muted-foreground text-sm">🔗</span>
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
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <div className="flex justify-evenly gap-9 text-center w-full max-w-2xl">
            {assetLibrary.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-sm gap-2 relative"
                onMouseEnter={() => setHoveredAsset(item.label)}
                onMouseLeave={() => setHoveredAsset(null)}
              >
                <AnimatePresence>
                  {hoveredAsset === item.label && (
                    <motion.div
                      className="absolute -top-10 z-10 whitespace-nowrap px-2 py-1 text-xs rounded-lg font-bold bg-primary text-primary-foreground"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {item.description}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center cursor-pointer">
                  <motion.img
                    src={item.icon}
                    alt={item.label}
                    className="w-8 h-8"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.25 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="text-xs">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <input
            type="file"
            accept="video/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
        />

      </div>
    </>
  );
}