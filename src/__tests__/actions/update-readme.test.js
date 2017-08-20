const updateReadme = require('../../actions/update-readme')

jest.mock('../../spinner')

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
* [\`foo\`](./docs/rules/foo.md) — Ensure that foo is used instead of bar
* [\`no-baz\`](./docs/rules/no-baz.md) — Ensure that baz is not used
<!-- end rule list -->
More description
`.trim() + '\n'
describe('buildBlock', () => {
  it('properly formats the rule metadata', () => {
    expect(updateReadme.buildBlock(fakeMetadata)).toMatchSnapshot()
  })
})
describe('updateReadme', () => {
  it('replaces the block if it’s already present', () => {
    expect(updateReadme(fakeReadme, fakeMetadata)).toMatchSnapshot()
  })
  it('is idempotent', () => {
    const firstPass = updateReadme(fakeReadme, fakeMetadata)
    const secondPass = updateReadme(firstPass, fakeMetadata)
    expect(secondPass).toEqual(firstPass)
  })
  it('is case-insensitive', () => {
    expect(
      updateReadme(fakeReadme.toUpperCase(), fakeMetadata)
    ).toMatchSnapshot()
  })
})
