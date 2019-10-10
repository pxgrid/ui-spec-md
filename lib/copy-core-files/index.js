const path = require('path')
const ncp = require('ncp').ncp
ncp.limit = 16

const DEFAULT_THEME = require('../../constants/dir-names').DEFAULT_THEME

// build済みのファイルが格納されているディレクトリ
const distDir = path.resolve(__dirname, `../../${DEFAULT_THEME}`)

const copyScriptsDir = destDir => {
  const source = path.resolve(distDir, './_ui-spec-md')
  const dest = path.resolve(destDir, './_ui-spec-md')

  return new Promise((resolve, reject) => {
    ncp(source, dest, err => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

/**
 * @param destDir マークダウンを変換後のhtmlファイルを出力するディレクトリ
 * @returns {Promise<void | never>}
 */
const copyCoreFiles = destDir => {
  return copyScriptsDir(destDir)
}

module.exports = copyCoreFiles
