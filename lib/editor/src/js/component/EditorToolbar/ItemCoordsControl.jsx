const React = require( 'react' );
const store = require( '../../store' );

const LOOKUP = { x: 0, y: 1, w: 2, h: 3 };

class ItemCoordsControl extends React.Component {

	render () {

		const { target, selectedItem, coords } = this.props;
		const val = typeof selectedItem === 'number'
			? coords[selectedItem][LOOKUP[target]]
			: undefined;

		return (
			<div className="EDT-EditorToolbar__item">
				<div className="EDT-EditorToolbar__label">
					{target}
				</div>
				<div className="EDT-EditorToolbar__control">
					<input
						className="EDT-EditorToolbar__input"
						type="number" min="0" max="10000"
						value={ val }
						onChange={ this.onValuechange.bind( this ) }
					/>
				</div>
			</div>
		);

	}

	onValuechange( e ) {

		const { target, selectedItem, coords } = this.props;

		if ( selectedItem === null ) {

			e.preventDefault();
			return;

		}

		let coordsClone = coords[ selectedItem ].concat();

		coordsClone[ LOOKUP[ target ] ] = e.target.value | 0;

		store.dispatch( {
			type: 'SET_COORDS',
			order: selectedItem,
			coord: coordsClone
		} );

	}

};

module.exports = ItemCoordsControl;
