'use strict';

const _      = require( 'lodash' );
const fs     = require( 'fs' );
const path   = require( 'path' );
const sizeOf = require( 'image-size' );

const makePageHtml = function ( contents ) {

	let templateSrc = fs.readFileSync( __dirname + '/template/build/_template.html', { encoding: 'utf-8' } );
	let template = _.template( templateSrc );

	return template( {
		toRoot   : contents.toRoot,
		title    : contents.title,
		svgCanvas: makeSvgCanvasSrc( contents.dir, contents.screen ),
		body     : contents.body
	} );

}

const svgCanvasTemplate = function ( src, w, h, coords ) {
	return `
		<svg width="${ w }" height="${ h }" viewBox="0 0 ${ w } ${ h }" class="UISP-capture">
			<image xlink:href="${ src }" width="${ w }" height="${ h }" class="UISP-svgimage" />
			${ ( function () {

				let result = [];

				coords.forEach( function ( coord, i ) {

					let x = coord[ 0 ];
					let y = coord[ 1 ];
					let w = coord[ 2 ];
					let h = coord[ 3 ];

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

const makeSvgCanvasSrc = function ( pageDir, screenUrl ) {

	if ( !screenUrl ) { return ''; }

	let reg    = /highlight=\[(\[[0-9]+,[0-9]+,[0-9]+,[0-9]+\],?)+\]/;
	let match  = reg.exec( screenUrl );
	let coords = match ? JSON.parse( match[ 0 ].replace( /highlight=/, '' ) ) : [];

	let fullImagePath = path.resolve( pageDir, screenUrl ).replace( /\?.*$/, '' );
	let dimensions;

	try {

		// TODO
		// ローカルにない、httpの画像も処理したい
		let dimensions = sizeOf( fullImagePath );
		return svgCanvasTemplate( screenUrl, dimensions.width, dimensions.height, coords );

	} catch ( e ) {

		return '';

	}

}

module.exports = makePageHtml;
