const React = require( 'react' );
const store = require( '../store' );

const ItemSrcControl   = require( './EditorToolbar/ItemSrcControl.jsx' );
const ItemZoomControl  = require( './EditorToolbar/ItemZoomControl.jsx' );
const ItemOrderControl = require( './EditorToolbar/ItemOrderControl.jsx' );

class EditorToolbar extends React.Component {

	render () {

		const { filename, selectedItem, coords } = this.props;
		const url = ( !!filename ) ? `${ filename }?highlight=${ JSON.stringify( coords ) }` : ``;
		let x, y, w, h;

		if ( typeof selectedItem === `number` ) {

			// FIXME
			x = coords[ selectedItem ][ 0 ];
			y = coords[ selectedItem ][ 1 ];
			w = coords[ selectedItem ][ 2 ];
			h = coords[ selectedItem ][ 3 ];

		}

		return (
			<div className="EDT-EditorToolbar">
				<div className="EDT-EditorToolbar__inner">
					<div className="EDT-EditorToolbar__row">
						<ItemSrcControl url={ url } />
					</div>

					<div className="EDT-EditorToolbar__row EDT-EditorToolbar__row--fit-true">

						<ItemOrderControl selectedItem={ selectedItem } />

						<div className="EDT-EditorToolbar__item">
							<div className="EDT-EditorToolbar__label">
								x
							</div>
							<div className="EDT-EditorToolbar__control">
								<input className="EDT-EditorToolbar__input" type="number" min="0" max="10000" value={ x }
									onChange={ this.onvaluechange.bind( this, 'x' ) }
								/>
							</div>
						</div>
						<div className="EDT-EditorToolbar__item">
							<div className="EDT-EditorToolbar__label">
								y
							</div>
							<div className="EDT-EditorToolbar__control">
								<input className="EDT-EditorToolbar__input" type="number" min="0" max="10000" value={ y }
									onChange={ this.onvaluechange.bind( this, 'y' ) }
								/>
							</div>
						</div>
						<div className="EDT-EditorToolbar__item">
							<div className="EDT-EditorToolbar__label">
								width
							</div>
							<div className="EDT-EditorToolbar__control">
								<input className="EDT-EditorToolbar__input" type="number" min="0" max="10000" value={ w }
									onChange={ this.onvaluechange.bind( this, 'w' ) }
								/>
							</div>
						</div>
						<div className="EDT-EditorToolbar__item">
							<div className="EDT-EditorToolbar__label">
								height
							</div>
							<div className="EDT-EditorToolbar__control">
								<input className="EDT-EditorToolbar__input" type="number" min="0" max="10000" value={ h }
									onChange={ this.onvaluechange.bind( this, 'h' ) }
								/>
							</div>
						</div>
						<div className="EDT-EditorToolbar__item">
							<div className="EDT-EditorToolbar__control">
								<button className="EDT-EditorToolbar__button"
									onClick={ () => {
										store.dispatch( { type: 'HIGHLIGHT_REMOVE' } );
									} }
								>
									X
								</button>
							</div>
						</div>

						<ItemZoomControl />

					</div>
				</div>
			</div>
		);

	}

	onvaluechange ( key, e ) {

		let { selectedItem, coords } = this.props;

		if ( selectedItem === null ) {

			e.preventDefault();
			return;

		}

		const LOOKUP    = { x: 0, y: 1, w: 2, h: 3 };
		let selected    = selectedItem;
		let coordsClone = coords[ selected ].concat();

		coordsClone[ LOOKUP[ key ] ] = e.target.value;

		store.dispatch( {
			type: 'SET_COORDS',
			order: selected,
			coord: coordsClone
		} );

	}

}

module.exports = EditorToolbar;
