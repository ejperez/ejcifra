// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false;

if ( process.env.NODE_ENV === 'production' ) {
	window.apiHost = 'https://ejcifra-api.herokuapp.com/api'
} else {
	window.apiHost = 'http://ejcifra-api/api'
}

window.axios = axios;

/* eslint-disable no-new */
new Vue( {
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
} )

/* Register the service worker */
if ( 'serviceWorker' in navigator ) {
	window.addEventListener( 'load', function () {
		navigator.serviceWorker.register( 'static/sw.js' ).then( 
			function ( registration ) {
				// Registration was successful
				console.log( 'ServiceWorker registration successful with scope: ', registration.scope );
			},
			function ( err ) {
				// registration failed :( 
				console.log( 'ServiceWorker registration failed: ', err );
			} );
	} );
}