(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var store = require('./store.js');
var EditorToolbar = require('./EditorToolbar.jsx');
var EditorViewport = require('./EditorViewport.jsx');

var Editor = function (_React$Component) {
	_inherits(Editor, _React$Component);

	_createClass(Editor, null, [{
		key: '_onchange',
		value: function _onchange() {

			var state = store.getState();
			this.setState(state);
		}
	}]);

	function Editor(props, context) {
		_classCallCheck(this, Editor);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Editor).call(this, props, context));

		_this.state = store.getState();
		_this.listener = Editor._onchange.bind(_this);

		return _this;
	}

	_createClass(Editor, [{
		key: 'componentDidMount',
		value: function componentDidMount() {

			this.unsubscribe = store.subscribe(this.listener);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {

			this.unsubscribe();
		}
	}, {
		key: 'render',
		value: function render() {
			var _state = this.state;
			var filename = _state.filename;
			var src = _state.src;
			var zoom = _state.zoom;
			var coords = _state.coords;
			var selectedItem = _state.selectedItem;
			var w = this.state.width;
			var h = this.state.height;

			return React.createElement(
				'div',
				{ className: 'EDT-Editor' },
				React.createElement(EditorToolbar, { filename: filename, width: w, height: h, coords: coords, selectedItem: selectedItem }),
				React.createElement(EditorViewport, { src: src, width: w, height: h, zoom: zoom, coords: coords, selectedItem: selectedItem })
			);
		}
	}]);

	return Editor;
}(React.Component);

module.exports = Editor;

},{"./EditorToolbar.jsx":4,"./EditorViewport.jsx":5,"./store.js":9}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var store = require('./store.js');
var Highlight = require('./Highlight.jsx');

var EditorCanvas = function (_React$Component) {
	_inherits(EditorCanvas, _React$Component);

	function EditorCanvas(props, context) {
		_classCallCheck(this, EditorCanvas);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(EditorCanvas).call(this, props, context));
	}

	_createClass(EditorCanvas, [{
		key: 'addHighlight',
		value: function addHighlight(e) {

			e.nativeEvent.preventDefault();
			e.nativeEvent.stopPropagation();

			if (!e.target.classList.contains('EDT-EditorCanvas__image')) {
				return;
			}

			// FIXME
			var svg = document.querySelector('svg');
			var p = svg.createSVGPoint();
			p.x = e.nativeEvent.x | 0;
			p.y = e.nativeEvent.y | 0;
			var svgCoord = p.matrixTransform(svg.getScreenCTM().inverse());

			// FIXME
			store.dispatch({
				type: 'HIGHLIGHT_ADD',
				coord: [svgCoord.x, svgCoord.y, 100, 100]
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _props = this.props;
			var src = _props.src;
			var zoom = _props.zoom;
			var coords = _props.coords;
			var selectedItem = _props.selectedItem;
			var w = this.props.width;
			var h = this.props.height;
			var viewbox = '0 0 ' + w + ' ' + h;

			return React.createElement(
				'svg',
				{ className: 'EDT-EditorCanvas', width: w * zoom, height: h * zoom, viewBox: viewbox, onClick: this.addHighlight },
				React.createElement('image', { xlinkHref: src, width: w, height: h, className: 'EDT-EditorCanvas__image' }),
				coords.map(function (coord, i) {

					var isSelected = i === selectedItem;
					return React.createElement(Highlight, { key: i, order: i, coord: coord, selected: isSelected });
				})
			);
		}
	}]);

	return EditorCanvas;
}(React.Component);

module.exports = EditorCanvas;

},{"./Highlight.jsx":6,"./store.js":9}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var store = require('./store.js');

