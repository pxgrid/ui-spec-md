'use strict';

const File = require( 'vinyl' );

const makeIndex = function ( stream, fileInfoList ) {

	const list = function ( list ) {

		let res = [];

		list.forEach( function ( file ) {

			res.push( `<li><a href="${ file.relativePath }">${ file.title }</a></li>` );

		} );

		return res.join( '' );

	}

	let htmlSrc = `
		<!DOCTYPE html>
		<html>
		<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>UI Spec</title>
		</head>
		<body>
			<ul>
				${ list( fileInfoList ) }
			</ul>
		</body>
		</html>
	`;

	let indexHtml = new File( {
		path: 'index.html',
		contents: new Buffer( htmlSrc )
	} );
	stream.push( indexHtml );

};

module.exports = makeIndex;
