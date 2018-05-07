import axios from "axios"
import 'es6-promise/auto'
import Cookies from "js-cookie/src/js.cookie"

var AuthService = {
	getLoggedInUser: function () {
		let user = Cookies.get( 'user' );
		let token = Cookies.get( 'token' );

		if ( !user || !token ) {
			return null;
		}

		user = JSON.parse( user );

		return {
			name: user.name
		};
	},
	refresh( successCallback, errorCallback ) {
		let config = {
			headers: {
				Authorization: 'Bearer ' + Cookies.get( 'token' )
			}
		};

		Cookies.remove( 'token' );

		axios
			.post( window.apiHost + "/auth/refresh", {}, config )
			.then( function ( response ) {
				Cookies.set( 'token', response.data.access_token );

				successCallback( response );
			} )
			.catch( function ( error ) {
				errorCallback( error )
			} );
	},
	login: function ( successCallback, errorCallback, email, password ) {
		let data = {
			email: email,
			password: password
		};

		axios
			.post( window.apiHost + "/auth/login", data )
			.then( function ( response ) {
				Cookies.set( 'token', response.data.access_token );

				// Get user details
				let config = {
					headers: {
						Authorization: 'Bearer ' + Cookies.get( 'token' )
					}
				};

				axios
					.post( window.apiHost + "/auth/me", {}, config )
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

		Cookies.remove( 'token' );
		Cookies.remove( 'user' );

		axios
			.post( window.apiHost + "/auth/logout", {}, config )
			.then( function ( response ) {
				successCallback( response );
			} )
			.catch( function ( error ) {
				errorCallback( error )
			} );
	}
};

export default AuthService;
