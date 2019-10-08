const path = require('path')

const makeRootPath = ({ fromRoot, filename }) => {
  const splitPathList = fromRoot.split(path.sep)
  const pathList = splitPathList.filter(path => path !== '')
  pathList.unshift('')
  pathList.push(filename)
  return pathList.join(path.sep)
}

const makePageNode = ({ filename, title, fromRoot }) => {
  const rootPath = makeRootPath({ fromRoot, filename })
  return {
    rootPath: rootPath,
    filename: filename,
    title: title,
  }
}

module.exports = makePageNode
