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
