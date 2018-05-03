import axios from "axios"
import 'es6-promise/auto'
import Cookies from "js-cookie/src/js.cookie"

var AuthService = {
	apiHost: 'https://ejcifra-api.herokuapp.com/api',

	getLoggedInUser: function () {
		let user = Cookies.get( 'user' );

		if ( !user ) {
			return null;
		}

		user = JSON.parse( user );

		return {
			name: user.name
		};
	},
	login: function ( successCallback, errorCallback, email, password ) {
		let data = {
			email: email,
			password: password
		};

		axios
			.post( AuthService.apiHost + "/auth/login", data )
			.then( function ( response ) {
				Cookies.set( 'token', response.data.access_token );

				// Get user details
				let config = {
					headers: {
						Authorization: 'Bearer ' + Cookies.get( 'token' )
					}
				};

				axios
					.post( AuthService.apiHost + "/auth/me", {}, config )
					.then( function ( response ) {
						Cookies.set( 'user', response.data );

						// Get user details
						successCallback( response );
					} )
					.catch( function ( error ) {
						errorCallback( error )
					} );
			} )
			.catch( function ( error ) {
				errorCallback( error )
			} );
	},
	logout: function ( successCallback, errorCallback ) {
		let config = {
			headers: {
				Authorization: 'Bearer ' + Cookies.get( 'token' )
			}
		};

		axios
			.post( AuthService.apiHost + "/auth/logout", {}, config )
			.then( function ( response ) {
				Cookies.remove( 'token' );
				Cookies.remove( 'user' );

				successCallback( response );
			} )
			.catch( function ( error ) {
				errorCallback( error )
			} );
	}
};

export default AuthService;
