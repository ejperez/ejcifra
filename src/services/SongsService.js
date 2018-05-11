import "es6-promise/auto"
import Cookies from "js-cookie/src/js.cookie"
import AuthService from "@/services/AuthService";

var SongsService = {
	saveDraft: function ( song ) {
		localStorage.setItem( 'songDraft', song );
	},
	getDraft: function () {
		return localStorage.getItem( 'songDraft' );
	},
	removeDraft: function () {
		return localStorage.removeItem( 'songDraft' );
	},
	get: function ( successCallback, errorCallback, search, page ) {
		window.axios
			.get( window.apiHost + "/songs", {
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
		window.axios
			.get( window.apiHost + "/songs/" + id )
			.then( function ( response ) {
				successCallback( response );
			} )
			.catch( function ( error ) {
				errorCallback( error )
			} );
	},
	duplicate: function ( successCallback, errorCallback, id ) {
		let scope = this;

		scope.getSingle( function ( result ) {
			let song = result.data;

			scope.save( successCallback, errorCallback, false, song );
		}, errorCallback, id );
	},
	save: function ( successCallback, errorCallback, id, song ) {
		let url = window.apiHost + '/songs', method = 'post', scope = this;

		if ( id ) {
			url += '/' + id;
			method = 'put';
		}

		window.axios( {
			url: url,
			data: song,
			method: method,
			headers: {
				Authorization: 'Bearer ' + Cookies.get( 'token' )
			}
		} )
			.then( function ( response ) {
				successCallback( response );
			} )
			.catch( function ( error ) {
				let errorMessage = error.response.data.error;

				if ( errorMessage === "Unauthenticated." ) {
					AuthService.refresh( function () {
						scope.save( successCallback, errorCallback, id, song );
					}, errorCallback );
				} else {
					errorCallback( error );
				}
			} );
	},
	delete: function ( successCallback, errorCallback, id ) {
		let scope = this, config = {
			headers: {
				Authorization: 'Bearer ' + Cookies.get( 'token' )
			}
		};

		window.axios
			.delete( window.apiHost + "/songs/" + id, config )
			.then( function ( response ) {
				successCallback( response );
			} )
			.catch( function ( error ) {
				let errorMessage = error.response.data.error;

				if ( errorMessage === "Unauthenticated." ) {
					AuthService.refresh( function () {
						scope.delete( successCallback, errorCallback, id );
					}, errorCallback );
				} else {
					errorCallback( error );
				}
			} );
	}
};

export default SongsService;
