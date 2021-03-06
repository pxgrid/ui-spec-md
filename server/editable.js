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

const localPathToMdPath = (mdDir, destDir, serverRootDir, localPath) => {
  const absoluteMdDirPath = path.resolve(process.cwd(), mdDir)
  const absolutePath = serverRootDir + (/^\//.test(localPath) ? localPath : `/${localPath}`)
  return absolutePath.replace(destDir, absoluteMdDirPath)
}

const toRelativeDirPath = pathName => {
  return /\.html$/.test(pathName)
    ? path.dirname(pathName).replace(/^\//, '') //ex. /path/to/index.html => path/to/
    : pathName.replace(/^\//, '') //ex. /path/to/foo => path/to/foo
}

const editable = (app, mdDir, destDir, serverRootDir, port) => {
  app.use(express.json())
  const uploads = multer({ dest: path.join(__dirname, '__uploads/') })

  // 画像のアップロード
  app.post('/__uploadImage', uploads.single('image'), (req, res) => {
    // TODO: ファイルタイプのチェック req.file.mimetype => "image/png"
    const uploadedPath = req.file.path
    const { filePath, imagePath } = req.body
    const dirPath = toRelativeDirPath(filePath)
    const absoluteDirPath = localPathToMdPath(mdDir, destDir, serverRootDir, dirPath)
    const pathToMove = path.resolve(absoluteDirPath, imagePath)

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
    const absoluteMdPath = localPathToMdPath(mdDir, destDir, serverRootDir, mdPath)
    const mdContent = fs.readFileSync(absoluteMdPath, { encoding: 'utf-8' })
    res.send(mdContent)
  })

  // マークダウンを編集（書き込み）し、変換したHTMLを返す
  app.post('/__markdown', (req, res, next) => {
    ;(async () => {
      const htmlPath = req.body.path
      const mdSource = req.body.markdown
      const mdRootPath = path.resolve(process.cwd(), mdDir)
      const mdPath = htmlPath.replace(/\.html$/, '.md')
      let absoluteMdPath = localPathToMdPath(mdDir, destDir, serverRootDir, mdPath)
      if (/\.md$/.test(absoluteMdPath) === false) {
        absoluteMdPath = path.resolve(absoluteMdPath, 'index.md')
      }

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
      let absoluteMdPath = localPathToMdPath(mdDir, destDir, serverRootDir, mdPath)
      if (/\.md$/.test(absoluteMdPath) === false) {
        absoluteMdPath = path.resolve(absoluteMdPath, 'index.md')
      }
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

  // ページ（ファイル）の新規作成
  app.post('/__createNewFile', (req, res, next) => {
    ;(async () => {
      const newFilePath = req.body.newFilePath
      const absoluteMdPath = localPathToMdPath(mdDir, destDir, serverRootDir, newFilePath)
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
      if (!serverRootDir) {
        res.json({})
        return
      }

      let limitCount = 0
      while (true) {
        const absoluteHtmlPath = path
          .resolve(serverRootDir, newFilePath.replace(/^\//, ''))
          .replace(/\.md$/, '.html')
        if (fs.existsSync(absoluteHtmlPath)) {
          break
        }
        if (limitCount > 20) {
          console.log(`Cloud not find new file! ${absoluteHtmlPath}`)
          break
        }
        limitCount++
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
      const absoluteMdPath = localPathToMdPath(mdDir, destDir, serverRootDir, mdPath)

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

  // リクエストされたマークダウンをHTMLに変換
  app.post('/__html', (req, res, next) => {
    ;(async () => {
      const mdSource = req.body.markdown
      const mdSourceWithoutMeta = mdSource.replace(regexpConstants.markdownMeatArea, '')
      const html = await md2html(mdSourceWithoutMeta)
      res.json({ html: html })
    })().catch(next)
  })

  app.get('/__validateUploadPath', (req, res, next) => {
    const { uploadPath, locationPathName } = req.query
    const pageDirPath = toRelativeDirPath(locationPathName)
    const absoluteDirPath = localPathToMdPath(mdDir, destDir, serverRootDir, pageDirPath)
    const pathToUpload = path.resolve(absoluteDirPath, uploadPath)

    const regExp = new RegExp(`^${process.cwd()}`)
    const invalidRoot = !regExp.test(pathToUpload)
    let isExists
    try {
      fs.accessSync(pathToUpload)
      isExists = true
    } catch (err) {
      isExists = false
    }
    res.json({ invalid: invalidRoot, exists: isExists })
  })

  app.get('/__fetchSerialFileName', (req, res, next) => {
    const { uploadDir, locationPathName, imageExtension } = req.query
    const pageDirPath = toRelativeDirPath(locationPathName)
    const absoluteMdDirPath = localPathToMdPath(mdDir, destDir, serverRootDir, pageDirPath)
    const absoluteImageDirPath = path.resolve(absoluteMdDirPath, uploadDir)
    const baseName = path.basename(locationPathName, '.html')

    const getSerialFileName = (absoluteDirPath, baseName, index = 1) => {
      const fileName = `${baseName}-${index}.${imageExtension}`
      const absoluteFilePath = path.resolve(absoluteDirPath, fileName)
      try {
        fs.accessSync(absoluteFilePath)
        return getSerialFileName(absoluteDirPath, baseName, index + 1)
      } catch (err) {
        return `${uploadDir}${fileName}`
      }
    }

    res.send(getSerialFileName(absoluteImageDirPath, baseName))
  })
}

const devEditable = app => {
  editable(app, 'public/dummies')
}

const productionEditable = (app, mdDir, destDir, serverRootDir, port) => {
  editable(app, mdDir, destDir, serverRootDir, port)
}

module.exports = {
  devEditable,
  productionEditable,
}
