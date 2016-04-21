document.addEventListener( 'DOMContentLoaded', function () {

	var state = {
		zoom: 100 | 0,
		fit: true,
		highlight: true
	}

	var ZOOM_MAX = 200;
	var ZOOM_MIN = 25;

	var $container = document.querySelector( '.UISP-Screen' );
	var $zoomin  = document.querySelector( 'button[data-UISP-tool="zoomin"]' );
	var $zoomout = document.querySelector( 'button[data-UISP-tool="zoomout"]' );
	var $zoomval = document.querySelector( 'output[data-UISP-tool="zoomval"]' );
	var $svgRoot = document.querySelector( '.UISP-Screen__svgRoot' );
	var captureSrc = $svgRoot.querySelector( 'image.UISP-Screen__image' ).getAttribute( 'xlink:href' ).replace( /\?/, '&' );
	var svgSize = {
		width : $svgRoot.getAttribute( 'width' ),
		height: $svgRoot.getAttribute( 'height' )
	}

	var render = function () {

		var MODIFIER = {
			FIT       : 'UISP-Screen--fit',
			HIGHLIGHT : 'UISP-Screen--highlight',
			DISABLED  : 'UISP-Doc__screenTool--disabled'
		}

		return function () {

			if ( state.fit )       { $container.classList.add( MODIFIER.FIT ); }
			else                   { $container.classList.remove( MODIFIER.FIT ); }

			if ( state.highlight ) { $container.classList.add( MODIFIER.HIGHLIGHT ); }
			else                   { $container.classList.remove( MODIFIER.HIGHLIGHT ); }

			// zoom
			if ( !state.fit ) {

				$zoomval.classList.remove( MODIFIER.DISABLED );
				$zoomin.classList.remove( MODIFIER.DISABLED );
				$zoomout.classList.remove( MODIFIER.DISABLED );
				$svgRoot.style.width  = svgSize.width  * state.zoom * 0.01;
				$svgRoot.style.height = svgSize.height * state.zoom * 0.01;
				$zoomval.innerHTML = state.zoom;

				if      ( state.zoom >= ZOOM_MAX ) { $zoomin.classList.add( MODIFIER.DISABLED ); }
				else if ( state.zoom <= ZOOM_MIN ) { $zoomout.classList.add( MODIFIER.DISABLED ); }

			} else {

				$zoomval.classList.add( MODIFIER.DISABLED );
				$zoomin.classList.add( MODIFIER.DISABLED );
				$zoomout.classList.add( MODIFIER.DISABLED );
				$svgRoot.removeAttribute( 'style' );
				$zoomval.innerHTML = '';

			}

		}

	}();

	render();

	document.querySelector( 'button[data-UISP-tool="fit"]').addEventListener( 'click', function () {

		state.fit = !state.fit;
		render();

	} );


	document.querySelector( 'button[data-UISP-tool="highlight"]').addEventListener( 'click', function () {

		state.highlight = !state.highlight;
		render();

	} );


	$zoomin.addEventListener( 'click', function () {

		state.zoom = Math.min( state.zoom + 25, ZOOM_MAX ) | 0;
		render();

	} );

	$zoomout.addEventListener( 'click', function () {

		state.zoom = Math.max( state.zoom - 25, ZOOM_MIN ) | 0;
		render();

	} );


	document.querySelector( 'button[data-UISP-tool="editor"]').addEventListener( 'click', function () {

		window.open( `./_editor.html?src=${ captureSrc }`, 'EDT-Editor' );

	} );

} );



document.addEventListener( 'DOMContentLoaded', function () {

	var $body = document.body;
	var $el   = document.querySelector( '.UISP' );
	var $sep  = $el.querySelector( '.UISP-Separator' );
	var $left  = $el.querySelector( '.UISP-Doc__screen' );
	var $right = $el.querySelector( '.UISP-Doc__mdContent' );
	var left   = sessionStorage.getItem( 'left' ) || 0.5;

	var setLeft = function ( left ) {

		$sep.style.left    = `${ left * 100 }%`;
		$left.style.width  = `${ left * 100 }%`;
		$right.style.width = `${ ( 1 - left ) * 100 }%`;
		sessionStorage.setItem( 'left', left );

	}

	var dragging = function ( e ) {

		var screenWidth = window.innerWidth;
		var left = Math.min( Math.max( e.x / screenWidth, 0.2 ), 0.8 );
		setLeft( left );

	}

	setLeft( left );

	$sep.addEventListener( 'mousedown', function () {

		$body.addEventListener( 'mousemove', dragging );
		$el.classList.add( 'UISP--dragging-true' );

	} );


	$body.addEventListener( 'mouseup', function () {

		$body.removeEventListener( 'mousemove', dragging );
		$el.classList.remove( 'UISP--dragging-true' );

	} );

} );
