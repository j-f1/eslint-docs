import { RuleMeta } from '../read-rule'

import updateReadme, { buildBlock } from '../update-readme'

jest.mock('../../spinner')

const fakeMetadata: RuleMeta[] = [
  {
    name: 'foo',
    description: 'Ensure that foo is used instead of bar',
    extraDescription: 'Magical!',
    recommended: true,
  },
  {
    name: 'no-baz',
    description: 'Ensure that baz is not used',
    extraDescription: ['Unicorns', '`Rainbows`'],
  },
  {
    name: 'r',
    description: 'Require your code to be super awesome!',
    fixable: 'code',
  },
]
const fakeReadme =
  `
# eslint-plugin-test
Some description
<!-- begin rule list -->
**Key**: :heavy_check_mark: = recommended, :wrench: = fixable
| Name | Description | :heavy_check_mark: | :wrench: |
| ---- | ----------- | ------------------ | -------- |
| [awesome/foo](./docs/rules/foo.md) | Ensure that foo is used instead of bar | :heavy_check_mark: | |
| [awesome/no-baz](./docs/rules/no-baz.md) | Ensure that baz is not used | | |
<!-- end rule list -->
More description
`.trim() + '\n'

const pluginName = 'awesome'
const project = { pluginName }
describe('buildBlock', () => {
  it('properly formats the rule metadata', () => {
    expect(buildBlock(fakeMetadata, pluginName)).toMatchSnapshot()
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
