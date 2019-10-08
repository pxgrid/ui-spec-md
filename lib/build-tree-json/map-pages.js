/**
 * pageInfoの構造は、lib/parse-page-md/index.js を参照
 */
const path = require('path')
const makeDirNode = require('./make-dir-node')
const makePageNode = require('./make-page-node')

const mapPage = (pageInfo, currentDirTree, currentDirPath, underDirPathList) => {
  currentDirTree.forEach(tree => {
    if (tree.path === currentDirPath) {
      if (underDirPathList.length === 1) {
        const pageNode = makePageNode(pageInfo)
        if (pageInfo.filename === 'index.html') {
          // index.htmlはその階層のDirNodeにページ情報を持たせる
          const { filename, title, rootPath } = pageNode
          Object.assign(tree, { filename, title, rootPath })
          return
        }
        tree.children.push(pageNode)
      } else {
        const nextDirPath = underDirPathList[0] + path.sep
        const nextUnderDirPathList = underDirPathList.slice(1, underDirPathList.length)
        mapPage(pageInfo, tree.children, nextDirPath, nextUnderDirPathList)
      }
    }
  })
}

const mapPages = (pageInfoList, dirTree) => {
  const rootNode = makeDirNode({ path: '/', children: [] })

  pageInfoList.forEach(pageInfo => {
    const fromRoot = pageInfo.fromRoot
    if (fromRoot === '') {
      // 最上層に属するページ
      const pageNode = makePageNode(pageInfo)
      if (pageNode.filename === 'index.html') {
        Object.assign(rootNode, pageNode)
        return
      }
      dirTree.push(pageNode)
      return
    }
    const splitPathList = fromRoot.split(path.sep)
    const currentDirPath = splitPathList[0] + path.sep
    const underDirPathList = splitPathList.slice(1, splitPathList.length)
    mapPage(pageInfo, dirTree, currentDirPath, underDirPathList)
  })
  rootNode.children = dirTree
  return rootNode
}

module.exports = mapPages
