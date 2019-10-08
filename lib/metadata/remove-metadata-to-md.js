const parseMetadataFromMd = require('./parse-metadata-from-md')
const metadataObjectToMd = require('./metadata-object-to-md')

const removeMetadataToMd = (metadataKeyToDelete, md) => {
  const { metadata, mdSource } = parseMetadataFromMd(md)
  delete metadata[metadataKeyToDelete]
  const mdMetadata = `---\n` + metadataObjectToMd(metadata) + `---`
  return `${mdMetadata}

${mdSource}`
}

module.exports = removeMetadataToMd
