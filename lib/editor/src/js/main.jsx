const store  = require( './store' );
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
	<Editor />,
	document.body
);
