'use strict';

const _            = require( 'lodash' );
const fs           = require( 'fs' );
const path         = require( 'path' );
const sizeOf       = require( 'image-size' );

const makePageHtml = function ( contents ) {

	let templateSrc = fs.readFileSync( __dirname + '/template/build/_template.html', { encoding: 'utf-8' } );
	let template = _.template( templateSrc );

	return template( {
		toRoot       : contents.toRoot,
		title        : contents.title,
		svgCanvas    : makeSvgCanvasSrc( contents.dir, contents.screen ),
		body         : contents.body,
		modifiedDate : contents.modifiedDate,
		createdDate  : contents.createdDate
	} );

}

const svgCanvasTemplate = function ( src, w, h, coords ) {
	return `
		<div class="UISP-Screen UISP-Screen--fit UISP-Screen--highlight">
			<svg width="${ w }" height="${ h }" viewBox="0 0 ${ w } ${ h }" class="UISP-Screen__svgRoot">
				<image xlink:href="${ src }" width="${ w }" height="${ h }" class="UISP-Screen__image" />
				${ ( function () {

					let result = [];

					coords.forEach( function ( coord, i ) {

						let x = coord[ 0 ];
						let y = coord[ 1 ];
						let w = coord[ 2 ];
						let h = coord[ 3 ];

						result.push( `<g class="UISP-Highlight">
							<rect x="${ x     }" y="${ y     }" width="${ w     }" height="${ h     }" class="UISP-Highlight__fill"/>
							<rect x="${ x - 2 }" y="${ y - 2 }" width="${ w + 4 }" height="${ h + 4 }" class="UISP-Highlight__outline"/>
							<text x="${ x + 2 }" y="${ y - 2 }" dy="${ h - 2 }" class="UISP-Highlight__label">${ ( i + 1 ) }</text>
						</g>` );

					} );

					return result.join( '' );

				} )() }
			</svg>
		</div>
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
