const React     = require( 'react' );
const store     = require( './store.js' );
const Highlight = require( './Highlight.jsx' );

class EditorCanvas extends React.Component {

	addHighlight ( e ) {

		e.nativeEvent.preventDefault();
		e.nativeEvent.stopPropagation();

		if ( !e.target.classList.contains( 'EDT-EditorCanvas__image' ) ) { return; }

		let svg = this.refs.svg;
		let p   = svg.createSVGPoint();
		p.x = e.nativeEvent.x | 0;
		p.y = e.nativeEvent.y | 0;
		let svgCoord = p.matrixTransform( svg.getScreenCTM().inverse() );

		store.dispatch( {
			type: 'HIGHLIGHT_ADD',
			coord: [ svgCoord.x, svgCoord.y, 100, 100 ]
		} );

	}

	render () {

		let { src, zoom, coords, selectedItem } = this.props,
				w = this.props.width,
				h = this.props.height,
				viewbox = `0 0 ${ w } ${ h }`;

		return (
			<svg ref="svg" className="EDT-EditorCanvas" width={ w * zoom } height={ h * zoom } viewBox={ viewbox } onClick={ this.addHighlight }>
				<image xlinkHref={ src } width={ w } height={ h } className="EDT-EditorCanvas__image" />

				{ coords.map( function ( coord, i ) {

					let isSelected = ( i === selectedItem );
					return (
						<Highlight key={ i } order={ i } coord={ coord } selected={ isSelected } />
					);

				} ) }

			</svg>
		);

	}

}

module.exports = EditorCanvas;