var EditorDrop = function (_React$Component) {
	_inherits(EditorDrop, _React$Component);

	function EditorDrop(props, context) {
		_classCallCheck(this, EditorDrop);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(EditorDrop).call(this, props, context));
	}

	_createClass(EditorDrop, [{
		key: 'handleDragEnter',
		value: function handleDragEnter(e) {

			e.preventDefault();
			this.classList.add('EDT-EditorDrop--dragging');
		}
	}, {
		key: 'handleDragLeave',
		value: function handleDragLeave(e) {

			e.preventDefault();
			this.classList.remove('EDT-EditorDrop--dragging');
		}
	}, {
		key: 'handleDragOver',
		value: function handleDragOver(e) {
			e.preventDefault();
		}
	}, {
		key: 'handleDragDrop',
		value: function handleDragDrop(e) {

			e.preventDefault();

			this.classList.remove('EDT-EditorDrop--dragging');

			// drop an element currently not supported
			// let urlList = e.dataTransfer.getData( 'text/uri-list' );

			// if ( /\.(gif|png|jpg|jpeg|svg)($|\?)/i.test( urlList ) ) {

			// 	console.log( urlList0 );

			// }

			var file = e.dataTransfer.files[0];

			if (!/image/.test(file.type)) {

				return;
			}

			var reader = new FileReader();

			reader.onload = function (e) {

				var src = this.result;
				store.dispatch({
					type: 'SET_IMAGE',
					filename: file.name,
					src: src
				});
			};

			reader.readAsDataURL(file);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {

			var dropTarget = this.refs.EditorDrop;
			dropTarget.addEventListener('dragenter', this.handleDragEnter);
			dropTarget.addEventListener('dragover', this.handleDragOver);
			dropTarget.addEventListener('dragleave', this.handleDragLeave);
			dropTarget.addEventListener('drop', this.handleDragDrop);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {

			var dropTarget = this.refs.EditorDrop;
			dropTarget.removeEventListener('dragenter', this.handleDragEnter);
			dropTarget.removeEventListener('dragover', this.handleDragOver);
			dropTarget.removeEventListener('dragleave', this.handleDragLeave);
			dropTarget.removeEventListener('drop', this.handleDragDrop);
		}
	}, {
		key: 'render',
		value: function render() {

			return React.createElement(
				'div',
				{ className: 'EDT-EditorDrop', ref: 'EditorDrop' },
				React.createElement(
					'div',
					{ className: 'EDT-EditorDrop__target' },
					React.createElement(
						'svg',
						{ className: 'EDT-EditorDrop__icon', width: '50', height: '43', viewBox: '0 0 50 43' },
						React.createElement('path', { d: 'M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z' })
					),
					'Drag an image here.'
				)
			);
		}
	}]);

	return EditorDrop;
}(React.Component);

module.exports = EditorDrop;

},{"./store.js":9}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var store = require('./store.js');

