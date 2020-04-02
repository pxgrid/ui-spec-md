const path = require('path')
const express = require('express')
const chokidar = require('chokidar')

const generateSpecAndTree = require('../lib/generate-spec-and-tree')
const writeSpec = require('../lib/write-spec')
const generateTree = require('../lib/generate-tree')
const { productionEditable } = require('../server/editable')

const createServer = destDir => {
  const app = express()
  app.use(express.static(destDir))
  return app
}

const state = {
  server: null,
  sockets: [],
}

function start(mdDir, destDir, serverRootDir, port) {
  const app = createServer(serverRootDir)
  state.server = app.listen(port, () => {
    console.log(`edit-server: http://localhost:${port}`)
    if (destDir !== serverRootDir) {
      const uiSpecMdDir = path.relative(serverRootDir, destDir)
      console.log(`ui-spec-md root: http://localhost:${port}/${uiSpecMdDir}`)
    }
  })
  state.server.on('connection', socket => {
    console.log('Add socket', state.sockets.length + 1)
    state.sockets.push(socket)
  })

  productionEditable(app, mdDir, destDir, serverRootDir, port)
}

function restart(mdDir, destDir, serverRootDir, port) {
  state.sockets.forEach((socket, index) => {
    console.log('Destroying socket', index + 1)
    if (socket.destroyed === false) {
      socket.destroy()
    }
  })
  state.sockets = []
  state.server.close(() => {
    console.log('\n********* Restart edit-server *********')
    start(mdDir, destDir, serverRootDir, port)
  })
}

const startEditServer = async (mdDir, destDir, serverRootDir, port = 3001) => {
  await generateSpecAndTree(mdDir, destDir, serverRootDir, { isEditable: true })
  start(mdDir, destDir, serverRootDir, port)

  const watcher = chokidar.watch(mdDir, {
    ignoreInitial: true,
    persistent: true,
  })
  watcher
    .on('add', async absoluteMdPath => {
      const targetMdPath = path.relative(mdDir, absoluteMdPath)
      console.log(`File ${targetMdPath} has been added`)
      await writeSpec(mdDir, destDir, serverRootDir, targetMdPath)
      await generateTree(mdDir, destDir, serverRootDir)
    })
    .on('change', async absoluteMdPath => {
      const targetMdPath = path.relative(mdDir, absoluteMdPath)
      console.log(`File ${targetMdPath} has been changed`)
      await writeSpec(mdDir, destDir, serverRootDir, targetMdPath)
    })
    .on('unlink', async absoluteMdPath => {
      const targetMdPath = path.relative(mdDir, absoluteMdPath)
      console.log(`File ${targetMdPath} has been removed`)
      await generateTree(mdDir, destDir, serverRootDir)
    })
}

module.exports = startEditServer
