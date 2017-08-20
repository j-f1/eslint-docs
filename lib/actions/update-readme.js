const { isChecking } = require('../flags')

const spinner = require('../spinner')

const abort = require('../abort')

const targetRe = /^<!-- begin rule list -->[\s\S]+<!-- end rule list -->$/m

exports = module.exports = async (readme, ruleMeta) => {
  const ruleBlock = exports.buildBlock(ruleMeta)

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

  return updatedReadme
}

exports.buildBlock = meta => {
  const ruleLines = meta
    .map(
      ({ name, description }) =>
        `* [\`${name}\`](./docs/rules/${name}.md) \u{2014} ${description}`
    )
    .join('\n')

  return `
<!-- begin rule list -->
${ruleLines}
<!-- end rule list -->
    `.trim()
}
