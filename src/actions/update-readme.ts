import { graceful as detectNewline } from 'detect-newline'

import { RuleMeta } from './read-rule'

import { isChecking } from '../flags'

import spinner from '../spinner'

import abort from '../abort'

const targetRe = /^<!-- begin rule list -->[\s\S]+<!-- end rule list -->$/im

export default (
  readme: string,
  ruleMeta: RuleMeta[],
  { pluginName }: { pluginName: string }
): string => {
  const nl = detectNewline(readme)
  const ruleBlock = buildBlock(ruleMeta, pluginName, nl)

  let updatedReadme
  if (targetRe.test(readme)) {
    updatedReadme = readme.replace(targetRe, ruleBlock)
  } else {
    const message =
      'The README does not include a section to place the rule docs into.\nAdding it to the end instead.'
    // istanbul ignore next
    if (isChecking) {
      spinner.fail(message)
      return abort()
    } else {
      spinner.warn(message)
      updatedReadme = `${readme}${nl}${nl}${ruleBlock}${nl}`
    }
  }

  return updatedReadme
}

export function buildBlock(meta: RuleMeta[], pluginName: string, nl = '\n') {
  const rulesTable = meta
    .map(
      ({ name, description, extraDescription, recommended, fixable }) =>
        `| [\`${pluginName}/${name}\`](./docs/rules/${name}.md) | ${handleDescription(
          {
            description,
            extraDescription,
          }
        )} | ${recommended ? ':heavy_check_mark:' : ''} | ${
          fixable != null ? ':wrench:' : ''
        } |`
    )
    .join(nl)

  return `
<!-- begin rule list -->

**Key**: :heavy_check_mark: = recommended, :wrench: = fixable

<!-- prettier-ignore -->
| Name | Description | :heavy_check_mark: | :wrench: |
| ---- | ----------- | ------------------ | -------- |
${rulesTable}

<!-- end rule list -->
  `
    .trim()
    .replace(/\n/g, nl)
}

export function handleDescription({
  description,
  extraDescription,
}: Pick<RuleMeta, 'description' | 'extraDescription'>) {
  if (!extraDescription) return description

  if (Array.isArray(extraDescription)) {
    extraDescription = extraDescription.join(', ')
  }
  return `${description} (${extraDescription})`
}
