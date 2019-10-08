const makeDirNode = ({ path, children }) => {
  return {
    path: path,
    rootPath: '',
    filename: '',
    title: '',
    children: children,
  }
}

module.exports = makeDirNode
