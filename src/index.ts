'use strict'

import fs from 'mz/fs'
import path from 'path'

import chalk from 'chalk'

import { verb, isChecking, noDiffs } from './flags'
import defaultRoot from './project-root'
import { read, write } from './try-fs'
import { register } from './paths'
import { unabort } from './abort'
import spinner from './spinner'
import diff from './diff'

import readRule from './actions/read-rule'
import updateReadme from './actions/update-readme'

export default unabort(
  async (projectRoot: string | Promise<string> = defaultRoot) => {
    const { isTTY } = process.stdout
    const project = register(await projectRoot)
    const { rulesDir, readmePath, docsDir } = project
    projectRoot = project.projectRoot

    if (isTTY) spinner.start('Reading rules...')

    const rulePaths = (await fs.readdir(rulesDir)).map(name =>
      path.resolve(rulesDir, name)
    )

    const ruleMeta = []

    for (const rulePath of rulePaths) {
      if (isTTY)
        spinner.start(
          `${verb} rule ${rulePaths.indexOf(rulePath) + 1} of ${
            rulePaths.length
          }...`
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
        const { meta, newDocs } = readRule(
          { rule, docs, friendlyDocPath },
          name
        )
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

    if (isTTY) spinner.start(`${verb} README...`)
    const readme = await read(null, `Could not read the README`, readmePath)

    const updatedReadme = updateReadme(readme, ruleMeta, project)

    if (updatedReadme !== readme) {
      const patch = diff(
        { name: 'README.md', content: readme },
        { name: 'generated', content: updatedReadme }
      )
      if (isChecking) {
        spinner.fail('The README is not correctly formatted. Please update it:')
        if (!noDiffs) console.error(patch)
        process.exitCode = 1
      } else {
        spinner.info('Updating README:')
        if (!noDiffs) console.log(patch)
        await write(
          'README.md is up-to-date',
          `Could not update the README`,
          readmePath,
          updatedReadme
        )
      }
    } else {
      if (isChecking) {
        spinner.succeed('The README is valid')
      } else {
        spinner.succeed('The README is up-to-date')
      }
    }
  }
)
