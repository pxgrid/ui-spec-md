const EditorCanvas = require( './EditorCanvas.jsx' );
const EditorDrop   = require( './EditorDrop.jsx' );

class EditorViewport extends React.Component {

	constructor( props, context ) {

		super( props, context );

	}

	render () {

		let { src, width, height, zoom, coords, selectedItem } = this.props;

		return (
			<div className="EDT-EditorViewport">
				<div className="EDT-EditorViewport__inner">
					<div className="EDT-EditorViewport__inner2">

						{ ( function () {

							if ( !!src ) {
								return <EditorCanvas src={ src } width={ width } height={ height } zoom={ zoom } coords={ coords } selectedItem={ selectedItem } />;
							} else {
								return <EditorDrop />;
							}
						}.bind( this ) )() }

					</div>
				</div>
			</div>
		);

	}

}

module.exports = EditorViewport;
