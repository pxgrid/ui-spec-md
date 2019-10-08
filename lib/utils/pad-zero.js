function padZero(targetStr, targetLength) {
  targetStr = String(targetStr)
  return ('0'.repeat(targetLength) + targetStr).slice(-1 * targetLength)
}

module.exports = padZero
