const React = require( 'react' );
const MINIMUM_SIZE = 20;

class Highlight extends React.Component {

	constructor () {

		super();

		this.state = {

			draggingEl: null,
			dragStartOffsetX: null,
			dragStartOffsetY: null,

		};

		this._handleDrag = this._handleDrag.bind( this );
		this._dragEnd    = this._dragEnd.bind( this );

	}

	render () {

		let { order, coord, selected, selectHighlightAction } = this.props;
		let [ x, y, w, h ] = coord;

		return (
			<g
				className="EDT-Highlight"
				aria-selected={ selected }
				onMouseDown={ () => { selectHighlightAction( order );

				} }
			>
				<rect x={ x     } y={ y     } width={ w     } height={ h     } className="EDT-Highlight__fill" />
				<rect x={ x - 2 } y={ y - 2 } width={ w + 4 } height={ h + 4 } className="EDT-Highlight__outline" />
				<text x={ x + 2 } y={ y - 2 } dy={ h - 2 } className="EDT-Highlight__label">{ order + 1 }</text>

				<rect x={ x     } y={ y     } width={ w     } height={ h     } className="EDT-Highlight__clickableArea"
				ref="c"
				onMouseDown={ this.dragStart.bind( this, 'c' ) }
				/>

				<rect x={ x - 5 + w * 0.5 } y={ y - 5           } width="10" height="10" className="EDT-Highlight__ctrl EDT-Highlight__ctrl--t"
				ref="t"
				onMouseDown={ this.dragStart.bind( this, 't' ) }
				/>
				<rect x={ x - 5 + w       } y={ y - 5 + h * 0.5 } width="10" height="10" className="EDT-Highlight__ctrl EDT-Highlight__ctrl--r"
				ref="r"
				onMouseDown={ this.dragStart.bind( this, 'r' ) }
				/>
				<rect x={ x - 5 + w * 0.5 } y={ y - 5 + h       } width="10" height="10" className="EDT-Highlight__ctrl EDT-Highlight__ctrl--b"
				ref="b"
				onMouseDown={ this.dragStart.bind( this, 'b' ) }
				/>
				<rect x={ x - 5           } y={ y - 5 + h * 0.5 } width="10" height="10" className="EDT-Highlight__ctrl EDT-Highlight__ctrl--l"
				ref="l"
				onMouseDown={ this.dragStart.bind( this, 'l' ) }
				/>

				<circle cx={ x     } cy={ y     } r="10" className="EDT-Highlight__ctrl EDT-Highlight__ctrl--tl"
				ref="tl"
				onMouseDown={ this.dragStart.bind( this, 'tl' ) }
				/>
				<circle cx={ x + w } cy={ y     } r="10" className="EDT-Highlight__ctrl EDT-Highlight__ctrl--tr"
				ref="tr"
				onMouseDown={ this.dragStart.bind( this, 'tr' ) }
				/>
				<circle cx={ x + w } cy={ y + h } r="10" className="EDT-Highlight__ctrl EDT-Highlight__ctrl--br"
				ref="br"
				onMouseDown={ this.dragStart.bind( this, 'br' ) }
				/>
				<circle cx={ x     } cy={ y + h } r="10" className="EDT-Highlight__ctrl EDT-Highlight__ctrl--bl"
				ref="bl"
				onMouseDown={ this.dragStart.bind( this, 'bl' ) }
				/>
			</g>
		);

	}

	dragStart ( ref, e ) {

		const { getCoordByXY } = this.props;

		// e.nativeEvent.preventDefault();
		e.nativeEvent.stopPropagation();

		let svgCoord = getCoordByXY(e.nativeEvent);

		this.setState( {
			draggingEl: ref,
			dragStartOffsetX: svgCoord.x - this.props.coord[ 0 ],
			dragStartOffsetY: svgCoord.y - this.props.coord[ 1 ],
		} );

		document.body.classList.add( '--dragging' );
		document.removeEventListener( 'mousemove', this._handleDrag );
		document.addEventListener( 'mousemove', this._handleDrag );

	}


	_dragEnd () {

		this.setState( {
			draggingEl: null,
			dragStartOffsetX: null,
			dragStartOffsetY: null,
		} );

		document.body.classList.remove( '--dragging' );
		document.removeEventListener( 'mousemove', this._handleDrag );

	}

	_handleDrag ( e ) {

		const { draggingEl, dragStartOffsetX, dragStartOffsetY } = this.state;
		const { coord, order, coordsAction, getCoordByXY, width, height } = this.props;

		let svgCoord = getCoordByXY(e);

		let _svgCoordX = svgCoord.x;
		let _svgCoordY = svgCoord.y;
		_svgCoordX = Math.max( _svgCoordX, 0 );
		_svgCoordY = Math.max( _svgCoordY, 0 );
		_svgCoordX = Math.min( _svgCoordX, width );
		_svgCoordY = Math.min( _svgCoordY, height );

		let prevBox = {
			x: coord[ 0 ],
			y: coord[ 1 ],
			w: coord[ 2 ],
			h: coord[ 3 ]
		};

		let newBox = {
			x: prevBox.x,
			y: prevBox.y,
			w: prevBox.w,
			h: prevBox.h
		};

		if ( /r/.test( draggingEl ) ) {

			newBox.w = Math.max( _svgCoordX - prevBox.x, MINIMUM_SIZE );

		} else if ( /l/.test( draggingEl ) ) {

			let left  = _svgCoordX;
			let right = prevBox.w + prevBox.x;
			let maxLeft = right - MINIMUM_SIZE;

			newBox.x = Math.min( left, maxLeft );
			newBox.w = prevBox.w + ( prevBox.x - newBox.x );

		}

		if ( /b/.test( draggingEl ) ) {

			newBox.h = Math.max( _svgCoordY - prevBox.y, MINIMUM_SIZE );

		} else if ( /t/.test( draggingEl ) ) {

			let top    = _svgCoordY;
			let bottom = prevBox.h + prevBox.y;
			let maxTop = bottom - MINIMUM_SIZE;

			newBox.y = Math.min( top, maxTop );
			newBox.h = prevBox.h + ( prevBox.y - newBox.y );

		}

		if ( /c/.test( draggingEl ) ) {

			newBox.x = _svgCoordX - dragStartOffsetX;
			newBox.y = _svgCoordY - dragStartOffsetY;

		}

		coordsAction( order, [ newBox.x, newBox.y, newBox.w, newBox.h ] );

	}

	componentDidMount () {

		document.addEventListener( 'mouseup', this._dragEnd );

	}

	componentWillUnmount () {

		document.removeEventListener( 'mouseup', this._dragEnd );

	}

}

Highlight.propTypes = {

	getCoordByXY:          React.PropTypes.func.isRequired,
	selectHighlightAction: React.PropTypes.func.isRequired,
	coordsAction:          React.PropTypes.func.isRequired,

};

module.exports = Highlight;
