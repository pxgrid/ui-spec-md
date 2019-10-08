import getParamsValue from '../getParamsValue'

const paramsString = '/path/to/index.html?src=screen.png&highlight=[[1,2,3,4]]'

test('should return valid keys value.', () => {
  expect(getParamsValue(paramsString, 'src')).toBe('screen.png')
  expect(getParamsValue(paramsString, 'highlight')).toBe('[[1,2,3,4]]')
})
