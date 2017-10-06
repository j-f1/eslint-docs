const { graceful: detectNewline } = require('detect-newline')

const { isChecking } = require('../flags')

const spinner = require('../spinner')

const abort = require('../abort')

const targetRe = /^<!-- begin rule list -->[\s\S]+<!-- end rule list -->$/im

exports = module.exports = (readme, ruleMeta, { pluginName }) => {
  const nl = detectNewline(readme)
  const ruleBlock = exports.buildBlock(ruleMeta, pluginName, nl)

  let updatedReadme
  if (targetRe.test(readme)) {
    updatedReadme = readme.replace(targetRe, ruleBlock)
  } else {
    const message =
      'The README does not include a section to place the rule docs into.\nAdding it to the end instead.'
    // istanbul ignore next
    if (isChecking) {
      spinner.fail(message)
      abort()
    } else {
      spinner.warn(message)
      updatedReadme = `${readme}${nl}${nl}${ruleBlock}${nl}`
    }
  }

  return updatedReadme
}

exports.buildBlock = (meta, pluginName, nl = '\n') => {
  const ruleLines = meta
    .map(
      ({ name, description, extraDescription }) =>
        `* [\`${pluginName}/${name}\`](./docs/rules/${name}.md) \u{2014} ${exports.handleDescription(
          {
            description,
            extraDescription,
          }
        )}`
    )
    .join(nl)

  return `<!-- begin rule list -->${nl}${ruleLines}${nl}<!-- end rule list -->
    `.trim()
}

exports.handleDescription = ({ description, extraDescription }) => {
  if (!extraDescription) return description

  if (Array.isArray(extraDescription)) {
    extraDescription = extraDescription.join(', ')
  }
  return `${description} (${extraDescription})`
}
