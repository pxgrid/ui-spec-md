const store = require( '../store.js' );

module.exports = {

	coordsAction: ( selectedItem, coordsClone ) => {

		store.dispatch( {
			type: 'SET_COORDS',
			order: selectedItem,
			coord: coordsClone
		} );

	},


	selectHighlightAction: ( selectedItem ) => {

		store.dispatch( {
			type: 'HIGHLIGHT_SELECT',
			selectedItem: selectedItem
		} );

	},

	shiftAction: () => {

		store.dispatch( {
			type: 'HIGHLIGHT_SHIFT'
		} );

	},

	unshiftAction: () => {

		store.dispatch( {
			type: 'HIGHLIGHT_UNSHIFT'
		} );

	},

	removeAction: () => {

		store.dispatch( {
			type: 'HIGHLIGHT_REMOVE'
		} );

	},

	zoomAction: ( val ) => {

		store.dispatch( {
			type: 'ZOOM',
			zoom: val
		} );

	},

};
