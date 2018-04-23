import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/songs/Index'
import View from '@/components/songs/View'
import Login from '@/components/auth/Login'

Vue.use( Router )

export default new Router( {
	routes: [
		{
			path: '/',
			name: 'Index',
			component: Index
		},
		{
			path: '/songs/:id/:slug',
			name: 'View',
			component: View,
			props: true
		},
		{
			path: '/login',
			name: 'Login',
			component: Login
		}
	]
} )
