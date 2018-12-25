export default function abort(): never {
  if (!process.exitCode) {
    process.exitCode = 1
  }
  throw new Abort()
}

export class Abort extends Error {}

export const unabort = <F extends (...args: any[]) => any>(f: F) => async (
  ...args: Parameters<F>
): Promise<ReturnType<F> | undefined> => {
  try {
    return await f(...args)
  } catch (e) {
    // silently catch the abort() call
    if (e instanceof exports.Abort) {
      return undefined
    }
    throw e
  }
}
