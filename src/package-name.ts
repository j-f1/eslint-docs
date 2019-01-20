/**
 Copyright JS Foundation and other contributors, https://js.foundation

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * Removes the prefix from a fullname.
 * @param {string} fullname The term which may have the prefix.
 * @param {string} prefix The prefix to remove.
 * @returns {string} The term without prefix.
 * @see https://github.com/eslint/eslint/blob/6009239042cb651bc7ca6b8c81bbe44c40327430/lib/util/naming.js#L69
 */
export function getShorthandName(fullname: string, prefix: string) {
  if (fullname[0] === '@') {
    let matchResult = new RegExp(`^(@[^/]+)/${prefix}$`).exec(fullname)

    if (matchResult) {
      return matchResult[1]
    }

    matchResult = new RegExp(`^(@[^/]+)/${prefix}-(.+)$`).exec(fullname)
    if (matchResult) {
      return `${matchResult[1]}/${matchResult[2]}`
    }
  } else if (fullname.startsWith(`${prefix}-`)) {
    return fullname.slice(prefix.length + 1)
  }

  return fullname
}
