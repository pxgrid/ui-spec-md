const mdDir = require('./options/mdDir')
const destDir = require('./options/destDir')
const port = require('./options/port')
const startEditServer = require('../../server/edit-server')

exports.command = 'edit-server [options]'

exports.describe = 'Serve editable server to edit spec markdown.'

exports.builder = yargs => {
  yargs.options({
    ...mdDir,
    ...destDir,
    ...port,
  })
}

exports.handler = async argv => {
  await startEditServer(argv.mdDir, argv.destDir, argv.port)
}
