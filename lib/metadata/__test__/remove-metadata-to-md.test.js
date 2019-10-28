const removeMetadataToMd = require('../remove-metadata-to-md')

const md = `---
title: タイトル
screen: ./screen.png?highlight=[[1,2,3,4],[5,6,7,8]]
---

# 見出し1
## 見出し2
### 見出し3
`
const metadataKeyToDelete = 'screen'
const result = `---
title: タイトル
---

# 見出し1
## 見出し2
### 見出し3
`

test('Markdown metadata should be deleted correctly.', () => {
  expect(removeMetadataToMd(metadataKeyToDelete, md)).toEqual(result)
})
