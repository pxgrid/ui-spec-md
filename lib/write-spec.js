const path = require('path')
const cpx = require('cpx')
const globby = require('globby')

const BUILT_IN_TEMPLATE = require('../constants/dir-names').BUILT_IN_TEMPLATE
const loadTmpl = require('../lib/load-tmpl')
const buildPage = require('../lib/build-page')

const copyMdSource = (mdDirPath, destDirPath, targetMdPath) => {
  const sourcePath = path.resolve(mdDirPath, targetMdPath)
  const destPath = path.dirname(path.resolve(destDirPath, targetMdPath))
  cpx.copySync(sourcePath, destPath)
}

const writeSpec = async (mdDir, destDir, targetMdPath) => {
  copyMdSource(mdDir, destDir, targetMdPath)
  const absoluteMdFilesPath = path.resolve(mdDir, targetMdPath)
  const relativeMdFilesPath = path.relative(process.cwd(), absoluteMdFilesPath)
  const rootTemplateFilesPath = path.resolve(__dirname, `../${BUILT_IN_TEMPLATE}/**/*.html`)

  const tmplMap = new Map()
  return Promise.resolve()
    .then(() => globby(rootTemplateFilesPath))
    .then(paths => Promise.all(paths.map(tmplPath => loadTmpl(tmplPath, tmplMap))))
    .then(() => globby(relativeMdFilesPath))
    .then(paths =>
      buildPage(paths, { rootDir: mdDir, destDir: destDir, tmplMap }, { isEditable: true }),
    )
    .then(() => console.log('All done :D'))
}

module.exports = writeSpec
