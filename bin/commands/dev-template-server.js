const mdDir = require('./options/mdDir')
const destDir = require('./options/destDir')
const templateDir = require('./options/templateDir')
const port = require('./options/port')
const devTemplateServer = require('../../server/dev-template-server')

exports.command = 'dev-template-server [options]'

exports.describe = 'Serve server for developing templates.'

exports.builder = yargs => {
  yargs.options({
    ...mdDir,
    ...destDir,
    ...templateDir,
    ...port,
  })
}

exports.handler = async argv => {
  await devTemplateServer({
    mdDir: argv.mdDir,
    destDir: argv.destDir,
    port: argv.port,
    templateDir: argv.templateDir,
  })
}
