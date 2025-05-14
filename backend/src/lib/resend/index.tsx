import { Resend } from "resend";
import config from "@/utils/config";
import { ClipsReady } from "./templates/clip-ready-template";

const resend = new Resend(config.RESEND_API_KEY)

export const ClipsReadyNotification = async (email: string, url: string) => {
    const { data, error } = await resend.emails.send({
        from: `support${config.RESEND_DOMAIN}`,
        to: email,
        subject: "Your clips are ready!",
        react: <ClipsReady url={url} email={email}/>
    })

    if (error) throw new Error(error.message)

    return data
}


export default resend