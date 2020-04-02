import toRelative from '../changeRootPathToRelative'

describe('changeRootPathToRelative test', () => {
  test('should return valid relative path (1).', () => {
    const from = '/path/to/1/2'
    const to = '/path/to/foo/bar/baz'
    expect(toRelative(from, to)).toBe('../foo/bar/baz')
  })
  test('should return valid relative path (2).', () => {
    const from = '/path/to/foo/bar/baz'
    const to = '/path/to/1/2'
    expect(toRelative(from, to)).toBe('../../1/2')
  })
  test('should return valid relative path (3).', () => {
    const from = '/other/path/to/1/2'
    const to = '/path/to/foo/bar/baz'
    expect(toRelative(from, to)).toBe('../../../../../path/to/foo/bar/baz')
  })
  test('should return valid relative path (4).', () => {
    const from = '/path/to/'
    const to = '/path/to/1/2'
    expect(toRelative(from, to)).toBe('1/2')
  })
  test('should return valid relative path (5).', () => {
    const from = '/path/to/index.html'
    const to = '/path/to/1/2/foo.html'
    expect(toRelative(from, to)).toBe('1/2/foo.html')
  })
})
