import axios from "axios"
import 'es6-promise/auto'

var AuthService = {
	apiHost: 'https://ejcifra-api.herokuapp.com/api',

	login: function ( successCallback, errorCallback, email, password ) {
		axios
			.get( AuthService.apiHost + "/auth/login", {
				params: {
					email: email,
					password: password
				}
			} )
			.then( function ( response ) {
				successCallback( response );
			} )
			.catch( function ( error ) {
				errorCallback( error )
			} );
	},
	logout: function ( successCallback, errorCallback ) {
		axios
			.get( AuthService.apiHost + "/auth/logout" )
			.then( function ( response ) {
				successCallback( response );
			} )
			.catch( function ( error ) {
				errorCallback( error )
			} );
	}
};

export default AuthService;
