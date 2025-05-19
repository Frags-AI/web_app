import { useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { deleteProject, getProjects } from "./homeHelper"
import { useAuth } from "@clerk/clerk-react"
import LoadingScreen from "@/app/accessories/LoadingScreen"
import { useNavigate } from "react-router-dom"
import { ProjectProps } from "@/types"
import { Ellipsis, Hourglass, Loader } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { trackProgress } from "./homeHelper"
import { useTime, useTransform, motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"


function ProjectProcessingOverlay({ project }: { project: ProjectProps }) {
    const [motionProgress, setMotionProgress] = useState<number>(0)
    const [clippingProgress, setClippingProgress] = useState<number>(0)
    const time = useTime();

    const rotate = useTransform(time, [0, 5000], [0, 360], {
        clamp: false
    }) 
    const rotatingBorder = useTransform(rotate, (r) => {
        return `conic-gradient(from ${r}deg, #ffffff 0deg, #c0c0c0 30deg, #a0a0a0 60deg, #808080 90deg, #a0a0a0 120deg, #c0c0c0 150deg, #ffffff 180deg, #c0c0c0 210deg,
            #a0a0a0 240deg, #808080 270deg, #a0a0a0 300deg, #c0c0c0 330deg, #ffffff 360deg)`
    })

    const setProcessingProgress = (currentMotionProgress: number, currentClippingProgress: number) => {
        setMotionProgress(currentMotionProgress)
        setClippingProgress(currentClippingProgress)
    }

    const getProcessingStatus = () => {
        trackProgress(setProcessingProgress, project.jobId)
    }


    useEffect(() => {
        getProcessingStatus()
    }, [])

    const totalProgress = (motionProgress * .5) + (clippingProgress * .5)

    return (
        <div className="absolute left-17 top-20 w-[10rem] rounded-lg">
            <div className="relative">
                {totalProgress !== 100 &&                 
                    <div className={`relative bg-background px-4 py-2 rounded-lg text-highlight flex gap-2 justify-center z-10`}>
                        <Hourglass width="24" className="animate-pulse font-bold"/>
                        <div className="font-bold">{totalProgress}%</div>
                    </div>
                }
                {totalProgress === 100 &&                 
                    <div className={`relative bg-background px-4 py-2 rounded-lg text-highlight flex gap-2 justify-center z-10`}>
                        <Loader className="animate-spin" />
                        <div className="font-bold">Transferring</div>
                    </div>
                }
                <motion.div className="absolute -inset-[2px] rounded-lg bg-highlight" style={{background: rotatingBorder}} />
            </div>
        </div>
    )
}

function ProjectCards({projects}: {projects: ProjectProps[]}) {
    const { getToken } = useAuth()
    const navigate = useNavigate()
    const [displayDeleteForm, setDisplayDeleteForm] = useState<boolean>(false)

    const handleCardClick = (identifier: string) => {
        navigate(`/dashboard/clips/${identifier}`)
    }

    const deleteUserProject = async (identifer: string) => {
        try {
            const token = await getToken()
            const data = await deleteProject(token, identifer)
            toast.success(data.message)
        } catch (err) {
            toast.error(err.message)
        }
    }

    return (
        <div className="flex flex-wrap gap-16 mt-8">
            {projects.map((project) => (
                <div className={`bg-primary/5 p-4 rounded-lg w-[18.75rem] h-[15rem] relative flex flex-col`}>
                    <div className="bg-background grow flex justify-center w-full h-4/5 hover:cursor-pointer" onClick={() => handleCardClick(project.identifier)}>
                        <img src={project.thumbnail} className={`object-contain ${project.status === "processing" ? "blur-xs" : ""}`} />
                    </div>
                    <div className="flex items-center mt-4 gap-4 w-full justify-between">
                        <div className="text-muted-foreground text-xs truncate text-ellipsis">{project.title}</div>
                        <DropdownMenu>
                            <DropdownMenuTrigger><Ellipsis /></DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Options</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="hover:cursor-pointer">Share Project</DropdownMenuItem>
                                <DropdownMenuItem className="hover:cursor-pointer" onClick={() => setDisplayDeleteForm(true)}>Delete Project</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {displayDeleteForm &&
                            <Dialog open={displayDeleteForm} onOpenChange={() => setDisplayDeleteForm((prev) => !prev)}>
                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle className="mb-4">You are about to delete "{project.title}"</DialogTitle>
                                <DialogDescription className="flex flex-col gap-4">
                                    <div>This action cannot be undone. This will permanently delete all of the project data from your account, including clips and transcriptions</div>
                                    <div className="font-bold text-foreground text-lg">Are you sure you want to delete this project?</div>
                                    <div className="flex gap-4 justify-end">
                                        <Button variant="outline">Cancel</Button>
                                        <Button className="bg-red-500 hover:bg-red-600 text-foreground" onClick={() => deleteUserProject(project.identifier)}>Delete Project</Button>
                                    </div>
                                </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                            </Dialog>
                        }
                    </div>
                    {project.status === "processing" && <ProjectProcessingOverlay project={project} />}
                </div>
            ))}
        </div>
    )
}

export default function Home() {
    const { getToken } = useAuth()

    async function getAllProjects() {
        const token = await getToken()
        return await getProjects(token)
    }

    const {data, error, isLoading} = useQuery({
        queryKey: ["UserProjectInformation"],
        queryFn: getAllProjects
    })

    const projects = data as ProjectProps[]
    const testProjects = []
    if (projects) for (let i = 0; i < 10; i++) testProjects.push(projects[0])

    
    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Welcome to your dashboard</h1>
                <p className="text-muted-foreground">Here you can view all of your current projects</p>
            </div>
            <div className="mt-12">
                <div className="font-bold text-2xl">Projects</div>
                {isLoading ? <LoadingScreen /> : <ProjectCards projects={projects} />}
            </div>
        </div>
    )
}