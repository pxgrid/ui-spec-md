const React = require( 'react' );
const store = require( '../../store' );

const ItemOrderControl = ( props ) => {
	const { selectedItem } = props;

	return (
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
	);
};

module.exports = ItemOrderControl;
