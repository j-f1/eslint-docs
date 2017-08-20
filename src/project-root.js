const readPkgUp = require('read-pkg-up')
const { dirname } = require('path')

exports = module.exports = readPkgUp().then(({ path }) => path).then(dirname)
