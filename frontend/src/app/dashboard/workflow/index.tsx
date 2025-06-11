"use client"

import { useLocation, useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@clerk/clerk-react"
import { createProject } from "./workflowHelper"
import { motion, AnimatePresence } from "framer-motion"
import {
  LoaderCircle,
  Sparkles,
  Gem,
  Play,
  Settings,
  Type,
  Scissors,
  Globe,
  Clock,
  Gamepad2,
  RotateCcw,
  CheckCircle2,
  Info,
  Shield,
} from "lucide-react"
import { generateVideoThumbnail } from "@/lib/thumbnail"

export default function EnhancedWorkflow() {
  const location = useLocation()
  const navigate = useNavigate()
  const [genre, setGenre] = useState<string>("Auto")
  const [clipLength, setClipLength] = useState<string>("Auto")
  const [language, setLanguage] = useState<string>("Auto")
  const [thumbnailURL, setThumbnailURL] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState("AI Clipping")
  const { getToken } = useAuth()

  const model: string = location.state?.model || "Basic"
  const file: File = location.state?.file || null
  const thumbnail: Blob = location.state?.thumbnail || null
  const title: string = location.state?.title || "Untitled Video"

  useEffect(() => {
    if (!file) {
      toast.error("Invalid File Format")
      navigate("/dashboard/studio", { state: { toastMessage: "Please upload a video first" } })
    } else {
      if (thumbnail) {
        setThumbnailURL(URL.createObjectURL(thumbnail))
      } else {
        const generateThumbnail = async () => {
          const response = await generateVideoThumbnail(file)
          setThumbnailURL(response)
        }
        generateThumbnail()
      }
    }
  }, [])

  const handleDefaultClick = () => {
    setClipLength("Auto")
    setGenre("Auto")
    setLanguage("Auto")
    toast.success("Reset to default settings")
  }

  const handleClipClick = async () => {
    setLoading(true)
    try {
      const token: string = await getToken()
      const image = thumbnail ? new File([thumbnail], "project_thumbnail.png", { type: "image/png" }) : null

      const response = await createProject(token, file as File, image, title)
      if (!response) {
        toast.error("Something went wrong, please try again")
        setLoading(false)
        return
      }
      toast.success("Your video is currently being processed, we will let you know when it is done!")
      setLoading(false)
      navigate("/dashboard")
    } catch (err) {
      setLoading(false)
      toast.error("Something went wrong, Please try again")
    }
  }

  const getModelIcon = () => {
    switch (model) {
      case "Advanced":
        return <Sparkles className="w-4 h-4" />
      case "Pro":
        return <Gem className="w-4 h-4" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  const getModelColor = () => {
    switch (model) {
      case "Advanced":
        return "from-yellow-500 to-orange-500"
      case "Pro":
        return "from-blue-500 to-purple-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Video Workflow
          </h1>
          <p className="text-lg text-muted-foreground">Configure your AI processing settings</p>
        </motion.div>

        {/* Video Preview Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* Video Thumbnail */}
                <div className="relative">
                  <div className="w-80 h-48 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {thumbnailURL ? (
                      <img
                        src={thumbnailURL || "/placeholder.svg"}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center">
                        <LoaderCircle className="w-8 h-8 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="gap-1">
                      <Play className="w-3 h-3" />
                      Video
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className={`gap-1 bg-gradient-to-r ${getModelColor()} text-white border-0`}>
                      {getModelIcon()}
                      {model}
                    </Badge>
                  </div>
                </div>

                {/* Video Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        Ready to process
                      </Badge>
                      <Badge variant="outline">
                        <Gamepad2 className="w-3 h-3 mr-1" />
                        {genre} Genre
                      </Badge>
                    </div>
                  </div>

                  {/* Copyright Notice */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p className="font-medium">Copyright & Fair Use Notice</p>
                        <p>
                          All rights to images, music, clips, and materials belong to their respective owners. This
                          content may be used under Fair Use guidelines.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Processing Features</h2>
            <p className="text-muted-foreground">Customize how AI will process your video</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="AI Clipping" className="gap-2">
                <Scissors className="w-4 h-4" />
                AI Clipping
              </TabsTrigger>
              <TabsTrigger value="Edit Captions" className="gap-2">
                <Type className="w-4 h-4" />
                Captions
              </TabsTrigger>
              <TabsTrigger value="Adjust Clips" className="gap-2">
                <Settings className="w-4 h-4" />
                Advanced
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="AI Clipping" className="mt-0">
                  <Card>
                    <CardHeader className="text-center">
                      <CardTitle className="flex items-center justify-center gap-2">
                        <Scissors className="w-5 h-5" />
                        AI Clipping Configuration
                      </CardTitle>
                      <CardDescription>
                        AI will find hooks, highlights, and turn your video into viral shorts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Gamepad2 className="w-4 h-4" />
                            Genre
                          </label>
                          <Select value={genre} onValueChange={setGenre}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Auto">Auto Detect</SelectItem>
                              <SelectItem value="FPS">First Person Shooter</SelectItem>
                              <SelectItem value="RPG">Role Playing Game</SelectItem>
                              <SelectItem value="MMORPG">MMO RPG</SelectItem>
                              <SelectItem value="Strategy">Strategy</SelectItem>
                              <SelectItem value="Sports">Sports</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Clip Length
                          </label>
                          <Select value={clipLength} onValueChange={setClipLength}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Auto">Auto (0-3m)</SelectItem>
                              <SelectItem value="Short">Short (&lt;30s)</SelectItem>
                              <SelectItem value="Medium">Medium (30-59s)</SelectItem>
                              <SelectItem value="Long">Long (60-89s)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Language
                          </label>
                          <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Auto">Auto Detect</SelectItem>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="Spanish">Spanish</SelectItem>
                              <SelectItem value="French">French</SelectItem>
                              <SelectItem value="German">German</SelectItem>
                              <SelectItem value="Japanese">Japanese</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-medium mb-1">AI Processing Info</p>
                            <p className="text-muted-foreground">
                              The AI will analyze your video content, detect key moments, and create engaging clips
                              optimized for social media platforms.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-center">
                      <Button variant="outline" onClick={handleDefaultClick} className="gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Reset to Default
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="Edit Captions" className="mt-0">
                  <Card>
                    <CardHeader className="text-center">
                      <CardTitle className="flex items-center justify-center gap-2">
                        <Type className="w-5 h-5" />
                        Caption Settings
                      </CardTitle>
                      <CardDescription>Configure automatic caption generation and styling</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Caption Style</label>
                            <Select defaultValue="modern">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="modern">Modern</SelectItem>
                                <SelectItem value="classic">Classic</SelectItem>
                                <SelectItem value="bold">Bold</SelectItem>
                                <SelectItem value="minimal">Minimal</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Position</label>
                            <Select defaultValue="bottom">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="top">Top</SelectItem>
                                <SelectItem value="center">Center</SelectItem>
                                <SelectItem value="bottom">Bottom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="bg-muted/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="font-medium text-sm">Auto-generated captions will include:</span>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                            <li>• Accurate speech-to-text transcription</li>
                            <li>• Proper timing and synchronization</li>
                            <li>• Stylized text formatting</li>
                            <li>• Multi-language support</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="Adjust Clips" className="mt-0">
                  <Card>
                    <CardHeader className="text-center">
                      <CardTitle className="flex items-center justify-center gap-2">
                        <Settings className="w-5 h-5" />
                        Advanced Settings
                      </CardTitle>
                      <CardDescription>Fine-tune the AI processing parameters</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Sensitivity</label>
                            <Select defaultValue="medium">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low - Fewer clips</SelectItem>
                                <SelectItem value="medium">Medium - Balanced</SelectItem>
                                <SelectItem value="high">High - More clips</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Quality Priority</label>
                            <Select defaultValue="balanced">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="speed">Speed</SelectItem>
                                <SelectItem value="balanced">Balanced</SelectItem>
                                <SelectItem value="quality">Quality</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="bg-muted/30 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <Settings className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="font-medium mb-1">Processing Options</p>
                              <p className="text-muted-foreground">
                                These settings control how the AI analyzes and processes your content. Higher
                                sensitivity will detect more potential clips, while quality priority affects processing
                                time.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>

        {/* Action Button */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            size="lg"
            className="w-full max-w-md gap-2 text-lg font-semibold"
            onClick={handleClipClick}
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle className="w-5 h-5 animate-spin" />
                Processing Video...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Convert Video to Clips
              </>
            )}
          </Button>

          {loading && (
            <motion.p className="text-sm text-muted-foreground mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              This may take a few minutes depending on video length...
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
