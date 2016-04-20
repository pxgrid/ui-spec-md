'use strict';

var gulp   = require( 'gulp' );
var concat = require( 'gulp-concat' );
var rename = require( 'gulp-rename' );
var sass   = require( 'gulp-sass' );

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

	return gulp.src( './src/scss/template.scss' )
	       .pipe( sass() )
	       .pipe( rename( { basename: '_template' } ) )
	       .pipe( gulp.dest( './build/_template/' ) );

} );

gulp.task( 'watch', function () {

	gulp.watch( './src/js/*.js', [ 'js' ] );
	gulp.watch( './src/scss/*.scss', [ 'sass' ] );

} );

gulp.task( 'build', [ 'html', 'js', 'sass' ] );
gulp.task( 'default', [ 'build', 'watch' ] );