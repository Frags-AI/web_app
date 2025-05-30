import axios from "axios"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React from "react"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlatformDataProps } from "@/types"



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

export async function handleSocialMediaUpload(provider: string, link: string, title: string, token: string) {
    if (provider === "youtube") {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/social/youtube`,
            { link, title },
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
}

export const SocialMediaForm: React.FC<SocialMediaFormProps> = ({provider, providerData}) => {

    console.log(providerData)
    const detailsMapping = {
        "YouTube": "Channel",
        "TikTok": "Feed",
        "Instagram": "Page",
        "Facebook": "Page",
    }
    const detail = detailsMapping[provider]

    const formSchema = z.object({
        account: z.string().email({
            message: "Please enter a valid email"
        }),
        details: z.string().nonempty({
            message: `Please select a ${detail} to upload to`
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    function onSubmit() {
        
    }

    console.log(providerData)

    return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
            control={form.control}
            name="account"
            render={({ field }) => (
            <FormItem className="font-bold">
                <FormLabel className="text-lg text-foreground">Account</FormLabel>
                <FormControl>
                    <Select {...field}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an Account" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FormControl>
                <FormDescription className="">This is the email to the account you want to upload to</FormDescription>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
            <FormItem className="font-bold">
                <FormLabel className="text-lg text-foreground">{detail}</FormLabel>
                <FormControl>
                <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription className="">This is the specific {detail.toLowerCase()} you want to upload to</FormDescription>
                <FormMessage />
            </FormItem>
            )}
        />
        <Button type="submit">Upload to {provider}</Button>
        </form>
    </Form>
    )
}