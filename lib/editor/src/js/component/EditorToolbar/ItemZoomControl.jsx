const React = require( 'react' );
const store = require( '../../store' );

const ItemZoomControl = () => {
	return (
		<div className="EDT-EditorToolbar__item">
			<div className="EDT-EditorToolbar__label">
				zoom
			</div>
			<div className="EDT-EditorToolbar__control">
				<input
					className="EDT-EditorToolbar__range EDT-EditorToolbar__input--zoom"
					type="range" step="0.25" min="0.5" max="1.5"
					onChange={ ( e ) => {

						store.dispatch( {
							type: 'ZOOM',
							zoom: +e.target.value
						} );

					} }
				/>
			</div>
		</div>
	);
};

module.exports = ItemZoomControl;
