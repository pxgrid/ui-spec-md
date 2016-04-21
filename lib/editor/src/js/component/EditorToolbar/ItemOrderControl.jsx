const React = require( 'react' );

const ItemOrderControl = ( props ) => {
	const {
		selectedItem,
		shiftAction, unshiftAction,
	} = props;

	return (
		<div className="EDT-EditorToolbar__item">
			<div className="EDT-EditorToolbar__label">
				label
			</div>
			<div className="EDT-EditorToolbar__control">
				<button className="EDT-EditorToolbar__button"
					onClick={ shiftAction }
				>
					&lt;&lt;
				</button>

				<output className="EDT-EditorToolbar__output EDT-EditorToolbar__output--xshort">{ selectedItem + 1 }</output>

				<button className="EDT-EditorToolbar__button"
					onClick={ unshiftAction }
				>
					&gt;&gt;
				</button>
			</div>
		</div>
	);
};

ItemOrderControl.propTypes = {

	shiftAction:   React.PropTypes.func.isRequired,
	unshiftAction: React.PropTypes.func.isRequired,
};

module.exports = ItemOrderControl;
