const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const express = require('express')
const multer = require('multer')

const regexpConstants = require('../lib/constants/regexp')
const md2html = require('../lib/utils/md2html')
const parsePageMd = require('../lib/parse-page-md/index')
const parseGitLog = require('../lib/utils/git-log')
const makeTemplateContext = require('../lib/build-page/make-template-context')
const patchMetadataToMd = require('../lib/metadata/patch-metadata-to-md')
const removeMetadataToMd = require('../lib/metadata/remove-metadata-to-md')

const editable = (app, mdDir, destDir, port) => {
  app.use(express.json())
  const uploads = multer({ dest: path.join(__dirname, '__uploads/') })

  // 画像のアップロード
  app.post('/__uploadImage', uploads.single('image'), (req, res) => {
    // TODO: ファイルタイプのチェック req.file.mimetype => "image/png"
    const uploadedPath = req.file.path
    const { filePath, imagePath } = req.body
    const dirPath = /\.html$/.test(filePath)
      ? path.dirname(filePath).replace(/^\//, '') //ex. /path/to/index.html => path/to/
      : filePath.replace(/^\//, '') //ex. /path/to/foo => path/to/foo
    const pathToMove = path.resolve(process.cwd(), mdDir, dirPath, imagePath)

    // TODO: ディレクトリトラバーサルチェック
    const regexp = new RegExp(`^${process.cwd()}`)
    console.log('regexp', regexp.test(pathToMove))

    // make directory if not exists
    if (fs.existsSync(path.dirname(pathToMove)) === false) {
      mkdirp.sync(path.dirname(pathToMove))
    }

    fs.renameSync(uploadedPath, pathToMove)
    res.json({})
  })

  // マークダウンの編集（読み込み）
  app.get('/__markdown', (req, res) => {
    const queryPath = req.query.path
    const mdPath = /\.html$/.test(queryPath)
      ? queryPath.replace(/\.html$/, '.md') // ex. /path/to/index.html => /path/to/index.md
      : path.resolve(queryPath, 'index.md') // ex. /path/to/ => /path/to/index.md
    const absoluteMdPath = path.resolve(process.cwd(), mdDir + '/' + mdPath)
    const mdContent = fs.readFileSync(absoluteMdPath, { encoding: 'utf-8' })
    res.send(mdContent)
  })

  // マークダウンの編集（書き込み）と変換したHTMLの出力
  app.post('/__markdown', (req, res, next) => {
    ;(async () => {
      const htmlPath = req.body.path
      const mdSource = req.body.markdown
      const mdRootPath = path.resolve(process.cwd(), mdDir)
      const mdPath = htmlPath.replace(/\.html$/, '.md')
      const absoluteMdPath = /\.md$/.test(mdPath)
        ? path.resolve(mdRootPath, mdPath)
        : path.resolve(mdRootPath, mdPath, 'index.md')

      // マークダウンの更新
      fs.writeFileSync(absoluteMdPath, mdSource, { encoding: 'utf-8' })

      // ページを構成するための情報を返す
      const gitLog = await parseGitLog(absoluteMdPath)
      const pageInfo = parsePageMd(mdSource, gitLog, mdRootPath, mdDir + '/' + mdPath)
      const context = await makeTemplateContext(pageInfo, { isEditable: true })
      res.json({ context: context })
    })().catch(next)
  })

  // メタデータscreenの値の編集（書き込み）と変換したHTMLの出力
  app.post('/__screenMetadata', (req, res, next) => {
    ;(async () => {
      const htmlPath = req.body.path
      const screenMetadata = req.body.screenMetadata
      const mdRootPath = path.resolve(process.cwd(), mdDir)
      const mdPath = htmlPath.replace(/\.html$/, '.md')
      const absoluteMdPath = /\.md$/.test(mdPath)
        ? path.resolve(mdRootPath, mdPath)
        : path.resolve(mdRootPath, mdPath, 'index.md')

      // マークダウンの読み込み
      const md = fs.readFileSync(absoluteMdPath, 'utf8')
      const mdSource = patchMetadataToMd({ screen: screenMetadata }, md)
      // screen情報の更新
      fs.writeFileSync(absoluteMdPath, mdSource, { encoding: 'utf8' })

      // ページを構成するための情報を返す
      const gitLog = await parseGitLog(absoluteMdPath)
      const pageInfo = parsePageMd(mdSource, gitLog, mdRootPath, mdDir + '/' + mdPath)
      const context = await makeTemplateContext(pageInfo, { isEditable: true })
      res.json({ context: context })
    })().catch(next)
  })

  app.post('/__createNewFile', (req, res, next) => {
    ;(async () => {
      const newFilePath = req.body.newFilePath
      const mdRootPath = path.resolve(process.cwd(), mdDir)
      const absoluteMdPath = path.resolve(mdRootPath, newFilePath.replace(/^\//, ''))
      const imageFileName = path.basename(newFilePath).replace(/\.md$/, '.png')
      const mdSource = `---
title: title
screen: ./img/${imageFileName}
---

# heading1

## heading2
`
      if (fs.existsSync(path.dirname(absoluteMdPath)) === false) {
        mkdirp.sync(path.dirname(absoluteMdPath))
      }
      fs.writeFileSync(absoluteMdPath, mdSource, { encoding: 'utf-8' })

      // Don't pass destDir when `npm run dev`, because webpack-dev-server is running.
      if (!destDir) {
        res.json({})
        return
      }

      while (true) {
        const absoluteHtmlPath = path
          .resolve(destDir, newFilePath.replace(/^\//, ''))
          .replace(/\.md$/, '.html')
        if (fs.existsSync(absoluteHtmlPath)) {
          break
        }
        await new Promise(resolve => setTimeout(resolve, 200))
      }
      res.redirect(newFilePath.replace(/\.md$/, '.html'))
    })().catch(next)
  })

  app.patch('/__removeScreenMetadata', (req, res, next) => {
    ;(async () => {
      const htmlPath = req.body.path
      const mdRootPath = path.resolve(process.cwd(), mdDir)
      const mdPath = htmlPath.replace(/\.html$/, '.md')
      const absoluteMdPath = path.resolve(mdRootPath, mdPath)

      // マークダウンの読み込み
      const md = fs.readFileSync(absoluteMdPath, 'utf8')
      const mdSource = removeMetadataToMd('screen', md)
      // screen情報の更新
      fs.writeFileSync(absoluteMdPath, mdSource, { encoding: 'utf8' })

      // ページを構成するための情報を返す
      const gitLog = await parseGitLog(absoluteMdPath)
      const pageInfo = parsePageMd(mdSource, gitLog, mdRootPath, mdDir + '/' + mdPath)
      const context = await makeTemplateContext(pageInfo, { isEditable: true })
      res.json({ context: context })
    })().catch(next)
  })

  app.post('/__html', (req, res, next) => {
    ;(async () => {
      const mdSource = req.body.markdown
      const mdSourceWithoutMeta = mdSource.replace(regexpConstants.markdownMeatArea, '')
      const html = await md2html(mdSourceWithoutMeta)
      res.json({ html: html })
    })().catch(next)
  })
}

const devEditable = app => {
  editable(app, 'public/dummies')
}

const productionEditable = (app, mdDir, destDir, port) => {
  editable(app, mdDir, destDir)
}

module.exports = {
  devEditable,
  productionEditable,
}
