import LoadingScreen from "@/app/accessories/LoadingScreen"
import { changeAspectRatio, handleSocialMediaUpload, getAllClips } from "./clipHelper"
import { useState, useMemo, useCallback } from "react"
import { useAuth } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query"
import ReactPlayer from "react-player"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePause, faCirclePlay } from "@fortawesome/free-solid-svg-icons"
import { faYoutube, faTiktok, faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Ellipsis, Download, Pencil, Proportions, CloudUpload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { SocialMediaCardProps } from "@/types"

interface VideoProps {
    title: string
    link: string,
    aspectRatio: string
}

const urlParts = window.location.pathname.split("/")
const projectIdentifier = urlParts[urlParts.length - 1]

interface VideoCardProps {
    video: VideoProps,
    setVideoNumber: React.Dispatch<React.SetStateAction<number>>,
    videoIdx: number,
    currentIdx: number,
    setCurrentIdx: React.Dispatch<React.SetStateAction<number>>
}

function VideoCard({video, setVideoNumber, videoIdx, currentIdx, setCurrentIdx}: VideoCardProps) {
    const { getToken } = useAuth()
    const [displayPlayback, setDisplayPlayback] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [aspectRatio, setAspectRatio] = useState<string>(video.aspectRatio)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const isTall = aspectRatio === "9:16"
    
    const handleClick = () => {
        setCurrentIdx((prev) => prev === videoIdx ? -1 : videoIdx)
    }

    const socialMediaCards: SocialMediaCardProps[] = [
        { name: "YouTube", type: "youtube", description: "Upload to Channel", icon: faYoutube},
        { name: "TikTok", type: "tiktok", description: "Upload to Feed", icon: faTiktok},
        { name: "Facebook", type: "facebook", description: "Upload to Page", icon: faFacebook},
        { name: "Instagram", type: "instagram", description: "Upload to Page", icon: faInstagram},
    ]

    const handleVideoLoad = () => {
        setVideoNumber((prev) => prev + 1)
    }
    
    const handleClipExpand = () => {
        setCurrentIdx(-1)
        setShowModal((prev) => !prev)
    }

    const handleSocialMediaClick = async (type: string, link: string, title: string) => {
        try {
            const token = await getToken()
            toast.info(`Uploading clip to ${type}`)
            const message = await handleSocialMediaUpload(type, link, title, token)
            toast.info(message)
        } catch (err) {
            toast.error(err.message)
        }
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
        } catch (err) {
            toast.error(err.message)
        }
    }
    
    const convertAspectRatio = async (video: VideoProps, ratio: string) => {
        if (ratio === aspectRatio || isProcessing) return

        try {
            setIsProcessing(true)
            toast.info("Starting conversion...")
            const token = await getToken()
            setShowModal(false)
            const response = await changeAspectRatio(token, projectIdentifier, ratio, video.link, video.title)
            if (!response.ok) throw new Error("Failed to convert aspect ratio")
            setAspectRatio(ratio)
            toast.success("Successfully changed aspect ratio")
        } catch (err) {
            toast.error(err.message)
        }
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="text-lg">{video.title}</div>
        <div 
            className={`flex${isTall ? "" : " flex-col"} justify-between bg-background hover:bg-secondary/20 hover:cursor-pointer items-center 
                w-[500px] h-[350px] rounded-lg p-4${isProcessing ? " pointer-events-none" : ""}`}
            onClick={(e) => {
              const target = e.target as HTMLElement
              if (
                target.closest("button") ||
                target.closest("[role='menu']") ||
                target.closest("svg") ||
                target.closest("a")
              ) return

              handleClipExpand()
            }}
            onMouseEnter={() => setDisplayPlayback(true)}
            onMouseLeave={() => setDisplayPlayback(false)}
        >
            <div className="relative w-full h-full rounded-lg flex items-center">
                <ReactPlayer url={video.link} width="100%" height="100%" playing={videoIdx === currentIdx} loop={true} onReady={handleVideoLoad} style={{ position: "absolute", top: 0, left: 0}}/>
                {displayPlayback &&                 
                    <FontAwesomeIcon 
                        icon={currentIdx !== videoIdx ? faCirclePlay : faCirclePause} 
                        className={`text-primary absolute ${isTall ? "top-33 left-24" : "top-30 left-50"}`} size="2x" onClick={handleClick}/>
                }
            </div>
            <div className={`text-base text-muted-foreground flex${isTall ? " flex-col h-full items-end" : " justify-end"} w-100 z-5`}>
              <DropdownMenu>
                  <DropdownMenuTrigger><Ellipsis /></DropdownMenuTrigger>
                  <DropdownMenuContent className="z-5">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="hover:cursor-pointer" onClick={() => handleDownloadClip(video.link, video.title)}><Download />Download Clip</DropdownMenuItem>
                      <DropdownMenuItem className="hover:cursor-pointer"><Pencil />Edit Clip</DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
            </div>
              {showModal && 
                <Dialog open={showModal}>
                    <DialogContent className="min-w-4xl">
                        <DialogHeader className="mb-4">
                            <DialogTitle className="text-4xl text-center">{video.title}</DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="flex gap-4">
                            <ReactPlayer url={video.link} width="600px" height="400px" controls={true} playing={showModal} />
                            <div className="flex flex-col gap-4 justify-center">
                                <Button 
                                  className="flex gap-2 font-bold justify-start" 
                                  variant="secondary" 
                                  onClick={() => handleDownloadClip(video.link, video.title)}
                                >
                                    <Download size={16}/>
                                    <div>Download Clip</div>
                                </Button>
                                <Button className="flex gap-2 font-bold justify-start" variant="secondary">
                                  <Pencil size={16}/>
                                  <div>Edit Clip</div>
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" className="flex gap-2 font-bold justify-start">
                                      <Proportions />
                                      <div>Change Aspect Ratio</div>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup value={aspectRatio} onValueChange={(value) => convertAspectRatio(video, value)} >
                                      <DropdownMenuRadioItem value="1:1" className="cursor-pointer">1:1</DropdownMenuRadioItem>
                                      <DropdownMenuRadioItem value="9:16" className="cursor-pointer">9:16</DropdownMenuRadioItem>
                                      <DropdownMenuRadioItem value="16:9" className="cursor-pointer">16:9</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" className="flex gap-2 font-bold justify-start">
                                    <CloudUpload />
                                    <div>Upload to Social Media</div>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                    <DialogTitle className="text-lg font-bold text-center">Choose a platform</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                    {socialMediaCards.map((card) => (
                                        <div
                                            key={card.type}
                                            className={`border border-4 rounded-lg p-4 flex flex-col items-center text-center gap-2 font-bold hover:bg-secondary/60 
                                            hover:cursor-pointer transition duration-300${card.name === "YouTube" ? "" : " pointer-events-none bg-muted"}`}
                                            onClick={() => handleSocialMediaClick(card.type, video.link, video.title)}
                                            
                                        >
                                        <FontAwesomeIcon icon={card.icon} size="xl"/>
                                        <div className="text-lg">{card.name}</div>
                                        <div className="text-muted-foreground text-sm">{card.description}</div>
                                        {card.name !== "YouTube" && <div className="text-muted-foreground text-sm">Coming soon!</div>}
                                        </div>
                                    ))}
                                    </div>
                                </DialogContent>
                                </Dialog>
                            </div>
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
              }
        </div>
      </div>
    )
}

