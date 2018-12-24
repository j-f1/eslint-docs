const chalk = require('chalk')
const { graceful: detectNewline } = require('detect-newline')

const { isChecking, noDiffs } = require('../flags')
const spinner = require('../spinner')
const abort = require('../abort')
const diff = require('../diff')

module.exports = ({ rule, docs, friendlyDocPath }, name) => {
  if (!rule || !rule.meta || !rule.meta.docs || !rule.meta.docs.description) {
    spinner.fail(`Rule ${name} does not have a description`)
    abort()
  }

  const fixable = rule.meta.fixable
  const { description, extraDescription, recommended } = rule.meta.docs

  const heading = `# ${description} (${name})`

  const headingRe = /^\s*#[^\r\n]*(\r?\n)?/

  const newDocs = headingRe.test(docs)
    ? docs.replace(headingRe, heading + `$1`)
    : `${heading}${detectNewline(docs)}${docs}`

  if (newDocs !== docs) {
    const patch = diff(
      { name: friendlyDocPath, content: docs },
      { name: 'generated', content: newDocs }
    )
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
      extraDescription,
      recommended,
      fixable,
    },
  }
}
