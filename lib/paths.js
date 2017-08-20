const { join } = require('path')

exports.handlers = {
  rulesDir: projectRoot => join(projectRoot, 'lib', 'rules'),
  docsDir: projectRoot => join(projectRoot, 'docs', 'rules'),
  readmePath: projectRoot => join(projectRoot, 'README.md'),
}

exports.register = projectRoot => {
  const paths = Object.create(null)
  Object.keys(exports.handlers).map(key => {
    const f = exports.handlers[key]
    paths[key] = f.length < 2 ? f(projectRoot) : f.bind(null, projectRoot)
  })
  return Object.assign(paths, {
    projectRoot,
  })
}
