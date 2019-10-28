const path = require('path')

function rootPath(pathStr) {
  // `.`, `pages`, `*.html.md`の3つ分
  const len = pathStr.split(path.sep).length - 3
  const rel = new Array(len).fill('..')
  return path.join('.', ...rel)
}

module.exports = rootPath
