var EventDispatcher = require( './EventDispatcher.js' );

var model = new ( class extends EventDispatcher {

	constructor () {

		super();

		this.width    = 300;
		this.height   = 150;
		this.src      = '';
		this.filename = '';
		this.coords   = [];
		this.selectedItem = null;
		this.toolbarFocus = null;
		this.zoom     = 1.0;

		var url = window.location.search;
		var queries = url.slice( 1 ).split( '&' );

		queries.forEach( function ( query ) {

			var pair = query.split( '=' );
			var key = pair[ 0 ];
			var val = pair[ 1 ];

			if ( key === 'src' ) {

				this.src = val;
				this.filename = val;

			}

			if ( key === 'highlight' ) {

				this.coords = JSON.parse( val );

			}

		}.bind( this ) );

		if ( this.src !== '' ) {

			this.setImage( this.filename, this.src );

		}

	}

	MINIMUM_SIZE () {

		return 20;

	}

	addHighlight ( coord ) {

		this.coords.push( coord );
		this.selectedItem = this.coords.length - 1;
		this.dispatchEvent( { 'type': 'change' } );

	}

	removeHighlight ( n ) {}

	setSelected ( itemOrder ) {

		this.selectedItem = itemOrder;
		this.dispatchEvent( { 'type': 'change' } );

	}

	setImage ( filename, src ) {

		this.filename = filename;
		this.src = src;

		var img = new Image();

		img.onload = function () {

			this.width  = img.naturalWidth;
			this.height = img.naturalHeight;
			this.dispatchEvent( { 'type': 'change' } );
			img = null;

		}.bind( this );

		img.onerror = function () {

			this.filename = '';
			this.src = '';
			this.dispatchEvent( { 'type': 'change' } );
			img = null;

		}.bind( this );

		img.src = this.src;

	}

	setCoords ( order, values ) {

		var x = Math.max( values[ 0 ] );
		var y = Math.max( values[ 1 ] );
		var w = Math.max( values[ 2 ], this.MINIMUM_SIZE() );
		var h = Math.max( values[ 3 ], this.MINIMUM_SIZE() );

		if ( x < 0 ) {

			w = this.coords[ order ][ 2 ];

		}

		if ( x + this.coords[ order ][ 2 ] >= this.width ) {

			w = Math.min( w, this.coords[ order ][ 2 ] );

		}

		if ( y < 0 ) {

			h = this.coords[ order ][ 3 ];

		}

		if ( y + this.coords[ order ][ 3 ] >= this.height ) {

			h = Math.min( h, this.coords[ order ][ 3 ] );

		}

		x = Math.min( x, this.width  - w );
		y = Math.min( y, this.height - h );

		x = Math.max( x, 0 );
		y = Math.max( y, 0 );

		this.coords[ order ][ 0 ] = x | 0;
		this.coords[ order ][ 1 ] = y | 0;
		this.coords[ order ][ 2 ] = w | 0;
		this.coords[ order ][ 3 ] = h | 0;
		this.dispatchEvent( { 'type': 'change' } );

	}

	shiftSelected () {

		if ( this.selectedItem === null ) { return; }
		if ( this.selectedItem === 0 )    { return; }

		var index = this.selectedItem;

		this.coords.splice( index - 1, 2, this.coords[ index ], this.coords[ index - 1 ] );
		this.selectedItem -= 1
		this.dispatchEvent( { 'type': 'change' } );

	}

	unshiftSelected () {

		if ( this.selectedItem === null ) { return; }
		if ( this.selectedItem === this.coords.length - 1 ) { return; }

		var index = this.selectedItem + 1;

		this.coords.splice( index - 1, 2, this.coords[ index ], this.coords[ index - 1 ] );
		this.selectedItem += 1;
		this.dispatchEvent( { 'type': 'change' } );

	}

	deleteSelected () {

		if ( this.selectedItem === null ) { return; }

		this.coords.splice( this.selectedItem, 1 );
		this.selectedItem = null;
		this.dispatchEvent( { 'type': 'change' } );

	}

	setZoom ( val ) {

		this.zoom = val;
		this.dispatchEvent( { 'type': 'change' } );

	}

} );










// Component
class Editor extends React.Component {

	static _onchange () {

		this.setState( {
			filename : model.filename,
			src      : model.src,
			width    : model.width,
			height   : model.height,
			zoom     : model.zoom,
			coords   : model.coords,
			selectedItem: model.selectedItem,
			toolbarFocus: model.toolbarFocus
		} );

	}

