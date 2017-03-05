'use strict';

const File   = require( 'vinyl' )
const Stream = require( 'stream' );
const fs     = require( 'fs' );
const path   = require( 'path' );

const makePagesAndIndexData = require( './lib/makePagesAndIndexData.js' );
const makeIndex          = require( './lib/makeIndex.js' );
const copyTemplateAssets = require( './lib/copyTemplateAssets.js' );

const PLUGIN_NAME = 'ui-spec-md';


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

			makePagesAndIndexData( file, rootDir, indexData, stream );
			done();
			return;

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
