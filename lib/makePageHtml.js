'use strict';

var _      = require( 'lodash' );
var fs     = require( 'fs' );
var path   = require( 'path' );
var sizeOf = require( 'image-size' );

var makePageHtml = function ( contents ) {

	var templateSrc = fs.readFileSync( __dirname + '/template/build/_template.html', { encoding: 'utf-8' } );
	var template = _.template( templateSrc );

	return template( {
		toRoot   : contents.toRoot,
		title    : contents.title,
		svgCanvas: makeSvgCanvasSrc( contents.dir, contents.screen ),
		body     : contents.body
	} );

}

var svgCanvasTemplate = function ( src, w, h, coords ) {
	return `
		<svg width="${ w }" height="${ h }" viewBox="0 0 ${ w } ${ h }" class="UISP-capture">
			<image xlink:href="${ src }" width="${ w }" height="${ h }" class="UISP-svgimage" />
			${ ( function () {

				var result = [];

				coords.forEach( function ( coord, i ) {

					var x = coord[ 0 ];
					var y = coord[ 1 ];
					var w = coord[ 2 ];
					var h = coord[ 3 ];

					result.push( `<g class="UISP-rect">
						<rect x="${ x     }" y="${ y     }" width="${ w     }" height="${ h     }" class="UISP-fillrect"/>
						<rect x="${ x - 2 }" y="${ y - 2 }" width="${ w + 4 }" height="${ h + 4 }" class="UISP-outlinerect"/>
						<text x="${ x + 2 }" y="${ y - 2 }" dy="${ h - 2 }">${ ( i + 1 ) }</text>
					</g>` );

				} );

				return result.join( '' );

			} )() }
		</svg>
	`;
}

function makeSvgCanvasSrc ( pageDir, screenUrl ) {

	if ( !screenUrl ) { return ''; }

	var reg    = /highlight=\[(\[[0-9]+,[0-9]+,[0-9]+,[0-9]+\],?)+\]/;
	var match  = reg.exec( screenUrl )[ 0 ];
	var coords = match ? JSON.parse( match.replace( /highlight=/, '' ) ) : [];

	var fullImagePath = path.resolve( pageDir, screenUrl ).replace( /\?.*$/, '' );
	var dimensions;

	try {

		// TODO
		// ローカルにない、httpの画像も処理したい
		var dimensions = sizeOf( fullImagePath );
		return svgCanvasTemplate( screenUrl, dimensions.width, dimensions.height, coords );

	} catch ( e ) {

		return '';

	}

}

module.exports = makePageHtml;
