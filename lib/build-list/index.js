const writeFile = require('../utils/write-file')
const loadList = require('./load-list')
const renderList = require('./render-list')

/**
 * Markdownのファイルから、画面一覧を生成する処理。
 * Markdownへのパス -> Listというモデル -> HTML という処理の流れ。
 *
 */
function buildList(paths, { destDir, tmplMap }) {
  const dest = `${destDir}/list.html`

  console.log('>>> publishing list...')
  console.log(`[01/01] ${dest}`)
  paths.forEach(p => console.log(`  ${p}`))

  return Promise.all(paths.map(mdPath => loadList(mdPath)))
    .then(list => renderList(tmplMap, list))
    .then(html => writeFile(dest, html))
    .then(() => {
      console.log('<<< list published!')
    })
}

module.exports = buildList
