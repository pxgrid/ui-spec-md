const React = require( 'react' );
const store = require( '../../store' );

const LOOKUP = { x: 0, y: 1, w: 2, h: 3 };

class ItemCoordsControl extends React.Component {

	constructor() {

		super();

		this.state = { val: '' };

	}

	render () {

		const { target } = this.props;

		return (
			<div className="EDT-EditorToolbar__item">
				<div className="EDT-EditorToolbar__label">
					{target}
				</div>
				<div className="EDT-EditorToolbar__control">
					<input
						className="EDT-EditorToolbar__input"
						type="number" min="0" max="10000"
						value={ this.state.val }
						onChange={this.onChange.bind(this)}
					/>
				</div>
			</div>
		);

	}

	onChange( e ) {

		const { target, selectedItem, coords } = this.props;

		if ( selectedItem === null ) {

			e.preventDefault();
			return;

		}

		const val = e.target.value | 0;
		let coordsClone = coords[ selectedItem ].concat();

		coordsClone[ LOOKUP[ target ] ] = val;

		store.dispatch( {
			type: 'SET_COORDS',
			order: selectedItem,
			coord: coordsClone
		} );

		this.setState( { val: val } );

	}

	componentWillReceiveProps ( nextProps ) {
		const { target, selectedItem, coords } = nextProps;
		const val = typeof selectedItem === 'number'
			? coords[selectedItem][LOOKUP[target]]
			: undefined;

		val && this.setState( { val: val } );
	}

};

module.exports = ItemCoordsControl;
