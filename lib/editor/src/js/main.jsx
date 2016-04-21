const React    = require('react');
const ReactDOM = require('react-dom');

const EditorAction    = require( './action/Editor' );
const HighlightAction = require( './action/Highlight' );

const parseInitUrl = require( './util/parseInitUrl' );
const Editor       = require( './component/Editor.jsx' );

// main
const { src, highlight } = parseInitUrl();
EditorAction.initAction( src, highlight );

// 他にも増えたらどっか動かす
document.addEventListener( 'keydown' , ( e ) => {

	if ( e.keyCode === 8 ) {
		e.preventDefault();
		HighlightAction.removeAction();
	}

}, false);

ReactDOM.render(
	<Editor />,
	document.getElementById( 'app' )
);
