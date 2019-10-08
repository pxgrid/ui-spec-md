const makeTemplateContext = require('./make-template-context')

/**
 * @param handlebarsTemplate
 * @param pageInfo
 * @param isEditable
 * @returns {*}
 */
const embedHtml = async function(handlebarsTemplate, pageInfo, { isEditable }) {
  const templateContext = await makeTemplateContext(pageInfo, { isEditable })
  return handlebarsTemplate(templateContext)
}

module.exports = embedHtml
