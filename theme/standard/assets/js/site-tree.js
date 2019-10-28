const sanitize = text => {
  return text.replace(/[&'`"<>]/g, match => {
    return {
      '&': '&amp;',
      "'": '&#x27;',
      '`': '&#x60;',
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;',
    }[match]
  })
}

const makeBranch = items => {
  const branch = items.map(item => {
    if (item.children) {
      return makeDir(item)
    }
    return makeLeaf(item)
  })
  return `<ul>${branch.join('')}</ul>`
}

const makeLeaf = item => {
  return `
<li>
  <div>
    <span>└</span>
    <a href="${item.rootPath}">${sanitize(item.title)}</a>
  </div>
</li>
`
}

const makeDir = item => {
  return `
<li>
  <div>
    <span>├</span>
    <a href="${item.rootPath}">${sanitize(item.title)}</a>
  </div>
  ${makeBranch(item.children)}
</li>
`
}

fetch('/tree.json')
  .then(response => {
    return response.json()
  })
  .then(jsonData => {
    const treeTag = makeBranch([jsonData])
    const elSiteTree = document.getElementById('site-tree')
    const elShowSiteTree = document.getElementById('show-site-tree')
    elSiteTree.insertAdjacentHTML('afterbegin', treeTag)
    elShowSiteTree.addEventListener('click', () => {
      elSiteTree.style.visibility = 'visible'
      elSiteTree.style.opacity = '1'
    })
    elSiteTree.addEventListener('click', () => {
      elSiteTree.style.visibility = 'hidden'
      elSiteTree.style.opacity = '0'
    })
  })