	constructor( props, context ) {

		super( props, context );

		this.state = {
			filename : model.filename,
			src      : model.src,
			width    : model.width,
			height   : model.height,
			coords   : model.coords,
			zoom     : model.zoom,
			selectedItem: model.selectedItem,
			toolbarFocus: model.toolbarFocus
		};

	}

	componentDidMount () {

		this.onchange = Editor._onchange.bind( this );
		model.addEventListener( 'change', this.onchange );

	}

	componentWillUnmount() {

		model.removeEventListener( 'change', this.onchange );

	}

	render () {

		var { filename, src, zoom, coords, selectedItem, toolbarFocus } = this.state,
				w = this.state.width,
				h = this.state.height;

		return (
			<div className="EDT-Editor">
				<EditorToolbar filename={ filename } width={ w } height={ h } coords={ coords } selectedItem={ selectedItem } toolbarFocus={ toolbarFocus } />
				<EditorViewport src={ src } width={ w } height={ h } zoom={ zoom } coords={ coords } selectedItem={ selectedItem } />
			</div>
		);

	}

}


class EditorToolbar extends React.Component {

	constructor( props, context ) {

		super( props, context );

		this.state = {
			shiftkey: false
		}

	}

	onvaluechange ( key, e ) {

		if ( model.selectedItem === null ) {

			e.preventDefault();
			return;

		}

		var lookup   = { x: 0, y: 1, w: 2, h: 3 };
		var selected = model.selectedItem;
		var coords   = model.coords[ selected ].concat();

		coords[ lookup[ key ] ] = e.target.value;
		model.setCoords( selected, coords );

	}

	onzoomchange ( e ) {

		model.setZoom( +e.target.value );

	}

