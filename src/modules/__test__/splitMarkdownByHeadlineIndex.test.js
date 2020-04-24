import splitMarkdownByHeadlineIndex from '../splitMarkdownByHeadlineIndex'

const markdown = `---
title: 画面名
screen: ./img/screen.png
---

# 見出し1

## 見出し2

### 見出し3

# 見出しA

# 見出しB

# 見出しC
`

describe('splitMarkdownByHeadlineIndex ', () => {
  it('should return valid value by headline index 0.', () => {
    const expectedAboveValue = `---
title: 画面名
screen: ./img/screen.png
---
`
    const expectedTargetValue = `# 見出し1

## 見出し2

### 見出し3
`
    const expectedBelowValue = `# 見出しA

# 見出しB

# 見出しC
`
    const [aboveMarkdown, targetMarkdown, belowMarkdown] = splitMarkdownByHeadlineIndex(markdown, 0)
    expect(aboveMarkdown).toBe(expectedAboveValue)
    expect(targetMarkdown).toBe(expectedTargetValue)
    expect(belowMarkdown).toBe(expectedBelowValue)
  })

  it('should return valid value by headline index 1.', () => {
    const expectedTargetValue = `## 見出し2

### 見出し3
`
    const [aboveMarkdown, targetMarkdown, belowMarkdown] = splitMarkdownByHeadlineIndex(markdown, 1)
    expect(targetMarkdown).toBe(expectedTargetValue)
  })

  it('should return valid value by last headline index.', () => {
    const expectedTargetValue = `# 見出しC
`
    const [aboveMarkdown, targetMarkdown, belowMarkdown] = splitMarkdownByHeadlineIndex(markdown, 5)
    expect(targetMarkdown).toBe(expectedTargetValue)
    expect(belowMarkdown).toBe('')
  })
})
