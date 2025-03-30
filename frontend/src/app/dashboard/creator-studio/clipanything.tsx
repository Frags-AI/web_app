import React, { useState, useRef, useEffect } from "react";
import Sidebar from "@/app/dashboard/Sidebar";
import Header from "../Header";
import AIButton from "../AIButton";
import { Link } from "react-router-dom";

const placeholders = ["YouTube", "Twitch", "Rumble", "Zoom"];

export default function ClipAnything() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [uploadName, setUploadName] = useState(""); // Zoom link or filename
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadName(file.name);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.dataTransfer.getData("text/plain");
    if (text.startsWith("http")) {
      setUploadName(text);
    }
  };

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000); // 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-[#050406] text-white">
      {/* Sidebar */}
      <Sidebar
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
        className="h-full"
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <Header />

        {/* Page header */}
        <div className="p-4">
          <h1 className="text-2xl font-bold">Creator Studio</h1>
          <p>Welcome to your creator dashboard.</p>
        </div>

        {/* Centered Card */}
        <div className="flex justify-center mt-15">
          <div className="flex flex-col items-center">
            {/* ClipBasic / ClipAnything header - notice the reversed styling */}
            <div className="flex items-center gap-6 text-sm text-white mb-4">
              <Link
                to="/dashboard/studio"
                className="font-semibold text-white cursor-pointer flex items-center gap-1 px-2 py-2 rounded-md hover:bg-zinc-700 transition"
              >
                ClipBasic
              </Link>
              <Link
                to="/dashboard/clipanything"
                className="font-semibold text-[#e3c77c] cursor-pointer flex items-center gap-1 px-2 py-2 rounded-md hover:bg-zinc-700 transition"
                >
                ✨ ClipAnything
                <span className="text-zinc-400">ⓘ</span>
                </Link>

            </div>

            {/* Card with Midway Border Cut - identical styling to ClipBasic */}
            <div className="relative bg-[#050406] rounded-xl p-6 shadow-md w-[550px] border border-[#363638]">
              {/* Midway cut overlay */}
              <div className="absolute -bottom-[1px] left-1/2 transform -translate-x-1/2 w-[550px] h-[19px] z-10 bg-[#050406]" />

              {/* Card Content - different content for ClipAnything */}
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 text-sm">🔗</span>
                  <input
                    type="text"
                    placeholder={`Paste a ${placeholders[placeholderIndex]} URL`}
                    value={uploadName}
                    onChange={(e) => setUploadName(e.target.value)}
                    className="bg-zinc-800 text-white p-3 pl-8 rounded-md outline-none placeholder:text-zinc-400 w-full"
                  />
                </div>

                {/* Upload buttons - same as ClipBasic */}
                <div className="flex gap-6 items-center text-sm text-zinc-400 mt-2 px-1">
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-700 transition"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <img
                      src="/assets/cloud-computing.png"
                      alt="Upload Icon"
                      className="w-4 h-4"
                    />
                    <span>Upload</span>
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-700 transition"
                    onClick={() => {
                      const driveLink = prompt("Paste your Google Drive link:");
                      if (driveLink?.startsWith("http")) setUploadName(driveLink);
                    }}
                  >
                    <img
                      src="/assets/google-drive.png"
                      alt="Google Drive Icon"
                      className="w-4 h-4"
                    />
                    <span>Google Drive</span>
                  </button>
                </div>

                {/* Button - different text for ClipAnything */}
                <button className="bg-[#e3c77c] text-black font-bold py-3 rounded-md text-center">
                  Extract clips with AI
                </button>
                <a
                  href="#"
                  className="text-sm text-white underline text-center"
                >
                  Click here to try a sample project
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Icon Feature Row - identical to ClipBasic */}
        <div className="flex justify-center mt-10">
          <div className="flex justify-evenly gap-9 text-center w-full max-w-2xl">
          {[
            { icon: "/assets/star.png", label: "Long to shorts" },
            { icon: "/assets/cc.png", label: "AI Captions" },
            { icon: "/assets/film-strip.png", label: "AI B-Roll" },
            { icon: "/assets/crop.png", label: "AI Reframe" },
            { icon: "/assets/speaking.png", label: "AI hook" },
            ].map((item, index) => (
            <div
                key={index}
                className="flex flex-col items-center text-sm text-white gap-2"
            >
                <div className="bg-zinc-800 w-20 h-20 rounded-full flex items-center justify-center">
                {item.icon.startsWith("/") ? (
                    <img src={item.icon} alt={item.label} className="w-8 h-8" />
                ) : (
                    <span className="text-3xl">{item.icon}</span>
                )}
                </div>
                <span className="text-xs">{item.label}</span>
            </div>
            ))}
          </div>
        </div>

        <AIButton />

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="video/*"
        />
      </div>
    </div>
  );
}