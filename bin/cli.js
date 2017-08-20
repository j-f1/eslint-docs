#!/usr/bin/env node

const chalk = require('chalk')

const { Abort } = require('../lib/abort')
const spinner = require('../lib/spinner')

const run = require('../lib')

run().catch(err => {
  if (!(err instanceof Abort)) {
    spinner.fail('Oops, something went wrong!')
    console.error(chalk.gray(err.stack))
  }
})
