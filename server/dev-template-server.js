const express = require('express')
const chokidar = require('chokidar')

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

function start({ destDir, port }) {
  const app = createServer(destDir)
  state.server = app.listen(port, () => {
    console.log(`dev-template-server: http://localhost:${port}`)
  })
  state.server.on('connection', socket => {
    console.log('Add socket', state.sockets.length + 1)
    state.sockets.push(socket)
  })
}

function restart({ destDir, port }) {
  state.sockets.forEach((socket, index) => {
    console.log('Destroying socket', index + 1)
    if (socket.destroyed === false) {
      socket.destroy()
    }
  })
  state.sockets = []
  state.server.close(() => {
    console.log('\n********* Restart dev-template-server *********')
    start({ destDir, port })
  })
}

const startDevTemplateServer = async ({ mdDir, destDir, port, templateDir }) => {
  await generateSpecAndTree(mdDir, destDir, { templateDir })
  start({ destDir, port })

  const watcher = chokidar.watch(templateDir, {
    ignoreInitial: true,
    persistent: true,
  })
  watcher
    .on('add', async absoluteTemplatePath => {
      console.log(`File ${absoluteTemplatePath} has been added`)
      await generateSpecAndTree(mdDir, destDir, { templateDir })
      restart({ destDir, port })
    })
    .on('change', async absoluteTemplatePath => {
      console.log(`File ${absoluteTemplatePath} has been changed`)
      await generateSpecAndTree(mdDir, destDir, { templateDir })
      restart({ destDir, port })
    })
    .on('unlink', async absoluteTemplatePath => {
      console.log(`File ${absoluteTemplatePath} has been removed`)
      await generateSpecAndTree(mdDir, destDir, { templateDir })
      restart({ destDir, port })
    })
}

module.exports = startDevTemplateServer
