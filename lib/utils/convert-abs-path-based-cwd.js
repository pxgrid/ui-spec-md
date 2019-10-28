/*
 * convert absolute path based on working directory.
 *
 * ex). if working directory is '/path/to/foo/site',
 *      convertBasedWdAbsPath('./doc') will be '/path/to/foo/site/doc'
 */
const path = require('path')

const convertAbsPathBasedCwd = targetPath => {
  return path.resolve(process.cwd(), targetPath)
}

module.exports = convertAbsPathBasedCwd
