const marked = require('marked')

const UIFlowsRenderer = require('../marked-renderer/uiflows')
const renderer = new UIFlowsRenderer()

// idに対して`#日本語`でもジャンプできるように
renderer.heading = function(text, level) {
  return `<h${level} id="${text}"><a href="#${text}"><i class="fa fa-link"></i></a>${text}</h${level}>`
}

function sanitize(str) {
  return str.replace(/&<"/g, function(m) {
    if (m === '&') return '&amp;'
    if (m === '<') return '&lt;'
    return '&quot;'
  })
}

renderer.image = function(src, title, alt) {
  const exec = /=\s*(\d*)\s*x\s*(\d*)\s*$/.exec(title)
  let res = '<img src="' + sanitize(src) + '" alt="' + sanitize(alt)
  if (exec && exec[1]) res += '" height="' + exec[1]
  if (exec && exec[2]) res += '" width="' + exec[2]
  return res + '">'
}

marked.setOptions({
  renderer: renderer,
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
})

async function md2html(md) {
  const rendered = marked(md)
  return await UIFlowsRenderer.postRender(rendered)
}

module.exports = md2html
