const abort = require('../abort')
const { Abort, unabort } = abort

const abortingFunction = () => abort()
describe('abort()', () => {
  afterEach(() => {
    process.exitCode = 0
  })
  it('throws an error', () => {
    expect(abortingFunction).toThrowError()
  })
  it('sets the exit code', () => {
    try {
      abort()
    } catch (e) {}

    expect(process.exitCode).toMatchSnapshot()
  })
})

describe('unabort', () => {
  it('wraps without error', () =>
    expect(() => {
      unabort(abortingFunction)
    }).not.toThrow(Abort))

  it('catches Abort errors', () =>
    expect(unabort(abortingFunction)()).resolves.toBe(undefined))

  it('doesn’t catch non-Abort errors', () =>
    expect(
      unabort(() => {
        throw new TypeError()
      })()
    ).rejects.toBeInstanceOf(TypeError))
})
