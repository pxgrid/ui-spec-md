const createStore = function ( reducer ) {

	let state;
	let listeners = [];

	const getState = function () {

		return state;

	}

	const dispatch = function ( action ) {

		let result = reducer( state, action );

		if ( result instanceof Promise ) {

			result.then( function ( newState ) {

				state = newState;
				listeners.forEach( function ( listener ) { listener() } );

			} );

		} else {

			state = result;
			listeners.forEach( function ( listener ) { listener() } );

		}

	}

	const subscribe = function ( listener ) {

		listeners.push( listener );

		// return removeEventListener
		return function () {

			listeners = listeners.fister( l => l !== listener );

		}

	}

	dispatch( {} );

	return { getState, dispatch, subscribe }

}

module.exports = createStore;
