'use strict';

var path = require( 'path' );
var yaml = require( 'js-yaml' );

var splitInput = function ( file, rootDir ) {

	var fileContents = new String( file.contents );
	var dir = path.dirname( file.path );
	var result = {
		title     : '',
		screenUrl : '',
		mdSouce   : '',
		filename  : path.basename( file.path.replace( /\.md$/, '.html' ) ),
		dir       : dir.replace( /([^(.|/)]$)/, '$1/' ),
		fromRoot  : path.relative( rootDir, dir ).replace( /([^(.|/)]$)/, '$1/' ),
		toRoot    : path.relative( rootDir, dir ).replace( /([^/]$)/, '$1/' )
	}

	var metaYaml;
	var metaPattern    = /^\s*---\s*\n(.|\n)+?\s*---\s*\n/;
	var metaPatternRes = metaPattern.exec( fileContents );

	if( metaPatternRes ) {

		try {

			metaYaml = yaml.safeLoad( metaPatternRes[ 0 ].replace( /---/g, '' ) );

		} catch ( e ) {

			console.log( 'YAML section is invalid: ' + file.path );
			metaYaml = {};

		}

		result.title   = metaYaml.title  || '';
		result.screen  = metaYaml.screen || '';
		result.mdSouce = fileContents.slice( metaPatternRes[ 0 ].length );

	} else {

		result.mdSouce = fileContents;

	}

	return result;

}

module.exports = splitInput;
