/*!
 * - markedのオプションを設定
 * - 各ページのHTML作ってstreamに追加
 * - indexDataに内容設定
 */
'use strict';


const path   = require( 'path' );

const marked = require( 'marked' );
const UiflowsMDRenderer   = require( './UiflowsMDRenderer.js' );
const splitInput         = require( './splitInput.js' );
const makePageHtml       = require( './makePageHtml.js' );


marked.setOptions( {
	renderer: new UiflowsMDRenderer(),
	// renderer: new marked.Renderer(),
	gfm: true,
	tables: true,
	breaks: true,
	pedantic: false,
	sanitize: true,
	smartLists: true,
	smartypants: false,
	highlight: function ( code, lang ) {}
} );


module.exports = function ( file, rootDir, indexData, stream ) {

	let contents = {};
	let isReadme = ( file.path === `${ rootDir }index.md` );

	file.path = file.path.replace( /\.md$/, '.html' );
	contents = splitInput( file, rootDir );

	// この辺りの処理を外部ファイルとかにして、makedのoption設定とかも
	// まとめるとテストしやすいかも？
	marked( contents.mdSource, function ( err, content ) {

		let pageHtmlSource;

		if ( err ) {

			// stream.emit(
			//   'error',
			//   new gutil.PluginError( PLUGIN_NAME, err, { showStack: true } )
			// );
			return;

		}

		if ( isReadme ) {

			indexData.readmeSrc = content;
			indexData.title = contents.title;
			return;

		// エラーでもREADMEファイルでもなければ、
		// 各ページを作って、index用のデータもpush
		} else {

			// splitInputで取得したデータにmarkedで変換したコンテンツ部の
			// html文字列を入れてmakePageHtmlでページ全体のHtml文字列を作成。
			contents.body = content;
			pageHtmlSource = makePageHtml( contents );

			file.contents = new Buffer( pageHtmlSource );
			file.path = path.resolve( contents.dir, contents.filename );
			stream.push( file );

			// indexDataは、このファイルの頭で空のデータ定義して、
			// reademeの場合もtitleとか入れてる
			indexData.pageDataList.push( {
				filename: contents.filename,
				fromRoot: contents.fromRoot,
				title: contents.title,
				screen: contents.screen
			} );

			return;

		}

	} );

};