	render () {

		var focus    = this.props.toolbarFocus;
		var selected = this.props.selectedItem;
		var url      = ( !!this.props.filename ) ? `${ this.props.filename }?highlight=${ JSON.stringify( this.props.coords ) }` : '';
		var x, y, w, h;

		if ( typeof selected === 'number' ) {

			x = model.coords[ selected ][ 0 ];
			y = model.coords[ selected ][ 1 ];
			w = model.coords[ selected ][ 2 ];
			h = model.coords[ selected ][ 3 ];

		}

		return (
			<div className="EDT-EditorToolbar">
				<div className="EDT-EditorToolbar__inner">
					<div className="EDT-EditorToolbar__row">
						<div className="EDT-EditorToolbar__item">
							<div className="EDT-EditorToolbar__label">
								src
							</div>
							<div className="EDT-EditorToolbar__control">
								<output className="EDT-EditorToolbar__output">{ url }</output>
							</div>
						</div>
					</div>
					<div className="EDT-EditorToolbar__row EDT-EditorToolbar__row--fit-true">
						<div className="EDT-EditorToolbar__item">
							<div className="EDT-EditorToolbar__label">
								label
							</div>
							<div className="EDT-EditorToolbar__control">
								<button className="EDT-EditorToolbar__button"
									onClick={ model.shiftSelected.bind( model ) }
								>
									&lt;&lt;
								</button>
								<output className="EDT-EditorToolbar__output EDT-EditorToolbar__output--xshort">{ selected }</output>
								<button className="EDT-EditorToolbar__button"
									onClick={ model.unshiftSelected.bind( model ) }
								>
									&gt;&gt;
								</button>
							</div>
						</div>
						<div className="EDT-EditorToolbar__item">
							<div className="EDT-EditorToolbar__label">
								x
							</div>
							<div className="EDT-EditorToolbar__control">
								<input className="EDT-EditorToolbar__input" type="number" min="0" max="10000" value={ x }
									onChange={ this.onvaluechange.bind( this, 'x' ) }
								/>
							</div>
						</div>
						<div className="EDT-EditorToolbar__item">
							<div className="EDT-EditorToolbar__label">
								y
							</div>
							<div className="EDT-EditorToolbar__control">
								<input className="EDT-EditorToolbar__input" type="number" min="0" max="10000" value={ y }
									onChange={ this.onvaluechange.bind( this, 'y' ) }
								/>
							</div>
						</div>
						<div className="EDT-EditorToolbar__item">
							<div className="EDT-EditorToolbar__label">
								width
							</div>
							<div className="EDT-EditorToolbar__control">
								<input className="EDT-EditorToolbar__input" type="number" min="0" max="10000" value={ w }
									onChange={ this.onvaluechange.bind( this, 'w' ) }
								/>
							</div>
						</div>
						<div className="EDT-EditorToolbar__item">
							<div className="EDT-EditorToolbar__label">
								height
							</div>
							<div className="EDT-EditorToolbar__control">
								<input className="EDT-EditorToolbar__input" type="number" min="0" max="10000" value={ h }
									onChange={ this.onvaluechange.bind( this, 'h' ) }
								/>
							</div>
						</div>
						<div className="EDT-EditorToolbar__item">
							<div className="EDT-EditorToolbar__control">
								<button className="EDT-EditorToolbar__button"
									onClick={ model.deleteSelected.bind( model ) }
								>
									X
								</button>
							</div>
						</div>
						<div className="EDT-EditorToolbar__item">
							<div className="EDT-EditorToolbar__label">
								zoom
							</div>
							<div className="EDT-EditorToolbar__control">
								<input className="EDT-EditorToolbar__range EDT-EditorToolbar__input--zoom" type="range" step="0.25" min="0.5" max="1.5"
									ref="zoom"
									onChange={ this.onzoomchange }
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);

	}

}


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

		// FIXME
		// 親コンポーネントのSVG要素にアクセスしたいけどどうする？
		// right wey to get parent SVG element?
		var svg = document.querySelector( 'svg' );
		var p   = svg.createSVGPoint();
		p.x = e.x | 0;
		p.y = e.y | 0;
		var svgCoord = p.matrixTransform( svg.getScreenCTM().inverse() );

		var _svgCoordX = svgCoord.x;
		var _svgCoordY = svgCoord.y;
		_svgCoordX = Math.max( _svgCoordX, 0 );
		_svgCoordY = Math.max( _svgCoordY, 0 );
		_svgCoordX = Math.min( _svgCoordX, model.width );
		_svgCoordY = Math.min( _svgCoordY, model.height );

		var prevBox = {
			x: model.coords[ this.props.order ][ 0 ],
			y: model.coords[ this.props.order ][ 1 ],
			w: model.coords[ this.props.order ][ 2 ],
			h: model.coords[ this.props.order ][ 3 ]
		}

		var newBox = {
			x: prevBox.x,
			y: prevBox.y,
			w: prevBox.w,
			h: prevBox.h
		}

		if ( /r/.test( this.draggingEl ) ) {

			newBox.w = Math.max( _svgCoordX - prevBox.x, model.MINIMUM_SIZE() );

		} else if ( /l/.test( this.draggingEl ) ) {

			let left  = _svgCoordX;
			let right = prevBox.w + prevBox.x;
			let maxLeft = right - model.MINIMUM_SIZE();

			newBox.x = Math.min( left, maxLeft );
			newBox.w = prevBox.w + ( prevBox.x - newBox.x );

		}

		if ( /b/.test( this.draggingEl ) ) {

			newBox.h = Math.max( _svgCoordY - prevBox.y, model.MINIMUM_SIZE() );

		} else if ( /t/.test( this.draggingEl ) ) {

			let top    = _svgCoordY;
			let bottom = prevBox.h + prevBox.y;
			let maxTop = bottom - model.MINIMUM_SIZE();

			newBox.y = Math.min( top, maxTop );
			newBox.h = prevBox.h + ( prevBox.y - newBox.y );

		}

		if ( /c/.test( this.draggingEl ) ) {

			newBox.x = _svgCoordX - this._dragStartOffsetX;
			newBox.y = _svgCoordY - this._dragStartOffsetY;

		}

		// model
		model.setCoords( this.props.order, [ newBox.x, newBox.y, newBox.w, newBox.h ] );

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

		var svg = document.querySelector( 'svg' );
		var p   = svg.createSVGPoint();
		p.x = e.nativeEvent.x | 0;
		p.y = e.nativeEvent.y | 0;
		var svgCoord = p.matrixTransform( svg.getScreenCTM().inverse() );

		this._dragStartOffsetX = svgCoord.x - model.coords[ this.props.order ][ 0 ];
		this._dragStartOffsetY = svgCoord.y - model.coords[ this.props.order ][ 1 ];
		this.draggingEl = ref;

		document.body.classList.add( '--dragging' );
		document.removeEventListener( 'mousemove', this.handleDrag );
		document.addEventListener( 'mousemove', this.handleDrag );

	}

	onselect ( e ) {

		model.setSelected( this.props.order );

	}

	render () {

		var { x, y, order, selected } = this.props,
				w = this.props.width,
				h = this.props.height;

		return (
			<g className="EDT-Highlight" aria-selected={ selected } onMouseDown={ this.onselect.bind( this ) }>
				<rect x={ x     } y={ y     } width={ w     } height={ h     } className="EDT-Highlight__fill" />
				<rect x={ x - 2 } y={ y - 2 } width={ w + 4 } height={ h + 4 } className="EDT-Highlight__outline" />
				<text x={ x + 2 } y={ y - 2 } dy={ h - 2 } className="EDT-Highlight__label">{ order }</text>

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



class EditorViewport extends React.Component {

	constructor( props, context ) {

		super( props, context );

	}

	render () {

		var { src, width, height, zoom, coords, selectedItem } = this.props;

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


class EditorCanvas extends React.Component {

	constructor ( props, context ) {

		super( props, context );

	}

	addHighlight ( e ) {

		e.nativeEvent.preventDefault();
		e.nativeEvent.stopPropagation();

		if ( !e.target.classList.contains( 'EDT-EditorCanvas__image' ) ) { return; }

		var svg = document.querySelector( 'svg' );
		var p   = svg.createSVGPoint();
		p.x = e.nativeEvent.x | 0;
		p.y = e.nativeEvent.y | 0;
		var svgCoord = p.matrixTransform( svg.getScreenCTM().inverse() );

		model.addHighlight( [ svgCoord.x, svgCoord.y, 100, 100 ] );

	}

	render () {

		var { src, zoom, coords, selectedItem } = this.props,
				w = this.props.width,
				h = this.props.height,
				viewbox = `0 0 ${ w } ${ h }`;

		return (
			<svg className="EDT-EditorCanvas" width={ w * zoom } height={ h * zoom } viewBox={ viewbox } onClick={ this.addHighlight }>
				<image xlinkHref={ src } width={ w } height={ h } className="EDT-EditorCanvas__image" />

				{ coords.map( function ( coord, i ) {

					var isSelected = ( i === selectedItem );
					return (
						<Highlight key={ i } order={ i } x={ coord[ 0 ] } y={ coord[ 1 ] } width={ coord[ 2 ] } height={ coord[ 3 ] } selected={ isSelected } />
					);

				} ) }

			</svg>
		);

	}

}


class EditorDrop extends React.Component {

	constructor ( props, context ) {

		super( props, context );

	}

	handleDragEnter ( e ) {

		e.preventDefault();
		this.classList.add( 'EDT-EditorDrop--dragging' );

	}

	handleDragLeave ( e ) {

		e.preventDefault();
		this.classList.remove( 'EDT-EditorDrop--dragging' );

	}

	handleDragOver ( e ) { e.preventDefault(); }

	handleDragDrop ( e ) {

		e.preventDefault();

		this.classList.remove( 'EDT-EditorDrop--dragging' );

		// drop an element currently not supported
		// var urlList = e.dataTransfer.getData( 'text/uri-list' );

		// if ( /\.(gif|png|jpg|jpeg|svg)($|\?)/i.test( urlList ) ) {

		// 	console.log( urlList0 );

		// }

		var file = e.dataTransfer.files[ 0 ];

		if ( !/image/.test( file.type ) ) {

			return;

		}

		var reader = new FileReader();

		reader.onload = function ( e ) {

			var src = this.result;
			model.setImage( file.name, src );

		}

		reader.readAsDataURL( file );

	}

	componentDidMount () {

		var dropTarget = this.refs.EditorDrop;
		dropTarget.addEventListener( 'dragenter', this.handleDragEnter );
		dropTarget.addEventListener( 'dragover',  this.handleDragOver );
		dropTarget.addEventListener( 'dragleave', this.handleDragLeave );
		dropTarget.addEventListener( 'drop',      this.handleDragDrop );

	}

	componentWillUnmount () {

		var dropTarget = this.refs.EditorDrop;
		dropTarget.removeEventListener( 'dragenter', this.handleDragEnter );
		dropTarget.removeEventListener( 'dragover',  this.handleDragOver );
		dropTarget.removeEventListener( 'dragleave', this.handleDragLeave );
		dropTarget.removeEventListener( 'drop',      this.handleDragDrop );

	}

	render () {

		return (
			<div className="EDT-EditorDrop" ref="EditorDrop">
				<div className="EDT-EditorDrop__target">
					<svg className="EDT-EditorDrop__icon" width="50" height="43" viewBox="0 0 50 43">
						<path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"></path>
					</svg>
					Drag an image here.
				</div>
			</div>
		);

	}
}


// main
ReactDOM.render(
	<Editor />,
	document.body
);
