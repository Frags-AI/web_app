import React, { useState } from "react"
import { Home, Video, Upload, Settings, User, LogOut, Plus, Search, MoreVertical, Play } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import Icons from "../icons"

export default function Dashboard() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadDialogOpen(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden md:flex w-64 flex-col bg-background border-r p-4">
        <div className="flex items-center mb-8">
          <Video className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">VideoHub</h1>
        </div>
        
        <nav className="space-y-1 flex-1">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="#" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="#" className="flex items-center">
              <Video className="mr-2 h-4 w-4" />
              My Videos
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="#" className="flex items-center">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="#" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </a>
          </Button>
        </nav>
        
        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-primary mr-2"></div>
            <div>
              <p className="text-sm font-medium">User Name</p>
              <p className="text-xs text-muted-foreground">user@example.com</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Video Dashboard</h1>
            <p className="text-muted-foreground">Manage and upload your videos</p>
          </div>
          
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search videos..."
                className="w-full md:w-[200px] pl-8"
              />
            </div>
                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Video
                    </Button>
                </DialogTrigger>
                <DialogContent className="text-white">
                    <DialogHeader>
                    <DialogTitle>Upload New Video</DialogTitle>
                    <DialogDescription className="text-stone-500">
                        Upload a new video to your dashboard.
                    </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Video Title</Label>
                        <Input id="title" placeholder="Enter video title" />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" placeholder="Enter video description" />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="file">Video File</Label>
                        <Input id="file" type="file" accept="video/*" className="file:text-white file:cursor-pointer">
                        </Input>
                    </div>
                    
                    {isUploading && (
                        <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Uploading...</Label>
                            <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} />
                        </div>
                    )}
                    </div>
                    
                    <DialogFooter>
                    <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Upload Video"}
                    </Button>
                    </DialogFooter>
                </DialogContent>
                </Dialog>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,024</div>
              <p className="text-xs text-muted-foreground">+256 from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4 GB</div>
              <p className="text-xs text-muted-foreground">of 10 GB (24%)</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Videos</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
            <TabsTrigger value="popular">Most Popular</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((video) => (
                <VideoCard key={video} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((video) => (
                <VideoCard key={video} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="popular" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4].map((video) => (
                <VideoCard key={video} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function VideoCard() {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <Button variant="ghost" size="icon" className="rounded-full bg-background/80">
            <Play className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">Video Title</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>Added on Mar 18, 2025</CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
        <div>128 views</div>
        <div>2:45</div>
      </CardFooter>
    </Card>
  )
}