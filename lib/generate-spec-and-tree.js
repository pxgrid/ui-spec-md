const path = require('path')
const fs = require('fs')
const cpx = require('cpx')
const globby = require('globby')

const DEFAULT_THEME = require('../constants/dir-names').DEFAULT_THEME
const makeDir = require('../lib/utils/make-dir')
const loadTmpl = require('../lib/load-tmpl')
const buildPage = require('../lib/build-page')
const buildTreeJson = require('../lib/build-tree-json')
const copyCoreFiles = require('../lib/copy-core-files')
const copyTemplateAssets = require('../lib/copy-template-assets')

const copyMdSource = (mdDirPath, destPath) => {
  makeDir(destPath) // recreate the dest directory.
  const sourcePath = path.resolve(mdDirPath, './**/*')
  cpx.copySync(sourcePath, destPath)
}

const generateSpecAndTree = async (mdDir, destDir, { isEditable, themeDir }) => {
  copyMdSource(mdDir, destDir)
  const absoluteMdFilesPath = path.resolve(mdDir, './**/*.md')
  const relativeMdFilesPath = path.relative(process.cwd(), absoluteMdFilesPath)

  const absolutethemeDirPath = themeDir ? themeDir : path.resolve(__dirname, `../${DEFAULT_THEME}`)

  try {
    fs.accessSync(absolutethemeDirPath, fs.constants.R_OK)
  } catch (e) {
    if (themeDir) return Promise.reject(`Could not found template directory! (${themeDir})`)
    return Promise.reject(
      `Could not found template directory! (${DEFAULT_THEME}) Please exec 'npm bun build' to generate ${DEFAULT_THEME} directory and template files!`,
    )
  }

  // templateのタイプをキーに、HandlebarsのTemplate関数を持つ
  const tmplMap = new Map()

  return Promise.resolve()
    .then(() => globby(`${absolutethemeDirPath}/**/*.html`))
    .then(paths => Promise.all(paths.map(tmplPath => loadTmpl(tmplPath, tmplMap))))
    .then(() => globby(relativeMdFilesPath))
    .then(paths => {
      return Promise.all([
        buildPage(paths, { rootDir: mdDir, destDir: destDir, tmplMap }, { isEditable: isEditable }),
        buildTreeJson(paths, { rootDir: mdDir, destDir: destDir }),
      ])
    })
    .then(() => {
      const promises = [copyCoreFiles(destDir)]
      if (themeDir) promises.push(copyTemplateAssets(themeDir, destDir))
      return Promise.all(promises)
    })
    .then(() => console.log('All done :D'))
    .catch(() =>
      Promise.reject(
        `Could not found directory included core files! (${DEFAULT_THEME}) Please exec 'npm bun build' to generate ${DEFAULT_THEME} directory and core files!`,
      ),
    )
}

module.exports = generateSpecAndTree
