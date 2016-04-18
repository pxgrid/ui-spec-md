// const EventDispatcher = require( './EventDispatcher.js' );
const MINIMUM_SIZE = 20;

const createStore = function ( reducer ) {

	let state;
	let listeners = [];

	const getState = function () {

		return state;

	}

	const dispatch = function ( action ) {

		let result = reducer( state, action );

		if ( result instanceof Promise ) {

			result.then( function ( newState ) {

				state = newState;
				listeners.forEach( function ( listener ) { listener() } );

			} );

		} else {

			state = result;
			listeners.forEach( function ( listener ) { listener() } );

		}

	}

	const subscribe = function ( listener ) {

		listeners.push( listener );

		// return removeEventListener
		return function () {

			listeners = listeners.fister( l => l !== listener );

		}

	}

	dispatch( {} );

	return { getState, dispatch, subscribe }

}


const _initialState = function () {

	let initialState = {
		width        : 300,
		height       : 150,
		src          : '',
		filename     : '',
		coords       : [],
		selectedItem : null,
		zoom         : 1.0
	};

	let url = window.location.search;
	let queries = url.slice( 1 ).split( '&' );

	queries.forEach( function ( query ) {

		let pair = query.split( '=' );
		let key = pair[ 0 ];
		let val = pair[ 1 ];

		if ( key === 'src' ) {

			initialState.src = val;
			initialState.filename = val;

		}

		if ( key === 'highlight' ) {

			initialState.coords = JSON.parse( val );

		}

	} );

	return initialState;

}();

const reducer = function ( state = _initialState, action ) {

	switch ( action.type ) {

		case 'SET_IMAGE': {

			return new Promise( function ( resolve, reject ) {

				let img = new Image();
				let width  = 0;
				let height = 0;
				let filename = action.filename;
				let src      = action.src;

				img.onload = function () {

					width  = img.naturalWidth;
					height = img.naturalHeight;
					img = null;
					resolve( Object.assign( {}, state, { filename, src, width, height } ) );

				};

				img.onerror = function () {

					filename = '';
					src = '';
					width  = 0;
					height = 0;
					img = null;
					resolve( Object.assign( {}, state, { filename, src, width, height } ) );

				};

				img.src = src;

			} );

		}

		case 'SET_COORDS': {

			let order  = action.order;
			let values = action.coord;

			let x = values[ 0 ];
			let y = values[ 1 ];
			let w = Math.max( values[ 2 ], MINIMUM_SIZE );
			let h = Math.max( values[ 3 ], MINIMUM_SIZE );

			if ( x < 0 ) {

				w = state.coords[ order ][ 2 ];

			}

			if ( x + state.coords[ order ][ 2 ] >= state.width ) {

				w = Math.min( w, state.coords[ order ][ 2 ] );

			}

			if ( y < 0 ) {

				h = state.coords[ order ][ 3 ];

			}

			if ( y + state.coords[ order ][ 3 ] >= state.height ) {

				h = Math.min( h, state.coords[ order ][ 3 ] );

			}

			x = Math.min( x, state.width  - w );
			y = Math.min( y, state.height - h );

			x = Math.max( x, 0 );
			y = Math.max( y, 0 );

			// FIXME not deep copied
			let coordsClone = state.coords.concat();

			coordsClone[ order ][ 0 ] = x | 0;
			coordsClone[ order ][ 1 ] = y | 0;
			coordsClone[ order ][ 2 ] = w | 0;
			coordsClone[ order ][ 3 ] = h | 0;

			return Object.assign( {}, state, {
				coords: coordsClone
			} );

		}

		case 'HIGHLIGHT_ADD': {

			// FIXME not deep copied
			let coordsClone = state.coords.concat();
			coordsClone.push( action.coord );

			return Object.assign( {}, state, {
				coords: coordsClone,
				selectedItem: state.coords.length
			} );

		}

		case 'HIGHLIGHT_REMOVE': {

			if ( state.selectedItem === null ) { return state; }

			let coordsClone = state.coords.concat();
			coordsClone.splice( state.selectedItem, 1 );

			return Object.assign( {}, state, {
				coords: coordsClone,
				selectedItem: null
			} );

		}

		case 'HIGHLIGHT_SELECT': {

			return Object.assign( {}, state, {
				selectedItem: action.selectedItem
			} );

		}

		case 'HIGHLIGHT_SHIFT': {

			if ( state.selectedItem === null ) { return state; }
			if ( state.selectedItem === 0 )    { return state; }

			let index = state.selectedItem;
			let coordsClone = state.coords.concat();

			[
				coordsClone[ index ],
				coordsClone[ index - 1 ]
			] = [
				coordsClone[ index - 1 ],
				coordsClone[ index ]
			];

			return Object.assign( {}, state, {
				selectedItem: index - 1,
				coords: coordsClone
			} );

		}

		case 'HIGHLIGHT_UNSHIFT': {

			if ( state.selectedItem === null ) { return state; }
			if ( state.selectedItem === state.coords.length - 1 ) { return state; }

			let index = state.selectedItem + 1;
			let coordsClone = state.coords.concat();

			[
				coordsClone[ index ],
				coordsClone[ index - 1 ]
			] = [
				coordsClone[ index - 1 ],
				coordsClone[ index ]
			];

			return Object.assign( {}, state, {
				selectedItem: index,
				coords: coordsClone
			} );

		}

		case 'ZOOM': {

			return Object.assign( {}, state, {
				zoom: action.zoom
			} );

		}

		default:
			return state;

	}

}

