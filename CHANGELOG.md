# v0.3.x

## v0.3.1
Less output in CI (for real this time)

## v0.3.0
Convert the codebase to TypeScript; extract the diff function to [a separate package](https://npmjs.com/package/cli-diff)

# v0.2.x

## v0.2.7
Less output in CI

## v0.2.6
Tell [Prettier](https://prettier.io) to ignore the table in the README

## v0.2.5
## v0.2.4
*not published due to error*

## v0.2.3
🐛 Fix table output

## v0.2.2
## v0.2.1
*not published due to error*

## v0.2.0

* Update style in README to be a table (**breaking**)
* Upgrade dependencies

# v0.1.x

## v0.1.3
🐛 install `regenerator-runtime` for `async function` support

## v0.1.2 (💀)
* Use the documentation file’s predominant newline style when inserting newlines ([#7])
* Remove `babel-polyfill` and fix the tests on Node v4

[#7]: https://github.com/j-f1/eslint-docs/issues/7

## v0.1.1
Properly support the CLI on older versions of Node

## v0.1.0
Add Babel to enable support for older Node versions.

# v0.0.6
Allow specifying an `Array` for the `extraDescription` key;
it will be `.join(', ')`ed before being added to the README.

# v0.0.5
✨ Add support for an `extraDescription` key in the rule metadata
specifying content that should go in () after the rule description in the README.

# v0.0.4
✨ prefix the rule names with `PLUGINNAME/` in the README

# v0.0.3
🐛 unwrap Promise properly

# v0.0.2
Actually publish the source code

# v0.0.1
Initial release 🚀
