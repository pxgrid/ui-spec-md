/**
 * Listというモデルを使って、テンプレートからHTML文字列を生成する処理。
 *
 * `list.html`に値をはめ込んでいく。
 *
 */
function renderList(tmplMap, list) {
  const template = tmplMap.get('list')

  // APIについて記載がない場合
  list = list.map(item => {
    item.isNoList = item.html === ''
    return item
  })

  const toc = list.map(item => {
    return {
      lv: 1,
      title: item.name,
      id: item.name,
    }
  })

  const html = template({
    list,
    toc: toc.length !== 0 ? toc : null,
  })

  return Promise.resolve(html)
}

module.exports = renderList
