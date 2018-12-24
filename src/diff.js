const indent = require('indent-string')
const diff = require('cli-diff')

module.exports = (...args) => indent(diff(...args), 2)
