import spinner from '../spinner'

import readRule from './read-rule'

import chalk from 'chalk'
chalk.enabled = false

jest.mock('../../spinner')
const description = 'Require that the file be empty'
const name = 'require-empty'
const heading = `# ${description} (${name})`
const docs =
  `
${heading}

This rule ensures great productivity by requiring that
all files you write are completely empty.
  `.trim() + '\n'

const friendlyDocPath = chalk`docs/rules/{bold ${name}}`

const runReadRule = (
  rule: any = {
    meta: {
      docs: { description },
    },
  },
  docFile = docs
) =>
  readRule(
    {
      rule,
      docs: docFile,
      friendlyDocPath,
    },
    name
  )

describe('readRule()', () => {
  it('reads the description', () => {
    const ruleModule = {
      meta: {
        docs: {},
      },
    }
    const getDescription = jest.fn(() => description)
    Object.defineProperty(ruleModule.meta.docs, 'description', {
      get: getDescription,
    })

    runReadRule(ruleModule)

    expect(getDescription).toHaveBeenCalled()
  })

  it('does not modify the docs', () => {
    expect(runReadRule().newDocs).toBe(docs)
  })

  it('updates the docs if needed', () => {
    expect(runReadRule(undefined, docs.replace('# ', '# ***')).newDocs).toBe(
      docs
    )
    expect(spinner.info).toHaveBeenCalledWith(
      `Updating the docs for ${chalk.bold(name)}:`
    )

    const mockLog = (console.log as any).mock
    expect(mockLog.calls[mockLog.calls.length - 1]).toMatchSnapshot()
  })

  it('properly handles Windows-style \\r\\n newlines', () => {
    expect(
      runReadRule(undefined, docs.replace('\n', '\r\n')).newDocs
    ).toMatchSnapshot()
  })

  it('properly handles mixed Windows and Unix newlines', () => {
    const docs = `${heading}\nSome random test:\r\n\r\n`

    expect(runReadRule(undefined, docs).newDocs).toBe(docs)
  })

  it('properly handles multiple newlines before heading', () => {
    const docs = `\n\n\n\n\r\n${heading}\n`
    const outputDocs = `${heading}\n`

    expect(runReadRule(undefined, docs).newDocs).toBe(outputDocs)
  })

  it('properly handles non heading text with new line', () => {
    const docs = `\nTest\n`
    const outputDocs = `${heading}\n\nTest\n`

    expect(runReadRule(undefined, docs).newDocs).toBe(outputDocs)
  })

  it('properly handles non heading text without new line', () => {
    const docs = `Test\n`
    const outputDocs = `${heading}\nTest\n`

    expect(runReadRule(undefined, docs).newDocs).toBe(outputDocs)
  })

  it('properly handles an single line heading', () => {
    const docs = `# Test`
    const outputDocs = `${heading}`

    expect(runReadRule(undefined, docs).newDocs).toBe(outputDocs)
  })

  it('handles an empty file properly', () => {
    const docs = ``
    const outputDocs = `${heading}\n`

    expect(runReadRule(undefined, docs).newDocs).toBe(outputDocs)
  })
})
