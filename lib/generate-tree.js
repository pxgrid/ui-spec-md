const path = require('path')
const globby = require('globby')

const buildTreeJson = require('../lib/build-tree-json')

const generateTree = async (mdDir, destDir, serverRootDir) => {
  const absoluteMdFilesPath = path.resolve(mdDir, './**/*.md')
  const relativeMdFilesPath = path.relative(process.cwd(), absoluteMdFilesPath)

  return Promise.resolve()
    .then(() => globby(relativeMdFilesPath))
    .then(paths => {
      const destFromSeverRoot = path.relative(serverRootDir, destDir)
      buildTreeJson(paths, { rootDir: mdDir, destDir, destFromSeverRoot })
    })
    .then(() => console.log('All done :D'))
}

module.exports = generateTree
