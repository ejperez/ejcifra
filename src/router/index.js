import Vue from 'vue'
import Router from 'vue-router'
import SongsIndex from '@/components/songs/Index'
import SongsView from '@/components/songs/View'
import AuthLogin from '@/components/auth/Login'
import AuthService from "@/services/AuthService"
import AdminSongsIndex from '@/components/admin/songs/Index'
import AdminSongsAddEdit from '@/components/admin/songs/AddEdit'

Vue.use( Router )

const router = new Router( {
	routes: [
		{
			path: '/',
			name: 'SongsIndex',
			component: SongsIndex
		},
		{
			path: '/songs',
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
			component: AdminSongsIndex,
			meta: { requiresAuth: true }
		},
		{
			path: '/admin/songs/add',
			name: 'AdminSongsAdd',
			component: AdminSongsAddEdit,
			meta: { requiresAuth: true }
		},
		{
			path: '/admin/songs/:id/:slug/edit',
			name: 'AdminSongsEdit',
			props: true,
			component: AdminSongsAddEdit,
			meta: { requiresAuth: true }
		}
	]
} )

router.beforeEach( ( to, from, next ) => {
	if ( to.matched.some( record => record.meta.requiresAuth ) ) {
		if ( AuthService.getLoggedInUser() ) {
			next();
		} else {
			next( {
				path: '/login',
				query: {
					redirect: to.fullPath,
				},
			} );
		}
	} else {
		next();
	}
} )

export default router