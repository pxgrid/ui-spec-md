const React    = require('react');
const ReactDOM = require('react-dom');

const EditorAction = require( './action/Editor' );
const parseInitUrl = require( './util/parseInitUrl' );
const Editor       = require( './component/Editor.jsx' );

// main
const { src, highlight } = parseInitUrl();
EditorAction.initAction( src, highlight );

ReactDOM.render(
	<Editor />,
	document.getElementById( 'app' )
);
