const gitLog = require('../utils/git-log')
const readFile = require('../utils/read-file')
const parsePageMd = require('../parse-page-md')

/**
 * Markdownのファイルを読み込んで、Pageという概念にモデル化する。
 *
 * - 最後に更新した情報を`git log`
 * - Markdownのテキスト
 * この2つを持つ。
 *
 */
function loadPage(rootDir, mdPath) {
  return Promise.all([readFile(mdPath), gitLog(mdPath)]).then(([md, gitLog]) => {
    const pageInfo = parsePageMd(md, gitLog, rootDir, mdPath)
    return Promise.resolve(pageInfo)
  })
}

module.exports = loadPage
