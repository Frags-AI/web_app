import React from 'react'
import { UserButton, UserProfile } from '@clerk/clerk-react';
import * as ProfileService from './ProfileService'
import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import ProtectedRoute from '../authentication/ProtectedRoute';
import Icons from "@/components/icons"
import { useNavigate, Navigate } from 'react-router-dom';

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
    <div className="mb-4  h-screen w-full flex items-center justify-center">
      <ProtectedRoute>
        <UserProfile >
          <UserProfile.Link label="Home" url="/" labelIcon={<Icons.Home size={16}/>} />
          <UserProfile.Link label="Dashboard" url="/dashboard" labelIcon={<Icons.LayoutDashboard size={16}/>} /> 
          <UserProfile.Link label="Logout" url="/signout" labelIcon={<Icons.LogOut size={16}/>} />
        </UserProfile>


      </ProtectedRoute>
    </div>
  );
}

export default Profile;
