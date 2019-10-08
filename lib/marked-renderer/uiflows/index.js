const marked = require('marked')
const uiflowsParser = require('./uiflowsParser.js')
const Viz = require('viz.js')
const { Module, render } = require('viz.js/full.render.js')
let viz = new Viz({ Module, render })

const DOT_CLASS_NAME = 'UISP-Dot'
const UIFLOWS = 'uiflows'
const DOT = 'dot'

const replaceAsync = async (str, regex, asyncFn) => {
  const promises = []
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args)
    promises.push(promise)
  })
  const data = await Promise.all(promises)
  return str.replace(regex, () => data.shift())
}

class uiflowsRenderer extends marked.Renderer {
  constructor(options) {
    super(options)
  }

  // marked.js renderer don't support async method (https://github.com/markedjs/marked/issues/896)
  // so I had to cover async Viz process using postRender.
  static async postRender(rendered) {
    const dotRegexp = new RegExp('```' + DOT + '(.*?)```', 'g')
    return Promise.resolve(rendered.replace(/[\n\t]/g, ''))
      .then(rendered => {
        return replaceAsync(rendered, dotRegexp, async (match, ...args) => {
          const vizScraps = /^<\?xml version="1.0" encoding="UTF-8" standalone="no"\?>\n<!DOCTYPE svg PUBLIC "-\/\/W3C\/\/DTD SVG 1.1\/\/EN"\n "http:\/\/www.w3.org\/Graphics\/SVG\/1.1\/DTD\/svg11.dtd">/
          const dotCode = args[0]
          const convertedDot = await viz.renderString(dotCode, { format: 'svg', engine: 'dot' })
          return `<div class="${DOT_CLASS_NAME}">${convertedDot.replace(vizScraps, '')}</div>`
        })
      })
      .catch(error => {
        // see: https://github.com/mdaines/viz.js/wiki/Usage#as-a-commonjs-module-such-as-in-nodejs
        viz = new Viz({ Module, render })
        throw new Error(error)
      })
  }

  code(code, lang, escaped) {
    // ```uiflows and ```dot will be processed later in the postRender
    if (lang === UIFLOWS) {
      const dotCode = uiflowsParser(code)
      return '```' + `\n${DOT}${dotCode}\n` + '```'
    }
    if (lang === DOT) {
      return '```' + `\n${DOT}${code}\n` + '```'
    }
    const result = super.code(code, lang, escaped)
    return result.replace(/(class=")(lang-)/, '$1line-numbers $2')
  }
}

module.exports = uiflowsRenderer
