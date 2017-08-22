'use strict'

const fs = require('mz/fs')
const path = require('path')

const chalk = require('chalk')

const { verb, isChecking } = require('./flags')
const defaultRoot = require('./project-root')
const { read, write } = require('./try-fs')
const { register } = require('./paths')
const { unabort } = require('./abort')
const spinner = require('./spinner')
const diff = require('./diff')

const readRule = require('./actions/read-rule')
const updateReadme = require('./actions/update-readme')

module.exports = unabort(async (projectRoot = defaultRoot) => {
  const project = register(await projectRoot)
  const { rulesDir, readmePath, docsDir } = project

  spinner.start('Reading rules...')

  const rulePaths = (await fs.readdir(rulesDir)).map(name =>
    path.resolve(rulesDir, name)
  )

  const ruleMeta = []

  for (const rulePath of rulePaths) {
    spinner.start(
      `${verb} rule ${rulePaths.indexOf(rulePath) +
        1} of ${rulePaths.length}...`
    )

    const rule = require(rulePath)

    const name = path.basename(rulePath, path.extname(rulePath))

    const docPath = path.resolve(docsDir, name + '.md')
    const friendlyDocPath = path
      .relative(projectRoot, docPath)
      .replace(name, chalk.bold(name))

    const docs = await read(
      null,
      `Could not read the docs for ${chalk.bold(name)} at ${friendlyDocPath}`,
      docPath
    )
    if (docs) {
      const { meta, newDocs } = readRule({ rule, docs, friendlyDocPath }, name)
      ruleMeta.push(meta)
      if (!isChecking) {
        await write(
          `${friendlyDocPath} is up-to-date`,
          `Could not update the docs for ${chalk.bold(
            name
          )} at ${friendlyDocPath}`,
          docPath,
          newDocs
        )
      }
    }
  }

  spinner.start(`${verb} README...`)
  const readme = await read(null, `Could not read the README`, readmePath)

  const updatedReadme = updateReadme(readme, ruleMeta)

  if (updatedReadme !== readme) {
    const patch = diff('README.md', 'generated', readme, updatedReadme)
    if (isChecking) {
      spinner.fail('The README is not correctly formatted. Please update it:')
      console.error(patch)
      process.exitCode = 1
    } else {
      spinner.info('Updating README:')
      console.log(patch)
    }
  }

  if (isChecking) {
    spinner.succeed('The README is valid')
  } else {
    await write(
      'README.md is up-to-date',
      `Could not update the README`,
      readmePath,
      updatedReadme
    )
  }
})
