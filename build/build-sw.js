// List all files in a directory in Node.js recursively in a synchronous fashion
var walkSync = function ( dir, filelist ) {
	var path = path || require( 'path' );
	var fs = fs || require( 'fs' ),
		files = fs.readdirSync( dir );
	filelist = filelist || [];
	files.forEach( function ( file ) {
		if ( fs.statSync( path.join( dir, file ) ).isDirectory() ) {
			filelist = walkSync( path.join( dir, file ), filelist );
		}
		else {
			filelist.push( path.join( dir, file ) );
		}
	} );
	return filelist;
};

var filenames = walkSync( 'docs' ).map( file => '"' + file.replace( 'docs\\', '' ) + '"' ).join( ',' );

var swContent = '\'use strict\';importScripts(\'static\\sw-toolbox.js\'); toolbox.precache([FILES]); toolbox.router.get(\'/*\', toolbox.networkFirst, { networkTimeoutSeconds: 5});';

swContent = swContent.replace( 'FILES', filenames );

var fs = require( 'fs' );
fs.writeFile( "docs\\static\\sw.js", swContent, function ( err ) {
	if ( err ) {
		return console.log( err );
	}

	console.log( "The file was saved!" );
} ); 