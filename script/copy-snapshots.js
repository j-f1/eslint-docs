const { spawnSync } = require('child_process')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')

const { stdout, stderr } = spawnSync(
  'find',
  [path.resolve(projectRoot, 'src'), '-iname', '*.js.snap'],
  {
    encoding: 'utf-8',
  }
)
if (stderr) {
  console.error(stderr)
}
for (const file of stdout.trim().split('\n')) {
  const relative = path.relative(projectRoot, file)
  const dest = path.resolve(projectRoot, relative.replace(/^src/, 'lib'))

  console.log(
    `copying {src => lib}/${path.relative(path.join(projectRoot, 'src'), file)}`
  )
  spawnSync('mkdir', ['-p', path.dirname(dest)])
  const { stderr } = spawnSync('cp', [file, dest], {
    encoding: 'utf-8',
  })
  if (stderr) console.error(stderr)
}
console.log('')
