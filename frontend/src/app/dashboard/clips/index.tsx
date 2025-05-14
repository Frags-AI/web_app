import LoadingScreen from "@/app/accessories/LoadingScreen"
import { getAllClips } from "./clipHelper"
import { useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import { useQuery, } from "@tanstack/react-query"
import ReactPlayer from "react-player"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePause, faCirclePlay } from "@fortawesome/free-solid-svg-icons"

interface VideoProps {
    title: string
    link: string
}

function VideoCard({video, setVideoNumber}: { video: VideoProps, setVideoNumber: React.Dispatch<React.SetStateAction<number>>}) {

    const [displayPlayback, setDisplayPlayback] = useState<boolean>(false)
    const [isPaused, setIsPaused] = useState<boolean>(true)
    
    const handleClick = () => {
        setIsPaused((prev) => !prev)
    }

    const handleVideoLoad = () => {
        setVideoNumber((prev) => prev + 1)
    }
    

    return (
        <div 
            className="flex flex-col justify-between bg-background hover:bg-secondary/20 hover:cursor-pointer items-center w-[350px] rounded-lg p-4"
            onMouseEnter={() => setDisplayPlayback(true)}
            onMouseLeave={() => setDisplayPlayback(false)}
        >
            <div className="bg-secondary/20 p-4 relative rounded-lg">
                <ReactPlayer url={video.link} width="300px" height="200px" playing={!isPaused} loop={true} onReady={handleVideoLoad}/>
                {displayPlayback &&                 
                    <FontAwesomeIcon icon={isPaused ? faCirclePlay : faCirclePause} className="text-primary absolute top-25 left-35" size="2x" onClick={handleClick}/>
                }
            </div>
            <div className="text-base text-muted-foreground py-2">{video.title}</div>
        </div>
    )
}

function VideoCards({videos}: { videos: VideoProps[] }) {
    const [loadedVideos, setLoadedVideos] = useState<number>(0)

    const allVideosLoaded = loadedVideos === videos.length

    return (
        <>
            {!allVideosLoaded && <LoadingScreen />}
            <div className={`flex gap-8 flex-wrap ${allVideosLoaded ? "" : "hidden"}`}>
                {videos.map((video) => <VideoCard key={video.link} video={video} setVideoNumber={setLoadedVideos}/>)}
            </div>
        </>
    )
}

export default function Page() {
    const { getToken } = useAuth()
    const urlParts = window.location.pathname.split("/")
    const projectIdentifier = urlParts[urlParts.length - 1]

    async function getVideoClips() {
        const token = await getToken()
        return await getAllClips(token, projectIdentifier)
    }

    const {data, isLoading, error} = useQuery({
        queryKey: [`ProjectVideoClips${projectIdentifier}`],
        queryFn: getVideoClips,
        refetchOnWindowFocus: false
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