import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

const MoviesListView = () => import('../views/MoviesList.vue')
const MoviesDetailsView = defineAsyncComponent(() => import('../views/MoviesDetails.vue'))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/movies'
    },
    {
      path: '/movies',
      name: 'movies',
      component: MoviesListView
    },
    {
      path: '/movies/:id',
      name: 'details',
      component: MoviesDetailsView
    },

  ]
})

export default router
