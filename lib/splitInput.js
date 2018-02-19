'use strict';

var path         = require( 'path' );
var yaml         = require( 'js-yaml' );

var gitLog       = require( '../lib/gitLog.js');

var splitInput = function ( file, rootDir ) {

	var fileContents = new String( file.contents );
	var dir = path.dirname( file.path );
	var mdFilePath = file.path.replace( /\.html$/, '.md' );
	var gitLogData = gitLog( mdFilePath );
	var result = {
		title             : '',
		screen            : '',
		mdSource          : '',
		filename          : path.basename( file.path.replace( /\.md$/, '.html' ) ),
		dir               : dir.replace( /([^(.|/)]$)/, '$1/' ),
		fromRoot          : path.relative( rootDir, dir ).replace( /([^(.|/)]$)/, '$1/' ),
		toRoot            : path.relative( dir, rootDir ).replace( /([^/]$)/, '$1/' ),
		updatedAuthorName : gitLogData.updated ? gitLogData.updated.name : "",
		updatedDate       : gitLogData.updated ? gitLogData.updated.date : "",
		createdAuthorName : gitLogData.created.name,
		createdDate       : gitLogData.created.date
	};

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

		result.title    = metaYaml.title  || '';
		result.screen   = metaYaml.screen || '';
		result.mdSource = fileContents.slice( metaPatternRes[ 0 ].length );

	} else {

		result.mdSource = fileContents.toString();

	}

	return result;

}

module.exports = splitInput;
