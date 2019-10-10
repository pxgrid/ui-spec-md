const mdDir = require('./options/mdDir')
const destDir = require('./options/destDir')
const themeDir = require('./options/themeDir')
const port = require('./options/port')
const devTemplateServer = require('../../server/dev-template-server')

exports.command = 'dev-template-server [options]'

exports.describe = 'Serve server for developing templates.'

exports.builder = yargs => {
  yargs.options({
    ...mdDir,
    ...destDir,
    ...themeDir,
    ...port,
  })
}

exports.handler = async argv => {
  await devTemplateServer({
    mdDir: argv.mdDir,
    destDir: argv.destDir,
    port: argv.port,
    themeDir: argv.themeDir,
  })
}
