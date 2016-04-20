const React = require( 'react' );
const store = require( '../store' );

class EditorToolbar extends React.Component {

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

	onzoomchange ( e ) {

		store.dispatch( {
			type: 'ZOOM',
			zoom: +e.target.value
		} );

	}

	copyUrl ( ) {

		this.refs.url.focus();
		this.refs.url.select();
		document.execCommand( 'copy' );

	}

	render () {

		let { selectedItem, coords } = this.props;
		let url = ( !!this.props.filename ) ? `${ this.props.filename }?highlight=${ JSON.stringify( this.props.coords ) }` : ``;
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
						<div className="EDT-EditorToolbar__item">
							<div className="EDT-EditorToolbar__label">
								src
							</div>
							<div className="EDT-EditorToolbar__control">
								<input className="EDT-EditorToolbar__output" readonly="" ref="url" value={ url } />
							</div>
							<div className="EDT-EditorToolbar__subControl">
								<button className="EDT-EditorToolbar__button" onClick={ this.copyUrl.bind( this ) }>copy</button>
							</div>
						</div>
					</div>
					<div className="EDT-EditorToolbar__row EDT-EditorToolbar__row--fit-true">
						<div className="EDT-EditorToolbar__item">
							<div className="EDT-EditorToolbar__label">
								label
							</div>
							<div className="EDT-EditorToolbar__control">
								<button className="EDT-EditorToolbar__button"
									onClick={ () => {
										store.dispatch( { type: 'HIGHLIGHT_SHIFT' } );
									} }
								>
									&lt;&lt;
								</button>
								<output className="EDT-EditorToolbar__output EDT-EditorToolbar__output--xshort">{ selectedItem + 1 }</output>
								<button className="EDT-EditorToolbar__button"
									onClick={ () => {
										store.dispatch( { type: 'HIGHLIGHT_UNSHIFT' } );
									} }
								>
									&gt;&gt;
								</button>
							</div>
						</div>
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
						<div className="EDT-EditorToolbar__item">
							<div className="EDT-EditorToolbar__label">
								zoom
							</div>
							<div className="EDT-EditorToolbar__control">
								<input className="EDT-EditorToolbar__range EDT-EditorToolbar__input--zoom" type="range" step="0.25" min="0.5" max="1.5"
									ref="zoom"
									onChange={ this.onzoomchange }
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);

	}

}

module.exports = EditorToolbar;
