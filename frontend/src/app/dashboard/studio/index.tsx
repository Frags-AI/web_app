"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"
import { VideoUploadForm } from "./input-form"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap, Wand2, Crop, Mic } from "lucide-react"

interface AssetLibraryProps {
  icon: React.ReactNode
  label: string
  description: string
  color: string
  comingSoon?: boolean
}

export default function EnhancedCreatorStudio() {
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.error(location.state.toastMessage, {
        duration: 5000,
      })
    }
  }, [location?.state?.toastMessage])

  const assetLibrary: AssetLibraryProps[] = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      label: "Long to Shorts",
      description: "AI finds hooks, highlights, and turns your video into viral shorts",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      label: "AI Captions",
      description: "Add stylish captions or translate your content with one click",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Wand2 className="w-6 h-6" />,
      label: "AI B-Roll",
      description: "Add AI generated B-Roll to your video with one click",
      color: "from-green-500 to-emerald-500",
      comingSoon: true,
    },
    {
      icon: <Crop className="w-6 h-6" />,
      label: "AI Reframe",
      description: "Let AI automatically reframe your content to feature on any social platform",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Mic className="w-6 h-6" />,
      label: "AI Hook",
      description: "Create a sound hook with the AI voice-over",
      color: "from-indigo-500 to-purple-500",
      comingSoon: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="flex-1 flex flex-col">
        <motion.div
          className="p-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
              Creator Studio
            </h1>
            <p className="text-lg text-muted-foreground">
              Transform your content with AI-powered tools and reach millions of viewers
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <VideoUploadForm />
        </motion.div>

        <motion.div
          className="flex justify-center mt-16 pb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="max-w-6xl w-full px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">AI-Powered Tools</h2>
              <p className="text-muted-foreground text-lg">Enhance your content with cutting-edge AI technology</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {assetLibrary.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  onMouseEnter={() => setHoveredAsset(item.label)}
                  onMouseLeave={() => setHoveredAsset(null)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white shadow-lg`}
                      >
                        {item.icon}
                      </div>
                      <h3 className="font-semibold text-sm mb-2">{item.label}</h3>
                      {item.comingSoon && (
                        <Badge variant="secondary" className="text-xs">
                          Coming Soon
                        </Badge>
                      )}
                    </CardContent>

                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                  </Card>

                  <AnimatePresence>
                    {hoveredAsset === item.label && (
                      <motion.div
                        className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-20"
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-lg border max-w-xs text-xs font-medium">
                          {item.description}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
                <h3 className="text-xl font-bold mb-2">Ready to go viral?</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your video and let our AI create engaging content that reaches millions
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>10GB max file size</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>10 hour max duration</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span>MP4, MOV, WEBM</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}