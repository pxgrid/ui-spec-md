const fs = require('fs')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')

/**
 * ディレクトリ作成。すでに書き出すフォルダがあれば一旦削除する。
 *
 * @param {string} dir - ディレクトリパス
 */
const makeDir = dir => {
  if (fs.existsSync(dir)) {
    rimraf.sync(dir)
  }
  mkdirp.sync(dir)
}

module.exports = makeDir
