import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/graphs'
  },
  {
    path: '/graphs',
    name: 'graphs',
    component: () => import('../components/Graphs.vue')
  },
  {
    path: '/tweener',
    name: 'tweener',
    component: () => import('../components/Tweener.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
