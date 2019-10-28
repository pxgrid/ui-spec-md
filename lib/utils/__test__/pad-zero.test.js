const padZero = require('../pad-zero')

test('Basic usage', () => {
  expect(padZero(1, 3)).toBe('001')
})

test('Even if first argument is a string, it is processed without problems.', () => {
  expect(padZero('1', 3)).toBe('001')
})

test('If first argument is empty string, it will padded zero all.', () => {
  expect(padZero('', 3)).toBe('000')
})

test('If first argument length and targetLength are same, it will not padded zero.', () => {
  expect(padZero('123', 3)).toBe('123')
})

test('If first argument length longer than targetLength, it will not padded zero.', () => {
  expect(padZero('123', 3)).toBe('123')
})
