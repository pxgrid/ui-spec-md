const changeRootPathToRelative = (from, to) => {
  console.log('from', from)
  console.log('to', to)

  const fromDirs = from.split('/').filter(dirName => dirName !== '')
  const toDirs = to.split('/').filter(dirName => dirName !== '')

  let matchedLevel = 0
  for (let i = 0; i < toDirs.length; i++) {
    if (fromDirs[i] === toDirs[i]) {
      matchedLevel++
    } else {
      break
    }
  }
  if (matchedLevel === 0) {
    return fromDirs.map(() => '..').join('/') + to
  }
  const countUpToDir = fromDirs.length - matchedLevel - 1
  if (countUpToDir < 1) {
    return toDirs.slice(matchedLevel).join('/')
  }
  const pathToUp = Array.from({ length: countUpToDir }, () => '..').join('/')
  return pathToUp + '/' + toDirs.slice(matchedLevel).join('/')
}

export default changeRootPathToRelative
