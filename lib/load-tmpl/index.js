const path = require('path')
const Handlebars = require('handlebars')
const readFile = require('../utils/read-file')

/**
 * 渡されたmapに、後で使うテンプレートを取得する。
 */
function loadTmpl(pathStr, map, destDir, serverRootDir) {
  const { name } = path.parse(pathStr)
  const toUiSpecDirPath = path.relative(serverRootDir, destDir)

  return Promise.resolve()
    .then(() => readFile(pathStr))
    .then(tmplHTML => {
      map.set(
        name,
        Handlebars.compile(
          toUiSpecDirPath
            ? tmplHTML
                .replace(/href="\/([^"]*)"/g, `href="/${toUiSpecDirPath}/$1"`)
                .replace(/src="\/([^"]*)"/g, `src="/${toUiSpecDirPath}/$1"`)
            : tmplHTML,
        ),
      )
    })
}

module.exports = loadTmpl
