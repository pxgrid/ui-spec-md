const store = require( '../store.js' );

module.exports = {

	dropImageAction: ( name, src ) => {

		store.dispatch( {
			type: 'SET_IMAGE',
			filename: name,
			src: src
		} );

	},

	addHighlightAction: ( svgCoord ) => {

		store.dispatch( {
			type: 'HIGHLIGHT_ADD',
			coord: [ svgCoord.x, svgCoord.y, 100, 100 ]
		} );

	},

};
