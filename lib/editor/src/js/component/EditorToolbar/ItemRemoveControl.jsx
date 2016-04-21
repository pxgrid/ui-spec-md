const React = require( 'react' );

const ItemRemoveControl = ( props ) => {

	const { removeAction } = props;

	return (
		<div className="EDT-EditorToolbar__item">
			<div className="EDT-EditorToolbar__control">
				<button className="EDT-EditorToolbar__button"
					onClick={ () => { removeAction(); } }
				>
					X
				</button>
			</div>
		</div>
	);

};

ItemRemoveControl.propTypes = {

	removeAction: React.PropTypes.func.isRequired,

};

module.exports = ItemRemoveControl;
