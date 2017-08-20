const chalk = require('chalk')
const diff = require('diff')

module.exports = (oldFile, newFile, oldText, newText) =>
  diff
    .createTwoFilesPatch(oldFile, newFile, oldText, newText)
    .split('\n')
    .slice(1) // strip the ====... line
    .map(chunk => {
      switch (chunk[0]) {
        case '+':
          return chalk.green(chunk)
        case '-':
          return chalk.red(chunk)
        case '@':
          return chalk.dim.blue(chunk)
        default:
          return chunk
      }
    })
    .map(chunk => `  ${chunk}`) // indent
    .join('\n')
