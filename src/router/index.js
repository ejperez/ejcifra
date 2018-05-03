import Vue from 'vue'
import Router from 'vue-router'
import SongsIndex from '@/components/songs/Index'
import AdminSongsIndex from '@/components/admin/songs/Index'
import SongsView from '@/components/songs/View'
import AuthLogin from '@/components/auth/Login'

Vue.use( Router )

const router = new Router( {
	routes: [
		{
			path: '/',
			name: 'SongsIndex',
			component: SongsIndex
		},
		{
			path: '/songs/:id/:slug',
			name: 'SongsView',
			component: SongsView,
			props: true
		},
		{
			path: '/login',
			name: 'AuthLogin',
			component: AuthLogin
		},
		{
			path: '/admin/songs',
			name: 'AdminSongsIndex',
			component: AdminSongsIndex
		}
	]
} )

// meta: { requiresAuth: true}

router.beforeEach( ( to, from, next ) => {
	console.log( to );
	if ( to.matched.some( record => record.meta.requiresAuth ) ) {
		if ( true ) {
			next( {
				path: '/login',
				query: {
					redirect: to.fullPath,
				},
			} );
		} else {
			next();
		}
	} else {
		next();
	}
} )

export default router