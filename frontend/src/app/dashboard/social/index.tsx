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
import { useQuery } from "@tanstack/react-query"
import { PlatformDataProps } from "@/types"

export default function Page() {

  const { getToken } = useAuth()
  const [filter, setFilter] = useState<string>("")

  const getAllPlatforms = async () => {
    const token = await getToken()
    const data = await getPlatforms(token)
    console.log(data)
    return data
  }

  const { data: socialPlatforms, error, isLoading } = useQuery<PlatformDataProps[]>({
    queryKey: ["SocialMediaPlatforms"],
    queryFn: () => getAllPlatforms(),
    refetchOnWindowFocus: false
  })

  const socialMediaCards: SocialMediaCardProps[] = [
    { name: "All Platforms", type: "All-Platforms", icon: faLayerGroup},
    { name: "YouTube", type: "YouTube", description: "Upload to Channel", icon: faYoutube},
    { name: "TikTok", type: "TikTok", description: "Upload to Feed", icon: faTiktok},
    { name: "Facebook", type: "Facebook", description: "Upload to Page", icon: faFacebook},
    { name: "Instagram", type: "Instagram", description: "Upload to Page", icon: faInstagram},
  ]

  const allowedProviders = [ "YouTube" ]

  const iconMapping = {
    "YouTube": faYoutube,
    "TikTok": faTiktok,
    "Facebook": faFacebook,
    "Instagram": faInstagram
  }
  const nameMapping = {
    "YouTube": "YouTube",
    "TikTok": "TikTok",
    "Facebook": "Facebook",
    "Instagram": "Instagram"
  }

  const handleFilterChange = (value: string) => {
    setFilter(value === "All-Platforms" ? "" : value)
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
    <div className="flex flex-col gap-4 w-[400px] self-center">
      <div className="text-2xl font-bold">Manage Social Accounts</div>
      <Select defaultValue="All-Platforms" onValueChange={handleFilterChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="text-xl font-bold mb-4">Select Platform</SelectLabel>
            <div className="flex flex-col gap-2">
              {socialMediaCards.map((card) => (
                <SelectItem value={card.type} className="hover:cursor-pointer flex gap-4" key={card.type + card.name}>
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
      <div className="w-[400px] h-[600px] p-4 border border-3 rounded-lg overflow-y-auto no-scrollbar flex flex-col gap-4">
        {!isLoading && socialPlatforms.filter((obj) => obj.scope.includes(filter)).map((platform) => (
          <div className="flex flex-col gap-2 hover:cursor-pointer hover:bg-secondary/60 rounded-lg p-4 transition duration-300 text-lg border border-3">
            <div key={platform.provider + platform.scope} className="flex items-center gap-4 w-full">
              <FontAwesomeIcon icon={iconMapping[platform.scope]} size="xl" />
              <div className="font-bold">{nameMapping[platform.scope]}</div>
              <div className="grow"/>
              <div className="font-bold text-muted-foreground">{platform.provider}</div>
            </div>
            <div className="font-bold text-base flex flex-col w-full ellipsis">
              <div className="text-muted-foreground flex justify-between">
                <div className="text-foreground">Name: </div>
                {platform.name}
              </div>
              <div className="text-muted-foreground flex justify-between gap-4">
                <div className="text-foreground">Email: </div>
                <div className="truncate">{platform.email}</div>
              </div>
              <div className="text-muted-foreground flex justify-between">
                <div className="text-foreground">Type: </div>
                {platform.details}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Dialog>
        <DialogTrigger>
          <Button className="flex gap-4 w-full">
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
                className={`border border-4 rounded-lg p-4 flex flex-col items-center justify-center text-center gap-2 font-bold hover:bg-secondary/60 
                  hover:cursor-pointer transition duration-300${allowedProviders.includes(card.name) ? "" : " pointer-events-none bg-muted"}`}
                onClick={() => handleSocialCardClick(card.type)}
              >
              <FontAwesomeIcon icon={card.icon} size="xl"/>
              <div className="text-lg">{card.name}</div>
              <div className="text-muted-foreground text-sm">{card.description}</div>
              {!allowedProviders.includes(card.name) && <div className="text-muted-foreground text-sm">Coming soon!</div>}
              </div>
          ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}