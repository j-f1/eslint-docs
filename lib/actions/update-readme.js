const { verb, isChecking } = require('../flags')
const { read, write } = require('../try-fs')

const spinner = require('../spinner')
const diff = require('../diff')

const abort = require('../abort')

const targetRe = /^<!-- begin rule list -->[\s\S]+<!-- end rule list -->$/m

module.exports = async ({ readmePath }, ruleMeta) => {
  spinner.start(`${verb} README...`)
  const readme = await read(null, `Could not read the README`, readmePath)

  const ruleLines = ruleMeta
    .map(
      ({ name, description }) =>
        `* [\`${name}\`](./docs/rules/${name}.md) \u{2014} ${description}`
    )
    .join('\n')

  const ruleBlock = `
<!-- begin rule list -->
${ruleLines}
<!-- end rule list -->
    `.trim()

  let updatedReadme
  if (targetRe.test(readme)) {
    updatedReadme = readme.replace(targetRe, ruleBlock)
  } else {
    const message =
      'The README does not include a section to place the rule docs into.\nAdding it to the end instead.'
    if (isChecking) {
      spinner.fail(message)
      abort()
    } else {
      spinner.warn(message)
      updatedReadme = `${readme}\n\n${ruleBlock}\n`
    }
  }

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
}
