#!/usr/bin/env node

const chalk = require('chalk')

const { unabort } = require('../lib/abort')
const spinner = require('../lib/spinner')

const run = require('../lib')

unabort(run)()
  .catch(err => {
    spinner.fail('Oops, something went wrong!')
    console.error(chalk.gray(err.stack || err.toString()))
  })
  .then(() => console.log(''))
