import axios from "axios"
import 'es6-promise/auto'

var SongsService = {
	apiHost: 'https://ejcifra-api.herokuapp.com/api',

	get: function ( successCallback, errorCallback, search, page ) {
		axios
			.get( SongsService.apiHost + "/songs", {
				params: {
					search: search,
					page: page
				}
			} )
			.then( function ( response ) {
				successCallback( response );
			} )
			.catch( function ( error ) {
				errorCallback( error )
			} );
	},
	getSingle: function ( successCallback, errorCallback, id ) {
		axios
			.get( SongsService.apiHost + "/songs/" + id )
			.then( function ( response ) {
				successCallback( response );
			} )
			.catch( function ( error ) {
				errorCallback( error )
			} );
	}
};

export default SongsService;
