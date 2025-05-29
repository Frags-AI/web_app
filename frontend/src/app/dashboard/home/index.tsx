"use client"

import { useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { deleteProject, getProjects } from "./homeHelper"
import { useAuth } from "@clerk/clerk-react"
import LoadingScreen from "@/app/accessories/LoadingScreen"
import { useNavigate } from "react-router-dom"
import type { ProjectProps } from "@/types"
import {
  Ellipsis,
  Hourglass,
  Loader,
  Plus,
  Search,
  Grid3X3,
  List,
  Calendar,
  Clock,
  Video,
  Share2,
  Trash2,
  Eye,
  Download,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { trackProgress } from "./homeHelper"
import { useTime, useTransform, motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

function ProjectProcessingOverlay({ project }: { project: ProjectProps }) {
  const [motionProgress, setMotionProgress] = useState<number>(0)
  const [clippingProgress, setClippingProgress] = useState<number>(0)
  const time = useTime()

  const rotate = useTransform(time, [0, 5000], [0, 360], {
    clamp: false,
  })

  const rotatingBorder = useTransform(rotate, (r) => {
    return `conic-gradient(from ${r}deg, #3b82f6 0deg, #8b5cf6 120deg, #06b6d4 240deg, #3b82f6 360deg)`
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

  const totalProgress = Math.round(motionProgress * 0.5 + clippingProgress * 0.5)

  return (
    <motion.div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative">
        <motion.div
          className="absolute -inset-1 rounded-full opacity-75 blur-sm"
          style={{ background: rotatingBorder }}
        />
        <div className="relative bg-background px-6 py-4 rounded-full border shadow-lg">
          <div className="flex items-center gap-3">
            {totalProgress < 100 ? (
              <>
                <Hourglass className="w-5 h-5 animate-pulse text-primary" />
                <div className="font-semibold text-sm">Processing {totalProgress}%</div>
              </>
            ) : (
              <>
                <Loader className="w-5 h-5 animate-spin text-primary" />
                <div className="font-semibold text-sm">Finalizing...</div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ProjectCard({ project, onDelete }: { project: ProjectProps; onDelete: (id: string) => void }) {
  const navigate = useNavigate()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleCardClick = () => {
    if (project.status !== "processing") {
      navigate(`/dashboard/clips/${project.identifier}`)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
          <div className="relative">
            <CardContent className="p-0">
              <div
                className="aspect-video bg-muted rounded-t-lg overflow-hidden cursor-pointer relative"
                onClick={handleCardClick}
              >
                <img
                  src={project.thumbnail || "/placeholder.svg"}
                  alt={project.title}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    project.status === "processing" ? "blur-sm" : "group-hover:scale-105"
                  }`}
                />

                {/* Overlay for non-processing projects */}
                {project.status !== "processing" && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
              </div>

              {/* Processing overlay */}
              <AnimatePresence>
                {project.status === "processing" && <ProjectProcessingOverlay project={project} />}
              </AnimatePresence>
            </CardContent>

            <CardHeader className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate mb-1">{project.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(project.createdAt || new Date().toISOString())}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={project.status === "completed" ? "default" : "secondary"} className="text-xs">
                    {project.status}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Ellipsis className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <Eye className="w-4 h-4 mr-2" />
                        View Project
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Project
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
          </div>
        </Card>
      </motion.div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription className="space-y-4">
              <p>
                You are about to delete <strong>"{project.title}"</strong>. This action cannot be undone.
              </p>
              <p>
                This will permanently delete all project data including clips, transcriptions, and associated files.
              </p>
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete(project.identifier)
                    setShowDeleteDialog(false)
                  }}
                >
                  Delete Project
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

function EmptyState() {
  const navigate = useNavigate()

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Video className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Get started by creating your first project. Upload a video and let our AI create amazing clips for you.
      </p>
      <Button onClick={() => navigate("/dashboard/upload")} className="gap-2">
        <Plus className="w-4 h-4" />
        Create Your First Project
      </Button>
    </motion.div>
  )
}

function ProjectStats({ projects }: { projects: ProjectProps[] }) {
  const totalProjects = projects?.length || 0
  const processingProjects = projects?.filter((p) => p.status === "processing").length || 0
  const completedProjects = projects?.filter((p) => p.status === "completed").length || 0

  const stats = [
    { label: "Total Projects", value: totalProjects, icon: Video },
    { label: "Processing", value: processingProjects, icon: Clock },
    { label: "Completed", value: completedProjects, icon: Eye },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default function Home() {
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterStatus, setFilterStatus] = useState<"all" | "processing" | "completed">("all")

  async function getAllProjects() {
    const token = await getToken()
    return await getProjects(token)
  }

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["UserProjectInformation"],
    queryFn: getAllProjects,
    refetchOnWindowFocus: false,
  })

  const projects = data as ProjectProps[]

  const filteredProjects =
    projects?.filter((project) => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterStatus === "all" || project.status === filterStatus
      return matchesSearch && matchesFilter
    }) || []

  const deleteUserProject = async (identifier: string) => {
    try {
      const token = await getToken()
      const data = await deleteProject(token, identifier)
      toast.success(data.message)
      refetch()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Manage and view all your video projects</p>
          </div>
          <Button onClick={() => navigate("/dashboard/upload")} className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>

        {/* Stats */}
        {projects && projects.length > 0 && <ProjectStats projects={projects} />}

        {/* Search and Filters */}
        {projects && projects.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Tabs value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="processing">Processing</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Projects */}
      <div>
        {!projects || projects.length === 0 ? (
          <EmptyState />
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No projects match your search criteria.</p>
          </div>
        ) : (
          <motion.div
            className={`grid gap-6 ${
              viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
            }`}
            layout
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <ProjectCard key={project.identifier} project={project} onDelete={deleteUserProject} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}