// index 絞り込み
document.addEventListener( 'DOMContentLoaded', function () {

	var $input = document.getElementById( 'UISP-Index__searchInput' );
	var $items = document.querySelectorAll( '.UISP-Index__listItem' );

	if ( !$input ) { return; }

	var collection = [];
	var render = function () {

		collection.forEach( function ( item, i ) {

			$items[ i ].setAttribute( 'aria-hidden', !item.isVisible );

		} );

	}

	Array.prototype.forEach.call( $items, function ( $item, i ) {

		var text = $item.querySelector( '.UISP-Index__itemTitle' ).textContent
		           .replace( /(^\s+|\s+$)/g, '' );
		collection.push( {
			text: text,
			isVisible: true
		} );

	} );

	$input.addEventListener( 'keyup', function ( e ) {

		if ( /^\s+$/.test( $input.value ) ) {

			collection.forEach( function ( item, i ) {

				// set showAll
				item.isVisible = true;

			} );

			render();
			return;

		}

		var pattern = new RegExp( $input.value );

		collection.forEach( function ( item, i ) {

			 item.isVisible = pattern.test( item.text );

		} );

		render();
		return;

	} );

} );
