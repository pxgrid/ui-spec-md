'use strict';

var File = require( 'vinyl' );
var fs   = require( 'fs' );

var copyTemplateAssets = function ( stream ) {

	var cssSrc = fs.readFileSync( __dirname + '/template/build/_template/_template.css', { encoding: 'utf-8' } );
	var css = new File( {
		path: '_template/_template.css',
		contents: new Buffer( cssSrc )
	} );
	stream.push( css );

	var jsSrc = fs.readFileSync( __dirname + '/template/build/_template/_template.js', { encoding: 'utf-8' } );
	var js = new File( {
		path: '_template/_template.js',
		contents: new Buffer( jsSrc )
	} );
	stream.push( js );

	// editor
	var editorHtmlSrc = fs.readFileSync( __dirname + '/editor/build/_editor.html', { encoding: 'utf-8' } );
	var editorHtml = new File( {
		path: '_editor.html',
		contents: new Buffer( editorHtmlSrc )
	} );
	stream.push( editorHtml );

	var editorCssSrc = fs.readFileSync( __dirname + '/editor/build/_editor/_editor.css', { encoding: 'utf-8' } );
	var editorCss = new File( {
		path: '_editor/_editor.css',
		contents: new Buffer( editorCssSrc )
	} );
	stream.push( editorCss );

	var editorJsSrc = fs.readFileSync( __dirname + '/editor/build/_editor/_editor.Js', { encoding: 'utf-8' } );
	var editorJs = new File( {
		path: '_editor/_editor.js',
		contents: new Buffer( editorJsSrc )
	} );
	stream.push( editorJs );

}

module.exports = copyTemplateAssets;
