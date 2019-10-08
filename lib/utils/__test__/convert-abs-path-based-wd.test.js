const path = require('path')
const convertAbsPathBasedCwd = require('../convert-abs-path-based-cwd')

test('Basic usage', () => {
  expect(convertAbsPathBasedCwd('./doc')).toBe(`${process.cwd()}/doc`)
})

test('Target path is only directory name.', () => {
  expect(convertAbsPathBasedCwd('doc')).toBe(`${process.cwd()}/doc`)
})

test('Target path has sub directories.', () => {
  expect(convertAbsPathBasedCwd('doc/foo/bar')).toBe(`${process.cwd()}/doc/foo/bar`)
})

test('Target path has ../ path.', () => {
  const dirname = path.dirname(process.cwd())
  expect(convertAbsPathBasedCwd('../doc')).toBe(`${dirname}/doc`)
})
