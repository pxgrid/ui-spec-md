const path = require('path')
const Handlebars = require('handlebars')
const readFile = require('../utils/read-file')

/**
 * 渡されたmapに、後で使うテンプレートを取得する。
 */
function loadTmpl(pathStr, map) {
  const { name } = path.parse(pathStr)

  return Promise.resolve()
    .then(() => readFile(pathStr))
    .then(tmplHTML => {
      map.set(name, Handlebars.compile(tmplHTML))
    })
}

module.exports = loadTmpl
