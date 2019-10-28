/**
 * DataTransfer detail: https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer
 */
const isSingleFile = dataTransfer => {
  if (!dataTransfer) return false
  if (!dataTransfer.types) return false
  if (dataTransfer.types.length !== 1) return false
  return dataTransfer.types[0] === 'Files'
}

const isSingleImageFile = dataTransfer => {
  const file = dataTransfer.files[0]
  if (!isSingleFile(dataTransfer)) return false
  return /image/.test(file.type)
}

const getAsSingleFile = dataTransfer => {
  if (isSingleFile(dataTransfer) === false) {
    throw new Error(`The data isn't single file!`)
  }
  return dataTransfer.items[0].getAsFile()
}

const readBase64 = async dataTransfer => {
  const file = dataTransfer.files[0]
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = e => reject(e)
    reader.readAsDataURL(file)
  })
}

export default {
  isSingleFile,
  isSingleImageFile,
  getAsSingleFile,
  readBase64,
}
