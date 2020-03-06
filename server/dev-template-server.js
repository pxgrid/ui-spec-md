const fs = require('fs')
const path = require('path')
const express = require('express')
const chokidar = require('chokidar')
const sass = require('node-sass')

const generateSpecAndTree = require('../lib/generate-spec-and-tree')

const createServer = destDir => {
  const app = express()
  app.use(express.static(destDir))
  return app
}

const state = {
  server: null,
  sockets: [],
}

function start({ rootDir, port }) {
  const app = createServer(rootDir)
  state.server = app.listen(port, () => {
    console.log(`dev-template-server: http://localhost:${port}`)
  })
  state.server.on('connection', socket => {
    console.log('Add socket', state.sockets.length + 1)
    state.sockets.push(socket)
  })
}

function restart({ rootDir, port }) {
  state.sockets.forEach((socket, index) => {
    console.log('Destroying socket', index + 1)
    if (socket.destroyed === false) {
      socket.destroy()
    }
  })
  state.sockets = []
  state.server.close(() => {
    console.log('\n********* Restart dev-template-server *********')
    start({ rootDir, port })
  })
}

const compileScss = (absoluteFilePath, themeDir) => {
  if (!/\.scss$/.test(absoluteFilePath)) {
    return
  }
  const sourceDir = path.resolve(themeDir, './assets/css')
  fs.readdir(sourceDir, (err, files) => {
    if (err) throw err
    const scssPaths = files
      .map(file => {
        return path.resolve(sourceDir, file)
      })
      .filter(file => {
        return fs.statSync(file).isFile() && /.*\.scss$/.test(file)
      })
    scssPaths.map(scssPath => {
      const outputCss = scssPath.replace(/\.scss$/, '.css')
      console.log('outputCss', outputCss)
      const result = sass.renderSync({
        file: scssPath,
        // outputStyle: 'compressed',
        outFile: outputCss,
      })
      fs.writeFileSync(outputCss, result.css)
    })
  })
}

const startDevTemplateServer = async ({ mdDir, destDir, rootDir, port, themeDir }) => {
  await generateSpecAndTree(mdDir, destDir, rootDir, { themeDir })
  start({ rootDir, port })

  const watcher = chokidar.watch(themeDir, {
    ignored: /\.css$/,
    ignoreInitial: true,
    persistent: true,
  })
  watcher
    .on('add', async absoluteTemplatePath => {
      console.log(`File ${absoluteTemplatePath} has been added`)
      compileScss(absoluteTemplatePath, themeDir)
      await generateSpecAndTree(mdDir, destDir, rootDir, { themeDir })
      restart({ rootDir, port })
    })
    .on('change', async absoluteTemplatePath => {
      console.log(`File ${absoluteTemplatePath} has been changed`)
      compileScss(absoluteTemplatePath, themeDir)
      await generateSpecAndTree(mdDir, destDir, rootDir, { themeDir })
      restart({ rootDir, port })
    })
    .on('unlink', async absoluteTemplatePath => {
      console.log(`File ${absoluteTemplatePath} has been removed`)
      compileScss(absoluteTemplatePath, themeDir)
      await generateSpecAndTree(mdDir, destDir, rootDir, { themeDir })
      restart({ rootDir, port })
    })
}

module.exports = startDevTemplateServer