const store = createStore( reducer );






// Component
class Editor extends React.Component {

	static _onchange () {

		let state = this.props.store.getState();
		this.setState( state );

	}

	constructor( props, context ) {

		super( props, context );
		this.state = Object.assign( {}, this.props.store.getState() );
		this.listener = Editor._onchange.bind( this );

	}

	componentDidMount () {

		this.unsubscribe = this.props.store.subscribe( this.listener );

	}

	componentWillUnmount() {

		this.unsubscribe();

	}

	render () {

		let { filename, src, zoom, coords, selectedItem } = this.state,
				w = this.state.width,
				h = this.state.height;

		return (
			<div className="EDT-Editor">
				<EditorToolbar filename={ filename } width={ w } height={ h } coords={ coords } selectedItem={ selectedItem } />
				<EditorViewport src={ src } width={ w } height={ h } zoom={ zoom } coords={ coords } selectedItem={ selectedItem } />
			</div>
		);

	}

}


class EditorToolbar extends React.Component {

	constructor( props, context ) {

		super( props, context );

	}

	onvaluechange ( key, e ) {

		let state = store.getState();

		if ( state.selectedItem === null ) {

			e.preventDefault();
			return;

		}

		let lookup   = { x: 0, y: 1, w: 2, h: 3 };
		let selected = state.selectedItem;
		let coords   = state.coords[ selected ].concat();

		coords[ lookup[ key ] ] = e.target.value;

		store.dispatch( {
			type: 'SET_COORDS',
			order: selected,
			coord: coords
		} );

	}

	onzoomchange ( e ) {

		store.dispatch( {
			type: 'ZOOM',
			zoom: +e.target.value
		} );

	}

	copyUrl ( e ) {

		this.refs.url.focus();
		this.refs.url.select();
		document.execCommand( 'copy' );

	}

