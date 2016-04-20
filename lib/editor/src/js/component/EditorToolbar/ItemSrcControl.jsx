const React = require( 'react' );

class ItemSrcControl extends React.Component {

	render () {
		const url = this._getUrl();

		return (
			<div className="EDT-EditorToolbar__item">
				<div className="EDT-EditorToolbar__label">
					src
				</div>
				<div className="EDT-EditorToolbar__control">
					<input
						className="EDT-EditorToolbar__output"
						onClick={ this.selectUrl.bind( this ) }
						readOnly={true} ref="url" value={ url }
					/>
				</div>
				<div className="EDT-EditorToolbar__subControl">
					<button
						className="EDT-EditorToolbar__button"
						onClick={ this.copyUrl.bind( this ) }
					>copy</button>
				</div>
			</div>
		);

	}

	selectUrl () {

		this.refs.url.focus();
		this.refs.url.select();

	}

	copyUrl () {

		this.selectUrl();
		document.execCommand( 'copy' );

	}

	_getUrl () {

		const { filename, coords } = this.props;

		if ( filename.length === 0 ) { return ''; }
		return `${ filename }?highlight=${ JSON.stringify( coords ) }`;

	}

}

module.exports = ItemSrcControl;
