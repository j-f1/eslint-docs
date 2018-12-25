#!/usr/bin/env node

import chalk from 'chalk'

import { unabort } from './abort'
import spinner from './spinner'

import run from './'

unabort(run)()
  .catch(err => {
    spinner.fail('Oops, something went wrong!')
    console.error(chalk.gray(err.stack || err.toString()))
  })
  .then(() => console.log(''))
