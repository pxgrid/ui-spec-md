'use strict';

var postcss      = require( 'gulp-postcss' );
var autoprefixer = require( 'autoprefixer' );
var gulp         = require( 'gulp' );
var concat       = require( 'gulp-concat' );
var consolidate  = require( 'gulp-consolidate' );
var iconfont     = require( 'gulp-iconfont' );
var rename       = require( 'gulp-rename' );
var sass         = require( 'gulp-sass' );

var AUTOPREFIXER_BROWSERS = {
  browsers: [
    'ie >= 9',
    'safari >= 7',
    'ios >= 7',
    'android >= 4'
  ]
};

gulp.task( 'html', function () {

	return gulp.src( './src/_template.html' )
	       .pipe( gulp.dest( './build/' ) );

} );

gulp.task( 'js', function () {

	return gulp.src( [
	        './src/js/template.js',
	        './src/js/prism.custom.js'
	       ] )
	       .pipe( concat( '_template.js' ) )
	       .pipe( gulp.dest( './build/_template/' ) );

} );

gulp.task( 'sass', function () {

	var processors = [
		autoprefixer( AUTOPREFIXER_BROWSERS )
	];

	return gulp.src( './src/scss/template.scss' )
	       .pipe( sass() )
	       .pipe( postcss( processors ) )
	       .pipe( rename( { basename: '_template' } ) )
	       .pipe( gulp.dest( './build/_template/' ) );

} );

gulp.task( 'iconfont', function () {

	var fontName = '_template';

	return gulp.src( [ './src/icons/*.svg' ] )
	.pipe( iconfont( {
		fontName: fontName,
		formats: [ 'woff' ],
		appendCodepoints: true
	} ) )
	.on( 'glyphs', function( glyphs, options ) {

		gulp.src( './src/icons/_icon.scss' )
		.pipe( consolidate( 'ejs', {
			glyphs: glyphs,
			fontName: fontName,
			fontPath: './',
			prefix: 'UISP-Icon'
		} ) )
		.pipe( gulp.dest( './src/scss/' ) );

	} )
	.pipe( gulp.dest( './build/_template/' ) );

} );

gulp.task( 'watch', function () {

	gulp.watch( './src/js/*.js', [ 'js' ] );
	gulp.watch( './src/scss/*.scss', [ 'sass' ] );

} );

gulp.task( 'build', [ 'html', 'js', 'sass' ] );
gulp.task( 'default', [ 'build', 'watch' ] );
