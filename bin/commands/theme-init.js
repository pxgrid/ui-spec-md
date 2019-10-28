const copyThemeDir = require('../../lib/copy-theme-dir')

exports.command = 'theme-init [dirName]'

exports.describe = 'Copy theme directory to working directory.'

exports.builder = yargs => {
  yargs.options({
    d: {
      alias: 'destDir',
      default: 'theme',
      requiresArg: true,
      describe: 'Path of directory to write out converted html',
      type: 'string',
    },
  })
}

exports.handler = argv => {
  copyThemeDir(argv.destDir)
}
