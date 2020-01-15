import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Mahasiswa from '../views/Mahasiswa.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
		{
			path: '/mahasiswa',
			name: 'mahasiswa',
			component: Mahasiswa,
			meta: { auth: true }
		}
]

const router = new VueRouter({
  routes
})

export default router
