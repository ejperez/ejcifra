import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import View from '@/components/View'

Vue.use(Router)

export default new Router({
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
	  }
  ]
})
