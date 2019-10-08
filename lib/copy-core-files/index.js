const path = require('path')
const ncp = require('ncp').ncp
ncp.limit = 16

const BUILT_IN_TEMPLATE = require('../../constants/dir-names').BUILT_IN_TEMPLATE

// build済みのファイルが格納されているディレクトリ
const distDir = path.resolve(__dirname, `../../${BUILT_IN_TEMPLATE}`)

const copyScriptsDir = destDir => {
  const source = path.resolve(distDir, './_screen-spec-md')
  const dest = path.resolve(destDir, './_screen-spec-md')

  return new Promise(resolve => {
    ncp(source, dest, err => {
      if (err) throw err
      resolve()
    })
  })
}

/**
 * @param destDir マークダウンを変換後のhtmlファイルを出力するディレクトリ
 * @returns {Promise<void | never>}
 */
const copyCoreFiles = destDir => {
  return Promise.resolve().then(() => {
    return copyScriptsDir(destDir)
  })
}

module.exports = copyCoreFiles
