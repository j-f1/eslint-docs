const abort = require('../abort')
const { Abort, unabort } = abort

expect.extend({
  toResolve() {
    console.log(this, ...arguments)
  },
})

describe('abort()', () => {
  afterEach(() => {
    process.exitCode = 0
  })
  it('throws an error', () => {
    expect(abort).toThrow(Abort)
  })
  it('sets the exit code', () => {
    try {
      abort()
    } catch (e) {}

    expect(process.exitCode).toMatchSnapshot()
  })
})

const abortingFunction = () => abort()
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
