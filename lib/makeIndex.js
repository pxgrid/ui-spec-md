'use strict';

var File = require( 'vinyl' );

var makeIndex = function ( stream, fileInfoList ) {

	var list = function ( list ) {

		var res = [];

		list.forEach( function ( file ) {

			res.push( `<li><a href="${ file.relativePath }">${ file.title }</a></li>` );

		} );

		return res.join( '' );

	}

	var htmlSrc = `
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

	var js = new File( {
		path: 'index.html',
		contents: new Buffer( htmlSrc )
	} );
	stream.push( js );

};

module.exports = makeIndex;
