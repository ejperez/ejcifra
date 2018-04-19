import axios from "axios";

var SongsService = {
	apiHost: 'http://ejcifra-api.herokuapp.com/api',
	get: function ( successCallback, errorCallback, search ) {
		axios
			.get( SongsService.apiHost + "/songs" )
			.then( function ( response ) {
				successCallback( response );
			} )
			.catch( function ( error ) {
				errorCallback( error )
			} );
	}
};

export default SongsService;
