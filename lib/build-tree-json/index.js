const path = require('path')

const writeFile = require('../utils/write-file')
const loadPage = require('../utils/load-page')
const listToDirTree = require('./list-to-dir-tree')
const mapPages = require('./map-pages')

/**
 * Markdownのファイルからサイトのツリー構造を構築する
 * Markdownへのパス -> pageInfoの配列 -> 子ページのパス情報も持つオブジェクトの配列 -> ツリー構造のjson
 *
 */
function buildTreeJson(paths, { rootDir, destDir, destFromSeverRoot }) {
  console.log('>>> publishing tree...')

  return Promise.all(
    paths.map(mdPath => {
      return Promise.resolve().then(() => loadPage({ rootDir, mdPath, destFromSeverRoot }))
    }),
  )
    .then(async pageInfoList => {
      const dirTree = listToDirTree(pageInfoList)
      const dirPageTree = mapPages(pageInfoList, dirTree)
      const destJson = `${destDir}/tree.json`
      const destJs = `${destDir}/tree.js`
      await writeFile(destJson, JSON.stringify(dirPageTree))
      await writeFile(
        destJs,
        `var SCREEN_SPEC_MD_TREE_DATA = JSON.parse('${JSON.stringify(dirPageTree)}')`,
      )
    })
    .then(() => {
      console.log(`<<< tree published!`)
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports = buildTreeJson
