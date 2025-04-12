import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Gem, X, InfoIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Icons from "@/components/icons"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";


export default function Workflow() {
  const [uploadName, setUploadName] = useState("https://www.youtube.com/watch?v=LXvv6CbGg8A");
  const fileInputRef = useRef(null);
  const [selectedModel, setSelectedModel] = useState("ClipBasic");
  const [language, setLanguage] = useState("English");
  const [clipMode, setClipMode] = useState("AI");
  const [promptText, setPromptText] = useState("");
  const placeholders = ["YouTube", "Twitch", "Rumble", "Zoom"];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("presets");

  const models = [
    { name: "ClipBasic", icon: null, color: null },
    { name: "ClipAnything", icon: Sparkles, color: "#fbbf24" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);


  const handleRemove = () => setUploadName("");

  return (
    <div className="flex flex-col items-center justify-center w-full mt-15 p-4 pt-20 text-white px-4">
      {/* Model Toggle */}
      <div className="flex items-center justify-center gap-4 mb-6">
      {models.map((model) => (
          <div
          key={model.name}
          onClick={() => setSelectedModel(model.name)}
          className="flex items-center gap-1 cursor-pointer"
        >
          {model.icon && <model.icon className="w-4 h-4" color={model.color} />}
          <span className="text-white text-sm font-medium">{model.name}</span>
          {model.name === "ClipAnything" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-white" />
                </TooltipTrigger>
                <TooltipContent className=" -top-8 z-10 whitespace-nowrap bg-white text-black px-2 py-1 text-xs rounded-lg font-bold">
                    Our smartest model. Great for any videos.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        ))}
      </div>

      {/* Input Area */}
      <div className=" p-4 rounded-xl w-full max-w-xl">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder={`https://www.${placeholders[placeholderIndex]}.com/...`}
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              className="bg-zinc-800 text-sm text-white placeholder-zinc-400 px-4 py-2 rounded-md pr-10"
            />
            {uploadName && (
              <button
                className="absolute right-2 top-2 text-zinc-400 hover:text-white"
                onClick={handleRemove}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Button className="bg-white text-black font-semibold py-2 rounded-md">
            Get clips in 1 click
          </Button>

          <div className="flex items-center justify-between text-sm text-zinc-400 mt-2">
            <div className="flex items-center">
              <span>Speech language:</span>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32 h-8 text-white text-sm border-none ">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 text-white border-none">
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                  <SelectItem value="Chinese">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <span className=" flex items-center gap-1">
                Credit Usage: 
          
                    <Icons.Zap size={20} fill="#d4b455" color="#d4b455"/>
                    <div>15</div> 
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-white" />
                </TooltipTrigger>
                <TooltipContent className=" -top-8 z-10 whitespace-nowrap bg-white text-black px-2 py-1 text-xs rounded-lg font-bold">
                    <span className="underline">ClipAnything:</span> 15 credits = 15 minutes of video processing
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          
                
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnail Preview */}
      <div className="mt-0 mb-20">
        <img
          src="https://i.ytimg.com/vi/LXvv6CbGg8A/hqdefault.jpg"
          alt="thumbnail preview"
          className="rounded-xl w-64"
        />
        
      </div>
      {/* AI Clipping Section */}
      
      <div
        
        className={`mt-20 bg-zinc-900 p-6 rounded-xl w-full max-w-xl transition-colors duration-500 
        `}
        >

          <div className="flex gap-4 mb-4 text-sm">
            <button
              className={`px-4 py-1 rounded-md ${
                clipMode === "AI" ? "bg-white text-black" : "bg-zinc-800 text-white"
              }`}
              onClick={() => setClipMode("AI")}
            >
              AI clipping
            </button>
            <button
              className={`px-4 py-1 rounded-md ${
                clipMode === "Manual" ? "bg-white text-black" : "bg-zinc-800 text-white"
              }`}
              onClick={() => setClipMode("Manual")}
            >
              Don’t clip
            </button>
          </div>

          {clipMode === "AI" ? (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-1">Clip Length</label>
                <select className="w-full bg-zinc-800 text-white rounded-md px-2 py-1 text-sm">
                  <option>Auto (&lt;90s)</option>
                  <option>&lt;60s</option>
                  <option>&lt;30s</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">For best results, choose genres:</label>
                <div className="flex flex-wrap gap-2">
                  {["Let AI detect", "Podcast", "Lifestyle", "Sports", "Marketing & Webinar", "Entertainment", "News", "Informative & Educational"].map((genre) => (
                    <button key={genre} className="bg-zinc-800 px-3 py-1 rounded-md text-sm">
                      {genre}
                    </button>
                  ))}
                  <button className="bg-zinc-700 px-3 py-1 rounded-md text-sm">Show more</button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1">Include specific moments</label>
                <Input
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="💡 Example: Find me the section with epic fights"
                  className="bg-zinc-800 text-sm text-white placeholder-zinc-400 px-4 py-2 rounded-md"
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-zinc-400 mb-4">
              We will not clip your videos and will preserve their original length.
            </p>
          )}

          {/* Slider and timestamps */}
          <div className="w-full flex items-center justify-between text-sm text-white/80">
            <span>0:00:00</span>
            <span>0:15:19</span>
          </div>
          <div className="w-full h-1 bg-zinc-700 rounded-full mt-1 mb-2">
            <div className="w-full h-full bg-white rounded-full"></div>
          </div>
        </div>
        {/* Template Presets Section */}
    
        <div className="mt-10 w-2/5 pb-20">
          <div className="bg-zinc-900 rounded-xl p-4">
            <div className="flex mb-4 gap-4 text-sm">
              <button
                onClick={() => setActiveTab("presets")}
                className={`px-4 py-1 rounded-md transition-colors duration-300 ${
                  activeTab === "presets" ? "bg-white text-black font-medium" : "bg-zinc-800 text-white"
                }`}
              >
                Quick presets
              </button>
              <button
                onClick={() => setActiveTab("templates")}
                className={`px-4 py-1 rounded-md transition-colors duration-300 ${
                  activeTab === "templates" ? "bg-white text-black font-medium" : "bg-zinc-800 text-white"
                }`}
              >
                My templates
              </button>
            </div>

            {activeTab === "presets" ? (
              <>
                {/* Carousel */}
                <div className="flex items-center justify-between gap-2">
                  <button className="text-white bg-zinc-700 rounded-full px-2 py-1">←</button>
                  <div className="flex gap-4 overflow-x-auto transition-transform duration-500 ease-in-out">
                    <div className="border border-white rounded-xl overflow-hidden w-[120px] hover:scale-105 transition-transform duration-300">
                      <img src="" className="object-cover w-full h-[200px]" alt="preset1" />
                      <p className="text-center text-sm py-1">Karaoke</p>
                    </div>
                    <div className="rounded-xl overflow-hidden w-[120px] hover:scale-105 transition-transform duration-300">
                      <img src="" className="object-cover w-full h-[200px]" alt="preset2" />
                      <p className="text-center text-sm py-1 text-white/80">Gameplay</p>
                    </div>
                    <div className="rounded-xl overflow-hidden w-[120px] hover:scale-105 transition-transform duration-300">
                      <img src="" className="object-cover w-full h-[200px]" alt="preset3" />
                      <p className="text-center text-sm py-1 text-white/80">Beasty</p>
                    </div>
                  </div>
                  <button className="text-white bg-zinc-700 rounded-full px-2 py-1">→</button>
                </div>

                {/* Aspect Ratio Selector */}
                <div className="flex items-center justify-start mt-4 text-sm text-white/80">
                  <span className="mr-2">Choose aspect ratio</span>
                  <select className="bg-zinc-800 border border-zinc-700 text-white px-2 py-1 rounded-md text-sm transition-colors duration-300">
                    <option value="9:16">9:16</option>
                    <option value="16:9">16:9</option>
                    <option value="1:1">1:1</option>
                  </select>
                </div>
              </>
            ) : (
              <div className="text-white/70 text-sm py-10 text-center border border-dashed border-zinc-600 rounded-md">
                You have no saved templates.
              </div>
            )}
          </div>
        </div>
    </div>
  );
}