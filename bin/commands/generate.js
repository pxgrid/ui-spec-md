const mdDir = require('./options/mdDir')
const destDir = require('./options/destDir')
const rootDir = require('./options/rootDir')
const themeDir = require('./options/themeDir')
const generateSpecAndTree = require('../../lib/generate-spec-and-tree')

exports.command = ['* [options]', 'generate']

exports.describe = 'Generate spec files from markdown'

exports.builder = yargs => {
  yargs.options({
    ...mdDir,
    ...destDir,
    ...rootDir,
    ...themeDir,
  })
}

exports.handler = async argv => {
  await generateSpecAndTree(argv.mdDir, argv.destDir, argv.rootDir ? argv.rootDir : argv.destDir, {
    isEditable: false,
    themeDir: argv.themeDir,
  })
}
