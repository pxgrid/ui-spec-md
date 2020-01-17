const mdDir = require('./options/mdDir')
const destDir = require('./options/destDir')
const themeDir = require('./options/themeDir')
const generateSpecAndTree = require('../../lib/generate-spec-and-tree')

exports.command = ['* [options]', 'generate']

exports.describe = 'Generate spec files from markdown'

exports.builder = yargs => {
  yargs.options({
    ...mdDir,
    ...destDir,
    ...themeDir,
    l: {
      alias: 'local',
      demandOption: false,
      requiresArg: false,
      describe:
        'Convert all absolute paths to relative paths so that the generated file can be viewed locally on a browser with "file: //".',
    },
  })
}

exports.handler = async argv => {
  await generateSpecAndTree(argv.mdDir, argv.destDir, {
    isEditable: false,
    canSeeLocal: argv.local,
    themeDir: argv.themeDir,
  })
}
