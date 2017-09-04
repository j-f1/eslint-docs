# eslint-docs

[![NPM version](https://img.shields.io/npm/v/eslint-docs.svg?style=flat-square)](https://npmjs.org/package/eslint-docs)
[![Build Status](https://img.shields.io/travis/j-f1/eslint-docs/master.svg?style=flat-square)](https://travis-ci.org/j-f1/eslint-docs)
[![Codecov](https://img.shields.io/codecov/c/github/j-f1/eslint-docs.svg?style=flat-square)](https://codecov.io/gh/j-f1/eslint-docs)
[![Greenkeeper enabled](https://img.shields.io/badge/greenkeeper-enabled-00c775.svg?style=flat-square)](https://greenkeeper.io/)

> Keep your rule names and descriptions up-to-date across your repo

## Installation

```shellsession
$ npm install --save-dev eslint-docs
```

## Usage

In the shell

```shellsession
$ eslint-docs
✔ docs/rules/no-insecure-random.md is up-to-date
✔ docs/rules/no-stateless-class.md is up-to-date
✔ docs/rules/promise-must-complete.md is up-to-date
✔ README.md is up-to-date

$ eslint-docs check # Run this in CI!
✔ docs/rules/no-insecure-random.md is valid
✔ docs/rules/no-stateless-class.md is valid
✔ docs/rules/promise-must-complete.md is valid
✔ The README is valid
```

In package.json:

```json
{
  "scripts": {
    "docs": "eslint-docs",
    "docs:check": "eslint-docs check"
  }
}
```

In a Node.js script

```js
const eslintDocs = require('eslint-docs')

eslintDocs(yourProjectDirectory).then(() => {
  // Everything went OK!
}, () => {
  // Something went wrong!
  // Currently, you’ll have to ask the user to look at the terminal. sorry :(
})

```

`yourProjectDirectory` defaults to the closest directory above `process.cwd()`
that includes a `package.json`


## License

ISC © [Jed Fox](https://j-f1.github.io)
