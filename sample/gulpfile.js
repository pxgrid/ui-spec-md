const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const runSequence = require('run-sequence').use(gulp);

const del = require('del');

const browserSync = require('browser-sync');
const reload = browserSync.reload;

const uiSpecMd = require('ui-spec-md');


const log = plugins.util.log;
const colors = plugins.util.colors;



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

const LISTEN = 3000;
const LOCALHOST = 'http://localhost:' + LISTEN;



/**
 * ビルドしたHTMLファイルを削除する。
 * @requires del
 */
gulp.task('clean:html', function (callback) {
	return del([
		'./build/**/*.html'
	], callback);
});
gulp.task('clean:temp', function (callback) {
	return del([
		'./build/_editor',
		'./build/_editor.html',
		'./build/_menu.html',
		'./build/_template',
	], callback);
});
gulp.task('clean:capture', (callback) => {
	return del([
		'./build/**/*.+(png|jpg|jpeg|gif)'
	]);
});
gulp.task('clean', function (callback) {
	return del([
		'./build/**/*'
	], callback);
});



/**
 * Markdownファイルからビルドする。
 *
 * @requires uiSpecMd
 * @requires BUILD_DIR 展開するディレクトリ。
 */
gulp.task('build', (callback) => {
	runSequence('clean', [
		'capture',
		'md'
	], callback);
});


gulp.task('capture', [
	'clean:capture'
], function () {
	return gulp.src('./src/**/*.@(png|jpg|jpeg|gif)')
		.pipe(plugins.plumber())
		.pipe(gulp.dest(BUILD_DIR));
});


gulp.task('md', [
	'clean:html'
], function () {
	return gulp.src('./src/**/*.md')
		.pipe(plugins.plumber())
		.pipe(uiSpecMd({ srcRoot: __dirname + '/src/' }))
		.pipe(gulp.dest(BUILD_DIR));
});



/**
 * ビルドされた画面設計書を閲覧するための静的サーバーを建てる。
 */
gulp.task('serve', () => {

	browserSync.init({
		server: './build',
		port: LISTEN
	});

});



/**
 * 画面設計書編集時用ウォッチタスク。
 *  - watchして変更になったファイルだけ更新
 * TODO src内の子ディレクトリ名を変更すると止まるので再起動が必要。
 */
gulp.task('watch', () => {
	//gulp.watch('src/**/*.md', [ 'md' ]);
	//gulp.watch('src/**/*.+(png|jpg|jpeg|gif)', [ 'capture' ]);
	// ↑だと移動とかリネームで2回実行されちゃう。
	// renamedとdeletedが起きてるからと思われる。

	//なので、一旦src配下全部監視して、
	gulp.watch('src/**', (event) => {

		// 画像なら
		if ( /\.(png|jpg|jpeg|gif)$/.test(event.path) ) {
			let filename = event.path.replace(/^.+\/src\/(.+?)\.(png|jpg|jpeg|gif)$/, '$1.$2')
			let filedir = filename.split('/').slice(0, -1).join('/');

			// deletedなら削除して、それ以外はコピー
			// ちなみに、ファイルを移動したときは、deletedとaddedじゃなくて、
			// deletedとrenamedになる。
			if (/added|changed|renamed/.test(event.type)) {

				console.log(`------------------------------`);
				gulp.src(event.path)
					.pipe(plugins.plumber())
					.pipe(gulp.dest('./build/' + filedir + '/'))
					.on('end', () => {
						log(colors.green('Image Updated!'));
						reload();
					});


			} else if (/deleted/.test(event.type)){

				del([ './build/' + filename ]);

				//log(colors.red(event.type + ': ') + __dirname + /build/ + filename);

			}

		// mdなら
		} else if ( /\.md$/.test(event.path) ) {

			if ( /added|renamed|changed/.test(event.type) ) {
				// たまにイベント多すぎるって言われるけどいいんじゃなかろうか
				// TODO できれば、全部作り直すタスク実行するんじゃなくて、
				// 画像同様に変更したファイルだけ処理したいが、uiSpecMdの修正が必要。
				console.log(`------------------------------`);
				runSequence(
					'clean:temp',
					'md',
					() => {
						log(colors.green('HTML Updated!'));
						reload();
					}
				);
			}

		}

	});
});



/**
 * 画面設計書をスタートする。
 *
 * @requires gulp md
 * @requires gulp connect
 */
gulp.task( 'start', [
], () => {

	runSequence(
		'build',
		[
			'serve',
			'watch'
		],
		() => {
			console.log(`
Watching files...
`);
		}
	);

} );
