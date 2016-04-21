const React     = require( 'react' );
const Highlight = require( './Highlight.jsx' );

class EditorCanvas extends React.Component {

	addHighlight ( e ) {

		const { addHighlightAction } = this.props;

		e.nativeEvent.preventDefault();
		e.nativeEvent.stopPropagation();

		if ( !e.target.classList.contains( 'EDT-EditorCanvas__image' ) ) { return; }

		let svgCoord = this.getCoordByXY( e.nativeEvent );

		addHighlightAction( svgCoord );

	}

	getCoordByXY( { x, y } ) {

		let svg = this.refs.svg;
		let p   = svg.createSVGPoint();
		p.x = x | 0;
		p.y = y | 0;

		return p.matrixTransform( svg.getScreenCTM().inverse() );

	}

	render () {

		let { src, zoom, coords, selectedItem } = this.props,
				w = this.props.width,
				h = this.props.height,
				viewbox = `0 0 ${ w } ${ h }`;

		let getCoordByXY = this.getCoordByXY.bind( this );

		return (
			<svg
				ref="svg"
				className="EDT-EditorCanvas"
				width={ w * zoom } height={ h * zoom } viewBox={ viewbox }
				onClick={ this.addHighlight.bind( this ) }
			>
				<image xlinkHref={ src } width={ w } height={ h } className="EDT-EditorCanvas__image" />

				{ coords.map( function ( coord, i ) {

					return (
						<Highlight
							key={ i } order={ i }
							coord={ coord }
							selected={ i === selectedItem }
							width={ w }
							height={ h }
							getCoordByXY={ getCoordByXY }
						/>
					);

				} ) }

			</svg>
		);

	}

}

EditorCanvas.propTypes = {

	addHighlightAction: React.PropTypes.func.isRequired,

};

module.exports = EditorCanvas;
