import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { faYoutube, faTiktok, faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons"
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons"
import { Plus } from "lucide-react"
import { SocialMediaCardProps } from "@/types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "@/components/ui/button"
import { useAuth } from "@clerk/clerk-react"
import { toast } from "sonner"
import { addPlatformProvider, getPlatforms } from "./socialHelper"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import LoadingScreen from "@/app/accessories/LoadingScreen"

interface SocialMediaDataProps {
  scope: string,
  provider: "youtube" | "tiktok" | "facebook" | "instagram"
}

export default function Page() {

  const { getToken } = useAuth()
  const [filter, setFilter] = useState<string>("")
  const navigate = useNavigate()

  const getAllPlatforms = async () => {
    const token = await getToken()
    const data = await getPlatforms(token)
    return data
  }

  const { data: socialPlatforms, error, isLoading } = useQuery<SocialMediaDataProps[]>({
    queryKey: ["SocialMediaPlatforms"],
    queryFn: () => getAllPlatforms(),
    refetchOnWindowFocus: false
  })

  const socialMediaCards: SocialMediaCardProps[] = [
    { name: "All Platforms", type: "all-platforms", icon: faLayerGroup},
    { name: "YouTube", type: "youtube", description: "Upload to Channel", icon: faYoutube},
    { name: "TikTok", type: "tiktok", description: "Upload to Feed", icon: faTiktok},
    { name: "Facebook", type: "facebook", description: "Upload to Page", icon: faFacebook},
    { name: "Instagram", type: "instagram", description: "Upload to Page", icon: faInstagram},
  ]

  const iconMapping = {
    "youtube": faYoutube,
    "tiktok": faTiktok,
    "facebook": faFacebook,
    "instagram": faInstagram
  }
  const nameMapping = {
    "youtube": "YouTube",
    "tiktok": "TikTok",
    "facebook": "Facebook",
    "instagram": "Instagram"
  }

  const handleFilterChange = (value: string) => {
    setFilter(value === "all-platforms" ? "" : value)
  }

  const handleSocialCardClick = async (type: string) => {
    try {
      toast.info(`Setting up ${type} authentication...`)
      const token = await getToken()
      const data = await addPlatformProvider(token, type)

      if (!data) throw new Error("Failed to fetch platform provider")

      const url = data.url

      if (!url) throw new Error("Failed to create authentication link")

      window.location.href = url
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-[400px]">
      <div className="text-2xl font-bold">Manage Social Accounts</div>
      <Select defaultValue="all-platforms" onValueChange={handleFilterChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup defaultValue="all-platforms">
            <SelectLabel className="text-xl font-bold mb-4">Select Platform</SelectLabel>
            <div className="flex flex-col gap-2">
              {socialMediaCards.map((card) => (
                <SelectItem value={card.type} className="hover:cursor-pointer flex gap-4">
                  <div className="flex gap-4">
                    <FontAwesomeIcon icon={card.icon} size="xl"/>
                    <div className="font-bold">{card.name}</div>
                  </div>
                </SelectItem>
              ))}
            </div>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="min-w-[400px] min-h-[600px] max-w-[400px] max-h-[600px] p-4 border border-3 rounded-lg overflow-y-auto no-scrollbar">
        {!isLoading && socialPlatforms.map((platform) => (
          <div key={platform.provider + platform.scope} className="flex items-center gap-4 hover:cursor-pointer hover:bg-secondary/60 rounded-lg p-2 transition duration-300">
            <FontAwesomeIcon icon={iconMapping[platform.provider]} size="xl" />
            <div className="font-bold text-lg">{nameMapping[platform.provider]}</div>
            <div className="font-bold text-muted-foreground">{platform.scope}</div>
          </div>
        ))}
      </div>
      <Dialog>
        <DialogTrigger className="flex justify-end">
          <Button className="flex gap-4">
            <Plus />
            <div className="font-bold">Add Provider</div>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
          <DialogTitle className="text-lg font-bold text-center">Choose a platform</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
          {socialMediaCards.map((card) => card.name !== "All Platforms" && ( 
              <div
                key={card.type}
                className={`border border-4 rounded-lg p-4 flex flex-col items-center text-center gap-2 font-bold hover:bg-secondary/60 
                  hover:cursor-pointer transition duration-300${card.name === "YouTube" ? "" : " pointer-events-none bg-muted"}`}
                onClick={() => handleSocialCardClick(card.type)}
                
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
  )
}