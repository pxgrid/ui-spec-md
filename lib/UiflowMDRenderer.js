/*!
 * markedのカスタムレンダラー。
 *  - hn要素で日本語文字列等を可に
 *  - codeブロックを拡張し、langが `uiflow` か `dot` なら専用のレンダリングを行うようにする。
 */
'use strict';

const marked       = require( 'marked' );
const Viz          = require( 'viz.js' );
const uiflowParser = require( './uiflowParser.js' );

const UiflowMDRenderer = function ( options ) {

	marked.Renderer.call( this );
	this.options = options || {};

}

UiflowMDRenderer.prototype = Object.create( marked.Renderer.prototype );
UiflowMDRenderer.prototype.constructor = UiflowMDRenderer;


/**
 * hn要素のレンダリング
 *
 * @param {string} text
 * @param {number} level
 * @return {string} HTML string
 */
UiflowMDRenderer.prototype.heading = function (text, level) {

	let tagName = 'h' + level;

	// デフォルトのルールだと、`text.toLowerCase().replace(/[^\w]+/g, '-')` で、
	// 日本語が使えない。
	// id属性値の仕様よりも、使いやすさを優先し、`/[\s"]/` 以外は置換しない。
	let id = text.replace(/[\s"]/g, '-');

	return '<' + tagName + ' id="' + id + '">' + text + '</' + tagName + '>';

};



/**
 * code要素のレンダリング
 *
 * @param {string} code
 * @param {string} lang
 * @param {}       escaped
 *   https://github.com/chjj/marked#block-level-renderer-methods を見ると、
 *   codeは第2引数までしか取らないので謎。
 */
UiflowMDRenderer.prototype.code = function ( code, lang, escaped ) {

	const vizScraps = /^<\?xml version="1.0" encoding="UTF-8" standalone="no"\?>\n<!DOCTYPE svg PUBLIC "-\/\/W3C\/\/DTD SVG 1.1\/\/EN"\n "http:\/\/www.w3.org\/Graphics\/SVG\/1.1\/DTD\/svg11.dtd">/;

	if ( lang === 'uiflow' ) {

		let dotCode = uiflowParser( code );

		return `<div class="UISP-Dot">${ Viz( dotCode, { format:"svg", engine:"dot" } ).replace( vizScraps, '' ) }</div>`;

	}

	if ( lang === 'dot' ) {

		return `<div class="UISP-Dot">${ Viz( code, { format:"svg", engine:"dot" } ).replace( vizScraps, '' ) }</div>`;

	} else {

		let result = marked.Renderer.prototype.code.call( this, code, lang, escaped );
		return result.replace( /(class=")(lang-)/, '$1line-numbers $2' );

	}

}

module.exports = UiflowMDRenderer;
