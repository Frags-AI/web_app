import React from 'react'
import { UserButton, UserProfile } from '@clerk/clerk-react';
import * as ProfileService from './ProfileService'
import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import ProtectedRoute from '../authentication/ProtectedRoute';
import Icons from "@/components/icons"
import { useNavigate, Navigate } from 'react-router-dom';
import appearance from '@/clerk/clerkStyles';

interface Video {
  id: string,
  url: string
}

const Profile: React.FC = ({children}: {children: React.ReactNode}) => {
  const { getToken } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        alert("Please select a video first.");
        return;
      }

      const token = await getToken()
      const data = await ProfileService.uploadVideo(file, token)

      alert(data.message || "Upload successful!");
      setFile(null);
      fetchVideos();
    } catch (error) {
      console.log("Error uploading video:", error);
      alert(error.message || "Something went wrong uploading the video.");
    }
  };

  const fetchVideos = async () => {
    const token = await getToken()
    const response = await ProfileService.fetchVideos(token)
    setVideos(response.videos || [])
  };

  return (
    <div className="mb-4 text-white h-screen w-full flex items-center justify-center">
      <ProtectedRoute>
        <UserProfile 
          appearance={{
            elements: {
              cardBox: "w-screen h-screen",
            }
          }}
        >
          <UserProfile.Page label="Settings" url="/settings" labelIcon={<Icons.Settings size={16}/>} >
            <div>
              <input type="file" onChange={handleFileChange} />
              <button onClick={handleUpload}>Upload Video</button>
              <ul>
                {videos.map((video) => (
                  <li key={video.id}>
                    <a href={video.url} target="_blank" rel="noopener noreferrer">
                      {video.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </UserProfile.Page>
          <UserProfile.Link label="Home" url="/" labelIcon={<Icons.Home size={16}/>} />
          <UserProfile.Link label="Dashboard" url="/dashboard" labelIcon={<Icons.LayoutDashboard size={16}/>} /> 
          <UserProfile.Link label="Logout" url="/signout" labelIcon={<Icons.LogOut size={16}/>} />
        </UserProfile>


      </ProtectedRoute>
    </div>
  );
}

          {/* <div className="[--header-height:calc(theme(spacing.14))]">
    <SidebarProvider className="flex flex-col">
      <SiteHeader />
      <div className="flex flex-1">
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  </div> */}

export default Profile;
