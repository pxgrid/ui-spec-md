document.addEventListener( 'DOMContentLoaded', function () {

	var $container = document.querySelector( '.UISP-captureContainer' );
	var modifierZoom = 'UISP-captureContainer--zoom-true';
	var modifierHide = 'UISP-captureContainer--annotation-false';
	var captureSrc = $container.querySelector( 'image.UISP-svgimage' ).getAttribute( 'xlink:href' ).replace( /\?/, '&' );

	document.querySelector( 'button[data-UISP-button="zoom"]').addEventListener( 'click', function () {

		$container.classList.toggle( modifierZoom );

	} );


	document.querySelector( 'button[data-UISP-button="hide"]').addEventListener( 'click', function () {

		$container.classList.toggle( modifierHide );

	} );

	document.querySelector( 'button[data-UISP-button="editor"]').addEventListener( 'click', function () {

		window.open( `./_editor.html?src=${ captureSrc }`, 'UISP-Editor' );

	} );

} );

document.addEventListener( 'DOMContentLoaded', function () {

	var $body = document.body;
	var $el   = document.querySelector( '.UISP' );
	var $sep  = $el.querySelector( '.UISP-separator' );
	var $left  = $el.querySelector( '.UISP-header__inner' );
	var $right = $el.querySelector( '.UISP-mdContainer__inner' );
	var left   = sessionStorage.getItem( 'left' ) || 0.5;

	var setLeft = function ( left ) {

		$sep.style.left   = `${ left * 100 }%`;
		$left.style.width = `${ left * 100 }%`;
		$right.style.left = `${ left * 100 }%`;
		sessionStorage.setItem( 'left', left );

	}

	var dragging = function ( e ) {

		var screenWidth = window.innerWidth;
		setLeft( e.x / screenWidth );

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
