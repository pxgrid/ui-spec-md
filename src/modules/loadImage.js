const loadImage = async src => {
  return new Promise(resolve => {
    let img = new Image()
    img.onload = () => {
      const width = img.naturalWidth
      const height = img.naturalHeight
      img = null
      resolve({ width, height })
    }
    img.onerror = () => {
      img = null
      resolve({ width: 0, height: 0 })
    }
    img.src = src
  })
}

export default loadImage
