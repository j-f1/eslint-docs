const chalk = require('chalk')

const { isChecking, noDiffs } = require('../flags')
const spinner = require('../spinner')
const abort = require('../abort')
const diff = require('../diff')

module.exports = ({ rule, docs, friendlyDocPath }, name) => {
  if (!rule || !rule.meta || !rule.meta.docs || !rule.meta.docs.description) {
    spinner.fail(`Rule ${name} does not have a description`)
    abort()
  }

  const { description } = rule.meta.docs

  const newDocs = [`# ${description} (${name})`]
    .concat(docs.split('\n').slice(1))
    .join('\n')

  if (newDocs !== docs) {
    const patch = diff(friendlyDocPath, 'generated', docs, newDocs)
    if (isChecking) {
      spinner.fail(
        `The description for ${chalk.bold(
          name
        )} must match the required format:`
      )
      if (!noDiffs) console.error(patch)
      process.exitCode = 1
    } else {
      spinner.info(`Updating the docs for ${chalk.bold(name)}:`)
      if (!noDiffs) console.log(patch)
    }
  }

  if (isChecking) {
    spinner.succeed(`${friendlyDocPath} is valid`)
  }
  return {
    newDocs,
    meta: {
      name,
      description,
    },
  }
}
