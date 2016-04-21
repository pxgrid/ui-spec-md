'use strict';

const File = require( 'vinyl' );
const fs     = require( 'fs' );
const _    = require( 'lodash' );
const naturalCompare = require( 'natural-compare-lite' );

const makeIndex = function ( stream, fileInfoList ) {

	fileInfoList.sort( function ( a, b ) {

		return naturalCompare( a.filename, b.filename );

	} );

	let templateSrc = fs.readFileSync( __dirname + '/template/build/_index.html', { encoding: 'utf-8' } );
	let template = _.template( templateSrc );
	let htmlSrc = template( { list: fileInfoList } );

	let indexHtml = new File( {
		path: 'index.html',
		contents: new Buffer( htmlSrc )
	} );
	stream.push( indexHtml );

};

module.exports = makeIndex;
