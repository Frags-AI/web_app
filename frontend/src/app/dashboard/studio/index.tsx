import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import VideoUploadForm from "./InputForm";
import { toast } from "sonner";

interface AssetLibraryProps {
  icon: string;
  label: string;
  description: string;
}

export default function CreatorStudio() {
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);
  const location = useLocation()

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast(location.state.toastMessage, {
        description: "Please upload a video first before going into workflow",
        duration: 5000,
      });
    }
  }, []);

  const assetLibrary: AssetLibraryProps[] = [
      { icon: "/assets/star.png", label: "Long to shorts", description:"AI find hooks, highlights, and turns your video into viral shorts." },
      { icon: "/assets/cc.png", label: "AI Captions",description:"Add stylish captions or translate your content with one click." },
      { icon: "/assets/film-strip.png", label: "AI B-Roll",description:"Let AI automatically reframe your content to ft any social platform. Save time on manual reframing." },
      { icon: "/assets/crop.png", label: "AI Reframe" ,description:"Add AI generated B-Roll to your video in 1 click."},
      { icon: "/assets/speaking.png", label: "AI hook",description:"Create a sound hook with the AI voice-over." },
  ]

  return (
    <>
      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Creator Studio</h1>
          <p>Welcome to your creator dashboard.</p>
        </div>

        <VideoUploadForm />

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
      </div>
    </>
  );
}