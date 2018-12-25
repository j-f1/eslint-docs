import chalk from 'chalk'
import { graceful as detectNewline } from 'detect-newline'

import { isChecking, noDiffs } from '../flags'
import spinner from '../spinner'
import abort from '../abort'
import diff from '../diff'

interface Options {
  rule: import('eslint').Rule.RuleModule & {
    meta: { docs: { extraDescription?: string | string[] } }
  }
  docs: string
  friendlyDocPath: string
}

export interface RuleMeta {
  name: string
  description: string
  extraDescription?: string | string[]
  recommended?: boolean
  fixable?: 'whitespace' | 'code'
}

export default (
  { rule, docs, friendlyDocPath }: Options,
  name: string
): { newDocs: string; meta: RuleMeta } => {
  if (!rule || !rule.meta || !rule.meta.docs || !rule.meta.docs.description) {
    spinner.fail(`Rule ${name} does not have a description`)
    return abort()
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
        chalk`The description for {bold ${name}} must match the required format:`
      )
      if (!noDiffs) console.error(patch)
      process.exitCode = 1
    } else {
      spinner.info(chalk`Updating the docs for {bold ${name}}:`)
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
