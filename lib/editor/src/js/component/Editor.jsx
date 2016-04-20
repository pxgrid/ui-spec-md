const React          = require( 'react' );
const store          = require( '../store.js' );
const EditorToolbar  = require( './EditorToolbar.jsx' );
const EditorViewport = require( './EditorViewport.jsx' );

class Editor extends React.Component {

	_onchange () {

		let state = store.getState();
		this.setState( state );

	}

	constructor() {

		super();
		this.state = store.getState();
		this.listener = this._onchange.bind( this );

	}

	componentDidMount () {

		this.unsubscribe = store.subscribe( this.listener );

	}

	componentWillUnmount() {

		this.unsubscribe();

	}

	render () {

		return (
			<div className="EDT-Editor">
				<EditorToolbar {...this.state} />
				<EditorViewport {...this.state} />
			</div>
		);

	}

}

module.exports = Editor;
