import ora from 'ora'

const spinner: ReturnType<typeof ora> = ora('Initializing...')
if (process.stdout.isTTY) spinner.start()

export default spinner
