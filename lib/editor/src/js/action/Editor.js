const store = require( '../store.js' );

const EditorAction = {

	initAction: ( src, highlight ) => {

		if ( highlight && highlight.length !== 0 ) {

			highlight.forEach( ( coord ) => {

				store.dispatch( {
					type: 'HIGHLIGHT_ADD',
					coord: coord
				} );

			} );

		}

		// XXX: いろんな業が重なってて、これを後にしないとHIGHLIGHTが消えちゃう
		// - reducerが非同期キューをまんま非同期でやっちゃうとか
		// - そもそもstoreでPromise返してるとか
		if ( src ) {

			store.dispatch( {
				type: 'SET_IMAGE',
				filename: src,
				src: src
			} );

		}

	},

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

module.exports = EditorAction;
