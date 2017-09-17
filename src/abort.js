exports = module.exports = function abort() {
  if (!process.exitCode) {
    process.exitCode = 1
  }
  throw exports.Abort
}

exports.Abort = {}

exports.unabort = f => async (...args) => {
  try {
    return await f(...args)
  } catch (e) {
    // silently catch the abort() call
    if (e !== exports.Abort) {
      throw e
    }
  }
}
