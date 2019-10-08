const path = require('path')
const makeDirNode = require('./make-dir-node')

const convertTree = (dirPath, currentDirs) => {
  const pathList = dirPath.split(path.sep)
  if (pathList.length < 2) {
    // ex. '/', '.'
    return currentDirs
  }
  if (pathList.length === 2) {
    // ex. 'login/', 'settings/'
    const dirNode = makeDirNode({ path: dirPath, children: [] })
    currentDirs.push(dirNode)
    return currentDirs
  }
  const parentPath = pathList[0] + path.sep
  const childDirPath = pathList.slice(1, pathList.length).join(path.sep)
  const targetDir = currentDirs.find(item => item.path === parentPath)
  if (targetDir) {
    targetDir.children = convertTree(childDirPath, targetDir.children)
  } else {
    const dirNode = makeDirNode({ path: parentPath, children: convertTree(childDirPath, []) })
    currentDirs.push(dirNode)
  }
  return currentDirs
}

const listToDirTree = pageInfoList => {
  const dirPaths = pageInfoList
    .map(info => info.fromRoot) // ディレクリの情報のみを抽出
    .filter((fromRoot, i, self) => self.indexOf(fromRoot) === i) // 重複削除

  return dirPaths.reduce((currentDirs, dirPath) => {
    return convertTree(dirPath, currentDirs)
  }, [])
}

module.exports = listToDirTree
