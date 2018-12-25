import readPkgUp from 'read-pkg-up'
import { dirname } from 'path'

export default readPkgUp()
  .then(({ path }) => path)
  .then(dirname)
