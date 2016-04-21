const React = require( 'react' );

const ItemSrcControl    = require( './EditorToolbar/ItemSrcControl.jsx' );
const ItemOrderControl  = require( './EditorToolbar/ItemOrderControl.jsx' );
const ItemCoordsControl = require( './EditorToolbar/ItemCoordsControl.jsx' );
const ItemRemoveControl = require( './EditorToolbar/ItemRemoveControl.jsx' );
const ItemZoomControl   = require( './EditorToolbar/ItemZoomControl.jsx' );

const EditorToolbar = ( props ) => {

	const {
		filename, selectedItem, coords,
		shiftAction, unshiftAction,
		coordsAction,
		removeAction,
		zoomAction,
	} = props;

	return (
		<div className="EDT-EditorToolbar">
			<div className="EDT-EditorToolbar__inner">
				<div className="EDT-EditorToolbar__row">

					<ItemSrcControl
						filename={ filename }
						coords={ coords }
					/>

				</div>

				<div className="EDT-EditorToolbar__row EDT-EditorToolbar__row--fit-true">

					<ItemOrderControl
						selectedItem={ selectedItem }
						shiftAction={ shiftAction }
						unshiftAction={ unshiftAction }
					/>

					{
						[ 'x', 'y', 'w', 'h' ].map(( target, idx ) => {
							return (
								<ItemCoordsControl
									key={ idx }
									target={ target }
									selectedItem={ selectedItem }
									coords={ coords }
									coordsAction={ coordsAction }
								/>
							);
						})
					}

					<ItemRemoveControl
						removeAction={ removeAction }
					/>

					<ItemZoomControl
						zoomAction={ zoomAction }
					/>

				</div>
			</div>
		</div>
	);
};

EditorToolbar.propTypes = {

	shiftAction:   React.PropTypes.func.isRequired,
	unshiftAction: React.PropTypes.func.isRequired,
	coordsAction:  React.PropTypes.func.isRequired,
	zoomAction:    React.PropTypes.func.isRequired,
	removeAction:  React.PropTypes.func.isRequired,

};

module.exports = EditorToolbar;
