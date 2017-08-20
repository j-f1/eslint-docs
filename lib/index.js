'use strict'

const fs = require('mz/fs')
const path = require('path')

const defaultRoot = require('./project-root')
const { register } = require('./paths')
const spinner = require('./spinner')
const { verb } = require('./flags')

const readRule = require('./actions/read-rule')
const updateReadme = require('./actions/update-readme')

module.exports = async (projectRoot = defaultRoot) => {
  const project = register(await projectRoot)
  const { rulesDir } = project

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
    ruleMeta.push(
      await readRule(project, path.basename(rulePath, path.extname(rulePath)))
    )
  }

  await updateReadme(project, ruleMeta)
}
