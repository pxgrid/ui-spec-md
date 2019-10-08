const cheerio = require('cheerio')
const md2html = require('../utils/md2html')
const readFile = require('../utils/read-file')
const destPath = require('../utils/dest-path')

/**
 * Markdownのファイルを読み込んで、Listという概念にモデル化する。
 *
 * - パス
 * - ページ名
 * - リスト化したいAPIについての部分のMarkdownをHTMLにしたもの
 * この2つを持つ。
 *
 */
function loadList(pathStr) {
  return Promise.resolve()
    .then(() => readFile(pathStr))
    .then(md => md2html(md))
    .then(mdHTML => {
      const $ = cheerio.load(mdHTML, { decodeEntities: false })

      const ret = {
        path: destPath(pathStr),
        name: $('h1').text(),
        html: '',
      }

      $('h2').each((_, el) => {
        const $el = $(el)
        if ($el.text() === 'FileIdと使用API') {
          // XXX: なぜか<ul />がいない
          ret.html = `<ul>${$el.next().html()}</ul>`
          return false
        }
      })

      return Promise.resolve(ret)
    })
}

module.exports = loadList
