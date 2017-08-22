jest.mock('../../spinner')

const spinner = require('../../spinner')

const chalk = require('chalk')
chalk.enabled = true

const readRule = require('../../actions/read-rule')

const description = 'Require that the file be empty'
const name = 'require-empty'
const docs =
  `
# ${description} (${name})

This rule ensures great productivity by requiring that
all files you write are completely empty.
  `.trim() + '\n'

const friendlyDocPath = `docs/rules/${chalk.bold(name)}`

const runReadRule = (
  rule = {
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

    const mockLog = console.log.mock
    expect(mockLog.calls[mockLog.calls.length - 1]).toMatchSnapshot()
  })
})
