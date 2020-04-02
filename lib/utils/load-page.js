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
async function loadPage({ rootDir, mdPath, destFromSeverRoot }) {
  const md = await readFile(mdPath)
  const log = await gitLog(mdPath).catch(error => {
    // If there is no repository or git is not installed, an error will occur.
    console.warn(`Could not get information from git. (${mdPath})`)
    return parsePageMd(md, {}, rootDir, mdPath, destFromSeverRoot)
  })
  return parsePageMd(md, log, rootDir, mdPath, destFromSeverRoot)
}

module.exports = loadPage
