const patchMetadataToMd = require('../patch-metadata-to-md')

const md = `---
title: タイトル
screen: ./screen.png?highlight=[[1,2,3,4],[5,6,7,8]]
---

# 見出し1
## 見出し2
### 見出し3
`
const metadataToPatch = {
  screen: './patched-screen.png?highlight=[[11,12,13,14],[15,16,17,18]]',
}

test('Markdown metadata should be updated correctly with patch data.', () => {
  expect(patchMetadataToMd(metadataToPatch, md)).toMatchSnapshot()
})