function VideoCards({videos}: { videos: VideoProps[] }) {
    const [loadedVideos, setLoadedVideos] = useState<number>(0)
    const [currentIdx, setCurrentIdx] = useState<number>(-1)

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
            />
        ))
    }, [videos, currentIdx])

    return (
        <>
            {!allVideosLoaded && <LoadingScreen />}
            <div className={`flex gap-8 flex-wrap ${allVideosLoaded ? "" : "hidden"}`}>
                {videoCards}
            </div>
        </>
    )
}

export default function Page() {
    const { getToken, isLoaded } = useAuth()

    const getVideoClips = useCallback(async () => {
        const token = await getToken()
        return await getAllClips(token, projectIdentifier)
    }, [getToken])

    const {data, isLoading, error} = useQuery({
        queryKey: [`ProjectVideoClips${projectIdentifier}`],
        queryFn: getVideoClips,
        refetchOnWindowFocus: false,
        staleTime: 3600 * 1000,
        enabled: isLoaded,
        retry: false,
        refetchOnReconnect: false
    })

    let videos: VideoProps[] = []

    if (data) videos = data as VideoProps[]

    return (
        <div className="flex flex-col">
            <div className="font-bold text-2xl flex flex-col gap-4">
                <div className="text-muted-foreground text-base">Total clips {`${isLoading ? "" : `(${videos.length})`}`}</div>
                {isLoading ? <LoadingScreen /> : <VideoCards videos={videos} />}
            </div>
        </div>
    )
}