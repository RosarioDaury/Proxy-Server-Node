import chalk from "chalk"

const success = (content: any) => {
    console.log(chalk.green.bold('[SUCCESS]', content))
}

const error = (content: any) => {
    console.log(chalk.red.bold('[ERROR]', content))
}

const info = (content: any) => {
    console.log(chalk.blue('[INFO]', content))
}

const warning = (content: any) => {
    console.log(chalk.yellow('[WARNING]', content)); 
}

const Logger = {
    success,
    error,
    info,
    warning
}

export default Logger;
