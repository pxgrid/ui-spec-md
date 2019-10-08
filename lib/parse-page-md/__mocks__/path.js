const path = jest.genMockFromModule('path')

function dirname() {
  return 'foo/bar/baz'
}
function basename() {
  return 'index.html'
}
function resolve(fromRoot, screen) {
  return `${fromRoot}${screen}`
}
const relative = jest
  .fn(() => 'default')
  // For 1st test
  .mockImplementationOnce(() => 'foo/bar')
  .mockImplementationOnce(() => '../../')
  // For 2nd test
  .mockImplementationOnce(() => 'foo/bar')
  .mockImplementationOnce(() => '../../')

path.dirname = dirname
path.relative = relative
path.resolve = resolve
path.basename = basename

module.exports = path
