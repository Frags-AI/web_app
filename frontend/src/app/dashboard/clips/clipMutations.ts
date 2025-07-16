import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { changeAspectRatio } from "./clipHelper";
import { addVideoSubtitles } from "./transcribingHelper";
import { VideoProps } from ".";
import { toast } from "sonner";

export function useAdjustAspectRatio(projectIdentifier: string) {
    const { getToken } = useAuth()
    const queryClient = useQueryClient()

    return useMutation<
        { clipTitle: string; newRatio: string; newLink: string },
        Error,
        { id: string; selectedRatio: string; selectedLink: string }
    >({
        mutationFn: async ({id, selectedRatio, selectedLink}) => {
            const token = await getToken()
            const response = await changeAspectRatio(token, selectedRatio, selectedLink, id) 
            return { newRatio: response.aspectRatio, newLink: response.link, clipTitle: response.clipTitle }
        },
        onSuccess: (data) => {
            queryClient.setQueryData<VideoProps[]> (
                ["ProjectVideoClips", projectIdentifier],
                (oldClips) => oldClips?.map((clip) => clip.title === data.clipTitle ? { ...clip, link: data.newLink, aspectRatio: data.newRatio } : clip) || []
            )
        },
        onError: (err) => toast.error(err.message)
    })
}

export function useAddSubtitles(projectIdentifier: string) {
    const { getToken } = useAuth()
    const queryClient = useQueryClient()

    return useMutation<
        {newLink: string, title: string},
        Error,
        {selectedLink: string, title: string}
    >({
        mutationFn: async ({selectedLink, title}) => {
            const token = await getToken()
            const response = await addVideoSubtitles(token, selectedLink, title)
            return {newLink: response.link, title: response.title}
        },
        onSuccess: (data) => {
            queryClient.setQueryData<VideoProps[]>(
                ["ProjectVideoClips", projectIdentifier],
                (oldClips) => oldClips.map((clip) => clip.title === data.title ? { ...clip, link: data.newLink} : clip) || []
            )
        },
        onError: (err) => toast.error(err.message)
    })
}

