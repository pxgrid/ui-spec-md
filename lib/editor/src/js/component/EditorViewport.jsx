const React        = require( 'react' );
const EditorCanvas = require( './EditorCanvas.jsx' );
const EditorDrop   = require( './EditorDrop.jsx' );

class EditorViewport extends React.Component {

	render () {

		let El;

		if ( !!this.props.src ) {

			El = <EditorCanvas { ...this.props } />;

		} else {

			El = <EditorDrop { ...this.props } />;

		}

		return (
			<div className="EDT-EditorViewport">
				<div className="EDT-EditorViewport__inner">
					<div className="EDT-EditorViewport__inner2">
						{ El }
					</div>
				</div>
			</div>
		);

	}

}

EditorViewport.propTypes = {

	addHighlightAction: React.PropTypes.func.isRequired,
	dropImageAction:    React.PropTypes.func.isRequired,

};

module.exports = EditorViewport;
