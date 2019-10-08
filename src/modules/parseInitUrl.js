const parseInitUrl = () => {
  const url = window.location.search
  const queries = url.slice(1).split('&')

  let src = ''
  let highlight = ''
  queries.forEach(function(query) {
    let pair = query.split('=')
    let key = pair[0]
    let val = pair[1]
    if (key === 'src') {
      src = val
    }
    if (key === 'highlight') {
      highlight = JSON.parse(val)
    }
  })
  return { src, highlight }
}

export default parseInitUrl
