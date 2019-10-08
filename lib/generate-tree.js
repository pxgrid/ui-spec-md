const path = require('path')
const globby = require('globby')

const buildTreeJson = require('../lib/build-tree-json')

const generateTree = async (mdDir, destDir) => {
  const absoluteMdFilesPath = path.resolve(mdDir, './**/*.md')
  const relativeMdFilesPath = path.relative(process.cwd(), absoluteMdFilesPath)

  return Promise.resolve()
    .then(() => globby(relativeMdFilesPath))
    .then(paths => {
      buildTreeJson(paths, { rootDir: mdDir, destDir: destDir })
    })
    .then(() => console.log('All done :D'))
}

module.exports = generateTree