var EditorToolbar = function (_React$Component) {
	_inherits(EditorToolbar, _React$Component);

	function EditorToolbar(props, context) {
		_classCallCheck(this, EditorToolbar);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(EditorToolbar).call(this, props, context));
	}

	_createClass(EditorToolbar, [{
		key: 'onvaluechange',
		value: function onvaluechange(key, e) {
			var _props = this.props;
			var selectedItem = _props.selectedItem;
			var coords = _props.coords;


			if (selectedItem === null) {

				e.preventDefault();
				return;
			}

			var LOOKUP = { x: 0, y: 1, w: 2, h: 3 };
			var selected = selectedItem;
			var coordsClone = coords[selected].concat();

			coordsClone[LOOKUP[key]] = e.target.value;

			store.dispatch({
				type: 'SET_COORDS',
				order: selected,
				coord: coordsClone
			});
		}
	}, {
		key: 'onzoomchange',
		value: function onzoomchange(e) {

			store.dispatch({
				type: 'ZOOM',
				zoom: +e.target.value
			});
		}
	}, {
		key: 'copyUrl',
		value: function copyUrl(e) {

			this.refs.url.focus();
			this.refs.url.select();
			document.execCommand('copy');
		}
	}, {
		key: 'render',
		value: function render() {
			var _props2 = this.props;
			var selectedItem = _props2.selectedItem;
			var coords = _props2.coords;

			var url = !!this.props.filename ? this.props.filename + '?highlight=' + JSON.stringify(this.props.coords) : '';
			var x = void 0,
			    y = void 0,
			    w = void 0,
			    h = void 0;

			if (typeof selectedItem === 'number') {

				// FIXME
				x = coords[selectedItem][0];
				y = coords[selectedItem][1];
				w = coords[selectedItem][2];
				h = coords[selectedItem][3];
			}

			return React.createElement(
				'div',
				{ className: 'EDT-EditorToolbar' },
				React.createElement(
					'div',
					{ className: 'EDT-EditorToolbar__inner' },
					React.createElement(
						'div',
						{ className: 'EDT-EditorToolbar__row' },
						React.createElement(
							'div',
							{ className: 'EDT-EditorToolbar__item' },
							React.createElement(
								'div',
								{ className: 'EDT-EditorToolbar__label' },
								'src'
							),
							React.createElement(
								'div',
								{ className: 'EDT-EditorToolbar__control' },
								React.createElement('input', { className: 'EDT-EditorToolbar__output', readonly: '', ref: 'url', value: url })
							),
							React.createElement(
								'div',
								{ className: 'EDT-EditorToolbar__subControl' },
								React.createElement(
									'button',
									{ className: 'EDT-EditorToolbar__button', onClick: this.copyUrl.bind(this) },
									'copy'
								)
							)
						)
					),
					React.createElement(
						'div',
						{ className: 'EDT-EditorToolbar__row EDT-EditorToolbar__row--fit-true' },
						React.createElement(
							'div',
							{ className: 'EDT-EditorToolbar__item' },
							React.createElement(
								'div',
								{ className: 'EDT-EditorToolbar__label' },
								'label'
							),
							React.createElement(
								'div',
								{ className: 'EDT-EditorToolbar__control' },
								React.createElement(
									'button',
									{ className: 'EDT-EditorToolbar__button',
										onClick: function onClick() {
											store.dispatch({ type: 'HIGHLIGHT_SHIFT' });
										}
									},
									'<<'
								),
								React.createElement(
									'output',
									{ className: 'EDT-EditorToolbar__output EDT-EditorToolbar__output--xshort' },
									selectedItem + 1
								),
								React.createElement(
									'button',
									{ className: 'EDT-EditorToolbar__button',
										onClick: function onClick() {
											store.dispatch({ type: 'HIGHLIGHT_UNSHIFT' });
										}
									},
									'>>'
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'EDT-EditorToolbar__item' },
							React.createElement(
								'div',
								{ className: 'EDT-EditorToolbar__label' },
								'x'
							),
							React.createElement(
								'div',
								{ className: 'EDT-EditorToolbar__control' },
								React.createElement('input', { className: 'EDT-EditorToolbar__input', type: 'number', min: '0', max: '10000', value: x,
									onChange: this.onvaluechange.bind(this, 'x')
								})
							)
						),
						React.createElement(
							'div',
							{ className: 'EDT-EditorToolbar__item' },
							React.createElement(
								'div',
								{ className: 'EDT-EditorToolbar__label' },
								'y'
							),
							React.createElement(
								'div',
								{ className: 'EDT-EditorToolbar__control' },
								React.createElement('input', { className: 'EDT-EditorToolbar__input', type: 'number', min: '0', max: '10000', value: y,
									onChange: this.onvaluechange.bind(this, 'y')
								})
							)
						),
						React.createElement(
							'div',
							{ className: 'EDT-EditorToolbar__item' },
							React.createElement(
								'div',
								{ className: 'EDT-EditorToolbar__label' },
								'width'
							),
							React.createElement(
								'div',
								{ className: 'EDT-EditorToolbar__control' },
								React.createElement('input', { className: 'EDT-EditorToolbar__input', type: 'number', min: '0', max: '10000', value: w,
									onChange: this.onvaluechange.bind(this, 'w')
								})
							)
						),
						React.createElement(
							'div',
							{ className: 'EDT-EditorToolbar__item' },
							React.createElement(
								'div',
								{ className: 'EDT-EditorToolbar__label' },
								'height'
							),
							React.createElement(
								'div',
								{ className: 'EDT-EditorToolbar__control' },
								React.createElement('input', { className: 'EDT-EditorToolbar__input', type: 'number', min: '0', max: '10000', value: h,
									onChange: this.onvaluechange.bind(this, 'h')
								})
							)
						),
						React.createElement(
							'div',
							{ className: 'EDT-EditorToolbar__item' },
							React.createElement(
								'div',
								{ className: 'EDT-EditorToolbar__control' },
								React.createElement(
									'button',
									{ className: 'EDT-EditorToolbar__button',
										onClick: function onClick() {
											store.dispatch({ type: 'HIGHLIGHT_REMOVE' });
										}
									},
									'X'
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'EDT-EditorToolbar__item' },
							React.createElement(
								'div',
								{ className: 'EDT-EditorToolbar__label' },
								'zoom'
							),
							React.createElement(
								'div',
								{ className: 'EDT-EditorToolbar__control' },
								React.createElement('input', { className: 'EDT-EditorToolbar__range EDT-EditorToolbar__input--zoom', type: 'range', step: '0.25', min: '0.5', max: '1.5',
									ref: 'zoom',
									onChange: this.onzoomchange
								})
							)
						)
					)
				)
			);
		}
	}]);

	return EditorToolbar;
}(React.Component);

module.exports = EditorToolbar;

},{"./store.js":9}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditorCanvas = require('./EditorCanvas.jsx');
var EditorDrop = require('./EditorDrop.jsx');

