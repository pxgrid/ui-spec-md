const path = require('path')
const parseMetadataFromMd = require('../metadata/parse-metadata-from-md')

/**
 * Markdownの先頭のyaml形式で書かれたmeta情報を取得する
 */
const parsePageMd = (md, gitLog, rootDir, mdPath) => {
  const dir = path.dirname(mdPath)
  const result = {
    title: '',
    screen: '',
    absolutesScreen: '',
    mdSource: '',
    filename: path.basename(mdPath.replace(/\.md$/, '.html')),
    dir: dir.replace(/([^(.|/)]$)/, '$1/'),
    fromRoot: path.relative(rootDir, dir).replace(/([^(.|/)]$)/, '$1/'),
    toRoot: path.relative(dir, rootDir).replace(/([^/]$)/, '$1/'),
    updatedAuthorName: gitLog.updated ? gitLog.updated.name : '',
    updatedDate: gitLog.updated ? gitLog.updated.date : '',
    createdAuthorName: gitLog.created.name,
    createdDate: gitLog.created.date,
  }

  const { metadata, mdSource } = parseMetadataFromMd(md)
  if (metadata === null && mdSource === null) {
    result.mdSource = md
    return result
  }
  result.title = metadata.title || ''
  result.screen = metadata.screen || ''
  result.absolutesScreen = metadata.screen
    ? path.resolve('/' + result.fromRoot, metadata.screen)
    : ''
  result.mdSource = mdSource
  return result
}

module.exports = parsePageMd
