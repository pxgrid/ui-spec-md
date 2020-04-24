const splitMarkdownByHeadlineIndex = (markdown, headlineIndex) => {
  const markdownLines = markdown.split('\n')
  let startIndex = null
  let endIndex = null
  let startHeadlineLevel = null
  let loopHeadlineIndex = 0
  markdownLines.forEach((markdownLine, index) => {
    if (/^#/.test(markdownLine)) {
      const currentHeadlineLevel = markdownLine.match(/^#+/)[0].length
      if (endIndex === null && startHeadlineLevel !== null) {
        if (currentHeadlineLevel <= startHeadlineLevel) {
          endIndex = index - 1
        }
      }
      if (startIndex === null && headlineIndex === loopHeadlineIndex) {
        startIndex = index
        startHeadlineLevel = currentHeadlineLevel
      }
      loopHeadlineIndex++
    }
  })
  if (endIndex === null) {
    endIndex = markdownLines.length - 1
  }

  const aboveMarkdown = markdownLines.slice(0, startIndex).join('\n')
  const targetMarkdown = markdownLines.slice(startIndex, endIndex + 1).join('\n')
  const belowMarkdown = markdownLines.slice(endIndex + 1).join('\n')
  return [aboveMarkdown, targetMarkdown, belowMarkdown]
}

export default splitMarkdownByHeadlineIndex
