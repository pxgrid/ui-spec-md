const React = require( 'react' );
const store = require( './store.js' );

class EditorDrop extends React.Component {

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

		reader.onload = function () {

			let src = this.result;
			store.dispatch( {
				type: 'SET_IMAGE',
				filename: file.name,
				src: src
			} );

		};

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

module.exports = EditorDrop;
