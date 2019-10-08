const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const parsePageMd = require('./lib/parse-page-md/index')
const parseGitLog = require('./lib/utils/git-log')
const embedHtml = require('./lib/build-page/embed-html')

const embedHtmlDummyPage = async (html, pageName, dummiesDirPath) => {
  try {
    const template = Handlebars.compile(html)
    const mdPath = path.resolve(dummiesDirPath, `./${pageName}.md`)
    const mdSource = fs.readFileSync(mdPath, 'utf-8')
    const gitLog = await parseGitLog(mdPath)
    const pageInfo = parsePageMd(mdSource, gitLog, dummiesDirPath, mdPath)
    const embeddedHtml = embedHtml(template, pageInfo, { isEditable: true })
    return Promise.resolve(embeddedHtml)
  } catch (e) {
    console.error(e)
    return Promise.reject('')
  }
}

class DevPlugin {
  constructor(dummiesDirPath) {
    this.dummiesDirPath = dummiesDirPath
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('DevPlugin', compilation => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('DevPlugin', (data, callback) => {
        const pageName = path.basename(data.outputName, '.html')
        embedHtmlDummyPage(data.html, pageName, this.dummiesDirPath).then(html => {
          data.html = html
          callback(null, data)
        })
      })
    })
  }
}

module.exports = DevPlugin
