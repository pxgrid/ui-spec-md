const store  = require( './store.js' );
const Editor = require( './Editor.jsx' );


// main
{
	const state = store.getState();
	store.dispatch( {
		type: 'SET_IMAGE',
		filename: state.filename,
		src: state.src
	} );
}

ReactDOM.render(
	<Editor store={ store } />,
	document.body
);
