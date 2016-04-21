const React          = require( 'react' );
const store          = require( '../store.js' );

const HighlightAction = require( '../action/Highlight' );
const EditorAction    = require( '../action/Editor' );

const EditorToolbar  = require( './EditorToolbar.jsx' );
const EditorViewport = require( './EditorViewport.jsx' );


class Editor extends React.Component {

	constructor() {

		super();

		this.state = store.getState();

	}

	componentDidMount () {

		this.unsubscribe = store.subscribe( this._onchange.bind( this ) );

	}

	componentWillUnmount() {

		this.unsubscribe();

	}

	render () {

		return (
			<div className="EDT-Editor">
				<EditorToolbar
					{ ...this.state }
					{ ...HighlightAction }
				/>
				<EditorViewport
					{ ...this.state }
					{ ...EditorAction }
					{ ...HighlightAction }
				/>
			</div>
		);

	}

	_onchange () {

		this.setState( store.getState() );

	}

}

module.exports = Editor;
