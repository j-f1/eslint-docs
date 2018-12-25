const mock: any = {}

'start warn fail succeed info'.split(' ').map(k => {
  mock[k] = jest.fn()
})

export default mock

export const console = global.console
global.console = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
} as any
