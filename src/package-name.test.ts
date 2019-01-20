import { getShorthandName } from './package-name'

describe('getShorthandName', () => {
  const testName = (name: string) => getShorthandName(name, 'eslint-plugin')

  it('expect correct package name', () => {
    expect(testName('')).toEqual('')
    expect(testName('foo-test')).toEqual('foo-test')
    expect(testName('eslint-plugin-eslint-plugin')).toEqual('eslint-plugin')
    expect(testName('eslint-plugin-vue')).toEqual('vue')
    expect(testName('eslint-plugin-typescript')).toEqual('typescript')
    expect(testName('eslint-plugin-jest')).toEqual('jest')
  })

  it('expect correct scoped package name', () => {
    expect(testName('@test/foo-test')).toEqual('@test/foo-test')
    expect(testName('@test/eslint-plugin-eslint-plugin')).toEqual(
      '@test/eslint-plugin'
    )
    expect(testName('@test/eslint-plugin-vue')).toEqual('@test/vue')
    expect(testName('@test/eslint-plugin-typescript')).toEqual(
      '@test/typescript'
    )
    expect(testName('@test/eslint-plugin')).toEqual('@test')
    expect(testName('@typescript-eslint/eslint-plugin')).toEqual(
      '@typescript-eslint'
    )
  })
})
