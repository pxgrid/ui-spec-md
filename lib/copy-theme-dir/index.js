const path = require('path')
const ncp = require('ncp').ncp
ncp.limit = 16

const copyThemeDir = destDir => {
  const source = path.resolve(__dirname, '../../theme')
  return new Promise(resolve => {
    ncp(source, destDir, err => {
      if (err) throw err
      resolve()
    })
  })
}

module.exports = copyThemeDir