	render () {

		let selected = this.props.selectedItem;
		let url      = ( !!this.props.filename ) ? `${ this.props.filename }?highlight=${ JSON.stringify( this.props.coords ) }` : '';
		let x, y, w, h;

		if ( typeof selected === 'number' ) {

			// FIXME
			let state = store.getState();
			x = state.coords[ selected ][ 0 ];
			y = state.coords[ selected ][ 1 ];
			w = state.coords[ selected ][ 2 ];
			h = state.coords[ selected ][ 3 ];

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
								<input className="EDT-EditorToolbar__output" readonly="" ref="url" value={ url } />
							</div>
							<div className="EDT-EditorToolbar__subControl">
								<button className="EDT-EditorToolbar__button" onClick={ this.copyUrl.bind( this ) }>copy</button>
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
									onClick={ function () {
										store.dispatch( { type: 'HIGHLIGHT_SHIFT' } )
									} }
								>
									&lt;&lt;
								</button>
								<output className="EDT-EditorToolbar__output EDT-EditorToolbar__output--xshort">{ selected + 1 }</output>
								<button className="EDT-EditorToolbar__button"
									onClick={ function () {
										store.dispatch( { type: 'HIGHLIGHT_UNSHIFT' } )
									} }
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
									onClick={ function () {
										store.dispatch( { type: 'HIGHLIGHT_REMOVE' } )
									} }
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
			x: state.coords[ this.props.order ][ 0 ],
			y: state.coords[ this.props.order ][ 1 ],
			w: state.coords[ this.props.order ][ 2 ],
			h: state.coords[ this.props.order ][ 3 ]
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

		let state = store.getState();

		let svg = document.querySelector( 'svg' );
		let p   = svg.createSVGPoint();
		p.x = e.nativeEvent.x | 0;
		p.y = e.nativeEvent.y | 0;
		let svgCoord = p.matrixTransform( svg.getScreenCTM().inverse() );

		this._dragStartOffsetX = svgCoord.x - state.coords[ this.props.order ][ 0 ];
		this._dragStartOffsetY = svgCoord.y - state.coords[ this.props.order ][ 1 ];
		this.draggingEl = ref;

		document.body.classList.add( '--dragging' );
		document.removeEventListener( 'mousemove', this.handleDrag );
		document.addEventListener( 'mousemove', this.handleDrag );

	}

	onselect ( e ) {

		let state = store.getState();
		store.dispatch( {
			type: 'HIGHLIGHT_SELECT',
			selectedItem: this.props.order
		} );

	}

	render () {

		let { x, y, order, selected } = this.props,
				w = this.props.width,
				h = this.props.height;

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


class EditorCanvas extends React.Component {

	constructor ( props, context ) {

		super( props, context );

	}

	addHighlight ( e ) {

		e.nativeEvent.preventDefault();
		e.nativeEvent.stopPropagation();

		if ( !e.target.classList.contains( 'EDT-EditorCanvas__image' ) ) { return; }

		// FIXME
		let svg = document.querySelector( 'svg' );
		let p   = svg.createSVGPoint();
		p.x = e.nativeEvent.x | 0;
		p.y = e.nativeEvent.y | 0;
		let svgCoord = p.matrixTransform( svg.getScreenCTM().inverse() );

		// FIXME
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
			<svg className="EDT-EditorCanvas" width={ w * zoom } height={ h * zoom } viewBox={ viewbox } onClick={ this.addHighlight }>
				<image xlinkHref={ src } width={ w } height={ h } className="EDT-EditorCanvas__image" />

				{ coords.map( function ( coord, i ) {

					let isSelected = ( i === selectedItem );
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
		// let urlList = e.dataTransfer.getData( 'text/uri-list' );

		// if ( /\.(gif|png|jpg|jpeg|svg)($|\?)/i.test( urlList ) ) {

		// 	console.log( urlList0 );

		// }

		let file = e.dataTransfer.files[ 0 ];

		if ( !/image/.test( file.type ) ) {

			return;

		}

		let reader = new FileReader();

		reader.onload = function ( e ) {

			let src = this.result;
			store.dispatch( {
				type: 'SET_IMAGE',
				filename: file.name,
				src: src
			} );

		}

		reader.readAsDataURL( file );

	}

	componentDidMount () {

		let dropTarget = this.refs.EditorDrop;
		dropTarget.addEventListener( 'dragenter', this.handleDragEnter );
		dropTarget.addEventListener( 'dragover',  this.handleDragOver );
		dropTarget.addEventListener( 'dragleave', this.handleDragLeave );
		dropTarget.addEventListener( 'drop',      this.handleDragDrop );

	}

	componentWillUnmount () {

		let dropTarget = this.refs.EditorDrop;
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





{
	const state = store.getState();
	store.dispatch( {
		type: 'SET_IMAGE',
		filename: state.filename,
		src: state.src
	} );
}

// main
ReactDOM.render(
	<Editor store={ store } />,
	document.body
);
