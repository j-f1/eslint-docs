const ora = require('ora')

const spinner = (module.exports = ora('Initializing...'))
if (process.stdout.isTTY) spinner.start()
