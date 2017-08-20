const fs = require('mz/fs')

const chalk = require('chalk')

const spinner = require('./spinner')
const abort = require('./abort')

const run = f => (success, error, ...args) => {
  try {
    const result = f(...args)
    if (success) spinner.succeed(success)
    return result
  } catch (e) {
    spinner.fail(error || 'Error')
    console.error(chalk.gray(e.stack))
    abort()
  }
}

exports.read = run(path => fs.readFile(path, 'utf-8'))
exports.write = run((path, content) => fs.writeFile(path, content))
