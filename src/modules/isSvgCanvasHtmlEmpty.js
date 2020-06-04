export function isSvgCanvasHtmlEmpty(svgCanvasHtml) {
  return svgCanvasHtml.replace(/\n/g, '') === ''
}
