exports = module.exports = function abort() {
  if (!process.exitCode) {
    process.exitCode = 1
  }
  throw new exports.Abort()
}

exports.Abort = class extends Error {}

exports.unabort = f => (...args) => {
  try {
    return f(...args)
  } catch (e) {
    // silently catch the abort() call
    if (!(e instanceof exports.Abort)) {
      throw e
    }
  }
}
