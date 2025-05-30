import axios from "axios"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { PlatformDataProps } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"



export async function getAllClips(token: string, identifier: string) {
    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/video/clip`, 
        {identifier},
        {headers: {Authorization: `Bearer ${token}`}, }
    )

    const data = response.data
    return data
}

export async function changeAspectRatio(token: string, identifier: string, ratio: string, link: string, title: string) {
    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/video/aspect`,
        { identifier, ratio, link, title },
        { headers: {Authorization: `Bearer ${token}`} }
    )
    return response.data
}

export function getMappedProviders(data: PlatformDataProps[], scope: string) {
    if (!data) return null
    const filtered =  data.filter((platform) => platform.scope === scope)
    return filtered.length !== 0 ? filtered : null
}

export async function getAllSocialProviders(token: string) {
    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/social`,
        {headers: {Authorization: `Bearer ${token}`}}
    )
    return response.data
}

export async function getSocialAccountDetails(token: string, key: string, platformId: string) {
    if (key === "YouTube") {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/social/youtube/channel`,
            {platformId},
            {headers: {Authorization: `Bearer ${token}`}}
        )
        return response.data
    } else return null
}

export async function uploadToSocialMedia(token: string, provider: string, link: string, platformId: string, detailsId: string) {
    if (provider === "YouTube") {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/social/youtube/upload`,
            { link, platformId, detailsId },
            {headers: {Authorization: `Bearer ${token}`}}
        ).catch((err) => {
            throw new Error("Failed to upload video")
        })

        return "Successfully uploaded video to YouTube"
    }
}

export const allowedProviders = [ "YouTube" ]
export type Providers = "YouTube" | "TikTok" | "Facebook" | "Instagram"

interface SocialMediaFormProps {
    provider: "YouTube" | "TikTok" | "Facebook" | "Instagram",
    providerData: PlatformDataProps[] | null
    setter: React.Dispatch<React.SetStateAction<string>>,
    link: string
}

interface YouTubeChannelDataProps {
    title: string,
    description: string,
    id: string
}

type ProviderDataMapping = {
    "YouTube": YouTubeChannelDataProps
    "Facebook": YouTubeChannelDataProps
    "Instagram": YouTubeChannelDataProps
    "TikTok": YouTubeChannelDataProps
}

export const SocialMediaForm: React.FC<SocialMediaFormProps> = ({provider, providerData, setter, link}) => {
    const [platformId, setPlatformId] = useState<string>(null)
    const [detailsId, setDetailsId] = useState<string>(null)
    const { getToken } = useAuth()

    const loadSocialDetails = async (key: string, platformId: string) => {
        if (!platformId) return null
        const token = await getToken()
        const data = await getSocialAccountDetails(token, key, platformId)
        return data
    }

    const { data: socialData, isLoading: socialDataLoading } = useQuery<ProviderDataMapping[typeof provider][]>({
        queryKey: ["SocialMediaFormDetails", platformId],
        queryFn: () => loadSocialDetails(provider, platformId),
        refetchOnWindowFocus: false
    })

    const detailsMapping = {
        "YouTube": "Channel",
        "TikTok": "Feed",
        "Instagram": "Page",
        "Facebook": "Page",
    }

    const platforms = getMappedProviders(providerData, provider)
    const detail = detailsMapping[provider]

    const formSchema = z.object({
        account_id: z.string().nonempty({
            message: "Please select an account to upload to"
        }),
        account_details: z.string().nonempty({
            message: `Please select a ${detail} to upload to`
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { account_id, account_details } = values
        const token = await getToken()

        if (!account_details || !account_id) {
            toast.error("Something went wrong, please try again")
            return
        }

        await uploadToSocialMedia(token, provider, link, platformId, detailsId)

        toast.success(`Successfully uploaded to ${provider}`)
        setter(null)
    }

    const selectedAccount = providerData.find((value) => value.id === platformId);
    const selectedDetails = socialData ? socialData.find((value) => value.id === detailsId) : null;

    return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
            control={form.control}
            name="account_id"
            render={({ field }) => (
            <FormItem className="font-bold">
                <FormLabel className="text-lg text-foreground">Select Account</FormLabel>
                <FormControl>
                    <Select {...field} 
                        value={field.value} 
                        onValueChange={(value) => {
                            setPlatformId(value)
                            field.onChange(value)
                        }
                    }>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an Account" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            {platforms.map((platform) => (
                                <SelectItem 
                                    value={platform.id} 
                                    key={platform.id} 
                                    className="text-base font-bold hover:cursor-pointer hover:bg-background/10 transition duration-300">
                                    <div>{platform.name}</div>
                                </SelectItem>
                            ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FormControl>
                <FormDescription className="flex flex-col gap-4">
                    {selectedAccount &&
                        <div className="space-y-2 text-sm">
                            <div className="font-bold flex gap-4"><div className="text-foreground grow">Name: </div> {selectedAccount.name}</div>
                            <div className="font-bold flex gap-4"><div className="text-foreground grow">Email: </div> {selectedAccount.email}</div>
                            <div className="font-bold flex gap-4"><div className="text-foreground grow">Provider: </div> {selectedAccount.provider}</div>
                            <div className="font-bold flex gap-4"><div className="text-foreground grow">Scope: </div> {selectedAccount.scope}</div>
                            <div className="font-bold flex gap-4"><div className="text-foreground grow">Type: </div> {selectedAccount.details}</div>
                        </div>
                    }
                    <div>This is the email to the account you want to upload to</div>
                </FormDescription>
                <FormMessage />
            </FormItem>
            )}
        />
        {selectedAccount && !socialDataLoading &&
            <FormField
                control={form.control}
                name="account_details"
                render={({ field }) => (
                <FormItem className="font-bold">
                    <FormLabel className="text-lg text-foreground">Select {detail}</FormLabel>
                    <FormControl>
                    <Select {...field} 
                        value={field.value} 
                        onValueChange={(value) => {
                            setDetailsId(value)
                            field.onChange(value)
                        }
                    }>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an Account" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            {socialData.map((item) => (
                                <SelectItem 
                                    value={item.id} 
                                    key={item.id} 
                                    className="text-base font-bold hover:cursor-pointer hover:bg-background/10 transition duration-300">
                                    <div>{item.title}</div>
                                </SelectItem>
                            ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    </FormControl>
                    <FormDescription className="flex flex-col gap-4">
                    {selectedDetails &&
                        <div className="space-y-2 text-sm">
                            <div className="font-bold flex gap-4"><div className="text-foreground grow">{detail} name: </div> {selectedDetails.title}</div>
                            <div className="font-bold flex gap-4 text-muted-foreground">{selectedDetails.description}</div>
                        </div>
                    }
                    <div>This is the specific {detail.toLowerCase()} you want to upload to</div>
                </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
        }
        {selectedDetails && <Button type="submit">Upload to {provider}</Button>}
        </form>
    </Form>
    )
}