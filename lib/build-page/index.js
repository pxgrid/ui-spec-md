const path = require('path')

const writeFile = require('../utils/write-file')
const padZero = require('../utils/pad-zero')
const destPath = require('../utils/dest-path')
const loadPage = require('../utils/load-page')
const renderPage = require('./render-page')

/**
 * MarkdownのファイルをHTMLに変換する処理。
 * Markdownへのパス -> Pageというモデル -> HTML という処理の流れ。
 *
 */
function buildPage(paths, { rootDir, destDir, tmplMap }, { isEditable }) {
  console.log('>>> publishing pages...')
  return Promise.all(
    paths.map((mdPath, idx) => {
      const destFile = `${destPath(mdPath)}.html`
      const dest = path.resolve(destDir, destFile)

      // 進捗をログ
      const total = String(paths.length)
      console.log(`[${padZero(idx + 1, total.length)}/${total}] ${dest}`)

      return Promise.resolve()
        .then(() => loadPage(rootDir, mdPath))
        .then(pageInfo => renderPage(tmplMap, pageInfo, { isEditable }))
        .then(html => writeFile(dest, html))
        .catch(err => {
          console.log(err)
        })
    }),
  ).then(() => {
    console.log('>>> pages published!')
  })
}

module.exports = buildPage
