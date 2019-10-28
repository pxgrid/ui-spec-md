const fs = require('fs')
const path = require('path')

const TREE_JSON = require('../../constants/file-names').TREE_JSON
const loadPage = require('../utils/load-page')

const modifyTreeJson = async (targetPath, { rootDir, destDir }) => {
  const pageInfo = await loadPage(rootDir, targetPath)
  const treeJson = fs.readFileSync(path.resolve(destDir, TREE_JSON), 'utf8')
  const treeObject = JSON.parse(treeJson)
  const htmlRootPath = targetPath.replace(/^(.*)\.md/, '/$1.html') // ex). path/to/file.md -> /path/to/file.html
  console.log('pageInfo', pageInfo)
  console.log('htmlRootPath', htmlRootPath)
  console.log('treeObject', treeObject)
}

module.exports = modifyTreeJson
