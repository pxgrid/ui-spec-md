const childProcess = require('child_process')

function gitLog(path) {
  return new Promise((resolve, reject) => {
    childProcess.execFile(
      'git',
      // See https://git-scm.com/docs/pretty-formats
      ['log', '--pretty=format:%an%n%ai', path],
      (err, stdout, stderr) => {
        if (err || stderr) {
          return reject(err || stderr)
        }

        // [Aの名前, Aの日付, Bの名前, Bの日付]
        const logArr = stdout.split('\n')

        // createを先に
        const cDate = logArr.pop()
        const cAuthorName = logArr.pop()
        // updateを後に（1コミットしかない場合はupdateはない）
        const uAuthorName = logArr.shift()
        const uDate = logArr.shift()

        const created = {
          date: cDate,
          name: cAuthorName,
        }

        const updated =
          uAuthorName && uDate
            ? {
                date: uDate,
                name: uAuthorName,
              }
            : null

        resolve({
          created,
          updated,
        })
      },
    )
  })
}

module.exports = gitLog
