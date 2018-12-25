import fs from 'mz/fs'

import chalk from 'chalk'

import spinner from './spinner'
import abort from './abort'

type UnPromise<P> = P extends Promise<infer T> ? T : P

const run = <Handler extends (...args: any[]) => any>(f: Handler) => async (
  success: string | null,
  error: string | null,
  ...args: Parameters<Handler>
): Promise<UnPromise<ReturnType<Handler>>> => {
  try {
    const result = await f(...args)
    if (success) spinner.succeed(success)
    return result
  } catch (e) {
    spinner.fail(error || 'Error')
    console.error(chalk.gray(e.stack))
    return abort()
  }
}

export const read = run((path: string) => fs.readFile(path, 'utf-8'))
export const write = run((path: string, content: string) =>
  fs.writeFile(path, content)
)
