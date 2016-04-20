const React = require( 'react' );

const ItemSrcControl    = require( './EditorToolbar/ItemSrcControl.jsx' );
const ItemOrderControl  = require( './EditorToolbar/ItemOrderControl.jsx' );
const ItemCoordsControl = require( './EditorToolbar/ItemCoordsControl.jsx' );
const ItemRemoveControl = require( './EditorToolbar/ItemRemoveControl.jsx' );
const ItemZoomControl   = require( './EditorToolbar/ItemZoomControl.jsx' );

const EditorToolbar = ( props ) => {

	const { filename, selectedItem, coords } = props;

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

					<ItemOrderControl selectedItem={ selectedItem } />

					{
						[ 'x', 'y', 'w', 'h' ].map(( target, idx ) => {
							return (
								<ItemCoordsControl
									key={ idx }
									target={ target }
									selectedItem={ selectedItem }
									coords={ coords }
								/>
							);
						})
					}

					<ItemRemoveControl />

					<ItemZoomControl />

				</div>
			</div>
		</div>
	);
};

module.exports = EditorToolbar;
