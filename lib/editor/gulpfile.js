'use strict';

var browserify = require( 'browserify' );
var babelify   = require( 'babelify' );
var source     = require( 'vinyl-source-stream' );

var gulp       = require( 'gulp' );
var rename     = require( 'gulp-rename' );
var sass       = require( 'gulp-sass' );

gulp.task( 'html', function () {

  return gulp.src( './src/_editor.html' )
         .pipe( gulp.dest( './build/' ) );

} );

gulp.task( 'js', function () {

  return browserify( {
    entries: './src/js/main.jsx'
  } )
  .transform( babelify.configure( {
    presets: [ 'es2015', 'react' ],
    plugins: [
    ]
  } ) )
  .bundle()
  .on( 'error', function( err ) {

    // print the error
    console.log( 'Error : ' + err.message );

    // Keep gulp from hanging on this task
    this.emit( 'end' );

  } )
  .pipe( source( '_editor.js' ) )
  .pipe( gulp.dest( './build/_editor/' ) );

} );

gulp.task( 'sass', function () {

  return gulp.src( './src/scss/editor.scss' )
         .pipe( sass() )
         .pipe( rename( { basename: '_editor' } ) )
         .pipe( gulp.dest( './build/_editor/' ) );

} );

gulp.task( 'watch', function () {

  gulp.watch( ['./src/**/*.jsx', './src/**/*.js'],  [ 'js' ] );
  gulp.watch( './src/**/*.scss', [ 'sass' ] );

} );


gulp.task( 'default', [ 'html', 'js', 'sass', 'watch' ] );
