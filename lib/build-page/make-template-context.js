const path = require('path')
const sizeOf = require('image-size')
const md2html = require('../utils/md2html')

const svgCanvasTemplate = function(src, w, h, coords) {
  return `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" class="Screen_SVGRoot UISP-Screen__svgRoot">
      <image xlink:href="${src}" width="${w}" height="${h}" class="Screen_Image" />
      ${(function() {
        let result = []

        coords.forEach(function(coord, i) {
          let x = coord[0]
          let y = coord[1]
          let w = coord[2]
          let h = coord[3]

          result.push(`<g class="Screen_Highlight">
            <rect x="${x}" y="${y}" width="${w}" height="${h}" class="Screen_Highlight_Fill"/>
            <rect x="${x -
              2}" y="${y - 2}" width="${w + 4}" height="${h + 4}" class="Screen_Highlight_Outline"/>
            <text x="${x +
              2}" y="${y - 2}" dy="${h - 2}" class="Screen_Highlight_Label">${i + 1}</text>
          </g>`)
        })
        return result.join('')
      })()}
    </svg>
  `
}

const makeSvgCanvasSrc = function(pageDir, screenUrl) {
  if (!screenUrl) {
    return ''
  }

  let reg = /highlight=\[(\[[0-9]+,[0-9]+,[0-9]+,[0-9]+\],?)+\]/
  let match = reg.exec(screenUrl)
  let coords = match ? JSON.parse(match[0].replace(/highlight=/, '')) : []
  let fullImagePath = path.resolve(pageDir, screenUrl).replace(/\?.*$/, '')

  try {
    let dimensions = sizeOf(fullImagePath)
    return svgCanvasTemplate(screenUrl, dimensions.width, dimensions.height, coords)
  } catch (e) {
    console.error(e)
    return ''
  }
}

/**
 * @param pageInfo
 * @param isEditable
 * @returns Handlebars template Context
 */
const makeTemplateContext = async function(
  {
    mdSource,
    toRoot,
    title,
    screen,
    absolutesScreen,
    dir,
    updatedAuthorName,
    updatedDate,
    createdAuthorName,
    createdDate,
  },
  { isEditable },
) {
  const mdHTML = await md2html(mdSource)
  return {
    editable: isEditable ? 'true' : '',
    toRoot: toRoot,
    title: title,
    screen: screen,
    absolutesScreen: absolutesScreen,
    svgCanvas: makeSvgCanvasSrc(dir, screen),
    body: mdHTML,
    updatedAuthorName: updatedAuthorName,
    updatedDate: updatedDate,
    createdAuthorName: createdAuthorName,
    createdDate: createdDate,
  }
}

module.exports = makeTemplateContext
