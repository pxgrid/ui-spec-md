const embedHtml = require('./embed-html')

const renderPage = function(tmplMap, pageInfo, { isEditable }) {
  const template = pageInfo.screen ? tmplMap.get('screen-spec') : tmplMap.get('plain-spec')
  return embedHtml(template, pageInfo, { isEditable })
}

module.exports = renderPage
