import app from "./app.js";
import logger from "./utils/logger.js";
import config from "./utils/config.js";
import ngrok from "@ngrok/ngrok";

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}\n`);
});


if (config.ENVIRONMENT === "development") {
    (async () => {
        const listener = await ngrok.forward({
            addr: config.PORT,
            authtoken_from_env: true,
            hostname: config.NGROK_DOMAIN,
        });
        logger.info(`Server running on ${listener.url()}\n`);
    })();
}


