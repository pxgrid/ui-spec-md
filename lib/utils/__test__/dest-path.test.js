const destPath = require('../dest-path')

test('Basic usage', () => {
  expect(destPath('foo/bar/baz.html')).toBe('bar/baz')
})

test('Argument path has ./ at the head.', () => {
  expect(destPath('./foo/bar/baz.html')).toBe('bar/baz')
})
