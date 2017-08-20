const args = process.argv.slice(2)

const isChecking = args.includes('check')
const verb = exports.isChecking ? 'Checking' : 'Updating'

const extArg = args.find(arg => arg.startsWith('--ext'))
let ext = '.js'
if (extArg) {
  if (extArg.startsWith('--ext=')) {
    ext = extArg.replace(/^--ext=/, '')
  } else if (extArg === '--ext' && args.indexOf(extArg) < args.length - 1) {
    ext = args[args.indexOf(extArg) + 1]
  }
}

if (!ext.match(/\..+$/)) {
  ext = `.${ext}`
}

exports = module.exports = {
  args,
  isChecking,
  verb,
  ext,
}
