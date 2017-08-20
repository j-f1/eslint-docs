const path = require('path')

const chalk = require('chalk')

const { ext, isChecking } = require('../flags')
const { read, write } = require('../try-fs')
const spinner = require('../spinner')
const abort = require('../abort')
const diff = require('../diff')

module.exports = async ({ rulesDir, docsDir, projectRoot }, name) => {
  const rulePath = path.join(rulesDir, name + ext)

  const rule = require(rulePath)
  if (!rule || !rule.meta || !rule.meta.docs || !rule.meta.docs.description) {
    spinner.fail(`Rule ${name} does not have a description`)
    abort()
  }

  const { description } = rule.meta.docs

  const docPath = path.resolve(docsDir, name + '.md')
  const friendlyDocPath = path
    .relative(projectRoot, docPath)
    .replace(name, chalk.bold(name))

  const docs = await read(
    null,
    `Could not read the docs for ${chalk.bold(name)} at ${friendlyDocPath}`,
    docPath
  )
  if (!docs) return

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
      console.error(patch)
      process.exitCode = 1
    } else {
      spinner.info(`Updating the docs for ${chalk.bold(name)}:`)
      console.log(patch)
    }
  }

  if (isChecking) {
    spinner.succeed(`${friendlyDocPath} is valid`)
  } else {
    await write(
      `${friendlyDocPath} is up-to-date`,
      `Could not update the docs for ${chalk.bold(name)} at ${friendlyDocPath}`,
      docPath,
      newDocs
    )
  }
  return {
    name,
    description,
  }
}