var EditorViewport = function (_React$Component) {
	_inherits(EditorViewport, _React$Component);

	function EditorViewport(props, context) {
		_classCallCheck(this, EditorViewport);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(EditorViewport).call(this, props, context));
	}

	_createClass(EditorViewport, [{
		key: 'render',
		value: function render() {
			var _props = this.props;
			var src = _props.src;
			var width = _props.width;
			var height = _props.height;
			var zoom = _props.zoom;
			var coords = _props.coords;
			var selectedItem = _props.selectedItem;


			return React.createElement(
				'div',
				{ className: 'EDT-EditorViewport' },
				React.createElement(
					'div',
					{ className: 'EDT-EditorViewport__inner' },
					React.createElement(
						'div',
						{ className: 'EDT-EditorViewport__inner2' },
						function () {

							if (!!src) {
								return React.createElement(EditorCanvas, { src: src, width: width, height: height, zoom: zoom, coords: coords, selectedItem: selectedItem });
							} else {
								return React.createElement(EditorDrop, null);
							}
						}.bind(this)()
					)
				)
			);
		}
	}]);

	return EditorViewport;
}(React.Component);

module.exports = EditorViewport;

},{"./EditorCanvas.jsx":2,"./EditorDrop.jsx":3}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var store = require('./store.js');
var MINIMUM_SIZE = 20;

