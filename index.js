'use strict';

const File   = require( 'vinyl' )
const Stream = require( 'stream' );
const fs     = require( 'fs' );
const path   = require( 'path' );
const marked = require( 'marked' );

const UiflowMDRenderer   = require( './lib/UiflowMDRenderer.js' );
const splitInput         = require( './lib/splitInput.js' );
const makePageHtml       = require( './lib/makePageHtml.js' );
const makeIndex          = require( './lib/makeIndex.js' );
const copyTemplateAssets = require( './lib/copyTemplateAssets.js' );

const PLUGIN_NAME = 'ui-spec-md';

marked.setOptions( {
	renderer: new UiflowMDRenderer(),
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


/**
 * ui-spec-md本体
 *
 * 最初に、 copyTemplateAssets で必要なテンプレート群を作って、
 * 次に Readableストリームからpipeされたデータを_transformしてHTML作る。
 * 最後に、pipeされたすべてのデータから_flushでindexを作る
 *
 * @param {object} options
 * @param {string} options.srcRoot
 *
 * @return {Stream.Transform}
 */
const uiSpecMd = function ( options ) {

	let rootDir = options.srcRoot;

	/**
	 * index.htmlを作るためのデータ。
	 *
	 * @type {object}
	 */
	let indexData = {
		title: '',
		readmeSrc: '',
		pageDataList: []
	};

	let stream = new Stream.Transform( { objectMode: true } );


	/**
	 * ストリームに対する処理。
	 * 適切なファイルであれば、markedを用いてマークダウンからHTMLを生成する。
	 *
	 * @requires marked
	 * @param {vinyl} file
	 */
	stream._transform = function( file, unused, done ) {

		// Do nothing when null
		if ( file.isNull() ) {

			stream.push( file );
			done();
			return;

		}

		// If the ext doesn't match, pass it through
		if( '.md' !== path.extname( file.path ) ) {

			stream.push( file );
			done();
			return;

		}

		if ( file.isBuffer () ) {

			let contents = {};
			let isReadme = ( file.path === `${ rootDir }index.md` );

			file.path = file.path.replace( /\.md$/, '.html' );
			contents = splitInput( file, rootDir );

			// この辺りの処理を外部ファイルとかにして、makedのoption設定とかも
			// まとめるとテストしやすいかも？
			marked( contents.mdSouce, function ( err, content ) {

				let pageHtmlSource;

				if ( err ) {

					// stream.emit(
					//   'error',
					//   new gutil.PluginError( PLUGIN_NAME, err, { showStack: true } )
					// );
					done();
					return;

				}

				if ( isReadme ) {

					indexData.readmeSrc = content;
					indexData.title = contents.title;
					done();
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

					done();
					return;

				}

			} );

		} else {

			console.log( 'not a buffer' );
			done();
			return;

		}

	};


	/**
	 * すべてのデータが処理されたときの処理。
	 * 目次ページを作成する。
	 *
	 * @requires ./lib/makeIndex
	 */
	stream._flush = function ( done ) {

		makeIndex( stream, indexData );
		done();

	};

	copyTemplateAssets( stream );

	return stream;

};

module.exports = uiSpecMd;
