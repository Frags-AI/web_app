import chalk from 'chalk'

const info = (...params: unknown[]) => {
    console.log(...params)
}

const error = (...params: unknown[]) => {
    console.error(chalk.bold.red(...params))
}

const logger ={
    info,
    error
}

export default logger