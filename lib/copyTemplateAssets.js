'use strict';

const File = require( 'vinyl' );
const fs   = require( 'fs' );

const copyTemplateAssets = function ( stream ) {

	let cssSrc = fs.readFileSync( __dirname + '/template/build/_template/_template.css', { encoding: 'utf-8' } );
	let css = new File( {
		path: '_template/_template.css',
		contents: new Buffer( cssSrc )
	} );
	stream.push( css );

	let jsSrc = fs.readFileSync( __dirname + '/template/build/_template/_template.js', { encoding: 'utf-8' } );
	let js = new File( {
		path: '_template/_template.js',
		contents: new Buffer( jsSrc )
	} );
	stream.push( js );

	// editor
	let editorHtmlSrc = fs.readFileSync( __dirname + '/editor/build/_editor.html', { encoding: 'utf-8' } );
	let editorHtml = new File( {
		path: '_editor.html',
		contents: new Buffer( editorHtmlSrc )
	} );
	stream.push( editorHtml );

	let editorCssSrc = fs.readFileSync( __dirname + '/editor/build/_editor/_editor.css', { encoding: 'utf-8' } );
	let editorCss = new File( {
		path: '_editor/_editor.css',
		contents: new Buffer( editorCssSrc )
	} );
	stream.push( editorCss );

	let editorJsSrc = fs.readFileSync( __dirname + '/editor/build/_editor/_editor.Js', { encoding: 'utf-8' } );
	let editorJs = new File( {
		path: '_editor/_editor.js',
		contents: new Buffer( editorJsSrc )
	} );
	stream.push( editorJs );

}

module.exports = copyTemplateAssets;
