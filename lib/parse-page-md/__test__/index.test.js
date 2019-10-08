jest.mock('path')
const parsePageMd = require('../')

test('should parsed valid page info', () => {
  const md = `
---
title: 画面仕様書
screen: img/image.png?highlight=[[1,2,3,4],[5,6,7,8]]
---
#見出し1`
  const gitLog = {
    created: { date: '2019-01-01', name: 'created-user-name' },
    updated: { date: '2019-01-02', name: 'updated-user-name' },
  }
  expect(parsePageMd(md, gitLog, '', '')).toEqual({
    absolutesScreen: '/foo/bar/img/image.png?highlight=[[1,2,3,4],[5,6,7,8]]',
    createdAuthorName: 'created-user-name',
    createdDate: '2019-01-01',
    dir: 'foo/bar/baz/',
    filename: 'index.html',
    fromRoot: 'foo/bar/',
    mdSource: '#見出し1',
    screen: 'img/image.png?highlight=[[1,2,3,4],[5,6,7,8]]',
    title: '画面仕様書',
    toRoot: '../../',
    updatedAuthorName: 'updated-user-name',
    updatedDate: '2019-01-02',
  })
})

test('should parsed valid page info without screen image and gitlog updated', () => {
  const md = `
---
title: 画面仕様書
---
#見出し1`
  const gitLog = {
    created: { date: '2019-01-01', name: 'created-user-name' },
    updated: null,
  }
  expect(parsePageMd(md, gitLog, '', '')).toEqual({
    absolutesScreen: '',
    createdAuthorName: 'created-user-name',
    createdDate: '2019-01-01',
    dir: 'foo/bar/baz/',
    filename: 'index.html',
    fromRoot: 'foo/bar/',
    mdSource: '#見出し1',
    screen: '',
    title: '画面仕様書',
    toRoot: '../../',
    updatedAuthorName: '',
    updatedDate: '',
  })
})
