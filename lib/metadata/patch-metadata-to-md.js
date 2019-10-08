const parseMetadataFromMd = require('./parse-metadata-from-md')
const metadataObjectToMd = require('./metadata-object-to-md')

const patchMetadataToMd = (metadataToPatch, md) => {
  const { metadata, mdSource } = parseMetadataFromMd(md)
  const patchedMetadata = Object.assign(metadata, metadataToPatch)
  const mdMetadata = `---\n` + metadataObjectToMd(patchedMetadata) + `---`
  return `${mdMetadata}

${mdSource}`
}

module.exports = patchMetadataToMd
