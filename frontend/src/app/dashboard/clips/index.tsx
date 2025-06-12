import LoadingScreen from "@/app/accessories/LoadingScreen"
import { 
  changeAspectRatio, 
  getAllClips, SocialMediaForm, 
  allowedProviders, 
  Providers, 
  getAllSocialProviders,
  getMappedProviders,
} from "./clipHelper"
import {
  addVideoSubtitles
} from "./transcribingHelper"
import { useState, useMemo, useCallback, useEffect } from "react"
import { useAuth } from "@clerk/clerk-react"
import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query"
import ReactPlayer from "react-player"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { faYoutube, faTiktok, faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons"
import {
  Ellipsis,
  Download,
  Pencil,
  Proportions,
  Play,
  Pause,
  Maximize2,
  Share2,
  Clock,
  Eye,
  Grid3X3,
  List,
  Search,
  Filter,
  SortDesc,
  Copy,
  Captions
} from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import type { SocialMediaCardProps } from "@/types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { PlatformDataProps } from "@/types"


interface VideoProps {
  title: string
  link: string
  aspectRatio: string
  duration?: number
  createdAt?: string
  thumbnail?: string
}

interface VideoCardProps {
  video: VideoProps
  setVideoNumber: React.Dispatch<React.SetStateAction<number>>
  videoIdx: number
  currentIdx: number
  setCurrentIdx: React.Dispatch<React.SetStateAction<number>>
  adjustRationMutation: UseMutationResult<
    { clipTitle: string; newRatio: string; newLink: string },
    Error,
    { clipTitle: string; selectedRatio: string; selectedLink: string }
  >,
  addSubtitlesMutation: UseMutationResult<
    {newLink: string; title: string}, 
    Error, 
    {selectedLink: string; title: string }, 
    unknown
  >
  providerData: PlatformDataProps[]
  viewMode: "grid" | "list"
}

function VideoCard({ video, setVideoNumber, videoIdx, currentIdx, setCurrentIdx, viewMode, providerData, adjustRationMutation, addSubtitlesMutation }: VideoCardProps) {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [aspectRatio, setAspectRatio] = useState<string>(video.aspectRatio)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)

  const isPlaying = currentIdx === videoIdx

  const handleClick = () => {
    setCurrentIdx((prev) => (prev === videoIdx ? -1 : videoIdx))
  }

  const socialMediaCards: SocialMediaCardProps[] = [
    { name: "YouTube", type: "youtube", description: "Upload to Channel", icon: faYoutube },
    { name: "TikTok", type: "tiktok", description: "Upload to Feed", icon: faTiktok },
    { name: "Facebook", type: "facebook", description: "Upload to Page", icon: faFacebook },
    { name: "Instagram", type: "instagram", description: "Upload to Page", icon: faInstagram },
  ]

  const handleVideoLoad = () => {
    setVideoNumber((prev) => prev + 1)
  }

  const handleClipExpand = () => {
    setCurrentIdx(-1)
    setShowModal(true)
  }

  const handleDownloadClip = async (url: string, videoName: string) => {
    try {
      toast.info("Downloading video...")
      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to download video")

      const blob = await response.blob()
      const blobURL = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = blobURL
      link.download = videoName.split(" ").join("_") + ".mp4"
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      URL.revokeObjectURL(blobURL)

      toast.success("Successfully downloaded video")
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(video.link)
      toast.success("Link copied to clipboard")
    } catch (err) {
      toast.error("Failed to copy link")
    }
  }

  const handleRatioChange = async (video: VideoProps, ratio: string) => {
    if (ratio === aspectRatio || isProcessing) return

    setIsProcessing(true)
    toast.info("Starting conversion...")
    adjustRationMutation.mutate(
      {clipTitle: video.title, selectedRatio: ratio, selectedLink: video.link},
      {
        onSuccess: (data) => {
          toast.success("Aspect Ratio updated")
          setAspectRatio(data.newRatio)
        },
        onSettled: () => {
          setIsProcessing(false)
          setShowModal(false)
        }
      }
    )
  }

  const handleSubtitleAddition = async (link: string, title: string) => {
    if (isProcessing) return

    setIsProcessing(true)
    toast.info("Adding Subtitles...")
    addSubtitlesMutation.mutate(
      {selectedLink: link, title},
      {
        onSuccess: () => {
          toast.success("Added Subtitles to Video")
        },
        onSettled: () => {
          setIsProcessing(false)
        }
      }
    )
    
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const checkSelection = (provider: string) => {
    const mapped = getMappedProviders(providerData, provider)
    if (mapped) setSelectedPlatform(provider)
    else toast.error(`Please create a provider for ${provider}`)
  }

  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`group ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
      >
        <Card className="hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div
                className="relative w-32 h-20 bg-muted rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
                onClick={handleClipExpand}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <ReactPlayer
                  url={video.link}
                  width="100%"
                  height="100%"
                  playing={isPlaying}
                  loop={true}
                  onReady={handleVideoLoad}
                  light={video.thumbnail}
                />
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 bg-black/20 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full w-8 h-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleClick()
                        }}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate mb-1">{video.title}</h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{video.duration ? formatDuration(video.duration) : "0:30"}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {aspectRatio}
                  </Badge>
                  {isProcessing && (
                    <Badge variant="secondary" className="text-xs">
                      Processing...
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClipExpand}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <Ellipsis className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDownloadClip(video.link, video.title)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopyLink}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit Clip
                    </DropdownMenuItem> */}
                    <DropdownMenuItem>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative">
          <div
            className="aspect-video bg-muted cursor-pointer relative overflow-hidden"
            onClick={handleClipExpand}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <ReactPlayer
              url={video.link}
              width="100%"
              height="100%"
              playing={isPlaying}
              loop={true}
              onReady={handleVideoLoad}
              light={video.thumbnail}
            />

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full w-12 h-12 p-0 shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClick()
                    }}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>

                  <div className="absolute top-3 right-3">
                    <Button size="sm" variant="secondary" className="rounded-full w-8 h-8 p-0">
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {video.duration ? formatDuration(video.duration) : "01:00"}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-background/80">
                      {aspectRatio}
                    </Badge>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-background rounded-lg px-4 py-2 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium">Converting...</span>
                </div>
              </div>
            )}
          </div>

          <CardHeader className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate mb-1">{video.title}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  <span>Ready to share</span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Ellipsis className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleDownloadClip(video.link, video.title)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Clip
                  </DropdownMenuItem> */}
                  <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
        </div>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{video.title}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <ReactPlayer url={video.link} width="100%" height="100%" controls={true} playing={showModal} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => handleDownloadClip(video.link, video.title)}
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                {/* <Button variant="outline" className="justify-start gap-2">
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button> */}
                {/* <Button variant="outline" className="justify-start gap-2" onClick={() => handleSubtitleAddition(video.link, video.title)}>
                  <Captions className="w-4 h-4"/>
                  Add Subtitles
                </Button> */}
              </div>

              {/* <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Aspect Ratio</h4>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <div className="flex items-center gap-2">
                        <Proportions className="w-4 h-4" />
                        Current: {aspectRatio}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuLabel>Select Ratio</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={aspectRatio}
                      onValueChange={(value) => handleRatioChange(video, value)}
                    >
                      <DropdownMenuRadioItem value="1:1" className="cursor-pointer">
                        1:1 (Square)
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="9:16" className="cursor-pointer">
                        9:16 (Vertical)
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="16:9" className="cursor-pointer">
                        16:9 (Horizontal)
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div> */}

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Share to Social Media</h4>
                <div className="grid grid-cols-2 gap-2">
                  {socialMediaCards.map((platform) => (
                    <div key={platform.name + platform.type}>
                      <Button
                        key={platform.type}
                        variant="outline"
                        className={`w-full h-auto p-3 flex flex-col gap-1 ${
                          !allowedProviders.includes(platform.name) ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => allowedProviders.includes(platform.name) && checkSelection(platform.name)}
                        disabled={!allowedProviders.includes(platform.name)}
                      >
                        <FontAwesomeIcon icon={platform.icon} />
                        <div className="text-lg">{platform.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {allowedProviders.includes(platform.name) ? "Ready" : "Coming Soon"}
                        </div>
                      </Button>
                      <Sheet 
                        key={platform.name} 
                        open={selectedPlatform === platform.name} 
                        onOpenChange={(value) => setSelectedPlatform((prev) => value ? prev : null)}
                      >
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle className="text-2xl">Upload to {platform.name}</SheetTitle>
                            <SheetDescription>
                              <SocialMediaForm 
                                provider={platform.name as Providers} 
                                providerData={getMappedProviders(providerData, platform.name)} 
                                setter={setSelectedPlatform}
                                link={video.link}
                                title={video.title}
                              />
                            </SheetDescription>
                          </SheetHeader>
                        </SheetContent>
                      </Sheet>
                    </div>
                  ))}
                </div>
              </div>

              {/* <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Video Details</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Duration: {video.duration ? formatDuration(video.duration) : "0:30"}</div>
                  <div>Aspect Ratio: {aspectRatio}</div>
                  <div>Format: MP4</div>
                </div>
              </div> */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

function VideoCards({ videos, viewMode, projectIdentifier }: { videos: VideoProps[]; viewMode: "grid" | "list", projectIdentifier: string }) {
  const [loadedVideos, setLoadedVideos] = useState<number>(0)
  const [currentIdx, setCurrentIdx] = useState<number>(-1)
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  async function getPlatforms() {
    const token = await getToken()
    const data = await getAllSocialProviders(token)
    return data

  }

  const {data: providerData, isLoading: platformsLoading} = useQuery<PlatformDataProps[]>({
    queryKey:["SocialMediaProviderList"],
    queryFn: getPlatforms
  })

  const adjustRatioMutation = useMutation<
    { clipTitle: string; newRatio: string; newLink: string },
    Error,
    { clipTitle: string; selectedRatio: string; selectedLink: string }
  >({
    mutationFn: async ({clipTitle, selectedRatio, selectedLink}) => {
      const token = await getToken()
      const response = await changeAspectRatio(
          token,
          projectIdentifier,
          selectedRatio,
          selectedLink,
          clipTitle
        ) 
      return { newRatio: response.aspectRatio, newLink: response.link, clipTitle }
    },
    onSuccess: (data) => {
      queryClient.setQueryData<VideoProps[]>(
        ["ProjectVideoClips", projectIdentifier],
        (oldClips) => oldClips?.map((clip) => clip.title === data.clipTitle ? { ...clip, link: data.newLink, aspectRatio: data.newRatio } : clip) || []
      )
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  const addSubtitlesMutation = useMutation<
    {newLink: string, title: string},
    Error,
    {selectedLink: string, title: string}
  >({
    mutationFn: async ({selectedLink, title}) => {
      const token = await getToken()
      const response = await addVideoSubtitles(token, selectedLink, title)
      return {newLink: response.link, title: response.title}
    },
    onSuccess: (data) => {
      queryClient.setQueryData<VideoProps[]>(
        ["ProjectVideoClips", projectIdentifier],
        (oldClips) => oldClips.map((clip) => clip.title === data.title ? { ...clip, link: data.newLink} : clip) || []
      )
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  const allVideosLoaded = loadedVideos > 0 && loadedVideos >= videos.length

  const videoCards = useMemo(() => {
    return videos.map((video, idx) => (
      <VideoCard
        key={video.link}
        video={video}
        setVideoNumber={setLoadedVideos}
        videoIdx={idx}
        currentIdx={currentIdx}
        setCurrentIdx={setCurrentIdx}
        adjustRationMutation={adjustRatioMutation}
        addSubtitlesMutation={addSubtitlesMutation}
        viewMode={viewMode}
        providerData={providerData}
      />
    ))
  }, [videos, currentIdx, viewMode, providerData])

  return (
    <>
      {!allVideosLoaded && <LoadingScreen />}
      <AnimatePresence>
        <motion.div
          key={viewMode}
          className={`${
            viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
          } ${allVideosLoaded ? "" : "hidden"}`}
          layout
        >
          {videoCards}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

function ClipsHeader({
  videoCount,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
}: {
  videoCount: number
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Video Clips</h1>
          <p className="text-muted-foreground">
            {videoCount > 0 ? `${videoCount} clips ready to share` : "No clips available"}
          </p>
        </div>
      </div>

      {videoCount > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search clips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>

            <Button variant="outline" size="sm" className="gap-2">
              <SortDesc className="w-4 h-4" />
              Sort
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Page() {
  const { getToken, isLoaded } = useAuth()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [projectIdentifier, setProjectIdentifier] = useState("")

  useEffect(() => {
    const urlParts = window.location.pathname.split("/")
    const urlIdentifier = urlParts[urlParts.length - 1]
    setProjectIdentifier(urlIdentifier)
    console.log(projectIdentifier)
  })

  // const getVideoClips = useCallback(async () => {
  //   const token = await getToken()
  //   return await getAllClips(token, projectIdentifier)
  // }, [getToken])

  const getVideoClips = async () => {
    const token = await getToken()
    return await getAllClips(token, projectIdentifier)
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["ProjectVideoClips", projectIdentifier],
    queryFn: getVideoClips,
    refetchOnWindowFocus: false,
    staleTime: 3600 * 1000,
  })

  let videos: VideoProps[] = []
  if (data) videos = data as VideoProps[]

  const filteredVideos = videos.filter((video) => video.title.toLowerCase().includes(searchQuery.toLowerCase()))

  if (!isLoaded || isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="space-y-8 p-6">
      <ClipsHeader
        videoCount={filteredVideos.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {filteredVideos.length === 0 && !isLoading ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Eye className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No clips found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search terms."
              : "Your clips will appear here once processing is complete."}
          </p>
        </div>
      ) : (
        <VideoCards videos={filteredVideos} viewMode={viewMode} projectIdentifier={projectIdentifier}/>
      )}
    </div>
  )
}