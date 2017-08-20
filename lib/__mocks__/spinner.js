const mock = {}

'start warn fail succeed'.split(' ').map(k => {
  mock[k] = () => {}
})

module.exports = mock
