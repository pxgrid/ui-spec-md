const path = require('path')
const fs = require('fs')
const cpx = require('cpx')
const globby = require('globby')

const BUILT_IN_TEMPLATE = require('../constants/dir-names').BUILT_IN_TEMPLATE
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

const generateSpecAndTree = async (mdDir, destDir, { isEditable, templateDir }) => {
  copyMdSource(mdDir, destDir)
  const absoluteMdFilesPath = path.resolve(mdDir, './**/*.md')
  const relativeMdFilesPath = path.relative(process.cwd(), absoluteMdFilesPath)

  const absoluteTemplateDirPath = templateDir
    ? templateDir
    : path.resolve(__dirname, `../${BUILT_IN_TEMPLATE}`)

  try {
    fs.accessSync(absoluteTemplateDirPath, fs.constants.R_OK)
  } catch (e) {
    if (templateDir) return Promise.reject(`Could not found template directory! (${templateDir})`)
    return Promise.reject(
      `Could not found template directory! (${BUILT_IN_TEMPLATE}) Please exec 'npm bun build' to generate ${BUILT_IN_TEMPLATE} directory and template files!`,
    )
  }

  // templateのタイプをキーに、HandlebarsのTemplate関数を持つ
  const tmplMap = new Map()

  return Promise.resolve()
    .then(() => globby(`${absoluteTemplateDirPath}/**/*.html`))
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
      if (templateDir) promises.push(copyTemplateAssets(templateDir, destDir))
      return Promise.all(promises)
    })
    .then(() => console.log('All done :D'))
}

module.exports = generateSpecAndTree