var Highlight = function (_React$Component) {
	_inherits(Highlight, _React$Component);

	_createClass(Highlight, null, [{
		key: '_dragEnd',


		// FIXME
		// イベントでthisをバインドしたいけどこれでいいの？
		value: function _dragEnd(e) {

			this.draggingEl = null;
			this._dragStartOffsetX = null;
			this._dragStartOffsetY = null;
			document.body.classList.remove('--dragging');
			document.removeEventListener('mousemove', this.handleDrag);
		}
	}, {
		key: '_handleDrag',
		value: function _handleDrag(e) {

			var state = store.getState();

			// FIXME
			// 親コンポーネントのSVG要素にアクセスしたいけどどうする？
			// right wey to get parent SVG element?
			var svg = document.querySelector('svg');
			var p = svg.createSVGPoint();
			p.x = e.x | 0;
			p.y = e.y | 0;
			var svgCoord = p.matrixTransform(svg.getScreenCTM().inverse());

			var _svgCoordX = svgCoord.x;
			var _svgCoordY = svgCoord.y;
			_svgCoordX = Math.max(_svgCoordX, 0);
			_svgCoordY = Math.max(_svgCoordY, 0);
			_svgCoordX = Math.min(_svgCoordX, state.width);
			_svgCoordY = Math.min(_svgCoordY, state.height);

			var prevBox = {
				x: this.props.coord[0],
				y: this.props.coord[1],
				w: this.props.coord[2],
				h: this.props.coord[3]
			};

			var newBox = {
				x: prevBox.x,
				y: prevBox.y,
				w: prevBox.w,
				h: prevBox.h
			};

			if (/r/.test(this.draggingEl)) {

				newBox.w = Math.max(_svgCoordX - prevBox.x, MINIMUM_SIZE);
			} else if (/l/.test(this.draggingEl)) {

				var left = _svgCoordX;
				var right = prevBox.w + prevBox.x;
				var maxLeft = right - MINIMUM_SIZE;

				newBox.x = Math.min(left, maxLeft);
				newBox.w = prevBox.w + (prevBox.x - newBox.x);
			}

			if (/b/.test(this.draggingEl)) {

				newBox.h = Math.max(_svgCoordY - prevBox.y, MINIMUM_SIZE);
			} else if (/t/.test(this.draggingEl)) {

				var top = _svgCoordY;
				var bottom = prevBox.h + prevBox.y;
				var maxTop = bottom - MINIMUM_SIZE;

				newBox.y = Math.min(top, maxTop);
				newBox.h = prevBox.h + (prevBox.y - newBox.y);
			}

			if (/c/.test(this.draggingEl)) {

				newBox.x = _svgCoordX - this._dragStartOffsetX;
				newBox.y = _svgCoordY - this._dragStartOffsetY;
			}

			store.dispatch({
				type: 'SET_COORDS',
				order: this.props.order,
				coord: [newBox.x, newBox.y, newBox.w, newBox.h]
			});
		}
	}]);

	function Highlight(props, context) {
		_classCallCheck(this, Highlight);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Highlight).call(this, props, context));
	}

	_createClass(Highlight, [{
		key: 'componentDidMount',
		value: function componentDidMount() {

			this.handleDrag = Highlight._handleDrag.bind(this);
			this.dragEnd = Highlight._dragEnd.bind(this);
			this.draggingEl = null;
			document.addEventListener('mouseup', this.dragEnd);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {

			document.removeEventListener('mouseup', this.dragEnd);
		}
	}, {
		key: 'dragStart',
		value: function dragStart(ref, e) {

			// e.nativeEvent.preventDefault();
			e.nativeEvent.stopPropagation();

			var svg = document.querySelector('svg');
			var p = svg.createSVGPoint();
			p.x = e.nativeEvent.x | 0;
			p.y = e.nativeEvent.y | 0;
			var svgCoord = p.matrixTransform(svg.getScreenCTM().inverse());

			this._dragStartOffsetX = svgCoord.x - this.props.coord[0];
			this._dragStartOffsetY = svgCoord.y - this.props.coord[1];
			this.draggingEl = ref;

			document.body.classList.add('--dragging');
			document.removeEventListener('mousemove', this.handleDrag);
			document.addEventListener('mousemove', this.handleDrag);
		}
	}, {
		key: 'onselect',
		value: function onselect(e) {

			store.dispatch({
				type: 'HIGHLIGHT_SELECT',
				selectedItem: this.props.order
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _props = this.props;
			var order = _props.order;
			var coord = _props.coord;
			var selected = _props.selected;
			var x = coord[0];
			var y = coord[1];
			var w = coord[2];
			var h = coord[3];

			return React.createElement(
				'g',
				{ className: 'EDT-Highlight', 'aria-selected': selected, onMouseDown: this.onselect.bind(this) },
				React.createElement('rect', { x: x, y: y, width: w, height: h, className: 'EDT-Highlight__fill' }),
				React.createElement('rect', { x: x - 2, y: y - 2, width: w + 4, height: h + 4, className: 'EDT-Highlight__outline' }),
				React.createElement(
					'text',
					{ x: x + 2, y: y - 2, dy: h - 2, className: 'EDT-Highlight__label' },
					order + 1
				),
				React.createElement('rect', { x: x, y: y, width: w, height: h, className: 'EDT-Highlight__clickableArea',
					ref: 'c',
					onMouseDown: this.dragStart.bind(this, 'c')
				}),
				React.createElement('rect', { x: x - 5 + w * 0.5, y: y - 5, width: '10', height: '10', className: 'EDT-Highlight__ctrl EDT-Highlight__ctrl--t',
					ref: 't',
					onMouseDown: this.dragStart.bind(this, 't')
				}),
				React.createElement('rect', { x: x - 5 + w, y: y - 5 + h * 0.5, width: '10', height: '10', className: 'EDT-Highlight__ctrl EDT-Highlight__ctrl--r',
					ref: 'r',
					onMouseDown: this.dragStart.bind(this, 'r')
				}),
				React.createElement('rect', { x: x - 5 + w * 0.5, y: y - 5 + h, width: '10', height: '10', className: 'EDT-Highlight__ctrl EDT-Highlight__ctrl--b',
					ref: 'b',
					onMouseDown: this.dragStart.bind(this, 'b')
				}),
				React.createElement('rect', { x: x - 5, y: y - 5 + h * 0.5, width: '10', height: '10', className: 'EDT-Highlight__ctrl EDT-Highlight__ctrl--l',
					ref: 'l',
					onMouseDown: this.dragStart.bind(this, 'l')
				}),
				React.createElement('circle', { cx: x, cy: y, r: '10', className: 'EDT-Highlight__ctrl EDT-Highlight__ctrl--tl',
					ref: 'tl',
					onMouseDown: this.dragStart.bind(this, 'tl')
				}),
				React.createElement('circle', { cx: x + w, cy: y, r: '10', className: 'EDT-Highlight__ctrl EDT-Highlight__ctrl--tr',
					ref: 'tr',
					onMouseDown: this.dragStart.bind(this, 'tr')
				}),
				React.createElement('circle', { cx: x + w, cy: y + h, r: '10', className: 'EDT-Highlight__ctrl EDT-Highlight__ctrl--br',
					ref: 'br',
					onMouseDown: this.dragStart.bind(this, 'br')
				}),
				React.createElement('circle', { cx: x, cy: y + h, r: '10', className: 'EDT-Highlight__ctrl EDT-Highlight__ctrl--bl',
					ref: 'bl',
					onMouseDown: this.dragStart.bind(this, 'bl')
				})
			);
		}
	}]);

	return Highlight;
}(React.Component);

module.exports = Highlight;

},{"./store.js":9}],7:[function(require,module,exports){
"use strict";

var createStore = function createStore(reducer) {

	var state = void 0;
	var listeners = [];

	var getState = function getState() {

		return state;
	};

	var dispatch = function dispatch(action) {

		var result = reducer(state, action);

		if (result instanceof Promise) {

			result.then(function (newState) {

				state = newState;
				listeners.forEach(function (listener) {
					listener();
				});
			});
		} else {

			state = result;
			listeners.forEach(function (listener) {
				listener();
			});
		}
	};

	var subscribe = function subscribe(listener) {

		listeners.push(listener);

		// return removeEventListener
		return function () {

			listeners = listeners.fister(function (l) {
				return l !== listener;
			});
		};
	};

	dispatch({});

	return { getState: getState, dispatch: dispatch, subscribe: subscribe };
};

module.exports = createStore;

},{}],8:[function(require,module,exports){
'use strict';

var store = require('./store.js');
var Editor = require('./Editor.jsx');

// main
{
	var state = store.getState();
	store.dispatch({
		type: 'SET_IMAGE',
		filename: state.filename,
		src: state.src
	});
}

ReactDOM.render(React.createElement(Editor, null), document.body);

},{"./Editor.jsx":1,"./store.js":9}],9:[function(require,module,exports){
'use strict';

var createStore = require('./createStore.js');
var MINIMUM_SIZE = 20;

var _initialState = function () {

	var initialState = {
		width: 300,
		height: 150,
		src: '',
		filename: '',
		coords: [],
		selectedItem: null,
		zoom: 1.0
	};

	var url = window.location.search;
	var queries = url.slice(1).split('&');

	queries.forEach(function (query) {

		var pair = query.split('=');
		var key = pair[0];
		var val = pair[1];

		if (key === 'src') {

			initialState.src = val;
			initialState.filename = val;
		}

		if (key === 'highlight') {

			initialState.coords = JSON.parse(val);
		}
	});

	return initialState;
}();

var reducer = function reducer() {
	var state = arguments.length <= 0 || arguments[0] === undefined ? _initialState : arguments[0];
	var action = arguments[1];


	switch (action.type) {

		case 'SET_IMAGE':
			{

				return new Promise(function (resolve, reject) {

					var img = new Image();
					var width = 0;
					var height = 0;
					var filename = action.filename;
					var src = action.src;

					img.onload = function () {

						width = img.naturalWidth;
						height = img.naturalHeight;
						img = null;
						resolve(Object.assign({}, state, { filename: filename, src: src, width: width, height: height }));
					};

					img.onerror = function () {

						filename = '';
						src = '';
						width = 0;
						height = 0;
						img = null;
						resolve(Object.assign({}, state, { filename: filename, src: src, width: width, height: height }));
					};

					img.src = src;
				});
			}

		case 'SET_COORDS':
			{

				var order = action.order;
				var values = action.coord;

				var x = values[0];
				var y = values[1];
				var w = Math.max(values[2], MINIMUM_SIZE);
				var h = Math.max(values[3], MINIMUM_SIZE);

				if (x < 0) {

					w = state.coords[order][2];
				}

				if (x + state.coords[order][2] >= state.width) {

					w = Math.min(w, state.coords[order][2]);
				}

				if (y < 0) {

					h = state.coords[order][3];
				}

				if (y + state.coords[order][3] >= state.height) {

					h = Math.min(h, state.coords[order][3]);
				}

				x = Math.min(x, state.width - w);
				y = Math.min(y, state.height - h);

				x = Math.max(x, 0);
				y = Math.max(y, 0);

				// FIXME not deep copied
				var coordsClone = state.coords.concat();

				coordsClone[order][0] = x | 0;
				coordsClone[order][1] = y | 0;
				coordsClone[order][2] = w | 0;
				coordsClone[order][3] = h | 0;

				return Object.assign({}, state, {
					coords: coordsClone
				});
			}

		case 'HIGHLIGHT_ADD':
			{

				var _coordsClone = state.coords.concat();
				_coordsClone.push(action.coord);

				return Object.assign({}, state, {
					coords: _coordsClone,
					selectedItem: state.coords.length
				});
			}

		case 'HIGHLIGHT_REMOVE':
			{

				if (state.selectedItem === null) {
					return state;
				}

				var _coordsClone2 = state.coords.concat();
				_coordsClone2.splice(state.selectedItem, 1);

				return Object.assign({}, state, {
					coords: _coordsClone2,
					selectedItem: null
				});
			}

		case 'HIGHLIGHT_SELECT':
			{

				return Object.assign({}, state, {
					selectedItem: action.selectedItem
				});
			}

		case 'HIGHLIGHT_SHIFT':
			{

				if (state.selectedItem === null) {
					return state;
				}
				if (state.selectedItem === 0) {
					return state;
				}

				var index = state.selectedItem;
				var _coordsClone3 = state.coords.concat();

				var _ref = [_coordsClone3[index - 1], _coordsClone3[index]];
				_coordsClone3[index] = _ref[0];
				_coordsClone3[index - 1] = _ref[1];


				return Object.assign({}, state, {
					selectedItem: index - 1,
					coords: _coordsClone3
				});
			}

		case 'HIGHLIGHT_UNSHIFT':
			{

				if (state.selectedItem === null) {
					return state;
				}
				if (state.selectedItem === state.coords.length - 1) {
					return state;
				}

				var _index = state.selectedItem + 1;
				var _coordsClone4 = state.coords.concat();

				var _ref2 = [_coordsClone4[_index - 1], _coordsClone4[_index]];
				_coordsClone4[_index] = _ref2[0];
				_coordsClone4[_index - 1] = _ref2[1];


				return Object.assign({}, state, {
					selectedItem: _index,
					coords: _coordsClone4
				});
			}

		case 'ZOOM':
			{

				return Object.assign({}, state, {
					zoom: action.zoom
				});
			}

		default:
			return state;

	}
};

module.exports = createStore(reducer);

},{"./createStore.js":7}]},{},[8]);
