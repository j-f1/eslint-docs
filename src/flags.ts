const argv = process.argv.slice(2)

export const parse = (args = argv) => {
  const isChecking = args.indexOf('check') !== -1
  const verb = exports.isChecking ? 'Checking' : 'Updating'

  const noDiffs = args.indexOf('--no-diffs') !== -1

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

  return {
    args,
    noDiffs,
    isChecking,
    verb,
    ext,
  }
}

const { args, noDiffs, isChecking, verb, ext } = parse()

export { args, noDiffs, isChecking, verb, ext }
