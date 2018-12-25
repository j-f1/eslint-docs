import { join } from 'path'

export interface Paths {
  rulesDir: string
  docsDir: string
  readmePath: string
  pluginName: string
}
type Handlers = { [K in keyof Paths]: (projectRoot: string) => string }

export const handlers: Handlers = {
  rulesDir: projectRoot => join(projectRoot, 'lib', 'rules'),
  docsDir: projectRoot => join(projectRoot, 'docs', 'rules'),
  readmePath: projectRoot => join(projectRoot, 'README.md'),
  pluginName: projectRoot =>
    require(join(projectRoot, 'package.json')).name.replace(
      /^eslint-plugin-/,
      ''
    ),
}

export function register(projectRoot: string) {
  const paths: Paths = Object.create(null)
  ;(Object.keys(handlers) as Array<keyof Handlers>).map(key => {
    const f = handlers[key]
    paths[key] = f(projectRoot)
  })
  return Object.assign(paths, {
    projectRoot,
  })
}
