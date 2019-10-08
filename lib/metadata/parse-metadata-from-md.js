const yaml = require('js-yaml')
const regexpMarkdownMetaArea = require('../constants/regexp').markdownMeatArea

const parseMetadata = metaRegexpRes => {
  const metaYamlContent = metaRegexpRes[0].replace(/---/g, '')
  try {
    return yaml.safeLoad(metaYamlContent)
  } catch (e) {
    throw new Error('Markdown metadata syntax is invalid!')
  }
}

const parseMetadataFromMd = md => {
  const metaRegexpRes = regexpMarkdownMetaArea.exec(md)
  if (!metaRegexpRes) {
    return { metadata: null, mdSource: null }
  }
  const metadata = parseMetadata(metaRegexpRes)
  const mdSource = md.slice(metaRegexpRes[0].length)
  return { metadata, mdSource }
}

module.exports = parseMetadataFromMd
