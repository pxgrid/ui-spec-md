const childProcess = require('child_process');

function gitLog(path) {

  const stdoutBuffer = childProcess.execFileSync(
    'git',
    // See https://git-scm.com/docs/pretty-formats
    ['log', '--pretty=format:%an%n%ai', path]
  );
  const stdout = stdoutBuffer.toString('utf-8', 0, stdoutBuffer.length);

  // [Aの名前, Aの日付, Bの名前, Bの日付]
  const logArr = stdout.split('\n');

  // createを先に
  const cDate = logArr.pop();
  const cAuthorName = logArr.pop();
  // updateを後に（1コミットしかない場合はupdateはない）
  const uAuthorName = logArr.shift();
  const uDate  = logArr.shift();

  const created = {
    date: cDate,
    name: cAuthorName,
  };

  const updated = (uAuthorName && uDate) ? {
    date: uDate,
    name: uAuthorName,
  } : null;

  return {
    created,
    updated,
  };
}

module.exports = gitLog;
