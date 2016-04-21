const createStore  = require( './util/createStore' );
const MINIMUM_SIZE = 20;

const initialState = {
	width        : 300,
	height       : 150,
	src          : '',
	filename     : '',
	coords       : [],
	selectedItem : null,
	zoom         : 1.0,
};

const reducer = function ( state = initialState, action ) {

	switch ( action.type ) {

		case 'SET_IMAGE': {

			return new Promise( function ( resolve, _reject ) {

				let img = new Image();
				let width  = 0;
				let height = 0;
				let filename = action.filename;
				let src      = action.src;

				img.onload = function () {

					width  = img.naturalWidth;
					height = img.naturalHeight;
					img = null;
					resolve( Object.assign( {}, state, { filename, src, width, height } ) );

				};

				img.onerror = function () {

					filename = '';
					src = '';
					width  = 0;
					height = 0;
					img = null;
					resolve( Object.assign( {}, state, { filename, src, width, height } ) );

				};

				img.src = src;

			} );

		}

		case 'SET_COORDS': {

			if ( state.selectedItem !== action.order ) {

				throw new Error( 'selectedItem in state doesnt equall to action.order!' );

			}

			let order  = action.order;
			let values = action.coord;

			let x = values[ 0 ];
			let y = values[ 1 ];
			let w = Math.max( values[ 2 ], MINIMUM_SIZE );
			let h = Math.max( values[ 3 ], MINIMUM_SIZE );

			if ( x < 0 ) {

				w = state.coords[ order ][ 2 ];

			}

			if ( x + state.coords[ order ][ 2 ] >= state.width ) {

				w = Math.min( w, state.coords[ order ][ 2 ] );

			}

			if ( y < 0 ) {

				h = state.coords[ order ][ 3 ];

			}

			if ( y + state.coords[ order ][ 3 ] >= state.height ) {

				h = Math.min( h, state.coords[ order ][ 3 ] );

			}

			x = Math.min( x, state.width  - w );
			y = Math.min( y, state.height - h );

			x = Math.max( x, 0 );
			y = Math.max( y, 0 );

			// FIXME not deep copied
			let coordsClone = state.coords.concat();

			coordsClone[ order ][ 0 ] = x | 0;
			coordsClone[ order ][ 1 ] = y | 0;
			coordsClone[ order ][ 2 ] = w | 0;
			coordsClone[ order ][ 3 ] = h | 0;

			return Object.assign( {}, state, {
				coords: coordsClone
			} );

		}

		case 'HIGHLIGHT_ADD': {

			let coordsClone = state.coords.concat();
			coordsClone.push( action.coord );

			return Object.assign( {}, state, {
				coords: coordsClone,
				selectedItem: state.coords.length
			} );

		}

		case 'HIGHLIGHT_REMOVE': {

			if ( state.selectedItem === null ) { return state; }

			let coordsClone = state.coords.concat();
			coordsClone.splice( state.selectedItem, 1 );

			return Object.assign( {}, state, {
				coords: coordsClone,
				selectedItem: null
			} );

		}

		case 'HIGHLIGHT_SELECT': {

			return Object.assign( {}, state, {
				selectedItem: action.selectedItem
			} );

		}

		case 'HIGHLIGHT_SHIFT': {

			if ( state.selectedItem === null ) { return state; }
			if ( state.selectedItem === 0 )    { return state; }

			let index = state.selectedItem;
			let coordsClone = state.coords.concat();

			[
				coordsClone[ index ],
				coordsClone[ index - 1 ]
			] = [
				coordsClone[ index - 1 ],
				coordsClone[ index ]
			];

			return Object.assign( {}, state, {
				selectedItem: index - 1,
				coords: coordsClone
			} );

		}

		case 'HIGHLIGHT_UNSHIFT': {

			if ( state.selectedItem === null ) { return state; }
			if ( state.selectedItem === state.coords.length - 1 ) { return state; }

			let index = state.selectedItem + 1;
			let coordsClone = state.coords.concat();

			[
				coordsClone[ index ],
				coordsClone[ index - 1 ]
			] = [
				coordsClone[ index - 1 ],
				coordsClone[ index ]
			];

			return Object.assign( {}, state, {
				selectedItem: index,
				coords: coordsClone
			} );

		}

		case 'ZOOM': {

			return Object.assign( {}, state, {
				zoom: action.zoom
			} );

		}

		default:
			return state;

	}

};

module.exports = createStore( reducer );
