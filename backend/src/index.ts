import "express-async-errors"
import app from "./app.js";
import logger from "./utils/logger.js";
import config from "./utils/config.js";
import ngrok from "@ngrok/ngrok";
import serverless from "serverless-http";

if (config.ENVIRONMENT !== "production") {
    app.listen(config.PORT, () => {
        logger.info(`Server running on port ${config.PORT}`);
    });
    
    (async () => {
        const listener = await ngrok.forward({
            addr: config.PORT,
            authtoken_from_env: true,
            hostname: config.NGROK_DOMAIN,
        });
        logger.info(`Server running on ${listener.url()}`);
    })();
} else {
    module.exports.handler = serverless(app)
    logger.info("Server reconfigured into API Gateway")
    logger.info("Server running on AWS Lambda")
}



