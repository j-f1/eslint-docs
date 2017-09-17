jest.mock('../../spinner')

const updateReadme = require('../../actions/update-readme')

const fakeMetadata = [
  {
    name: 'foo',
    description: 'Ensure that foo is used instead of bar',
  },
  {
    name: 'no-baz',
    description: 'Ensure that baz is not used',
  },
]
const fakeReadme =
  `
# eslint-plugin-test
Some description
<!-- begin rule list -->
* [\`awesome/foo\`](./docs/rules/foo.md) — Ensure that foo is used instead of bar
* [\`awesome/no-baz\`](./docs/rules/no-baz.md) — Ensure that baz is not used
<!-- end rule list -->
More description
`.trim() + '\n'

const pluginName = 'awesome'
const project = { pluginName }
describe('buildBlock', () => {
  it('properly formats the rule metadata', () => {
    expect(updateReadme.buildBlock(fakeMetadata, pluginName)).toMatchSnapshot()
  })
})
describe('updateReadme', () => {
  it('replaces the block if it’s already present', () => {
    expect(updateReadme(fakeReadme, fakeMetadata, project)).toMatchSnapshot()
  })
  it('appends the block if it doesn’t exist', () => {
    expect(
      updateReadme(
        `
# eslint-plugin-test
Some description
(I’m real lazy :()
More description
        `.trim() + '\n',
        fakeMetadata,
        project
      )
    ).toMatchSnapshot()
  })
  it('is idempotent', () => {
    const firstPass = updateReadme(fakeReadme, fakeMetadata, project)
    const secondPass = updateReadme(firstPass, fakeMetadata, project)
    expect(secondPass).toEqual(firstPass)
  })
  it('is case-insensitive', () => {
    expect(
      updateReadme(fakeReadme.toUpperCase(), fakeMetadata, project)
    ).toMatchSnapshot()
  })
})
