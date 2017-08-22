const mock = {}

'start warn fail succeed info'.split(' ').map(k => {
  mock[k] = jest.fn()
})

module.exports = mock
