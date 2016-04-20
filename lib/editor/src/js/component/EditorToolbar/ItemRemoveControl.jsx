const React = require( 'react' );
const store = require( '../../store' );

const ItemOrderControl = () => {

	return (
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
	);

};

module.exports = ItemOrderControl;
