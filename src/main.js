// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faPrint, faSave, faEye, faEdit, faClone, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add( faSearch, faPrint, faSave, faEye, faEdit, faClone, faTrashAlt )

Vue.component( 'font-awesome-icon', FontAwesomeIcon )

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

// include ChordPlus
let chordPlusScript = document.createElement( "script" );
chordPlusScript.setAttribute(
	"src",
	"static/vendor/chord-plus/dist/chord-plus.min.js"
);
document.head.appendChild( chordPlusScript );