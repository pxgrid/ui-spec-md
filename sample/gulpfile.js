const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const connect = require('connect');
const serveStatic = require('serve-static');
const del = require('del');

const uiSpecMd = require('ui-spec-md');



/**
 * 画面設計書一式がビルドされるディレクトリ。
 *
 * @readonly
 * @const
 * @type {string}
 *
 * @see gulp md
 * @see gulp connect
 */
const BUILD_DIR = './build/';



/**
 * ビルドしたHTMLファイルを削除する。
 * @requires del
 */
gulp.task('clean:html', function (callback) {
  return del([
    './build/**/*.html'
  ], callback);
});



/**
 * Markdownファイルからビルドする。
 *
 * @requires uiSpecMd
 * @requires BUILD_DIR 展開するディレクトリ。
 */
gulp.task('build', [
  'capture',
  'md'
]);


gulp.task('capture', [
], function () {
  gulp.src('./src/**/*.@(png|jpg)')
    .pipe(plugins.plumber())
    .pipe(gulp.dest(BUILD_DIR));
});


gulp.task('md', [
  'clean:html'
], function () {
  gulp.src('./src/**/*.md')
    .pipe(plugins.plumber())
    .pipe(uiSpecMd({ srcRoot: __dirname + '/src/' }))
    .pipe(gulp.dest(BUILD_DIR));
});



/**
 * ビルドされた画面設計書を閲覧するための静的サーバーを建てる。
 *
 * @requires connect
 * @requires serveStatic
 * @requires BUILD_DIR   ルートとするディレクトリ。
 */
gulp.task('connect', function () {
  const app = connect();

  app.use(serveStatic(BUILD_DIR, {
    index: [ 'index.html' ]
  }));

  app.listen(3000);

  plugins.util.log(plugins.util.colors.green('Server started: http://localhost:3000'));
});



/**
 * 画面設計書編集時用ウォッチタスク。
 */
gulp.task('watch', function () {
  // `./src/*md` を監視して更新する。
  gulp.watch('src/**/*.md', [ 'md' ]);
  gulp.watch('src/**/*.@(png|jpg)', [ 'capture' ]);
});



/**
 * 画面設計書をスタートする。
 *
 * @requires gulp md
 * @requires gulp connect
 *
 * @todo ./src/*.mdの更新を監視する
 */
gulp.task( 'start', [
  'build',
  'connect',
  'watch'
] );
