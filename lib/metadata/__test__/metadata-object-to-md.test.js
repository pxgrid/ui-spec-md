const metadataObjectToMd = require('../metadata-object-to-md')

const testArguments = {
  title: 'タイトル',
  screen: './img/screen.png?highlight=[[1,2,3,4],[5,6,7,8]]',
}
const expectedResult = `title: タイトル
screen: ./img/screen.png?highlight=[[1,2,3,4],[5,6,7,8]]
`

test('should', () => {
  expect(metadataObjectToMd(testArguments)).toBe(expectedResult)
})
