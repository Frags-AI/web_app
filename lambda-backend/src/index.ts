import app from "@/app";
import * as ngrok from "@ngrok/ngrok";
import config from "@/utils/config"
app.get("/", (c) => c.text("Hello Hono!"));

(async function() {

    const listener = await ngrok.forward({
        addr: config.PORT,
        authtoken: config.NGROK_AUTHTOKEN,
        hostname: config.NGROK_DOMAIN,
    })
    
    console.log(`Development server on port ${config.PORT} is now forwarded to ${listener.url()}`)
    
})()

export default app