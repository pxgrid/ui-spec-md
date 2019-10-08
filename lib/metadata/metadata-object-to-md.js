const metadataObjectToMd = metadataObject => {
  return Object.keys(metadataObject).reduce((accMd, currentKey) => {
    accMd += `${currentKey}: ${metadataObject[currentKey]}\n`
    return accMd
  }, '')
}

module.exports = metadataObjectToMd
