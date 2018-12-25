import diff from 'cli-diff'
import indent = require('indent-string')

export default (...args: Parameters<typeof diff>) => indent(diff(...args), 2)
