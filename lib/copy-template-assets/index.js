const path = require('path')
const ncp = require('ncp').ncp
ncp.limit = 16

const THEME_ASSETS = require('../../constants/dir-names').THEME_ASSETS

const copyTemplateAssets = (templateDir, destDir) => {
  const source = path.resolve(templateDir, THEME_ASSETS)
  const dest = path.resolve(destDir, THEME_ASSETS)

  return new Promise(resolve => {
    ncp(source, dest, err => {
      if (err) throw err
      resolve()
    })
  })
}

module.exports = copyTemplateAssets
