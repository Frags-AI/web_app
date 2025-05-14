import * as React from "react"
import { Html, Button, Body, Preview, Tailwind, Text } from "@react-email/components"

interface ClipReadyProps {
    url: string
    email: string
}

export const ClipsReady: React.FC<ClipReadyProps> = ({url, email}) => {

    return  (
        <Tailwind>
            <Html>
                <Body className="font-sans flex flex-col items-center gap-2">
                    <Text className="font-bold text-2xl">Your clips are ready to be viewed</Text>
                    <Text className="text-neutral-500 pt-4">Click the link below to access your clips</Text>
                    <Button className="bg-neutral-950 px-4 py-2 rounded-lg no-underline text-neutral-50 font-bold" href={url}>View your clips</Button>
                    <Text className="font-bold text-4xl">Frags AI</Text>
                    <Text className="text-neutral-500">Your #1 Video Capturing Software</Text>
                    <div className="flex flex-col gap-2 text-neutral-500 items-center">
                        <Text>This emailed was sent to <a href={`mailto:${email}`} className="text-black">{email}</a></Text>
                        <Text>You received this email because you signed up as a Frags AI user</Text>
                        <Text>Don't want to receive these types of emails? <a href="https://www.google.com/" className="text-black">Mange your email preferences</a></Text>
                        <Text>or <a href="https://www.google.com/" className="text-black">unsubscribe</a> from all emails</Text>
                    </div>
                </Body>
            </Html>
        </Tailwind>
    )
}