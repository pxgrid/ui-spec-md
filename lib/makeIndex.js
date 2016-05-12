'use strict';

const File = require( 'vinyl' );
const fs   = require( 'fs' );
const _    = require( 'lodash' );
const naturalCompare = require( 'natural-compare-lite' );

const makeIndex = function ( stream, data ) {

	data.pageDataList.sort( function ( a, b ) {

		return naturalCompare( a.filename, b.filename );

	} );

	let indexTemplateSrc = fs.readFileSync( __dirname + '/template/build/_index.html', { encoding: 'utf-8' } );
	let indexTemplate = _.template( indexTemplateSrc );
	let indexHtmlSrc = indexTemplate( data );

	let indexHtml = new File( {
		path: 'index.html',
		contents: new Buffer( indexHtmlSrc )
	} );
	stream.push( indexHtml );


	let menuTemplateSrc = fs.readFileSync( __dirname + '/template/build/_menu.html', { encoding: 'utf-8' } );
	let menuTemplate = _.template( menuTemplateSrc );
	let menuHtmlSrc = menuTemplate( data );

	let menuHtml = new File( {
		path: '_menu.html',
		contents: new Buffer( menuHtmlSrc )
	} );
	stream.push( menuHtml );

};

module.exports = makeIndex;
