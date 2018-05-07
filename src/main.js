// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

if ( Vue.config.productionTip ) {
	window.apiHost = 'https://ejcifra-api.herokuapp.com/api'
} else {
	window.apiHost = 'http://ej.local/api'
}

/* eslint-disable no-new */
new Vue( {
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
} )
