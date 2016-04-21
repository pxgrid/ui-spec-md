const React = require( 'react' );

const ItemZoomControl = ( props ) => {

	const { zoomAction } = props;

	return (
		<div className="EDT-EditorToolbar__item">
			<div className="EDT-EditorToolbar__label">
				zoom
			</div>
			<div className="EDT-EditorToolbar__control">
				<input
					className="EDT-EditorToolbar__range EDT-EditorToolbar__input--zoom"
					type="range" step="0.25" min="0.5" max="1.5"
					onChange={ ( e ) => { zoomAction( +e.target.value ); } }
				/>
			</div>
		</div>
	);
};

ItemZoomControl.propTypes = {

	zoomAction: React.PropTypes.func.isRequired,

};

module.exports = ItemZoomControl;
