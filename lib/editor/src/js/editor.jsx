const store          = require( './store.js' );
const EditorToolbar  = require( './EditorToolbar.jsx' );
const EditorViewport = require( './EditorViewport.jsx' );

class Editor extends React.Component {

	static _onchange () {

		let state = this.props.store.getState();
		this.setState( state );

	}

	constructor( props, context ) {

		super( props, context );
		this.state = Object.assign( {}, this.props.store.getState() );
		this.listener = Editor._onchange.bind( this );

	}

	componentDidMount () {

		this.unsubscribe = this.props.store.subscribe( this.listener );

	}

	componentWillUnmount() {

		this.unsubscribe();

	}

	render () {

		let { filename, src, zoom, coords, selectedItem } = this.state,
				w = this.state.width,
				h = this.state.height;

		return (
			<div className="EDT-Editor">
				<EditorToolbar filename={ filename } width={ w } height={ h } coords={ coords } selectedItem={ selectedItem } />
				<EditorViewport src={ src } width={ w } height={ h } zoom={ zoom } coords={ coords } selectedItem={ selectedItem } />
			</div>
		);

	}

}

module.exports = Editor;
