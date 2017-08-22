const mock = {}

'start warn fail succeed info'.split(' ').map(k => {
  mock[k] = jest.fn()
})

exports = module.exports = mock

exports.console = console
global.console = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
}
