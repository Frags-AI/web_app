
import responseTime from "response-time"
import logger from "./logger.js"
import chalk from "chalk"
import { Request, Response, NextFunction} from "express"

function getStatusColor(statusCode: number) {
  if (statusCode >= 200 && statusCode < 300) {
    return chalk.green
  } else if (statusCode >= 300 && statusCode < 400) {
    return chalk.cyan
  } else if (statusCode >= 400 && statusCode < 500) {
    return chalk.yellow
  } else if (statusCode >= 500) {
    return chalk.red
  } else return chalk.white
}

const requestLogger = responseTime((request: Request, response: Response, time: number) => {
    const color = getStatusColor(response.statusCode)
    logger.info("Method:", chalk.hex('#FFA500')(request.method))
    logger.info("Path:", chalk.yellow(request.path))
    logger.info("Status code:", color(response.statusCode))
    logger.info("Response time:", chalk.green(`${time.toFixed(3)} ms`))
    logger.info("Body:", request.body)
    logger.info("----")
})

const unknownEndpoint = (request: Request, response: Response) => {
    logger.error("Unknown endpoint, please use a valid url")
    response.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (err: any, req: Request, res: Response) => {
    logger.error(err.stack)
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal server error"
    })
}

export { requestLogger, unknownEndpoint, errorHandler }