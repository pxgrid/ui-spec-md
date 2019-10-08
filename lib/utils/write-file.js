const fs = require('fs')

function writeFile(dest, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dest, data, err => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })
}

module.exports = writeFile
