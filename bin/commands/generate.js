const mdDir = require('./options/mdDir')
const destDir = require('./options/destDir')
const templateDir = require('./options/templateDir')
const generateSpecAndTree = require('../../lib/generate-spec-and-tree')

exports.command = ['* [options]', 'generate']

exports.describe = 'Generate spec files from markdown'

exports.builder = yargs => {
  yargs.options({
    ...mdDir,
    ...destDir,
    ...templateDir,
  })
}

exports.handler = async argv => {
  await generateSpecAndTree(argv.mdDir, argv.destDir, {
    isEditable: false,
    templateDir: argv.templateDir,
  })
}
