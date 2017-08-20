# eslint-docs [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

[![Greenkeeper badge](https://badges.greenkeeper.io/j-f1/eslint-docs.svg)](https://greenkeeper.io/)
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

// If you’re fancy
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


[npm-image]: https://badge.fury.io/js/eslint-docs.svg
[npm-url]: https://npmjs.org/package/eslint-docs
[travis-image]: https://travis-ci.org/j-f1/eslint-docs.svg?branch=master
[travis-url]: https://travis-ci.org/j-f1/eslint-docs
