"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { uploadYoutube } from "./studioHelper"
import { Sparkles, Gem, Info, Upload, Video, Link, Loader2, CheckCircle2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@clerk/clerk-react"
import { motion, AnimatePresence } from "framer-motion"
import { useDropzone } from "react-dropzone"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"

interface ModelProps {
  name: string
  icon: LucideIcon | null
  color: string | null
  description: string
  features: string[]
}

const sources = [
  {
    name: "upload",
    label: "Upload File",
    icon: <Upload className="w-4 h-4" />,
    description: "Video up to 10GB, maximum duration of 10 hours (mp4, mov, webm)",
  },
  {
    name: "drive",
    label: "Google Drive",
    icon: <Link className="w-4 h-4" />,
    description: "Choose a video from Google Drive",
  },
]

type SourceName = (typeof sources)[number]["name"]

const models: ModelProps[] = [
  {
    name: "Basic",
    icon: null,
    color: null,
    description: "Perfect for getting started",
    features: ["Basic AI processing", "Standard quality", "Fast processing"],
  },
  {
    name: "Advanced",
    icon: Sparkles,
    color: "#bdc936",
    description: "Enhanced AI capabilities",
    features: ["Advanced AI processing", "High quality output", "Smart optimization"],
  },
  {
    name: "Pro",
    icon: Gem,
    color: "#45bde6",
    description: "Professional-grade results",
    features: ["Premium AI processing", "Ultra-high quality", "Priority processing"],
  },
]

export function VideoUploadForm() {
  const [uploadLink, setUploadLink] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedModel, setSelectedModel] = useState<"Basic" | "Advanced" | "Pro">("Basic")
  const [hoveredModel, setHoveredModel] = useState<"Basic" | "Advanced" | "Pro" | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [hoveredButton, setHoveredButton] = useState<SourceName | null>(null)
  const [videoProgress, setVideoProgress] = useState(0)
  const [thumbnailProgress, setThumbnailProgress] = useState(0)
  const placeholders = ["YouTube", "Twitch", "Rumble", "Zoom"]
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState<boolean>(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useQuery({
    queryKey: ["uploadValidation"],
    queryFn: async () => {
      setProcessing(true)
      if (!uploadLink.startsWith("https://youtu.be/") && !uploadLink.startsWith("https://www.youtube.com/watch")) {
        setUploadLink("")
        toast.error("Invalid YouTube Link")
        setProcessing(false)
        return ""
      } else {
        try {
          const token = await getToken()
          const data = await uploadYoutube(uploadLink, token, (progress: { video: number; thumbnail: number }) => {
            if (progress.video !== 0) setVideoProgress(progress.video)
            if (progress.thumbnail !== 0) setThumbnailProgress(progress.thumbnail)
          })
          toast.success("Video has been successfully uploaded")
          navigate("/dashboard/workflow", {
            state: { file: data.video, thumbnail: data.thumbnail, title: data.title, model: selectedModel },
          })
          return uploadLink
        } catch (err: any) {
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
    const file = e.target.files?.[0]
    if (file) setUploadedFile(file)
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const files = acceptedFiles

    if (files.length === 0) {
      toast.error("Please upload a .mp4, .webm, or .mov file", {
        duration: 5000,
      })
      return
    }

    setUploadedFile(files[0])
  }, [])

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".webm"],
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const handleModelSelect = (name: string) => {
    setSelectedModel(name as "Basic" | "Advanced" | "Pro")
  }

  const handleModelHover = (name: string | null) => {
    if (name) {
      setHoveredModel(name as "Basic" | "Advanced" | "Pro")
    } else setHoveredModel(null)
  }

  useEffect(() => {
    setProcessing(true)
    if (uploadedFile) {
      toast.success("File Successfully Uploaded")
      navigate("/dashboard/workflow", {
        state: { file: uploadedFile, title: uploadedFile.name, model: selectedModel },
      })
    }
    setProcessing(false)
  }, [uploadedFile])

  const totalProgress = Math.round((videoProgress + thumbnailProgress) / 2)

  return (
    <div className="flex justify-center px-8">
      <div className="w-full max-w-4xl">
        {/* Model Selection */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Choose Your AI Model</h3>
            <p className="text-muted-foreground">Select the processing power that fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {models.map((model, index) => (
              <motion.div
                key={`model-${index}`}
                className="relative"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    model.name === selectedModel ? "ring-2 ring-primary shadow-lg" : "hover:border-primary/50"
                  }`}
                  onClick={() => handleModelSelect(model.name)}
                  onMouseEnter={() => handleModelHover(model.name)}
                  onMouseLeave={() => handleModelHover(null)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      {model.icon && <model.icon className="w-6 h-6 mr-2" color={model.color} fill={model.color} />}
                      <h4 className="font-semibold text-lg">{model.name}</h4>
                      {model.name === selectedModel && <CheckCircle2 className="w-5 h-5 text-primary ml-2" />}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{model.description}</p>
                    <div className="space-y-1">
                      {model.features.map((feature, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground flex items-center justify-center">
                          <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Tooltip */}
                <AnimatePresence>
                  {hoveredModel === model.name && (
                    <motion.div
                      className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20"
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-lg border text-xs font-medium whitespace-nowrap">
                        {model.description}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card
            className={`relative overflow-hidden transition-all duration-300 ${
              processing ? "opacity-60 pointer-events-none" : ""
            } ${isDragActive ? "border-primary border-2 bg-primary/5" : ""}`}
            {...getRootProps()}
          >
            <CardContent className="p-8">
              {isDragActive ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Video className="w-16 h-16 text-primary mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">Drop your video here</h3>
                  <p className="text-muted-foreground">Supports MP4, MOV, WEBM files</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* URL Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Paste Video URL</label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder={`Paste a ${placeholders[placeholderIndex]} URL`}
                        value={uploadLink}
                        onChange={(e) => setUploadLink(e.target.value)}
                        className="pl-10"
                        disabled={processing}
                      />
                      <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Upload Options */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-muted" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {sources.map((source) => (
                        <div key={source.name} className="relative">
                          <Button
                            variant="outline"
                            className="w-full h-auto p-4 flex flex-col gap-2 hover:bg-primary/5 transition-colors"
                            onClick={() => {
                              if (source.name === "upload") {
                                fileInputRef.current?.click()
                                setHoveredButton(null)
                              } else {
                                const driveLink = prompt("Paste your Google Drive link:")
                                if (driveLink?.startsWith("http")) setUploadLink(driveLink)
                              }
                            }}
                            onMouseEnter={() => setHoveredButton(source.name)}
                            onMouseLeave={() => setHoveredButton(null)}
                            disabled={processing}
                          >
                            {source.icon}
                            <span className="font-medium">{source.label}</span>
                          </Button>

                          <AnimatePresence>
                            {hoveredButton === source.name && (
                              <motion.div
                                className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-20"
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-lg border max-w-xs text-xs font-medium">
                                  {source.description}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover" />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Processing Status */}
                  {processing && (
                    <motion.div
                      className="space-y-4 p-4 bg-muted/50 rounded-lg"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="font-medium">Processing your video...</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Overall Progress</span>
                          <span>{totalProgress}%</span>
                        </div>
                        <Progress value={totalProgress} className="h-2" />
                      </div>

                      {videoProgress > 0 && (
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Video</span>
                              <span>{videoProgress}%</span>
                            </div>
                            <Progress value={videoProgress} className="h-1" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Thumbnail</span>
                              <span>{thumbnailProgress}%</span>
                            </div>
                            <Progress value={thumbnailProgress} className="h-1" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Demo Button */}
                  <div className="text-center">
                    <Button variant="outline" className="gap-2" disabled={processing}>
                      <Video className="w-4 h-4" />
                      View Demonstration
                    </Button>
                  </div>

                  {/* Info */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium mb-1">Upload Tips</p>
                        <p>
                          We recommend uploading the highest resolution of your video to ensure the best quality for
                          clips. Supported formats: MP4, MOV, WEBM up to 10GB.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <input type="file" accept="video/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
    </div>
  )
}