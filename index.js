
var File   = require( 'vinyl' )
var Stream = require( 'stream' );
var fs     = require( 'fs' );
var path   = require( 'path' );
var marked = require( 'marked' );

var UiflowMDRenderer   = require( './lib/UiflowMDRenderer.js' );
var splitInput         = require( './lib/splitInput.js' );
var makePageHtml       = require( './lib/makePageHtml.js' );
var makeIndex          = require( './lib/makeIndex.js' );
var copyTemplateAssets = require( './lib/copyTemplateAssets.js' );

var PLUGIN_NAME = 'ui-spec-md';

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

function uiSpecMd( options ) {

	var fileinfoPool = [];
	var rootDir = options.srcRoot;

	var stream = new Stream.Transform( { objectMode: true } );

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

			file.path = file.path.replace( /\.md$/, '.html' );
			var contents = splitInput( file, rootDir );

			fileinfoPool.push( {
				relativePath: contents.fromRoot + contents.filename,
				title: contents.title
			} );

			marked( contents.mdSouce, function ( err, content ) {

				if ( err ) {

					// stream.emit(
					//   'error',
					//   new gutil.PluginError( PLUGIN_NAME, err, { showStack: true } )
					// );
					return done();

				}

				contents.body = content;

				var pageHtmlSource = makePageHtml( contents );
				file.contents = new Buffer( pageHtmlSource );
				file.path = path.resolve( contents.dir, contents.filename );
				stream.push( file );
				done();

			} );

		} else {

			console.log( 'not a buffer' );
			done();

		}

	};

	stream._flush = function ( done ) {

		makeIndex( stream, fileinfoPool );
		done();

	};

	copyTemplateAssets( stream );

	return stream;

};

module.exports = uiSpecMd;
