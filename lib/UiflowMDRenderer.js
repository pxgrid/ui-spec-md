'use strict';

var marked       = require( 'marked' );
var Viz          = require( 'viz.js' );
var uiflowParser = require( './uiflowParser.js' );

var UiflowMDRenderer = function ( options ) {

  marked.Renderer.call( this );
  this.options = options || {};

}

UiflowMDRenderer.prototype = Object.create( marked.Renderer.prototype );
UiflowMDRenderer.prototype.constructor = UiflowMDRenderer;

UiflowMDRenderer.prototype.code = function ( code, lang, escaped ) {

    if ( lang === 'uiflow' ) {

      var dotCode = uiflowParser( code );
      return `<div class="UISP-dot">${ Viz( dotCode, { format:"svg", engine:"dot" } ) }</div>`;

    }

    if ( lang === 'dot' ) {

      return `<div class="UISP-dot">${ Viz( code, { format:"svg", engine:"dot" } ) }</div>`;

    } else {

      var result = marked.Renderer.prototype.code.call( this, code, lang, escaped );
      return result.replace( /(class=")(lang-)/, '$1line-numbers $2' );

    }

}

module.exports = UiflowMDRenderer;
