const path = require('path')
const ncp = require('ncp').ncp
ncp.limit = 16

const TEMPLATE_ASSETS = require('../../constants/dir-names').TEMPLATE_ASSETS

const copyTemplateAssets = (templateDir, destDir) => {
  const source = path.resolve(templateDir, TEMPLATE_ASSETS)
  const dest = path.resolve(destDir, TEMPLATE_ASSETS)

  return new Promise(resolve => {
    ncp(source, dest, err => {
      if (err) throw err
      resolve()
    })
  })
}

module.exports = copyTemplateAssets
