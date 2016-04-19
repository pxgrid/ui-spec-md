const store = require( './store.js' );
const MINIMUM_SIZE = 20;

class Highlight extends React.Component {

	// FIXME
	// イベントでthisをバインドしたいけどこれでいいの？
	static _dragEnd ( e ) {

		this.draggingEl = null;
		this._dragStartOffsetX = null;
		this._dragStartOffsetY = null;
		document.body.classList.remove( '--dragging' );
		document.removeEventListener( 'mousemove', this.handleDrag );

	}

	static _handleDrag ( e ) {

		let state = store.getState();

		// FIXME
		// 親コンポーネントのSVG要素にアクセスしたいけどどうする？
		// right wey to get parent SVG element?
		let svg = document.querySelector( 'svg' );
		let p   = svg.createSVGPoint();
		p.x = e.x | 0;
		p.y = e.y | 0;
		let svgCoord = p.matrixTransform( svg.getScreenCTM().inverse() );

		let _svgCoordX = svgCoord.x;
		let _svgCoordY = svgCoord.y;
		_svgCoordX = Math.max( _svgCoordX, 0 );
		_svgCoordY = Math.max( _svgCoordY, 0 );
		_svgCoordX = Math.min( _svgCoordX, state.width );
		_svgCoordY = Math.min( _svgCoordY, state.height );

		let prevBox = {
			x: this.props.coord[ 0 ],
			y: this.props.coord[ 1 ],
			w: this.props.coord[ 2 ],
			h: this.props.coord[ 3 ]
		}

		let newBox = {
			x: prevBox.x,
			y: prevBox.y,
			w: prevBox.w,
			h: prevBox.h
		}

		if ( /r/.test( this.draggingEl ) ) {

			newBox.w = Math.max( _svgCoordX - prevBox.x, MINIMUM_SIZE );

		} else if ( /l/.test( this.draggingEl ) ) {

			let left  = _svgCoordX;
			let right = prevBox.w + prevBox.x;
			let maxLeft = right - MINIMUM_SIZE;

			newBox.x = Math.min( left, maxLeft );
			newBox.w = prevBox.w + ( prevBox.x - newBox.x );

		}

		if ( /b/.test( this.draggingEl ) ) {

			newBox.h = Math.max( _svgCoordY - prevBox.y, MINIMUM_SIZE );

		} else if ( /t/.test( this.draggingEl ) ) {

			let top    = _svgCoordY;
			let bottom = prevBox.h + prevBox.y;
			let maxTop = bottom - MINIMUM_SIZE;

			newBox.y = Math.min( top, maxTop );
			newBox.h = prevBox.h + ( prevBox.y - newBox.y );

		}

		if ( /c/.test( this.draggingEl ) ) {

			newBox.x = _svgCoordX - this._dragStartOffsetX;
			newBox.y = _svgCoordY - this._dragStartOffsetY;

		}

		store.dispatch( {
			type: 'SET_COORDS',
			order: this.props.order,
			coord: [ newBox.x, newBox.y, newBox.w, newBox.h ]
		} );

	}

	constructor( props, context ) {

		super( props, context );

	}

	componentDidMount () {

		this.handleDrag = Highlight._handleDrag.bind( this );
		this.dragEnd    = Highlight._dragEnd.bind( this );
		this.draggingEl = null;
		document.addEventListener( 'mouseup', this.dragEnd );

	}

	componentWillUnmount () {

		document.removeEventListener( 'mouseup', this.dragEnd );

	}

	dragStart ( ref, e ) {

		// e.nativeEvent.preventDefault();
		e.nativeEvent.stopPropagation();

		let svg = document.querySelector( 'svg' );
		let p   = svg.createSVGPoint();
		p.x = e.nativeEvent.x | 0;
		p.y = e.nativeEvent.y | 0;
		let svgCoord = p.matrixTransform( svg.getScreenCTM().inverse() );

		this._dragStartOffsetX = svgCoord.x - this.props.coord[ 0 ];
		this._dragStartOffsetY = svgCoord.y - this.props.coord[ 1 ];
		this.draggingEl = ref;

		document.body.classList.add( '--dragging' );
		document.removeEventListener( 'mousemove', this.handleDrag );
		document.addEventListener( 'mousemove', this.handleDrag );

	}

	onselect ( e ) {

		store.dispatch( {
			type: 'HIGHLIGHT_SELECT',
			selectedItem: this.props.order
		} );

	}

	render () {

		let { order, coord, selected } = this.props,
				x = coord[ 0 ],
				y = coord[ 1 ],
				w = coord[ 2 ],
				h = coord[ 3 ];

		return (
			<g className="EDT-Highlight" aria-selected={ selected } onMouseDown={ this.onselect.bind( this ) }>
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

}

module.exports = Highlight;
