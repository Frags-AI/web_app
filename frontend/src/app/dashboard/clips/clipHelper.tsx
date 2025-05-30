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

export async function uploadToSocialMedia(token: string, provider: string, link: string, title: string, platformId: string) {
    if (provider === "YouTube") {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/social/youtube/upload`,
            { link, platformId, title },
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
    provider: "YouTube" | "TikTok" | "Facebook" | "Instagram"
    providerData: PlatformDataProps[] | null
    setter: React.Dispatch<React.SetStateAction<string>>
    link: string
    title: string
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

export const SocialMediaForm: React.FC<SocialMediaFormProps> = ({provider, providerData, setter, link, title}) => {
    const [platformId, setPlatformId] = useState<string>(null)
    const { getToken } = useAuth()

    const platforms = getMappedProviders(providerData, provider)

    const formSchema = z.object({
        account_id: z.string().nonempty({
            message: "Please select an account to upload to"
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { account_id } = values
        const token = await getToken()

        if (!account_id) {
            toast.error("Something went wrong, please try again")
            return
        }

        await uploadToSocialMedia(token, provider, link, title, platformId)

        toast.success(`Successfully uploaded to ${provider}`)
        setter(null)
    }

    const selectedAccount = providerData.find((value) => value.id === platformId);

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
                            <div className="font-bold flex gap-4"><div className="text-foreground w-1/5">Name: </div> {selectedAccount.name}</div>
                            <div className="font-bold flex gap-4"><div className="text-foreground w-1/5">Email: </div> <div className=" truncate overflow-hidden text-ellipsis max-w-[250px]">{selectedAccount.email}</div></div>
                            <div className="font-bold flex gap-4"><div className="text-foreground w-1/5">Provider: </div> {selectedAccount.provider}</div>
                            <div className="font-bold flex gap-4"><div className="text-foreground w-1/5">Scope: </div> {selectedAccount.scope}</div>
                            <div className="font-bold flex gap-4"><div className="text-foreground w-1/5">Type: </div> {selectedAccount.details}</div>
                        </div>
                    }
                </FormDescription>
                <FormMessage />
            </FormItem>
            )}
        />
        {selectedAccount && <Button type="submit">Upload to {provider}</Button>}
        </form>
    </Form>
    )
}